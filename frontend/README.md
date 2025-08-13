# LogFlow Frontend

Sistema de gerenciamento logístico desenvolvido em React com TypeScript e Material-UI.

## 🚀 Funcionalidades

- **Dashboard**: Visão geral do sistema com estatísticas
- **Inventário**: Gerenciamento de produtos e estoque
- **Pedidos**: Controle de pedidos e status
- **Clientes**: Cadastro e gerenciamento de clientes
- **Usuários**: Administração de usuários do sistema
- **Upload Excel**: Importação de dados via arquivos Excel
- **Romaneio**: Sistema completo de romaneio com diferentes tipos
- **Perfil**: Gerenciamento de perfil do usuário

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router** - Roteamento da aplicação
- **React Query** - Gerenciamento de estado e cache
- **React Hook Form** - Gerenciamento de formulários
- **React Dropzone** - Upload de arquivos
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP
- **Yup** - Validação de esquemas

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Gera build de produção
- `npm test` - Executa os testes
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Corrige problemas do linter automaticamente
- `npm run type-check` - Verifica tipos TypeScript

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Auth/           # Componentes de autenticação
│   ├── Layout/         # Layout principal da aplicação
│   └── Romaneio/       # Componentes específicos do romaneio
├── pages/              # Páginas da aplicação
│   ├── Auth/           # Páginas de autenticação
│   ├── Dashboard/      # Dashboard principal
│   ├── Inventory/      # Gerenciamento de inventário
│   ├── Orders/         # Gerenciamento de pedidos
│   ├── Clients/        # Gerenciamento de clientes
│   ├── Users/          # Gerenciamento de usuários
│   ├── ExcelUpload/    # Upload de arquivos Excel
│   └── Profile/        # Perfil do usuário
├── App.tsx             # Componente principal
└── index.tsx           # Ponto de entrada da aplicação
```

## 🔐 Autenticação

O sistema possui um sistema de autenticação simulado. Para fazer login, use qualquer email e senha (não vazios).

## 🎨 Tema

O projeto utiliza Material-UI com tema personalizado em português brasileiro, incluindo:
- Cores primárias e secundárias customizadas
- Tipografia Roboto
- Componentes com bordas arredondadas
- Sombras suaves

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (>= 1024px)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔄 Estado da Aplicação

- **React Query**: Para cache e sincronização de dados
- **Context API**: Para autenticação global
- **Local State**: Para estados locais dos componentes

## 📊 Dados

Atualmente o sistema utiliza dados mockados para demonstração. Em produção, deve ser conectado a uma API backend.

## 🚀 Deploy

Para gerar o build de produção:

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `build/`.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email ou abra uma issue no repositório.
