# Generated by Django 4.2.5 on 2023-09-25 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0018_delete_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='excerpt',
            name='score_type',
            field=models.CharField(default='pdf', max_length=4),
            preserve_default=False,
        ),
    ]
