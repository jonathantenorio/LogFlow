#!/bin/bash

# Script de setup para o LogFlow
echo "🚀 Iniciando setup do LogFlow..."

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verifica se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Cria arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Edite as configurações conforme necessário."
fi

# Cria diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p backend/logs
mkdir -p backend/media
mkdir -p backend/staticfiles
mkdir -p nginx/conf.d

# Constrói e inicia os containers
echo "🐳 Construindo e iniciando containers..."
docker-compose up -d --build

# Aguarda os serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 30

# Executa migrações
echo "🗄️ Executando migrações do banco de dados..."
docker-compose exec backend python manage.py migrate

# Cria superusuário
echo "👤 Criando superusuário..."
docker-compose exec backend python manage.py createsuperuser --noinput || true

# Coleta arquivos estáticos
echo "📦 Coletando arquivos estáticos..."
docker-compose exec backend python manage.py collectstatic --noinput

echo "✅ Setup concluído!"
echo ""
echo "🌐 Acesse a aplicação em:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - Admin Django: http://localhost:8000/admin"
echo "   - Documentação API: http://localhost:8000/api/docs/"
echo ""
echo "📋 Para parar os serviços: docker-compose down"
echo "📋 Para ver logs: docker-compose logs -f"
echo "📋 Para reiniciar: docker-compose restart"
