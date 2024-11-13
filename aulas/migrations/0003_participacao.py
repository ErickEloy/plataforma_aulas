# Generated by Django 5.1.3 on 2024-11-13 00:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aulas', '0002_perfil'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Participacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_inscricao', models.DateTimeField(auto_now_add=True)),
                ('aluno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participacoes', to=settings.AUTH_USER_MODEL)),
                ('aula', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participantes', to='aulas.aula')),
            ],
            options={
                'unique_together': {('aluno', 'aula')},
            },
        ),
    ]