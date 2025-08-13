"""
URLs para a aplicação de inventário.
"""

from django.urls import path
from .views import (
    CategoryViewSet, ProductViewSet, StockMovementViewSet,
    inventory_stats, low_stock_alert
)

app_name = 'inventory'

urlpatterns = [
    # Categorias
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='category_list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='category_detail'),
    
    # Produtos
    path('products/', ProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='product_list'),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='product_detail'),
    path('products/<int:pk>/movements/', ProductViewSet.as_view({'get': 'movements'}), name='product_movements'),
    
    # Movimentações de estoque
    path('movements/', StockMovementViewSet.as_view({'get': 'list', 'post': 'create'}), name='movement_list'),
    path('movements/<int:pk>/', StockMovementViewSet.as_view({'get': 'retrieve'}), name='movement_detail'),
    
    # Estatísticas e alertas
    path('stats/', inventory_stats, name='inventory_stats'),
    path('alerts/low-stock/', low_stock_alert, name='low_stock_alert'),
]
