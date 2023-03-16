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
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'last_login', 'date_joined', 'is_admin',
                  'is_active', 'is_staff', 'is_super_user']


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = User(email=self.validated_data['email'])
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user
