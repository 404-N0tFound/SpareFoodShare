from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

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
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


def items_list(request):
    """
        Method to get all items' details
    """
    if request.method == 'GET':
        snippets = Item.objects.filter(item_isPrivate=False,
                                       item_isDeleted=False,
                                       item_isExpired=False)
        serializer = ItemsSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def items_details(request, pk):
    """
        Method to get an item's details
    """
    try:
        snippet = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = ItemsSerializer(snippet)
        if (serializer.data['item_isExpired'] is True or serializer.data['item_isDeleted'] is True
                or serializer.data['item_isPrivate'] is True):
            return Response(False, status=status.HTTP_404_NOT_FOUND)
        else:
            return JsonResponse(serializer.data)


def users_list(request):
    """
        Method to get all users' details
    """
    if request.method == 'GET':
        snippets = User.objects.all()
        serializer = UsersSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)


def user_details(request, pk):
    """
        Method to get a user's details
    """
    try:
        snippet = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = UsersSerializer(snippet)
        return JsonResponse(serializer.data)


@api_view(['POST'])
def upload_new(request):
    """
        Add new item to database
    """
    if request.method == "POST":
        serializer = ItemsSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return HttpResponseRedirect('/browse')
        else:
            return Response(serializer.errors, status=400)


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
        flag = False
        user = request.data['user']
        item = request.data['item']
        snippets = Order.objects.filter(order_initiator=user, order_item_id_id=item)
        serializer = OrdersSerializer(snippets, many=True)
        if (len(serializer.data)) == 1:
            flag = True
            return Response(flag, status=status.HTTP_200_OK)
        else:
            return Response(flag, status=status.HTTP_200_OK)