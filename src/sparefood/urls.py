from .views import *
from django.urls import path,include

urlpatterns = [
    # for the home function in the view file
    path('', home, name='home'),
    path('item/', items_list),
    path('items/<int:pk>/', items_details),
    path('users/', users_view),
    path('items_upload/', items_upload),
    path('item_delete/', items_delete),
]
