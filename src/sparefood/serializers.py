from rest_framework import serializers
from .models import *


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'upload_date', 'expiration_date', 'status', 'is_private', 'location', 'is_expired']

    def save(self):
        item = Item(
            name=self.validated_data['name'],
            description=self.validated_data['description'],
            expiration_date=self.validated_data['expiration_date'],
            location=self.validated_data['location'],
            is_private=self.validated_data['is_private']
        )
        item.save()
        return item


class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'order_initiator', 'order_item_id', 'order_created_date',
                  'order_donation_amount', 'order_isCollected', 'order_isDeleted', 'order_collected_date',
                  'order_collection_location']


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
