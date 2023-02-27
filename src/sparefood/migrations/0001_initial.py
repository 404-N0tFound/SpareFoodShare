# Generated by Django 4.1.7 on 2023-02-27 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Items',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=240, verbose_name='item_name')),
                ('item_des', models.TextField(max_length=240, verbose_name='item_des')),
                ('item_upload_date', models.DateField()),
                ('item_expiration_date', models.DateField()),
                ('item_provider', models.CharField(max_length=240, verbose_name='item_provider')),
                ('item_pricing', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=240, verbose_name='user_name')),
                ('user_account', models.CharField(max_length=240, verbose_name='user_account')),
                ('user_passwd', models.CharField(max_length=240, verbose_name='user_passwd')),
                ('user_role', models.CharField(max_length=240, verbose_name='user_role')),
                ('user_phone', models.CharField(max_length=240, verbose_name='user_phone')),
                ('user_email', models.CharField(max_length=240, verbose_name='user_email')),
                ('user_created_date', models.DateField()),
            ],
            options={
                'db_table': 'users_info',
            },
        ),
    ]
