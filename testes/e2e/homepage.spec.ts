import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Página Inicial - Validação de Elementos', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visit();
  });

  test('deve carregar a página inicial corretamente', async () => {
    // Verifica se a página carregou verificando elementos básicos
    await homePage.checkHeader();
    await homePage.checkLogo();
    
    const pageTitle = await homePage.page.title();
    expect(pageTitle).toBeTruthy();
  });

  test('deve exibir elementos de navegação', async () => {
    await homePage.checkHeader();
    await homePage.checkLogo();
  });

  test('deve exibir seção hero', async () => {
    await homePage.checkHeroSection();
  });

  test('deve validar navegação do botão hero', async () => {
    await homePage.checkHeroSection();
    await homePage.clickHeroButton();
  });

  test('deve validar estrutura visual da página', async () => {
    // Valida todos os elementos disponíveis na HomePage
    await homePage.checkHeader();
    await homePage.checkLogo();
    await homePage.checkHeroSection();
  });

  test('deve exibir elementos responsivos', async ({ page }) => {
    // Testa em diferentes tamanhos de tela
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await homePage.checkHeader();
    await homePage.checkLogo();
    await homePage.checkHeroSection();
    
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await homePage.checkHeader();
    await homePage.checkLogo();
    await homePage.checkHeroSection();
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await homePage.checkHeader();
    await homePage.checkLogo();
    await homePage.checkHeroSection();
  });

  test('deve validar navegação para marketplace', async () => {
    // Verifica se o botão hero navega corretamente
    await homePage.checkHeroSection();
    await homePage.clickHeroButton();
    
    // Verifica se foi redirecionado para o marketplace
    expect(homePage.page.url()).toContain('/marketplace');
  });
});
