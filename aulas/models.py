from django.db import models

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

