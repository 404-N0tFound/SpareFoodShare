from .views import *
from django.urls import path

from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('items/', items_list),
    path('items/<int:pk>/', items_details),
    path('users/', users_list),
    path('users/<int:pk>', user_details),
    path('upload_new', upload_new),
    path('', getApiRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegistrationView.as_view()),
    path('orders/create/', create_order),
    path('orders/', my_orders_list),
    path('orders/check/', my_orders_check),
]
