from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AulaViewSet, UserDetails, InstrutoresList

# Criação do roteador e registro da viewset
router = DefaultRouter()
router.register(r'aulas', AulaViewSet)

# Configuração das rotas
urlpatterns = router.urls  # As rotas para criar, editar, excluir e listar aulas são automaticamente configuradas

# Adicionando as rotas customizadas
urlpatterns += [
    path('user/', UserDetails.as_view(), name='user_details'),  # URL para pegar os dados do usuário
    path('instrutores/', InstrutoresList.as_view(), name='instrutores-list'),  # URL para listar os instrutores
]
