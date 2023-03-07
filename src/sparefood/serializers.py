from rest_framework import serializers
from .models import Items
from .models import Users


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
