/**
 * Arquivo de rotas para centralizar URLs da aplicação GameSwap
 * Facilita a manutenção e mudanças de URLs nos testes
 */

export const routes = {
  // Páginas principais
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  MARKETPLACE: '/marketplace',
  
} as const;



// Função helper para construir URLs completas
export const buildUrl = (route: string, baseUrl: string = 'http://localhost:5173'): string => {
  return `${baseUrl}${route}`;
};

// Função helper para construir URLs da API
export const buildApiUrl = (route: string, baseUrl: string = 'http://localhost:5173'): string => {
  return `${baseUrl}${route}`;
};
