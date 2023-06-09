from rest_framework import serializers
from .models import *


class ItemSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the Item model for both sending to the user and value manipulation."""
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'upload_date', 'expiration_date', 'is_deleted', 'location', 'provider',
                  'is_collected', 'picture', 'is_registrable']

    def save(self) -> Item:
        """Writes a valid Item object to the database."""
        item = Item(
            name=self.validated_data['name'],
            description=self.validated_data['description'],
            expiration_date=self.validated_data['expiration_date'],
            location=self.validated_data['location'],
            is_deleted=self.validated_data['is_deleted'],
            picture=self.validated_data['picture'],
            provider=self.validated_data['provider']
        )
        item.save()
        return item


class OrdersSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the Order model for both sending to the user and value manipulation."""
    class Meta:
        model = Order
        fields = ['id', 'initiator', 'item', 'created_date',
                  'donation_amount', 'is_collected', 'is_deleted', 'collected_date',
                  'collection_location']

    def save(self) -> Order:
        order: Order = Order(
            initiator=self.validated_data['initiator'],
            item=self.validated_data['item'],
            donation_amount=self.validated_data['donation_amount'],
        )
        order.save()
        return order


class UsersSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the User model for both sending to the user and value manipulation."""
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'last_login', 'date_joined', 'is_admin',
                  'is_active', 'is_staff', 'is_super_user']


class RegistrationSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the User model for value manipulation only. This does not have a send value
    and cannot be used for anything other than new userdata creation."""
    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'is_business']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self) -> User:
        user: User = User(full_name=self.validated_data['full_name'], email=self.validated_data['email'],
                          is_business=self.validated_data['is_business'])
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user


class ChatsSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the ChatRoom model for both sending to the user and value manipulation."""
    class Meta:
        model = ChatRoom
        fields = ['id', 'user_1', 'user_2', 'order', 'order_name']


class ShareSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the Share model for both sending to the user and value manipulation."""
    class Meta:
        model = Share
        fields = ['id', 'item', 'times_shared']
