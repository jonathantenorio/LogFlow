"""
Views core para funcionalidades básicas do LogFlow.
"""

import pandas as pd
import io
from datetime import datetime
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FileUploadParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db import transaction

from apps.inventory.models import Product, Category, StockMovement
from apps.orders.models import Order, OrderItem, Client
from apps.users.models import User


class ExcelUploadView(APIView):
    """View para upload de planilhas Excel."""
    
    parser_classes = [MultiPartParser, FileUploadParser]
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'file',
                openapi.IN_FORM,
                description="Arquivo Excel (.xlsx, .xls)",
                type=openapi.TYPE_FILE,
                required=True
            ),
            openapi.Parameter(
                'type',
                openapi.IN_FORM,
                description="Tipo de dados (inventory, orders, clients)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="Upload realizado com sucesso",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'file_path': openapi.Schema(type=openapi.TYPE_STRING),
                        'rows_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'columns': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING))
                    }
                )
            ),
            400: "Arquivo inválido ou erro no processamento"
        }
    )
    def post(self, request):
        """Upload de arquivo Excel."""
        
        if 'file' not in request.FILES:
            return Response(
                {'error': 'Nenhum arquivo enviado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        data_type = request.data.get('type', 'inventory')
        
        # Validação do arquivo
        if not file.name.endswith(('.xlsx', '.xls')):
            return Response(
                {'error': 'Formato de arquivo não suportado. Use .xlsx ou .xls'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Lê o arquivo Excel
            df = pd.read_excel(file)
            
            # Salva o arquivo
            file_path = f'excel_uploads/{data_type}/{datetime.now().strftime("%Y%m%d_%H%M%S")}_{file.name}'
            saved_path = default_storage.save(file_path, ContentFile(file.read()))
            
            # Retorna informações sobre o arquivo
            return Response({
                'message': 'Arquivo enviado com sucesso',
                'file_path': saved_path,
                'rows_count': len(df),
                'columns': df.columns.tolist(),
                'data_type': data_type
            })
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao processar arquivo: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ExcelProcessView(APIView):
    """View para processar dados de planilhas Excel."""
    
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'file_path': openapi.Schema(type=openapi.TYPE_STRING),
                'data_type': openapi.Schema(type=openapi.TYPE_STRING),
                'column_mapping': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    description="Mapeamento de colunas"
                ),
                'options': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    description="Opções de processamento"
                )
            },
            required=['file_path', 'data_type']
        ),
        responses={
            200: openapi.Response(
                description="Processamento realizado com sucesso",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'processed_rows': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'errors': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'warnings': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING))
                    }
                )
            ),
            400: "Erro no processamento"
        }
    )
    def post(self, request):
        """Processa dados de planilha Excel."""
        
        file_path = request.data.get('file_path')
        data_type = request.data.get('data_type')
        column_mapping = request.data.get('column_mapping', {})
        options = request.data.get('options', {})
        
        if not file_path or not data_type:
            return Response(
                {'error': 'file_path e data_type são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Lê o arquivo salvo
            file_content = default_storage.open(file_path, 'rb')
            df = pd.read_excel(file_content)
            
            # Processa baseado no tipo de dados
            if data_type == 'inventory':
                result = self._process_inventory_data(df, column_mapping, options, request.user)
            elif data_type == 'orders':
                result = self._process_orders_data(df, column_mapping, options, request.user)
            elif data_type == 'clients':
                result = self._process_clients_data(df, column_mapping, options, request.user)
            else:
                return Response(
                    {'error': 'Tipo de dados não suportado'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(result)
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao processar dados: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _process_inventory_data(self, df, column_mapping, options, user):
        """Processa dados de inventário."""
        
        processed_rows = 0
        errors = []
        warnings = []
        
        with transaction.atomic():
            for index, row in df.iterrows():
                try:
                    # Mapeia as colunas
                    code = row.get(column_mapping.get('code', 'code'), '')
                    name = row.get(column_mapping.get('name', 'name'), '')
                    category_name = row.get(column_mapping.get('category', 'category'), '')
                    quantity = row.get(column_mapping.get('quantity', 'quantity'), 0)
                    
                    if not code or not name:
                        errors.append(f"Linha {index + 1}: Código e nome são obrigatórios")
                        continue
                    
                    # Cria ou obtém categoria
                    category, created = Category.objects.get_or_create(
                        name=category_name or 'Sem Categoria',
                        defaults={'description': 'Categoria criada automaticamente'}
                    )
                    
                    # Cria ou atualiza produto
                    product, created = Product.objects.get_or_create(
                        code=code,
                        defaults={
                            'name': name,
                            'category': category,
                            'current_stock': quantity,
                            'minimum_stock': options.get('default_min_stock', 0),
                            'created_by': user
                        }
                    )
                    
                    if not created:
                        # Atualiza estoque se produto já existe
                        if quantity > 0:
                            StockMovement.objects.create(
                                product=product,
                                movement_type='in',
                                quantity=quantity,
                                reference=f'Importação Excel - Linha {index + 1}',
                                notes='Importação automática via Excel',
                                created_by=user
                            )
                    
                    processed_rows += 1
                    
                except Exception as e:
                    errors.append(f"Linha {index + 1}: {str(e)}")
        
        return {
            'message': f'Processamento concluído. {processed_rows} produtos processados.',
            'processed_rows': processed_rows,
            'errors': errors,
            'warnings': warnings
        }
    
    def _process_orders_data(self, df, column_mapping, options, user):
        """Processa dados de ordens."""
        
        processed_rows = 0
        errors = []
        warnings = []
        
        with transaction.atomic():
            for index, row in df.iterrows():
                try:
                    # Mapeia as colunas
                    client_name = row.get(column_mapping.get('client', 'client'), '')
                    order_type = row.get(column_mapping.get('order_type', 'order_type'), 'delivery')
                    description = row.get(column_mapping.get('description', 'description'), '')
                    requested_date = row.get(column_mapping.get('requested_date', 'requested_date'), datetime.now())
                    
                    if not client_name:
                        errors.append(f"Linha {index + 1}: Nome do cliente é obrigatório")
                        continue
                    
                    # Cria ou obtém cliente
                    client, created = Client.objects.get_or_create(
                        name=client_name,
                        defaults={
                            'email': f'{client_name.lower().replace(" ", ".")}@exemplo.com',
                            'created_by': user
                        }
                    )
                    
                    # Cria ordem
                    order = Order.objects.create(
                        client=client,
                        order_type=order_type,
                        description=description,
                        requested_date=requested_date,
                        created_by=user
                    )
                    
                    processed_rows += 1
                    
                except Exception as e:
                    errors.append(f"Linha {index + 1}: {str(e)}")
        
        return {
            'message': f'Processamento concluído. {processed_rows} ordens criadas.',
            'processed_rows': processed_rows,
            'errors': errors,
            'warnings': warnings
        }
    
    def _process_clients_data(self, df, column_mapping, options, user):
        """Processa dados de clientes."""
        
        processed_rows = 0
        errors = []
        warnings = []
        
        with transaction.atomic():
            for index, row in df.iterrows():
                try:
                    # Mapeia as colunas
                    name = row.get(column_mapping.get('name', 'name'), '')
                    email = row.get(column_mapping.get('email', 'email'), '')
                    phone = row.get(column_mapping.get('phone', 'phone'), '')
                    address = row.get(column_mapping.get('address', 'address'), '')
                    
                    if not name:
                        errors.append(f"Linha {index + 1}: Nome é obrigatório")
                        continue
                    
                    # Cria cliente
                    client, created = Client.objects.get_or_create(
                        name=name,
                        defaults={
                            'email': email or f'{name.lower().replace(" ", ".")}@exemplo.com',
                            'phone': phone,
                            'address': address
                        }
                    )
                    
                    if not created:
                        # Atualiza dados se cliente já existe
                        if email:
                            client.email = email
                        if phone:
                            client.phone = phone
                        if address:
                            client.address = address
                        client.save()
                    
                    processed_rows += 1
                    
                except Exception as e:
                    errors.append(f"Linha {index + 1}: {str(e)}")
        
        return {
            'message': f'Processamento concluído. {processed_rows} clientes processados.',
            'processed_rows': processed_rows,
            'errors': errors,
            'warnings': warnings
        }


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def system_stats(request):
    """Endpoint para estatísticas do sistema."""
    
    from django.db.models import Count, Sum
    from django.utils import timezone
    from datetime import timedelta
    
    # Estatísticas gerais
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_clients = Client.objects.count()
    total_users = User.objects.count()
    
    # Estatísticas de estoque
    low_stock_products = Product.objects.filter(
        current_stock__lte=models.F('minimum_stock')
    ).count()
    
    total_stock_value = Product.objects.aggregate(
        total=Sum(models.F('current_stock') * models.F('unit_price'))
    )['total'] or 0
    
    # Estatísticas de ordens
    pending_orders = Order.objects.filter(status='pending').count()
    processing_orders = Order.objects.filter(status='processing').count()
    completed_orders = Order.objects.filter(status='completed').count()
    
    # Estatísticas dos últimos 30 dias
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_orders = Order.objects.filter(created_at__gte=thirty_days_ago).count()
    recent_movements = StockMovement.objects.filter(created_at__gte=thirty_days_ago).count()
    
    return Response({
        'general': {
            'total_products': total_products,
            'total_orders': total_orders,
            'total_clients': total_clients,
            'total_users': total_users,
        },
        'inventory': {
            'low_stock_products': low_stock_products,
            'total_stock_value': float(total_stock_value),
        },
        'orders': {
            'pending': pending_orders,
            'processing': processing_orders,
            'completed': completed_orders,
        },
        'recent_activity': {
            'orders_last_30_days': recent_orders,
            'stock_movements_last_30_days': recent_movements,
        }
    })
