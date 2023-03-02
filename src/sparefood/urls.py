from .views import *
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('api/items/', items_list),
    path('api/items/<int:pk>/', items_details),
    path('api/users/', users_list),
    path('api/users/<int:pk>', user_details),
    path('', TemplateView.as_view(template_name="index.html")),
    path('<path:route>', TemplateView.as_view(template_name="index.html")),
]
