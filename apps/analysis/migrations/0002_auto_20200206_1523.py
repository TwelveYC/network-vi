# Generated by Django 2.2.7 on 2020-02-06 07:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='networkmanager',
            name='labels',
        ),
        migrations.AddField(
            model_name='networkmanager',
            name='labels_edge',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='networkmanager',
            name='labels_entirety',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='networkmanager',
            name='labels_node',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='networkmanager',
            name='type',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
