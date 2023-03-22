from django.views.generic import TemplateView

from .views import *
from django.urls import path

from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', getApiRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegistrationView.as_view()),
    path('items/', InfiniteItemsView.as_view()),
    path('upload_item/', CreateItemView.as_view()),
    # path('items/<int:pk>/', ItemView.as_view()),
]
