from django.db import models


# Items details

class Items(models.Model):
    item_name = models.CharField("item_name", max_length=240)
    item_des = models.TextField("item_des", max_length=240)
    item_upload_date = models.DateField()
    item_expiration_date = models.DateField()
    item_provider = models.CharField("item_provider", max_length=240)
    item_status = models.CharField("item_status", max_length=240)
    item_isPrivate = models.BooleanField(default=False)
    item_location = models.CharField("item_location", max_length=240)
    item_isExpired = models.BooleanField(default=False)
    item_pic = models.CharField("item_pic", max_length=240, default="PATH")


class Users(models.Model):
    user_name = models.CharField("user_name", max_length=240)
    user_account = models.CharField("user_account", max_length=240)
    user_passwd = models.CharField("user_passwd", max_length=240)
    user_role = models.CharField("user_role", max_length=240)
    user_phone = models.CharField("user_phone", max_length=240)
    user_email = models.CharField("user_email", max_length=240)
    user_created_date = models.DateField()
    user_isVerified = models.BooleanField(default=False)


class Orders(models.Model):
    order_initiator = models.ForeignKey(Users, related_name="order_initiator", on_delete=models.CASCADE)
    order_provider = models.ForeignKey(Users, related_name="order_provider", on_delete=models.CASCADE)
    order_item_id = models.ForeignKey(Items, related_name="order_item_id", on_delete=models.CASCADE)
    order_created_date = models.DateField()
    order_donation_amount = models.IntegerField(default=0)
    order_isCollected = models.BooleanField(default=False)
    order_isDeleted = models.BooleanField(default=False)
    order_collected_date = models.DateField()
    order_collection_location = models.CharField("order_location", max_length=240)
