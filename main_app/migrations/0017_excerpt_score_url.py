# Generated by Django 4.2.5 on 2023-09-25 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0016_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='excerpt',
            name='score_url',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]
