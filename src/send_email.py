import os
from django.core.mail import send_mail

os.environ['DJANGO_SETTINGS_MODULE'] = 'monolith.settings'

send_mail(
    'Welcome to SpareFoodShare!',
    'Click the link below to verify your account to be able to log in.',
    'sparefoodshare@gmail.com',
    ['sparefoodshare@example.com'],
)
