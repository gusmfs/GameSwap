# 🎮 GameSwap

> Plataforma de troca e venda de skins de Counter-Strike 2

GameSwap é uma aplicação frontend moderna para troca e venda de skins de Counter-Strike 2, desenvolvida com React e Vite.

## ✨ Funcionalidades

### 🏠 **Página Inicial**
- Apresentação da plataforma
- Design moderno e responsivo
- Navegação para marketplace

### 🛒 **Marketplace**
- Catálogo de skins disponíveis
- Sistema de busca e filtros
- Visualização detalhada de itens

### 👤 **Sistema de Usuários**
- **Registro**: Cadastro com validação
- **Login**: Autenticação simulada
- **Perfil**: Gerenciamento de dados
- **Inventário**: Visualização de itens

### 🛡️ **Área Administrativa**
- Dashboard com métricas
- Projeções de crescimento
- Interface exclusiva para admins

### 🛒 **Carrinho de Compras**
- Adicionar/remover itens
- Cálculo de totais

### 📊 **Sistema de Feedback**
- Envio de sugestões
- Interface dedicada

## 🚀 Tecnologias

- **React 19** - Biblioteca principal
- **Vite** - Build tool
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Estilização
- **React Icons** - Ícones
- **Playwright** - Testes e2e

## 📦 Instalação

### **Pré-requisitos**
- Node.js (versão 18+)
- npm

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/gameswap.git
cd gameswap
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Execute o projeto**
```bash
npm run dev
```
Acesse: `http://localhost:5173`

## 🧪 Testes

```bash
# Instalar Playwright
npm run test:e2e:install

# Executar testes
npm run test:e2e

# Interface visual
npm run test:e2e:ui
```

## 🔐 Credenciais de Teste

### **Administradores**
- **Email**: `admin@gameswap.com` | **Senha**: `admin123`
- **Email**: `admin@teste.com` | **Senha**: `admin123`

### **Usuário Comum**
- **Email**: `user@teste.com` | **Senha**: `user123`

## 🛣️ Rotas

### **Públicas**
- `/` - Página inicial
- `/marketplace` - Catálogo
- `/login` - Login
- `/register` - Registro
- `/terms` - Termos de uso
- `/feedback` - Feedback

### **Privadas**
- `/profile` - Perfil do usuário
- `/inventory` - Inventário
- `/cart` - Carrinho

### **Administrativas**
- `/admin` - Dashboard admin

## 🔧 Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Visualizar build |
| `npm run lint` | Linting |
| `npm run test:e2e` | Testes e2e |

## 📁 Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── routes/        # Configuração de rotas
├── services/      # Serviços (simulados)
├── providers/     # Context providers
└── assets/        # Recursos estáticos
```

## ⚠️ Aviso de Segurança

Esta é uma **aplicação de demonstração** com autenticação simulada. Para produção:

1. Implementar backend real
2. Usar hash de senhas
3. Implementar JWT tokens
4. Validar dados no servidor
5. Usar HTTPS

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'Add nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para a comunidade gamer**
