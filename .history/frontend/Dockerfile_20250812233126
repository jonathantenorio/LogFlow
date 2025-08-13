# Dockerfile para o frontend React do LogFlow

FROM node:18-alpine

# Define variáveis de ambiente
ENV NODE_ENV=development

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando padrão
CMD ["npm", "start"]
