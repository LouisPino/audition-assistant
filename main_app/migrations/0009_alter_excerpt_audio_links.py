# Generated by Django 4.2.5 on 2023-09-23 22:44

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0008_alter_excerpt_audio_links'),
    ]

    operations = [
        migrations.AlterField(
            model_name='excerpt',
            name='audio_links',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(verbose_name='Spotify Links, separate by commas'), blank=True, null=True, size=3),
        ),
    ]
