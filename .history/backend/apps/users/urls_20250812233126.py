"""
URLs para a aplicação de usuários.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView, LogoutView, UserProfileView, ChangePasswordView,
    UserListView, UserDetailView, UserCreateView, user_stats
)

app_name = 'users'

urlpatterns = [
    # Autenticação
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Perfil do usuário
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Gestão de usuários (apenas admin)
    path('', UserListView.as_view(), name='user_list'),
    path('create/', UserCreateView.as_view(), name='user_create'),
    path('<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('stats/', user_stats, name='user_stats'),
]
