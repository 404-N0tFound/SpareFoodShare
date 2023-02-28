from rest_framework import serializers
from .models import Items


class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = ['id', 'item_name', 'item_des', 'item_upload_date', 'item_expiration_date',
                  'item_provider', 'item_pricing', 'item_status', 'item_isprivate', 'item_location']
