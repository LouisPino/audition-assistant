# Generated by Django 4.2.5 on 2023-09-25 13:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0017_excerpt_score_url'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Score',
        ),
    ]
