from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/<str:ChatRoom>/', consumers.ChatConsumer.as_asgi()),
]
