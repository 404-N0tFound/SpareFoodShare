import os

from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from .serializers import ItemsSerializer, UsersSerializer
from .models import *


def home(request):
    return render(request, 'index.html')


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
