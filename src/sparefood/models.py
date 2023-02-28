from django.db import models


# Items details
class Items(models.Model):
    item_name = models.CharField("item_name", max_length=240)
    item_des = models.TextField("item_des", max_length=240)
    item_upload_date = models.DateField()
    item_expiration_date = models.DateField()
    item_provider = models.CharField("item_provider", max_length=240)
    item_pricing = models.IntegerField()
    item_status = models.CharField("item_status", max_length=240)
    item_isprivate = models.BooleanField()
    item_location = models.CharField("item_location", max_length=240)



class Users(models.Model):
    user_name = models.CharField("user_name", max_length=240)
    user_account = models.CharField("user_account", max_length=240)
    user_passwd = models.CharField("user_passwd", max_length=240)
    user_role = models.CharField("user_role", max_length=240)
    user_phone = models.CharField("user_phone", max_length=240)
    user_email = models.CharField("user_email", max_length=240)
    user_created_date = models.DateField()