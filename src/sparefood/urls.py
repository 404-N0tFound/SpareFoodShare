from .views import *
from django.urls import path,include

urlpatterns = [
    # for the home function in the view file
    path('', home, name='home'),
    path('items/', items_list),
    path('items/<int:pk>/', items_details),
    path('users/', users_list),
    path('users/<int:pk>', user_details),

]
