import uuid

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser

from phonenumber_field.modelfields import PhoneNumberField
import django.utils.timezone as timezone

from django.conf import settings

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
    is_business = models.BooleanField(default=False)

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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("name", max_length=240)
    description = models.TextField("description", max_length=10000)
    provider_id = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id', default="8ba97d61-4c1b-4d43-bcea-da0bd3653a7a")
    upload_date = models.DateField(default=timezone.now)
    expiration_date = models.DateField()
    status = models.CharField("status", max_length=30, default="Available")
    is_private = models.BooleanField(default=False)
    location = models.CharField("location", max_length=240)
    picture = models.ImageField(verbose_name="picture", upload_to='items')
    shared_times = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    @property
    def get_absolute_image_url(self):
        return '%s%s' % (settings.MEDIA_URL, self.image.url)


class Order(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiator = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    created_date = models.DateTimeField(auto_now_add=True)
    donation_amount = models.FloatField()

    is_collected = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    collected_date = models.DateTimeField(null=True, blank=True)
    collection_location = models.CharField(verbose_name="order_location", max_length=240, default="Sheffield")
