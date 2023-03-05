from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import ItemsSerializer, UsersSerializer
from .models import *


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


"""
    Add new item to database
"""
@csrf_exempt
@api_view(['POST'])
def upload_new(request):
    if request.method == "POST":
        serializer = ItemsSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return HttpResponseRedirect('/browse')
        else:
            return Response(serializer.errors, status=400)
