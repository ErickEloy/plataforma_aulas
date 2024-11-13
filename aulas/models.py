# models.py
from django.db import models
from django.contrib.auth.models import User

class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_instrutor = models.BooleanField(default=False)  # Marca se o usuário é instrutor

    def __str__(self):
        return self.user.username

class Aula(models.Model):
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    data = models.DateTimeField()
    instrutor = models.ForeignKey(
        'auth.User', 
        related_name='aulas', 
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return self.titulo

class Participacao(models.Model):
    aluno = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participacoes')
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name='participantes')
    data_inscricao = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('aluno', 'aula')  # Garante que o aluno só possa se inscrever uma vez na mesma aula.

    def __str__(self):
        return f"{self.aluno.username} inscrito na aula {self.aula.titulo}"
