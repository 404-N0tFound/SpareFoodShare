from rest_framework import serializers
from .models import Item
from .models import User


class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'item_name', 'item_des', 'item_upload_date', 'item_expiration_date',
                  'item_provider', 'item_status', 'item_isPrivate', 'item_location', 'item_isExpired',
                  'item_pic']


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_name', 'user_account', 'user_passwd', 'user_role',
                  'user_phone', 'user_email', 'user_created_date', 'user_isVerified']
