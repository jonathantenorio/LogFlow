"""
Admin para a aplicação de usuários.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin customizado para o modelo User."""
    
    list_display = [
        'username', 'email', 'first_name', 'last_name',
        'department', 'position', 'is_active', 'date_joined'
    ]
    list_filter = [
        'is_active', 'is_staff', 'is_superuser',
        'department', 'position', 'date_joined'
    ]
    search_fields = ['username', 'first_name', 'last_name', 'email']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Informações Pessoais'), {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        (_('Informações Profissionais'), {
            'fields': ('department', 'position')
        }),
        (_('Permissões'), {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            ),
        }),
        (_('Datas importantes'), {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'password1', 'password2',
                'first_name', 'last_name', 'phone', 'department', 'position'
            ),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
