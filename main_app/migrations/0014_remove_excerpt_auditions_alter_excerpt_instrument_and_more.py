# Generated by Django 4.2.5 on 2023-09-24 16:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0013_excerpt_instrument'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='excerpt',
            name='auditions',
        ),
        migrations.AlterField(
            model_name='excerpt',
            name='instrument',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='excerpt',
            name='auditions',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='main_app.audition'),
            preserve_default=False,
        ),
    ]
