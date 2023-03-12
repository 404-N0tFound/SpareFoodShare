from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import ItemsSerializer, UsersSerializer
from .models import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
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


# SELECT
@csrf_exempt
def items_list(request):
    if request.method == 'GET':
        snippets = Items.objects.all()
        print(snippets.query)
        serializer = ItemsSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def items_details(request, pk):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        snippet = Items.objects.get(pk=pk)
    except Items.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = ItemsSerializer(snippet)
        print(serializer.data)
        return JsonResponse(serializer.data)


@csrf_exempt
def users_list(request):
    if request.method == 'GET':
        snippets = Users.objects.all()
        print(snippets.query)
        serializer = UsersSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def user_details(request, pk):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        snippet = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = UsersSerializer(snippet)
        return JsonResponse(serializer.data)


@csrf_exempt
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
