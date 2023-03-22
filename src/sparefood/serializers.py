from rest_framework import serializers
from .models import Item
from .models import User


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'item_name', 'item_des', 'item_upload_date', 'item_expiration_date', 'item_status', 'item_isPrivate', 'item_location', 'item_isExpired']

    def save(self):
        item = Item(
            item_name=self.validated_data['item_name'],
            item_des=self.validated_data['item_des'],
            item_expiration_date=self.validated_data['item_expiration_date'],
            item_location=self.validated_data['item_location']
        )
        item.save()
        return item


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'last_login', 'date_joined', 'is_admin',
                  'is_active', 'is_staff', 'is_super_user']


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = User(full_name=self.validated_data['full_name'], email=self.validated_data['email'])
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user
