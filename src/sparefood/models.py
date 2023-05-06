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
    is_active = models.BooleanField(default=False)
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
    provider = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id')
    upload_date = models.DateField(default=timezone.now)
    expiration_date = models.DateField()
    is_deleted = models.BooleanField(default=False)
    is_collected = models.BooleanField(default=False)
    location = models.CharField("location", max_length=240)
    picture = models.ImageField(verbose_name="picture", upload_to='items')
    last_updated = models.DateField(auto_now=True)

    @property
    def get_absolute_image_url(self):
        return '%s%s' % (settings.MEDIA_URL, self.image.url)

    @property
    def is_registrable(self) -> bool:
        return self._is_registrable

    @is_registrable.setter
    def is_registrable(self, value: bool):
        if not (type(value) == bool):
            raise ValueError(f"Value {value} must be a bool.")
        self._is_registrable = value

    def __str__(self):
        return self.name


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiator = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    created_date = models.DateField(auto_now_add=True)
    donation_amount = models.FloatField()

    is_collected = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    collected_date = models.DateField(null=True, blank=True)
    collection_location = models.CharField(verbose_name="order_location", max_length=240, default="Sheffield")


class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.RESTRICT, to_field='id')
    user_1 = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id', related_name='user_1')
    user_2 = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id', related_name='user_2')

    @property
    def order_name(self) -> str:
        return ''


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    value = models.CharField(max_length=10000)
    date = models.DateField(verbose_name='date', auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.RESTRICT, to_field='id')
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, to_field='id')


class Share(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, to_field='id')
    date = models.DateField(verbose_name='date', auto_now_add=True)
    times_shared = models.IntegerField(verbose_name='times_shared', default=0)
