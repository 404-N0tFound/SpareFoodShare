import os

from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .itemsSerializers import ItemsSerializer
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


def users_view(request):
    queryset = Users.objects.all()
    print("Users:", Users.objects.all().query)

    context = {
        'Users': queryset
    }
    return render(request, 'app/users_demon.html', context)


def items_upload(request):
    if request.method == 'POST':
        item = Items()
        item.item_name = request.POST.get('item_name')
        print(item)
        item.save()
        redirect('base.html')
        return render(request, 'app/items_upload.html')
    return render(request, 'app/items_upload.html')


def items_delete(request, id):
    item = Items()
    if request.method == 'POST':
        item.id = id
        print(item)
        item.delete()
        return HttpResponseRedirect(reverse('home'))

    return render(request, 'app/base.html')
