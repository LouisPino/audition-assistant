# Generated by Django 4.2.5 on 2023-09-23 23:11

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0010_alter_excerpt_audio_links'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='excerpt',
            name='start_time',
        ),
        migrations.AddField(
            model_name='excerpt',
            name='start_times',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, null=True), default=None, size=None),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='excerpt',
            name='audio_links',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, help_text='separate by commas', null=True, size=3, verbose_name='Spotify Links'),
        ),
    ]