# Generated by Django 4.2.5 on 2023-09-27 14:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0023_remove_excerpt_goal_tempo_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='excerpt',
            name='audio_links',
        ),
        migrations.RemoveField(
            model_name='excerpt',
            name='start_times',
        ),
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('audio_link', models.CharField(blank=True, null=True, verbose_name='Youtube Link')),
                ('start_time', models.CharField(blank=True, null=True, verbose_name='excerpt time (mm:ss)')),
                ('excerpt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main_app.excerpt')),
            ],
        ),
    ]
