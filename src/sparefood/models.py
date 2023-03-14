
from django.db import models


# Items details

class Items(models.Model):
    item_name = models.CharField("item_name", max_length=240)
    item_des = models.TextField("item_des", max_length=240)
    item_upload_date = models.DateField(auto_now_add=True)
    item_expiration_date = models.DateField()
    item_provider = models.CharField("item_provider", max_length=240)
    item_status = models.CharField("item_status", max_length=240)
    item_isPrivate = models.BooleanField(default=False)
    item_location = models.CharField("item_location", max_length=240)
    item_isExpired = models.BooleanField(default=False)
    item_pic = models.CharField("item_pic", max_length=240, default="PATH")


class Users(models.Model):
    user_name = models.CharField("user_name", max_length=240)
    user_account = models.CharField("user_account", max_length=240, unique=True)
    user_passwd = models.CharField("user_passwd", max_length=240)
    user_role = models.CharField("user_role", max_length=240)
    user_phone = models.CharField("user_phone", max_length=240)
    user_email = models.CharField("user_email", max_length=240, unique=True)
    user_created_date = models.DateField(auto_now_add=True)
    user_isVerified = models.BooleanField(default=False)


class VerifyCode(models.Model):
    code = models.CharField(max_length=256)
    user = models.OneToOneField('Users', on_delete=models.CASCADE)