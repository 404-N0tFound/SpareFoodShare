from .views import *
from django.urls import path

urlpatterns = [
    # for the home function in the view file
    path('', home, name='home'),
    path('items/', items_view),
    path('users/', users_view),
    path('items_upload/', items_upload),
    path('item_delete/', items_delete),
]
