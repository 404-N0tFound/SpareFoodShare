from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

from .models import *


def home(request):
    return render(request, 'index.html')


# SELECT
def items_view(request):
    queryset = Items.objects.all()
    print("Items:", Items.objects.all().query)

    context = {
        'Items': queryset
    }
    return render(request, 'app/items_demon.html', context)


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
