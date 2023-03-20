from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
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
    if request.method == 'GET':
        snippets = Item.objects.all()
        serializer = ItemsSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)


def items_details(request, pk):
    try:
        snippet = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = ItemsSerializer(snippet)
        return JsonResponse(serializer.data)


def users_list(request):
    if request.method == 'GET':
        snippets = User.objects.all()
        serializer = UsersSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)


def user_details(request, pk):
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
    if request.method == "POST":
        serializer = OrdersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def my_orders_list(request):
    if request.method == 'POST':
        user = request.data['user']
        snippets = Order.objects.filter(order_initiator=user)
        serializer = OrdersSerializer(snippets, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def my_orders_check(request):
    if request.method == 'POST':
        user = request.data['user']
        item = request.data['item']
        snippets = Order.objects.filter(order_initiator=user, order_item_id_id=item)
        serializer = OrdersSerializer(snippets, many=True)
        return Response(len(serializer.data), status=status.HTTP_201_CREATED)
