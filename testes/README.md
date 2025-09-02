# Testes E2E com Playwright

Este diretório contém os testes end-to-end (E2E) do projeto GameSwap usando Playwright com TypeScript.

## Estrutura de Pastas

```
testes/
├── e2e/           # Testes E2E
├── pages/         # Page Objects
├── routes/        # Configuração de rotas
├── tsconfig.json  # Configuração TypeScript
└── README.md      # Este arquivo
```

## Como Executar os Testes

### Instalar dependências
```bash
npm install
```

### Instalar browsers do Playwright
```bash
npx playwright install
```

### Executar todos os testes
```bash
npx playwright test
```

### Executar testes em modo headed (com interface gráfica)
```bash
npx playwright test --headed
```

### Executar testes específicos
```bash
npx playwright test homepage.spec.ts
```

### Executar testes em um browser específico
```bash
npx playwright test --project=chromium
```

### Gerar relatório HTML
```bash
npx playwright show-report
```

## Page Objects

Os Page Objects estão localizados na pasta `pages/` e seguem o padrão:

- `BasePage.ts`: Classe base com métodos comuns
- `HomePage.ts`: Page Object para a página inicial
- Adicione novos Page Objects conforme necessário

## Rotas

O arquivo `routes/routes.ts` centraliza todas as URLs da aplicação, facilitando a manutenção e mudanças.

## Configuração

O arquivo `playwright.config.ts` na raiz do projeto contém todas as configurações do Playwright.

## Exemplos de Uso

### Criando um novo Page Object

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly selectors = {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
  };

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.selectors.emailInput, email);
    await this.fillInput(this.selectors.passwordInput, password);
    await this.clickElement(this.selectors.loginButton);
  }
}
```

### Criando um novo teste

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {
  test('deve fazer login com sucesso', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/login');
    await loginPage.login('user@example.com', 'password123');
    
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });
});
```

## Dicas

1. Use `data-testid` nos elementos HTML para facilitar a seleção nos testes
2. Mantenha os Page Objects organizados e reutilizáveis
3. Use as rotas centralizadas em `routes/routes.ts`
4. Execute os testes localmente antes de fazer commit
5. Use screenshots para debug quando necessário
