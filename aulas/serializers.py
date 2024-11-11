from rest_framework import serializers
from .models import Aula

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = '__all__'  # Isso vai incluir todos os campos do modelo Aula
