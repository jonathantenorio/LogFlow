# Documentação da API - LogFlow

## 📋 Visão Geral

A API do LogFlow é uma API RESTful desenvolvida em Django REST Framework que fornece endpoints para gerenciamento completo de logística, incluindo inventário, ordens, clientes e usuários.

**URL Base**: `http://localhost:8000/api/v1/`

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação.

### Login
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "username": "admin",
  "password": "senha123"
}
```

**Resposta**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@logflow.com",
    "first_name": "Administrador",
    "last_name": "Sistema"
  }
}
```

### Usar Token
```http
GET /api/v1/inventory/products/
Authorization: Bearer <access_token>
```

### Renovar Token
```http
POST /api/v1/auth/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

## 📦 Inventário

### Listar Produtos
```http
GET /api/v1/inventory/products/
Authorization: Bearer <token>
```

**Parâmetros de Query**:
- `search`: Busca por nome ou código
- `category`: Filtrar por categoria
- `status`: Filtrar por status (active, inactive, discontinued)
- `ordering`: Ordenação (name, code, current_stock, created_at)

**Resposta**:
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/v1/inventory/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "code": "PROD001",
      "name": "Notebook Dell Inspiron",
      "description": "Notebook para trabalho",
      "category": {
        "id": 1,
        "name": "Eletrônicos"
      },
      "unit": "UN",
      "current_stock": 50,
      "minimum_stock": 10,
      "maximum_stock": 100,
      "location": "Estante A1",
      "shelf": "A1-01",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Criar Produto
```http
POST /api/v1/inventory/products/
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "PROD006",
  "name": "Impressora HP LaserJet",
  "description": "Impressora laser monocromática",
  "category": 1,
  "unit": "UN",
  "current_stock": 15,
  "minimum_stock": 5,
  "maximum_stock": 30,
  "location": "Estante A3",
  "shelf": "A3-02"
}
```

### Atualizar Produto
```http
PUT /api/v1/inventory/products/1/
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_stock": 45,
  "location": "Estante A1-02"
}
```

### Deletar Produto
```http
DELETE /api/v1/inventory/products/1/
Authorization: Bearer <token>
```

### Movimentação de Estoque
```http
POST /api/v1/inventory/movements/
Authorization: Bearer <token>
Content-Type: application/json

{
  "product": 1,
  "movement_type": "in",
  "quantity": 10,
  "reference": "Compra #12345",
  "notes": "Entrada de estoque"
}
```

**Tipos de Movimentação**:
- `in`: Entrada
- `out`: Saída
- `adjustment`: Ajuste
- `transfer`: Transferência

## 📋 Ordens

### Listar Ordens
```http
GET /api/v1/orders/orders/
Authorization: Bearer <token>
```

**Parâmetros de Query**:
- `order_type`: Filtrar por tipo (pickup, delivery, withdrawal, transfer)
- `status`: Filtrar por status (pending, processing, ready, in_transit, completed, cancelled)
- `client`: Filtrar por cliente
- `created_by`: Filtrar por criador
- `date_from`: Data inicial
- `date_to`: Data final

**Resposta**:
```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "order_number": "ORD-000001",
      "order_type": "delivery",
      "status": "processing",
      "priority": "normal",
      "client": {
        "id": 1,
        "name": "Empresa ABC Ltda",
        "email": "contato@abc.com"
      },
      "pickup_address": "Rua A, 123 - Centro",
      "delivery_address": "Av. B, 456 - Zona Sul",
      "requested_date": "2024-01-15T14:00:00Z",
      "scheduled_date": "2024-01-16T09:00:00Z",
      "total_items": 3,
      "total_weight": 15.5,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Criar Ordem
```http
POST /api/v1/orders/orders/
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_type": "delivery",
  "client": 1,
  "pickup_address": "Rua A, 123 - Centro",
  "delivery_address": "Av. B, 456 - Zona Sul",
  "requested_date": "2024-01-16T09:00:00Z",
  "description": "Entrega de equipamentos",
  "priority": "high"
}
```

### Atualizar Status da Ordem
```http
POST /api/v1/orders/orders/1/status/
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_transit",
  "notes": "Saiu para entrega às 09:30"
}
```

### Adicionar Item à Ordem
```http
POST /api/v1/orders/items/
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": 1,
  "product": 1,
  "quantity": 2,
  "unit_price": 1500.00,
  "notes": "Produto com garantia estendida"
}
```

## 👥 Clientes

### Listar Clientes
```http
GET /api/v1/orders/clients/
Authorization: Bearer <token>
```

### Criar Cliente
```http
POST /api/v1/orders/clients/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nova Empresa Ltda",
  "email": "contato@novaempresa.com",
  "phone": "(11) 99999-9999",
  "address": "Rua das Flores, 123 - Centro",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567"
}
```

## 👤 Usuários

### Perfil do Usuário
```http
GET /api/v1/auth/profile/
Authorization: Bearer <token>
```

### Atualizar Perfil
```http
PUT /api/v1/auth/profile/
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "João",
  "last_name": "Silva",
  "phone": "(11) 88888-8888",
  "department": "Logística"
}
```

### Alterar Senha
```http
POST /api/v1/auth/change-password/
Authorization: Bearer <token>
Content-Type: application/json

{
  "old_password": "senha123",
  "new_password": "novaSenha456",
  "new_password_confirm": "novaSenha456"
}
```

## 📊 Estatísticas

### Estatísticas do Sistema
```http
GET /api/v1/stats/
Authorization: Bearer <token>
```

**Resposta**:
```json
{
  "general": {
    "total_products": 150,
    "total_orders": 25,
    "total_clients": 45,
    "total_users": 12
  },
  "inventory": {
    "low_stock_products": 8,
    "total_stock_value": 125000.50
  },
  "orders": {
    "pending": 5,
    "processing": 8,
    "completed": 12
  },
  "recent_activity": {
    "orders_last_30_days": 15,
    "stock_movements_last_30_days": 45
  }
}
```

### Estatísticas de Inventário
```http
GET /api/v1/inventory/stats/
Authorization: Bearer <token>
```

### Estatísticas de Ordens
```http
GET /api/v1/orders/stats/
Authorization: Bearer <token>
```

## 📤 Upload de Excel

### Upload de Arquivo
```http
POST /api/v1/upload/excel/
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <arquivo_excel>
type: inventory
```

**Resposta**:
```json
{
  "message": "Arquivo enviado com sucesso",
  "file_path": "excel_uploads/inventory/20240115_143022_planilha.xlsx",
  "rows_count": 50,
  "columns": ["code", "name", "category", "quantity", "unit"],
  "data_type": "inventory"
}
```

### Processar Dados
```http
POST /api/v1/upload/process/
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_path": "excel_uploads/inventory/20240115_143022_planilha.xlsx",
  "data_type": "inventory",
  "column_mapping": {
    "code": "codigo",
    "name": "nome",
    "category": "categoria",
    "quantity": "quantidade"
  },
  "options": {
    "default_min_stock": 5
  }
}
```

**Resposta**:
```json
{
  "message": "Processamento concluído. 45 produtos processados.",
  "processed_rows": 45,
  "errors": [
    "Linha 12: Código e nome são obrigatórios",
    "Linha 23: Produto já existe"
  ],
  "warnings": [
    "Linha 8: Categoria não encontrada, criada automaticamente"
  ]
}
```

## 🔍 Filtros e Busca

### Filtros Disponíveis

**Produtos**:
- `search`: Busca em nome e código
- `category`: ID da categoria
- `status`: Status do produto
- `location`: Localização
- `needs_restock`: Produtos com estoque baixo (true/false)

**Ordens**:
- `order_type`: Tipo de ordem
- `status`: Status da ordem
- `priority`: Prioridade
- `client`: ID do cliente
- `created_by`: ID do criador
- `date_from`: Data inicial
- `date_to`: Data final
- `overdue`: Ordens atrasadas (true/false)

**Clientes**:
- `search`: Busca em nome e email
- `city`: Cidade
- `state`: Estado
- `is_active`: Cliente ativo (true/false)

### Exemplo de Filtros
```http
GET /api/v1/inventory/products/?search=notebook&category=1&needs_restock=true
GET /api/v1/orders/orders/?status=pending&priority=high&date_from=2024-01-01
GET /api/v1/orders/clients/?search=empresa&city=São Paulo
```

## 📄 Paginação

Todas as listagens suportam paginação:

```json
{
  "count": 150,
  "next": "http://localhost:8000/api/v1/inventory/products/?page=2",
  "previous": null,
  "results": [...]
}
```

**Parâmetros**:
- `page`: Número da página
- `page_size`: Itens por página (padrão: 20)

## ⚠️ Códigos de Erro

### Erros Comuns

**400 - Bad Request**:
```json
{
  "error": "Dados inválidos",
  "details": {
    "field_name": ["Este campo é obrigatório"]
  }
}
```

**401 - Unauthorized**:
```json
{
  "detail": "As credenciais de autenticação não foram fornecidas."
}
```

**403 - Forbidden**:
```json
{
  "detail": "Você não tem permissão para executar esta ação."
}
```

**404 - Not Found**:
```json
{
  "detail": "Não encontrado."
}
```

**500 - Internal Server Error**:
```json
{
  "error": "Erro interno do servidor"
}
```

## 📚 Exemplos de Uso

### Exemplo Completo: Criar Ordem com Itens

1. **Criar Cliente** (se não existir):
```http
POST /api/v1/orders/clients/
{
  "name": "Cliente Exemplo",
  "email": "cliente@exemplo.com",
  "phone": "(11) 99999-9999"
}
```

2. **Criar Ordem**:
```http
POST /api/v1/orders/orders/
{
  "order_type": "delivery",
  "client": 1,
  "delivery_address": "Rua Exemplo, 123",
  "requested_date": "2024-01-16T10:00:00Z"
}
```

3. **Adicionar Itens**:
```http
POST /api/v1/orders/items/
{
  "order": 1,
  "product": 1,
  "quantity": 2,
  "unit_price": 1500.00
}
```

4. **Atualizar Status**:
```http
POST /api/v1/orders/orders/1/status/
{
  "status": "processing"
}
```

## 🔧 Rate Limiting

A API implementa rate limiting para proteger contra abuso:

- **Limite**: 1000 requisições por hora por usuário
- **Headers de resposta**:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp de reset

## 📞 Suporte

Para suporte técnico:

- **Documentação Swagger**: http://localhost:8000/api/docs/
- **Documentação ReDoc**: http://localhost:8000/api/redoc/
- **Email**: suporte@logflow.com
- **Issues**: https://github.com/logflow/issues
