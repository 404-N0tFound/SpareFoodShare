"""App settings for import into main django project and initialization of database structures."""
from django.apps import AppConfig


class SparefoodConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sparefood'
