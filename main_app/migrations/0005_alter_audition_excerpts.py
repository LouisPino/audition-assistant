# Generated by Django 4.2.5 on 2023-09-22 21:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0004_excerpt_goal_tempo_type_alter_excerpt_audio_link_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audition',
            name='excerpts',
            field=models.ManyToManyField(blank=True, null=True, to='main_app.excerpt'),
        ),
    ]
