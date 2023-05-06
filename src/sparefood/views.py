from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q, OuterRef, Subquery, QuerySet
from django.http import JsonResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from jwt import DecodeError
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView

from django.core.exceptions import ObjectDoesNotExist

import calendar
from datetime import datetime, timedelta
from .jwt_decoder import *

import phonenumbers

from .serializers import *
from .models import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.core.mail import send_mail
from .tokens import account_activation_token


@api_view(['GET'])
def getApiRoutes(request) -> Response:
    """Returns a response with a list of all available routes for debugging."""
    routes = [
        '/api/',
        '/api/token',
        '/api/token/refresh',
        '/api/token/new',
        'activate/<uidb64>/<token>',
        '/api/register',
        '/api/item',
        '/api/item/share/<uuid:item_uuid>'
        '/api/items',
        '/api/myitems',
        '/api/myitems/expiring/',
        '/api/items/upload',
        '/api/orders',
        '/api/orders/create',
        '/api/chats',
        '/api/chats/messages',
        '/api/sales',
        '/api/item_operations',
        '/api/user/update_profile',
        '/api/stats',
        '/api/media/(<path>.*)'
    ]
    return Response(routes)


class RegistrationView(APIView):
    @classmethod
    def post(cls, request) -> Response:
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            activate_email(request, serializer.data, serializer.data['email'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def activate_email(request, user, toEmail):
    mail_subject = "Activate your user account."
    message = render_to_string("app/activate_account.html", {
        'user': user['full_name'],
        'domain': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user['email'])),
        'token': account_activation_token.make_token(user),
        "protocol": 'https' if request.is_secure() else 'http'
    })

    send_mail(mail_subject, message, None, [toEmail])


def activate_account(request, uidb64, token):
    uid = force_str(urlsafe_base64_decode(uidb64))
    User.objects.filter(email=uid).update(is_active=True)

    return HttpResponseRedirect('http://localhost:3000/')


class NewRefreshToken(APIView):
    @classmethod
    def get(cls, request) -> Response:
        if is_valid_uuid(request):
            user = User.objects.get(id__exact=decode_jwt(request))
            refresh = RefreshToken.for_user(user)
            refresh['user_id'] = str(user.id)
            refresh['email'] = user.email
            refresh['full_name'] = user.full_name
            refresh['is_admin'] = user.is_admin
            refresh['is_business'] = user.is_business
            refresh['phone_number'] = str(user.phone_number)
            refresh['date_joined'] = str(user.date_joined)[:19]
            data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = str(user.id)
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['is_admin'] = user.is_admin
        token['is_business'] = user.is_business
        token['phone_number'] = str(user.phone_number)
        token['date_joined'] = str(user.date_joined)[:19]
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CreateItemView(APIView):
    @classmethod
    def post(cls, request) -> Response:
        data = request.data
        data['provider'] = decode_jwt(data['provider'], True)
        serializer = ItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateOrderView(APIView):
    @classmethod
    def post(cls, request) -> Response:
        data = request.data
        data['initiator'] = decode_jwt(data['initiator'], True)
        serializer = OrdersSerializer(data=request.data)
        if serializer.is_valid():
            try:
                item = Item.objects.get(id__exact=serializer.initial_data.get("item"))
                if str(item.provider_id) == str(decode_jwt(request.data['initiator'], True)):
                    return Response("You may not order your own item.", status=status.HTTP_401_UNAUTHORIZED)
                item.is_collected = True
                if serializer.save():
                    new_order = Order.objects.get(Q(item_id__exact=serializer.initial_data.get("item")) |
                                                  Q(initiator__exact=serializer.initial_data.get("item")))
                    chat_data = {'order': new_order.id,
                                 'user_1': data['initiator'],
                                 'user_2': item.provider_id}
                    room_serializer = ChatsSerializer(data=chat_data)
                    if room_serializer.is_valid():
                        item.save()
                        room_serializer.save()
                    else:
                        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def is_more_items(request) -> bool:
    offset = request.GET.get('offset')
    if int(offset) >= Item.objects.filter(
            Q(is_deleted__lte=False) & Q(is_collected__lte=False) &
            Q(expiration_date__gte=datetime.today().strftime('%Y-%m-%d'))).count():
        return False
    return True


def infinite_filter(request) -> QuerySet:
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    filtered_items = Item.objects.filter(
        Q(is_deleted__lte=False) & Q(is_collected__lte=False) &
        Q(expiration_date__gte=datetime.today().strftime('%Y-%m-%d')))[offset: max_index]
    for item in filtered_items:
        user_id = decode_jwt(request)
        if str(item.provider_id) == str(user_id):
            item.is_registrable = False
        else:
            item.is_registrable = True
    return filtered_items


class InfiniteItemsView(ListAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = infinite_filter(self.request)
        return qs

    def list(self, request):
        query_set = self.get_queryset()
        serializer = self.serializer_class(query_set, many=True)
        return Response({
            "items": serializer.data,
            "has_more": is_more_items(request)
        })


class SingleItemView(APIView):
    serializer_class = ItemSerializer

    @classmethod
    def get(cls, request):
        try:
            item = Item.objects.get(id__exact=request.GET.get('uuid'))
            user = User.objects.get(id__exact=item.provider_id)
            if item is not None:
                return Response({
                    "id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "upload_date": item.upload_date,
                    "expiration_date": item.expiration_date,
                    "provider": user.email,
                    "location": item.location,
                    "picture": settings.MEDIA_URL + str(item.picture),
                    "shared_times": item.shared_times,
                    "last_updated": item.last_updated,
                    "is_registrable": is_item_registrable(item, decode_jwt(request))
                }, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def is_item_registrable(item, request_user) -> bool:
    if request_user is None:
        return False
    return False if str(item.provider_id) == str(request_user) else True


def is_more_myitems(request) -> bool:
    offset = request.GET.get('offset')
    if int(offset) >= Item.objects.filter(
            Q(is_deleted__lte=False) & Q(is_collected__lte=False) &
            Q(expiration_date__gte=datetime.today().strftime('%Y-%m-%d'))).count():
        return False
    return True


def infinite_myitems_filter(request) -> QuerySet:
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    if is_admin(request):
        return Item.objects.filter(Q(is_deleted__lte=False))[offset: max_index]
    else:
        return Item.objects.filter(
            Q(provider_id__exact=decode_jwt(request)) & Q(is_deleted__lte=False))[offset: max_index]


class InfiniteMyItemsView(ListAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self) -> QuerySet:
        qs = infinite_myitems_filter(self.request)
        return qs

    def list(self, request) -> Response:
        query_set = self.get_queryset()
        serializer = self.serializer_class(query_set, many=True)
        return Response({
            "items": serializer.data,
            "has_more": is_more_items(request)
        })


class MyExpiringItemsView(APIView):
    @classmethod
    def get(cls, request) -> Response:
        try:
            if is_valid_uuid(request):
                expiration_date = datetime.today()
                expiration_date += timedelta(days=1)
                my_items = Item.objects.filter(Q(provider_id=decode_jwt(request)) & Q(is_deleted__lte=False) &
                                               Q(is_collected=False) &
                                               Q(expiration_date=expiration_date.strftime('%Y-%m-%d'))).values(
                    "id",
                    "name",
                    "description",
                    "upload_date",
                    "expiration_date",
                    "location",
                    "picture",
                    "last_updated"
                )
                return Response(list(my_items), status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        except DecodeError:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def is_more_orders(request) -> bool:
    offset = request.GET.get('offset')
    if int(offset) >= Order.objects.filter(
            Q(id__exact=decode_jwt(request))).count():
        return False
    return True


def infinite_myorders_filter(request) -> QuerySet:
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    if decode_jwt(request):
        return Order.objects.all().values("id",
                                          "created_date",
                                          "donation_amount",
                                          "is_collected",
                                          "is_deleted",
                                          "collection_location",
                                          "initiator",
                                          "initiator__email",
                                          "initiator__full_name",
                                          "item",
                                          "item__name"
                                          )[offset: max_index]
    else:
        return Order.objects.filter(
            Q(initiator_id=decode_jwt(request))).values("id",
                                                        "created_date",
                                                        "donation_amount",
                                                        "is_collected",
                                                        "is_deleted",
                                                        "collection_location",
                                                        "initiator",
                                                        "initiator__email",
                                                        "initiator__full_name",
                                                        "item",
                                                        "item__name"
                                                        )[offset: max_index]


class OrdersView(ListAPIView):
    serializer_class = OrdersSerializer

    def get_queryset(self) -> QuerySet:
        qs = infinite_myorders_filter(self.request)
        return qs

    def list(self, request) -> Response:
        data = self.get_queryset()
        return Response({
            "orders": data,
            "has_more": is_more_orders(request)
        })


class ChatsView(ListAPIView):
    serializer_class = ChatsSerializer

    def get_queryset(self) -> QuerySet:
        qs = infinite_chats_filter(self.request)
        return qs

    def list(self, request) -> Response:
        data = self.get_queryset()
        return Response({
            "chats": data,
            "has_more": is_more_chats(request)
        })


def infinite_chats_filter(request) -> QuerySet:
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    if is_admin(request):
        first_rooms = ChatRoom.objects.all().annotate(
            order_name=Subquery(
                Order.objects.filter(id=OuterRef('order_id')).values('item_id')[:1]
            ),
            item_name=Subquery(
                Item.objects.filter(id=OuterRef('order_id__item_id')).values('name')[:1]
            )
        ).values('id', 'item_name')
        second_rooms = ChatRoom.objects.all().annotate(
            order_name=Subquery(
                Order.objects.filter(id=OuterRef('order_id')).values('item_id')[:1]
            ),
            item_name=Subquery(
                Item.objects.filter(id=OuterRef('order_id__item_id')).values('name')[:1]
            )
        ).values('id', 'item_name')
        total_rooms = (first_rooms | second_rooms)[offset: max_index]
        return total_rooms
    else:
        first_rooms = ChatRoom.objects.filter(
            Q(user_1=decode_jwt(request))).annotate(
            order_name=Subquery(
                Order.objects.filter(id=OuterRef('order_id')).values('item_id')[:1]
            ),
            item_name=Subquery(
                Item.objects.filter(id=OuterRef('order_id__item_id')).values('name')[:1]
            )
        ).values('id', 'item_name')
        second_rooms = ChatRoom.objects.filter(
            Q(user_2=decode_jwt(request))).annotate(
            order_name=Subquery(
                Order.objects.filter(id=OuterRef('order_id')).values('item_id')[:1]
            ),
            item_name=Subquery(
                Item.objects.filter(id=OuterRef('order_id__item_id')).values('name')[:1]
            )
        ).values('id', 'item_name')
        total_rooms = (first_rooms | second_rooms)[offset: max_index]
        return total_rooms


def is_more_chats(request) -> bool:
    offset = request.GET.get('offset')
    if int(offset) >= ChatRoom.objects.filter(
            Q(user_1=decode_jwt(request)) or
            Q(user_2=decode_jwt(request))).count():
        return False
    return True


class MessagesView(APIView):
    @classmethod
    def get(cls, request) -> JsonResponse:
        data = [{
            'username': message.user.full_name,
            'message': message.value,
        } for message in Message.objects.filter(Q(chat_room=request.GET.get('room'))).order_by('date')]
        return JsonResponse(data, status=status.HTTP_200_OK, safe=False)


def infinite_mysales_filter(request) -> QuerySet:
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    return Order.objects.filter(
        Q(item__provider_id=decode_jwt(request))).values("id",
                                                         "created_date",
                                                         "donation_amount",
                                                         "is_collected",
                                                         "is_deleted",
                                                         "collection_location",
                                                         "initiator",
                                                         "initiator__email",
                                                         "initiator__full_name",
                                                         "item",
                                                         "item__name",
                                                         )[offset: max_index]


class SalesView(ListAPIView):
    serializer_class = OrdersSerializer

    def get_queryset(self) -> QuerySet:
        qs = infinite_mysales_filter(self.request)
        return qs

    def list(self, request) -> Response:
        data = self.get_queryset()
        return Response({
            "sales": data,
            "has_more": is_more_sales(request)
        })


def is_more_sales(request) -> bool:
    offset = request.GET.get('offset')
    if int(offset) >= Order.objects.filter(
            Q(id__exact=decode_jwt(request))).count():
        return False
    return True


class ItemOperationsView(APIView):
    @classmethod
    def post(cls, request) -> Response:
        data = request.data
        try:
            if data['operation'] == 'update':
                Item.objects.filter(id=data['id']).update(name=data['name'],
                                                          description=data['des'],
                                                          location=data['location'],
                                                          expiration_date=data['expiration_date']
                                                          )
            elif data['operation'] == 'delete':
                Item.objects.filter(id=data['id']).update(is_deleted=True)
            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)


class UserProfileUpdateView(APIView):
    @classmethod
    def post(cls, request) -> Response:
        data = request.data
        try:
            user = User.objects.get(id__exact=decode_jwt(data['jwt'], True))
            try:
                parsed = phonenumbers.parse(data['phone_number'])
                user.phone_number = str(parsed.national_number)
            except phonenumbers.NumberParseException:
                try:
                    parsed = phonenumbers.parse('+44{}'.format(data['phone_number']))
                    user.phone_number = str(parsed.national_number)
                except phonenumbers.NumberParseException:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            user.full_name = data['full_name']
            user.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)


class StatsView(APIView):
    @classmethod
    def get(cls, request) -> Response:
        try:
            if is_admin(request):
                data = {
                    "user_ratio": cls.calculate_user_ratio(),
                    "shared_week": cls.calculate_items_shared_weekly(),
                    "shared_month": cls.calculate_items_shared_monthly(),
                    "perished_week": cls.calculate_items_perished_weekly(),
                    "perished_month": cls.calculate_items_perished_monthly(),
                    "new_users_week": cls.calculate_new_users_weekly(),
                    "new_users_month": cls.calculate_new_users_monthly()
                }
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response(e.args, status=status.HTTP_400_BAD_REQUEST)

    @classmethod
    def calculate_user_ratio(cls) -> list:
        data = [
            {'name': 'Individual Users', 'value': len(User.objects.filter(Q(is_business=False)))},
            {'name': 'Businesses Users', 'value': len(User.objects.filter(Q(is_business=True)))}
        ]
        return data

    @classmethod
    def calculate_items_shared_weekly(cls) -> list:
        each_calculated_day = []
        for i in range(datetime.today().weekday() + 1):
            change_date = datetime.today()
            change_date += timedelta(days=-(datetime.today().weekday() - i))
            shares = Share.objects.filter(Q(date=change_date.strftime('%Y-%m-%d')))
            total_shares = 0
            for share in shares:
                total_shares += share.times_shared
            each_calculated_day.append(total_shares)
        for i in range(7 - len(each_calculated_day)):
            each_calculated_day.append(0)
        data = [
            {
                'name': 'Sunday',
                'Site-wide Shares': each_calculated_day[6]
            },
            {
                'name': 'Monday',
                'Site-wide Shares': each_calculated_day[0]
            },
            {
                'name': 'Tuesday',
                'Site-wide Shares': each_calculated_day[1]
            },
            {
                'name': 'Wednesday',
                'Site-wide Shares': each_calculated_day[2]
            },
            {
                'name': 'Thursday',
                'Site-wide Shares': each_calculated_day[3]
            },
            {
                'name': 'Friday',
                'Site-wide Shares': each_calculated_day[4]
            },
            {
                'name': 'Saturday',
                'Site-wide Shares': each_calculated_day[5]
            }
        ]
        return data

    @classmethod
    def calculate_items_shared_monthly(cls) -> list:
        data = []
        current_date = datetime.today()
        for i in range(6):
            change_month = current_date
            for j in range(i):
                change_month = change_month.replace(day=1) - timedelta(days=1)
            shares = Share.objects.filter(Q(date__month=change_month.month))
            total_shares = 0
            for share in shares:
                total_shares += share.times_shared
            data.append({'name': calendar.month_name[change_month.month], 'Site-wide Shares': total_shares})
        data = data[::-1]
        return data

    @classmethod
    def calculate_items_perished_weekly(cls) -> list:
        each_calculated_day = []
        for i in range(datetime.today().weekday() + 1):
            change_date = datetime.today()
            change_date += timedelta(days=-(datetime.today().weekday() - i))
            each_calculated_day.append(len(Item.objects.filter(Q(is_deleted__lte=False) & Q(is_collected__lte=False) &
                                                               Q(expiration_date=change_date.strftime('%Y-%m-%d')))))
        for i in range(7 - len(each_calculated_day)):
            each_calculated_day.append(0)
        data = [
            {
                'name': 'Sunday',
                'Perished Items': each_calculated_day[6]
            },
            {
                'name': 'Monday',
                'Perished Items': each_calculated_day[0]
            },
            {
                'name': 'Tuesday',
                'Perished Items': each_calculated_day[1]
            },
            {
                'name': 'Wednesday',
                'Perished Items': each_calculated_day[2]
            },
            {
                'name': 'Thursday',
                'Perished Items': each_calculated_day[3]
            },
            {
                'name': 'Friday',
                'Perished Items': each_calculated_day[4]
            },
            {
                'name': 'Saturday',
                'Perished Items': each_calculated_day[5]
            }
        ]
        return data

    @classmethod
    def calculate_items_perished_monthly(cls) -> list:
        data = []
        current_date = datetime.today()
        for i in range(6):
            change_month = current_date
            for j in range(i):
                change_month = change_month.replace(day=1) - timedelta(days=1)
            perished_count = len(Item.objects.filter(Q(is_deleted=False) & Q(is_collected=False) &
                                                     Q(expiration_date__month=change_month.month)))
            data.append({'name': calendar.month_name[change_month.month], 'Perished Items': perished_count})
        data = data[::-1]
        return data

    @classmethod
    def calculate_new_users_weekly(cls) -> list:
        each_calculated_day = []
        for i in range(datetime.today().weekday() + 1):
            change_date = datetime.today()
            change_date += timedelta(days=-(datetime.today().weekday() - i))
            each_calculated_day.append(len(User.objects.filter(Q(date_joined__date=change_date))))
        for i in range(7 - len(each_calculated_day)):
            each_calculated_day.append(0)
        data = [
            {
                'name': 'Sunday',
                'New Users': each_calculated_day[6]
            },
            {
                'name': 'Monday',
                'New Users': each_calculated_day[0]
            },
            {
                'name': 'Tuesday',
                'New Users': each_calculated_day[1]
            },
            {
                'name': 'Wednesday',
                'New Users': each_calculated_day[2]
            },
            {
                'name': 'Thursday',
                'New Users': each_calculated_day[3]
            },
            {
                'name': 'Friday',
                'New Users': each_calculated_day[4]
            },
            {
                'name': 'Saturday',
                'New Users': each_calculated_day[5]
            }
        ]
        return data

    @classmethod
    def calculate_new_users_monthly(cls) -> list:
        data = []
        current_date = datetime.today()
        for i in range(6):
            change_month = current_date
            for j in range(i):
                change_month = change_month.replace(day=1) - timedelta(days=1)
            new_users = len(User.objects.filter(Q(date_joined__month=change_month.month)))
            data.append({'name': calendar.month_name[change_month.month], 'New Users': new_users})
        data = data[::-1]
        return data


class ShareView(APIView):
    @classmethod
    def post(cls, request, item_uuid) -> Response:
        try:
            item = Item.objects.get(id__exact=item_uuid)
            try:
                share = Share.objects.get(Q(item__exact=item.id), Q(date=datetime.today().strftime('%Y-%m-%d')))
                share.times_shared += 1
                share.save()
                return Response(share.times_shared, status=status.HTTP_200_OK)
            except ObjectDoesNotExist:
                data = {'item': item.id, 'times_shared': 1}
                serializer = ShareSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(1, status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
