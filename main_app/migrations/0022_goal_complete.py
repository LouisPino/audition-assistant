# Generated by Django 4.2.5 on 2023-09-26 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0021_goal'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='complete',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
