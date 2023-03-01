from .views import *
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    # for the home function in the view file
    path('item/', items_list),
    path('items/<int:pk>/', items_details),
    path('users/', users_view),
    path('items_upload/', items_upload),
    path('item_delete/', items_delete),
    path('', TemplateView.as_view(template_name="index.html")),
    path('<path:route>', TemplateView.as_view(template_name="index.html")),
]
