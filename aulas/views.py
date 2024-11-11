from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Aula
from .serializers import AulaSerializer
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated # Importa a permissão

class AulaList(APIView):
    def get(self, request):
        aulas = Aula.objects.all()
        serializer = AulaSerializer(aulas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AulaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AulaViewSet(viewsets.ModelViewSet): # Manipulação de CRUD via API DRF
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer
    permission_classes = [IsAuthenticated]  # Adiciona a permissão de autenticado