from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView

from datetime import datetime

from .serializers import *
from .models import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class RegistrationView(APIView):
    @classmethod
    def post(cls, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = str(user.id)
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['is_business'] = user.is_business
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getApiRoutes(request):
    routes = [
        '/api/register',
        '/api/token',
        '/api/token/refresh',
        '/api/item/',
        '/api/items/',
        '/api/items/upload',
        '/api/orders/',
        '/api/orders/create/',
        '/api/orders/check/'
    ]
    return Response(routes)


class CreateItemView(APIView):
    @classmethod
    def post(cls, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateOrderView(APIView):
    @classmethod
    def post(cls, request):
        serializer = OrdersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def is_more_items(request):
    offset = request.GET.get('offset')
    if int(offset) >= Item.objects.filter(
            Q(is_deleted__lte=False) & Q(is_private__lte=False) &
            Q(expiration_date__gte=datetime.today().strftime('%Y-%m-%d'))).count():
        return False
    return True


def infinite_filter(request):
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    return Item.objects.filter(
        Q(is_deleted__lte=False) & Q(is_private__lte=False) &
        Q(expiration_date__gte=datetime.today().strftime('%Y-%m-%d')))[offset: max_index]


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
                    "status": item.status,
                    "provider": user.email,
                    "location": item.location,
                    "picture": settings.MEDIA_URL + str(item.picture),
                    "shared_times": item.shared_times,
                    "last_updated": item.last_updated
                }, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def is_more_myitems(request):
    offset = request.GET.get('offset')
    if int(offset) >= Item.objects.filter(
            Q(is_deleted__lte=False) & Q(is_private__lte=False) &
            Q(expiration_date__gte=datetime.today().strftime('%Y-%m-%d'))).count():
        return False
    return True


def infinite_myitems_filter(request):
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    return Item.objects.filter(
        Q(provider_id__exact=request.GET.get('user_id')))[offset: max_index]


class InfiniteMyItemsView(ListAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = infinite_myitems_filter(self.request)
        return qs

    def list(self, request):
        query_set = self.get_queryset()
        serializer = self.serializer_class(query_set, many=True)
        return Response({
            "items": serializer.data,
            "has_more": is_more_items(request)
        })


def is_more_orders(request):
    offset = request.GET.get('offset')
    if int(offset) >= Order.objects.filter(
            Q(id__exact=request.GET.get('user_id'))).count():
        return False
    return True


def infinite_myorders_filter(request):
    limit = int(request.GET.get('limit'))
    offset = int(request.GET.get('offset'))
    max_index = int(offset) + int(limit)
    return Order.objects.filter(
        Q(initiator_id=request.GET.get('user_id')) or
        Q(provider_id=request.GET.get('user_id'))).values("id",
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

    def get_queryset(self):
        qs = infinite_myorders_filter(self.request)
        return qs

    def list(self, request):
        data = self.get_queryset()
        return Response({
            "orders": data,
            "has_more": is_more_orders(request)
        })


class OrdersCheckView(ListAPIView):
    def get(self, request):
        """
            Method to check duplicate order
        """
        flag = False
        snippets = Order.objects.filter(initiator_id=request.GET.get('user'),
                                        item_id=request.GET.get('item'))
        serializer = OrdersSerializer(snippets, many=True)
        if (len(serializer.data)) > 0:
            flag = True
            return Response(flag, status=status.HTTP_200_OK)
        else:
            return Response(flag, status=status.HTTP_200_OK)
