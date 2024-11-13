from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Aula
from .serializers import AulaSerializer
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# ViewSet de CRUD para Aulas
class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer
    permission_classes = [IsAuthenticated]  # Exige que o usuário esteja autenticado para manipular aulas

    # Customiza a criação das aulas, associando o instrutor automaticamente
    def perform_create(self, serializer):
        serializer.save(instrutor=self.request.user)  # Associa a aula ao usuário logado como instrutor


# View para listar todas as aulas (GET) e criar uma nova aula (POST)
class AulaList(APIView):
    permission_classes = [IsAuthenticated]  # Exige que o usuário esteja autenticado

    # Listar aulas
    def get(self, request):
        aulas = Aula.objects.all()
        serializer = AulaSerializer(aulas, many=True)
        return Response(serializer.data)

    # Criar uma nova aula
    def post(self, request):
        if 'instrutor' not in request.data:
            return Response({'error': 'Instrutor é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AulaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(instrutor=request.user)  # Associa a aula ao usuário logado como instrutor
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View para listar os instrutores cadastrados
class InstrutoresList(APIView):
    permission_classes = [IsAuthenticated]  # Exige que o usuário esteja autenticado

    def get(self, request):
        # Filtra os instrutores (usuários com o campo 'is_instrutor' True)
        instrutores = User.objects.filter(is_staff=True)  # Aqui assumimos que instrutores são usuários com is_staff=True
        instrutores_data = [{"id": instrutor.id, "username": instrutor.username} for instrutor in instrutores]
        return Response(instrutores_data, status=status.HTTP_200_OK)


# View para retornar os dados do usuário autenticado
class UserDetails(APIView):
    permission_classes = [IsAuthenticated]  # Exige que o usuário esteja autenticado

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })
