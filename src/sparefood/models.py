from django.db import models


# Items details
class Items(models.Model):
    item_name = models.CharField("item_name", max_length=240)

    class Meta:
        db_table = 'items_details'

    def __str__(self):
        return self.item_name


class Users(models.Model):
    user_name = models.CharField("user_name", max_length=240)

    class Meta:
        db_table = 'users_info'

    def __str__(self):
        return self.user_name
