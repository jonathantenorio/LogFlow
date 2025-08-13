"""
Modelos de usuário para o sistema LogFlow.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Modelo de usuário customizado para o LogFlow.
    """
    
    # Campos adicionais
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name=_('Telefone')
    )
    
    department = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Departamento')
    )
    
    position = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Cargo')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Ativo')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Data de criação')
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Data de atualização')
    )
    
    class Meta:
        verbose_name = _('Usuário')
        verbose_name_plural = _('Usuários')
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"
    
    @property
    def full_name(self):
        """Retorna o nome completo do usuário."""
        return self.get_full_name() or self.username
