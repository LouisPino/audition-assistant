# Generated by Django 4.2.5 on 2023-09-23 23:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0012_alter_excerpt_start_times'),
    ]

    operations = [
        migrations.AddField(
            model_name='excerpt',
            name='instrument',
            field=models.CharField(blank=True, default='xylophone', max_length=100, null=True),
        ),
    ]
