from django.views.static import serve
from django.conf.urls.static import static

from .views import *
from django.urls import path, re_path
from django.conf import settings

from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from . import views

url_patterns: list = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/new/', NewRefreshToken.as_view()),
    path('activate/<uidb64>/<token>', views.activate_account, name='activate'),
    path('register/', RegistrationView.as_view()),
    path('item/', SingleItemView.as_view()),
    path('item/share/<uuid:item_uuid>/', ShareView.as_view()),
    path('items/', InfiniteItemsView.as_view()),
    path('myitems/', InfiniteMyItemsView.as_view()),
    path('myitems/expiring/', MyExpiringItemsView.as_view()),
    path('items/upload/', CreateItemView.as_view()),
    path('orders/', OrdersView.as_view()),
    path('orders/create/', CreateOrderView.as_view()),
    path('chats/', ChatsView.as_view()),
    path('chats/messages/', MessagesView.as_view()),
    path('sales/', SalesView.as_view()),
    path('item_operations/', ItemOperationsView.as_view()),
    path('user/update_profile/', UserProfileUpdateView.as_view()),
    path('stats/', StatsView.as_view()),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT})
]

if settings.DEBUG:
    url_patterns.insert(0, path('', getApiRoutes))
    url_patterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns: list = url_patterns
