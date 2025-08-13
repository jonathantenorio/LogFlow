# Guia de Instalação - LogFlow

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Git** (para clonar o repositório)

### Instalação do Docker

#### Windows
1. Baixe o Docker Desktop em: https://www.docker.com/products/docker-desktop
2. Execute o instalador e siga as instruções
3. Reinicie o computador se necessário

#### macOS
1. Baixe o Docker Desktop em: https://www.docker.com/products/docker-desktop
2. Arraste o aplicativo para a pasta Applications
3. Execute o Docker Desktop

#### Linux (Ubuntu/Debian)
```bash
# Atualiza os pacotes
sudo apt update

# Instala dependências
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Adiciona a chave GPG oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adiciona o repositório do Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instala o Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Adiciona o usuário ao grupo docker
sudo usermod -aG docker $USER

# Instala o Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 🚀 Instalação Rápida

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd LogFlow
```

### 2. Execute o script de setup
```bash
# Linux/macOS
chmod +x setup.sh
./setup.sh

# Windows (PowerShell)
# Execute o script setup.sh manualmente ou use os comandos abaixo
```

### 3. Acesse a aplicação
Após a conclusão do setup, acesse:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin
- **Documentação API**: http://localhost:8000/api/docs/

## 🔧 Instalação Manual

Se preferir fazer a instalação manual:

### 1. Configure as variáveis de ambiente
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 2. Crie os diretórios necessários
```bash
mkdir -p backend/logs
mkdir -p backend/media
mkdir -p backend/staticfiles
mkdir -p nginx/conf.d
```

### 3. Inicie os serviços
```bash
docker-compose up -d --build
```

### 4. Execute as migrações
```bash
docker-compose exec backend python manage.py migrate
```

### 5. Crie um superusuário
```bash
docker-compose exec backend python manage.py createsuperuser
```

### 6. Colete arquivos estáticos
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

## 📊 Estrutura do Projeto

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

## 🛠️ Comandos Úteis

### Gerenciamento de Containers
```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Reiniciar um serviço
docker-compose restart backend

# Reconstruir containers
docker-compose up -d --build
```

### Comandos Django
```bash
# Executar migrações
docker-compose exec backend python manage.py migrate

# Criar migrações
docker-compose exec backend python manage.py makemigrations

# Criar superusuário
docker-compose exec backend python manage.py createsuperuser

# Shell do Django
docker-compose exec backend python manage.py shell

# Coletar arquivos estáticos
docker-compose exec backend python manage.py collectstatic --noinput
```

### Comandos React
```bash
# Instalar dependências
docker-compose exec frontend npm install

# Executar testes
docker-compose exec frontend npm test

# Build de produção
docker-compose exec frontend npm run build
```

## 🔍 Solução de Problemas

### Problema: Porta já em uso
```bash
# Verifique quais processos estão usando as portas
sudo lsof -i :8000
sudo lsof -i :3000

# Pare os processos ou altere as portas no docker-compose.yml
```

### Problema: Erro de permissão
```bash
# No Linux, adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

### Problema: Banco de dados não conecta
```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Reinicie o serviço de banco
docker-compose restart db

# Verifique os logs
docker-compose logs db
```

### Problema: Frontend não carrega
```bash
# Verifique se o backend está rodando
docker-compose ps

# Reinicie o frontend
docker-compose restart frontend

# Verifique os logs
docker-compose logs frontend
```

## 📝 Configuração de Produção

Para deploy em produção:

1. **Altere as variáveis de ambiente**:
   - `DEBUG=False`
   - `SECRET_KEY` (gere uma chave segura)
   - `ALLOWED_HOSTS` (domínio de produção)
   - `DATABASE_URL` (banco de produção)

2. **Configure SSL/HTTPS**:
   - Adicione certificados SSL
   - Configure o Nginx para HTTPS

3. **Configure backup**:
   - Configure backup automático do banco
   - Configure backup dos arquivos de mídia

4. **Monitore a aplicação**:
   - Configure logs centralizados
   - Configure monitoramento de performance

## 🤝 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Consulte a documentação da API: http://localhost:8000/api/docs/
3. Abra uma issue no repositório
4. Entre em contato com a equipe de desenvolvimento

## 📚 Próximos Passos

Após a instalação:

1. **Configure usuários**: Acesse o admin Django para criar usuários
2. **Importe dados**: Use a funcionalidade de upload de Excel
3. **Configure categorias**: Crie categorias de produtos
4. **Teste as funcionalidades**: Explore todas as funcionalidades do sistema
5. **Personalize**: Adapte o sistema às suas necessidades
