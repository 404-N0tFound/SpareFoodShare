import os
from django.core.mail import send_mail

os.environ['DJANGO_SETTINGS_MODULE'] = 'monolith.settings'

send_mail(
    'A test mail from SpareFoodShare',
    'This is a test mail message from Donghao',
    'littlesheepdy@gmail.com',
    ['littlesheepdy@163.com'],
)
