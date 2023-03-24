from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView

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
        token['email'] = user.email
        token['full_name'] = user.full_name
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getApiRoutes(request):
    routes = [
        '/api/register',
        '/api/token',
        '/api/token/refresh',
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


@api_view(['POST'])
def create_order(request):
    """
        Method to create an order
    """
    if request.method == "POST":
        serializer = OrdersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def is_more_items(request):
    offset = request.GET.get('offset')
    if int(offset) >= Item.objects.filter(is_private__lte=False).count():
        return False
    return True


def infinite_filter(request):
    limit = request.GET.get('limit')
    offset = request.GET.get('offset')
    return Item.objects.filter(Q(is_private__lte=False) & Q(is_expired__lte=False))[int(offset): int(offset) + int(limit)]


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


@api_view(['POST'])
def my_orders_list(request):
    """
        Method to get the orders of current user
    """
    if request.method == 'POST':
        user = request.data['user']
        snippets = Order.objects.filter(order_initiator=user)
        serializer = OrdersSerializer(snippets, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def my_orders_check(request):
    """
        Method to check duplicate order
    """
    if request.method == 'POST':
        user = request.data['user']
        item = request.data['item']
        snippets = Order.objects.filter(order_initiator=user, order_item_id_id=item)
        serializer = OrdersSerializer(snippets, many=True)
        return Response(len(serializer.data), status=status.HTTP_201_CREATED)
