"""
URLs para a aplicação de ordens.
"""

from django.urls import path
from .views import (
    ClientViewSet, OrderViewSet, OrderItemViewSet, OrderStatusViewSet,
    OrderDocumentViewSet, order_stats, overdue_orders
)

app_name = 'orders'

urlpatterns = [
    # Clientes
    path('clients/', ClientViewSet.as_view({'get': 'list', 'post': 'create'}), name='client_list'),
    path('clients/<int:pk>/', ClientViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='client_detail'),
    
    # Ordens
    path('orders/', OrderViewSet.as_view({'get': 'list', 'post': 'create'}), name='order_list'),
    path('orders/<int:pk>/', OrderViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='order_detail'),
    path('orders/<int:pk>/items/', OrderViewSet.as_view({'get': 'items'}), name='order_items'),
    path('orders/<int:pk>/status/', OrderViewSet.as_view({'post': 'update_status'}), name='order_status'),
    
    # Itens da ordem
    path('items/', OrderItemViewSet.as_view({'get': 'list', 'post': 'create'}), name='item_list'),
    path('items/<int:pk>/', OrderItemViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='item_detail'),
    
    # Histórico de status
    path('status/', OrderStatusViewSet.as_view({'get': 'list'}), name='status_list'),
    path('status/<int:pk>/', OrderStatusViewSet.as_view({'get': 'retrieve'}), name='status_detail'),
    
    # Documentos
    path('documents/', OrderDocumentViewSet.as_view({'get': 'list', 'post': 'create'}), name='document_list'),
    path('documents/<int:pk>/', OrderDocumentViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='document_detail'),
    
    # Estatísticas e relatórios
    path('stats/', order_stats, name='order_stats'),
    path('overdue/', overdue_orders, name='overdue_orders'),
]
