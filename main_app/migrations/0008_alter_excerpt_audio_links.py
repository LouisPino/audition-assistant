# Generated by Django 4.2.5 on 2023-09-23 22:08

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0007_remove_excerpt_audio_link_excerpt_audio_links_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='excerpt',
            name='audio_links',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(), blank=True, null=True, size=3),
        ),
    ]