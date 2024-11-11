from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AulaViewSet

# Criação do roteador e registro da viewset
router = DefaultRouter()
router.register(r'aulas', AulaViewSet)

urlpatterns = router.urls  # Alterando aqui para que as rotas sejam diretamente configuradas

