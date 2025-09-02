import { expect, Locator, type Page } from '@playwright/test';
import { routes } from '../routes/routes';

const element = {
  path: routes.HOME,

  /*========================Header e Navegação========================*/
  header: 'header',
  navigation: 'nav',
  logo: 'img.logo-image',

  /*========================Seções de Conteúdo========================*/
  heroTitle: 'h1[class="animated-title"]',
  heroSubtitle: 'p[class="tagline"]',
  heroButton: 'a',

};

//const text = {
//};

export class HomePage {
  heroButton: Locator;

  constructor(readonly page: Page) {
    this.page = page;
    this.heroButton = page.locator(element.heroButton, { hasText: "Explorar Marketplace"});
  }

  async visit() {
    await this.page.goto(routes.HOME);
  }


  /*========================Validações do Header========================*/
  async checkHeader() {
    await expect(this.page.locator(element.header)).toBeVisible();
  }

  async checkLogo() {
    await expect(this.page.locator(element.logo)).toBeVisible();
  }

  /*========================Validações da Seção Hero========================*/
  async checkHeroSection() {
    await expect(this.page.locator(element.heroTitle, { hasText: "GameSwap" })).toBeVisible();
    await expect(this.page.locator(element.heroSubtitle, { hasText: "A maior plataforma de troca e venda de skins de Counter-Strike 2 do Brasil com tecnologia de ponta e segurança garantida para suas transações." })).toBeVisible();
    await expect(this.heroButton).toBeVisible();
  }

  async clickHeroButton() {
    await this.heroButton.click();
    expect(this.page.url()).toContain(routes.MARKETPLACE);
  }
}
