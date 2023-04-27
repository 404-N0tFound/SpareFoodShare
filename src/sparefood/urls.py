from .views import *
from django.urls import path

from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from . import views

urlpatterns = [
    path('', getApiRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegistrationView.as_view()),
    path('item/', SingleItemView.as_view()),
    path('items/', InfiniteItemsView.as_view()),
    path('myitems/', InfiniteMyItemsView.as_view()),
    path('items/upload/', CreateItemView.as_view()),
<<<<<<< HEAD
    path('api/orders/create/', create_order),
    path('api/orders/', my_orders_list),
    path('api/orders/check/', my_orders_check),
    path('activate/<uidb64>/<token>', views.activate_account, name='activate'),
    # path('items/<int:pk>/', ItemView.as_view()),
=======
    path('orders/create/', CreateOrderView.as_view()),
    path('orders/', OrdersView.as_view()),
    path('chats/', ChatsView.as_view()),
    path('chats/messages/', MessagesView.as_view()),
    path('sales/', SalesView.as_view()),
    path('item_operations/', ItemOperationsView.as_view()),
>>>>>>> adc857832e3f684692d9763eae3f5c10b3ebf5a5
]
