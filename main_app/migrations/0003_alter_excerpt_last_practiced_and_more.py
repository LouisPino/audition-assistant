# Generated by Django 4.2.5 on 2023-09-22 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0002_rename_notes_note_alter_excerpt_audio_link_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='excerpt',
            name='last_practiced',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='excerpt',
            name='start_time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
