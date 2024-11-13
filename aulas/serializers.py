# serializers.py
from rest_framework import serializers
from .models import Aula, Participacao

class AulaSerializer(serializers.ModelSerializer):
    instrutor_nome = serializers.CharField(source='instrutor.username', read_only=True)

    class Meta:
        model = Aula
        fields = ['id', 'titulo', 'descricao', 'data', 'instrutor', 'instrutor_nome']

class ParticipacaoSerializer(serializers.ModelSerializer):
    aluno = serializers.CharField(source='aluno.username', read_only=True)
    aula = AulaSerializer(read_only=True)

    class Meta:
        model = Participacao
        fields = ['aluno', 'aula', 'data_inscricao']
