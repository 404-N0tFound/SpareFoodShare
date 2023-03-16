import uuid

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser

from phonenumber_field.modelfields import PhoneNumberField

from django.db import models


# Items details

class Item(models.Model):
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

    # The following fields are required for every custom User model
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return True
