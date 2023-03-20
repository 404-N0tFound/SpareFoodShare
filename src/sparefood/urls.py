from django.views.generic import TemplateView

from .views import *
from django.urls import path

from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('api/items/', items_list),
    path('api/items/<int:pk>/', items_details),
    path('api/users/', users_list),
    path('api/users/<int:pk>', user_details),
    path('upload_new', upload_new),
    path('api/', getApiRoutes),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegistrationView.as_view()),
]
