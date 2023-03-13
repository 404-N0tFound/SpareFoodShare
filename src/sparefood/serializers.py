from rest_framework import serializers
from .models import Items
from .models import Users
from .models import Orders

class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = ['id', 'item_name', 'item_des', 'item_upload_date', 'item_expiration_date',
                  'item_provider', 'item_status', 'item_isPrivate', 'item_location', 'item_isExpired',
                  'item_pic']


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'user_name', 'user_account', 'user_passwd', 'user_role',
                  'user_phone', 'user_email', 'user_created_date', 'user_isVerified']


class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = ['id', 'order_initiator', 'order_item_id', 'order_created_date',
                  'order_donation_amount', 'order_isCollected', 'order_isDeleted', 'order_collected_date',
                  'order_collection_location']