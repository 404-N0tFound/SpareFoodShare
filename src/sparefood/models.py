import uuid

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser

from phonenumber_field.modelfields import PhoneNumberField

from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("User must have an email address.")

        user = self.model(email=self.normalize_email(email))

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email=self.normalize_email(email),
                                password=password,
                                )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(verbose_name="email", max_length=120, unique=True)
    full_name = models.CharField(verbose_name="full_name", max_length=240)
    phone_number = PhoneNumberField(verbose_name="phone_number", unique=False)
    # For whatever reason, django wants to create a username field from the inherited abstract user,
    # so we make it null with this field to solve that issue
    username = models.CharField(null=True, max_length=240)

    # The following fields are required for every custom User model
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return True


class Item(models.Model):
    item_name = models.CharField(verbose_name="item_name", max_length=120)
    item_des = models.TextField(verbose_name="item_des", max_length=240)
    item_upload_date = models.DateTimeField(auto_now_add=True)
    item_expiration_date = models.DateTimeField(auto_now_add=True)
    item_provider = models.ForeignKey(User, on_delete=models.CASCADE, to_field='email')
    item_isPrivate = models.BooleanField(default=False)
    item_isDeleted = models.BooleanField(default=False)
    item_isExpired = models.BooleanField(default=False)
    item_location = models.CharField(verbose_name="item_location", max_length=240)
    item_pic = models.CharField(verbose_name="item_pic", max_length=240, default="PATH")
    item_shared_times = models.PositiveIntegerField()
    item_last_updated = models.DateTimeField(auto_now=True)


class Order(models.Model):
    order_initiator = models.ForeignKey(User, on_delete=models.CASCADE, to_field='email')
    order_item_id = models.ForeignKey(Item, on_delete=models.CASCADE)

    order_created_date = models.DateTimeField(auto_now_add=True)
    order_donation_amount = models.FloatField()

    order_isCollected = models.BooleanField(default=False)
    order_isDeleted = models.BooleanField(default=False)

    order_collected_date = models.DateTimeField(null=True, blank=True)
    order_collection_location = models.CharField(verbose_name="order_location", max_length=240)
