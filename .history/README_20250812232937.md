# LogFlow - Sistema de Logística Inteligente

## 📋 Descrição

O LogFlow é um sistema web multiplataforma para gestão logística que permite processar dados de planilhas Excel e gerar automaticamente diferentes tipos de ordens (coleta, retirada, entrega) com controle de inventário em tempo real.

## 🚀 Funcionalidades Principais

- **Upload e Processamento de Planilhas Excel**: Leitura automática e interpretação de dados
- **Geração Automática de Ordens**: Coleta, retirada e entrega
- **Controle de Inventário**: Atualização em tempo real com edição manual
- **Interface Responsiva**: Compatível com desktop, tablet e mobile
- **API REST**: Integração completa com autenticação segura
- **Multi-usuário**: Suporte a múltiplos usuários simultâneos

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.11+**
- **Django 4.2+** - Framework web
- **Django REST Framework** - API REST
- **Pandas** - Processamento de dados Excel
- **OpenPyXL** - Manipulação de arquivos Excel
- **PostgreSQL** - Banco de dados
- **Celery** - Processamento assíncrono
- **Redis** - Cache e filas

### Frontend
- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Material-UI** - Componentes de interface
- **React Query** - Gerenciamento de estado
- **Axios** - Cliente HTTP

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Proxy reverso
- **Gunicorn** - Servidor WSGI

## 📁 Estrutura do Projeto

```
LogFlow/
├── backend/                 # Backend Django
│   ├── logflow/            # Projeto principal
│   ├── apps/               # Aplicações Django
│   │   ├── core/           # Funcionalidades básicas
│   │   ├── inventory/      # Controle de inventário
│   │   ├── orders/         # Gestão de ordens
│   │   └── users/          # Gestão de usuários
│   ├── requirements.txt    # Dependências Python
│   └── manage.py
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── utils/          # Utilitários
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml      # Orquestração Docker
├── nginx/                  # Configuração Nginx
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)

### Instalação com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <repository-url>
cd LogFlow
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Execute com Docker Compose:
```bash
docker-compose up -d
```

4. Acesse a aplicação:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Django: http://localhost:8000/admin

### Instalação Local

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 📚 Documentação da API

A documentação completa da API está disponível em:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login/` - Login de usuário
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh/` - Renovar token

#### Inventário
- `GET /api/inventory/` - Listar inventário
- `POST /api/inventory/` - Criar item
- `PUT /api/inventory/{id}/` - Atualizar item
- `DELETE /api/inventory/{id}/` - Deletar item

#### Ordens
- `GET /api/orders/` - Listar ordens
- `POST /api/orders/` - Criar ordem
- `PUT /api/orders/{id}/` - Atualizar ordem
- `DELETE /api/orders/{id}/` - Deletar ordem

#### Upload de Planilhas
- `POST /api/upload/excel/` - Upload de planilha Excel
- `POST /api/upload/process/` - Processar dados da planilha

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/logflow

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Comandos Úteis

```bash
# Backend
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
python manage.py createsuperuser

# Frontend
npm run build
npm run test
npm run lint

# Docker
docker-compose logs -f
docker-compose exec backend python manage.py shell
```

## 🧪 Testes

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Deploy

### Produção com Docker

1. Configure as variáveis de ambiente para produção
2. Execute:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment

O sistema está preparado para deploy em:
- AWS (ECS, RDS, ElastiCache)
- Google Cloud (GKE, Cloud SQL)
- Azure (AKS, Azure Database)
- Heroku
- DigitalOcean

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@logflow.com
- Documentação: https://docs.logflow.com
- Issues: https://github.com/logflow/issues

## 🔮 Roadmap

- [ ] Integração com APIs de transporte
- [ ] Sistema de rastreamento de entregas
- [ ] Dashboard analítico avançado
- [ ] Notificações em tempo real
- [ ] App mobile nativo
- [ ] Integração com ERPs
- [ ] Machine Learning para otimização de rotas 
