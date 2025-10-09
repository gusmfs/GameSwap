/**
 * Exemplo de uso do sistema de validação
 * Este arquivo demonstra como usar o sistema de validação na prática
 */

import { 
  calculateAccuracy, 
  validateGrowthTrend, 
  validateCorrelation,
  validatePriceLogic,
  validateSustainableGrowth,
  generateInsights,
  generateMockData
} from './validationUtils';
import { generateABNTReport } from './validationReport';

/**
 * Exemplo completo de validação
 */
export function runValidationExample() {
  console.log('🔍 Iniciando exemplo de validação...\n');
  
  // 1. Gerar dados mockados para teste
  const mockData = generateMockData(4); // 4 semanas de dados
  console.log('📊 Dados mockados gerados:', mockData);
  
  // 2. Testar precisão de previsões
  console.log('\n📈 Testando precisão de previsões...');
  const userAccuracy = calculateAccuracy(1200, 1350); // Projetado: 1200, Real: 1350
  console.log('Precisão usuários:', userAccuracy);
  
  const revenueAccuracy = calculateAccuracy(8500, 9200); // Projetado: 8500, Real: 9200
  console.log('Precisão receita:', revenueAccuracy);
  
  // 3. Validar tendências de crescimento
  console.log('\n📊 Validando tendências de crescimento...');
  const userTrend = validateGrowthTrend(mockData, 'users');
  console.log('Tendência usuários:', userTrend);
  
  const revenueTrend = validateGrowthTrend(mockData, 'revenue');
  console.log('Tendência receita:', revenueTrend);
  
  // 4. Validar correlações
  console.log('\n🔗 Validando correlações...');
  const userRevenueCorrelation = validateCorrelation(mockData, 'users', 'revenue');
  console.log('Correlação usuários-receita:', userRevenueCorrelation);
  
  // 5. Validar lógica de preços
  console.log('\n💰 Validando lógica de preços...');
  const priceData = [
    { category: 'Skins Raras', avgPrice: 150 },
    { category: 'Skins Comuns', avgPrice: 25 },
    { category: 'Skins Épicas', avgPrice: 80 }
  ];
  const priceLogic = validatePriceLogic(priceData);
  console.log('Lógica de preços:', priceLogic);
  
  // 6. Validar crescimento sustentável
  console.log('\n🌱 Validando crescimento sustentável...');
  const sustainableGrowth = validateSustainableGrowth(mockData);
  console.log('Crescimento sustentável:', sustainableGrowth);
  
  // 7. Gerar insights consolidados
  console.log('\n💡 Gerando insights...');
  const validationResults = [
    { type: 'accuracy', passed: userAccuracy.isAccurate, accuracy: userAccuracy.percentage },
    { type: 'trend', passed: userTrend.passed },
    { type: 'correlation', passed: userRevenueCorrelation.passed },
    { type: 'price', passed: priceLogic.passed },
    { type: 'sustainability', passed: sustainableGrowth.passed }
  ];
  
  const insights = generateInsights(validationResults);
  console.log('Insights gerados:', insights);
  
  // 8. Gerar relatório ABNT
  console.log('\n📄 Gerando relatório ABNT...');
  const reportData = {
    overallAccuracy: 87.5,
    confidence: 'high',
    totalTests: validationResults.length,
    passedTests: validationResults.filter(r => r.passed).length,
    accuracyResults: '87.5% de precisão média',
    trendResults: 'Tendências positivas confirmadas',
    correlationResults: 'Correlações positivas identificadas'
  };
  
  const abntReport = generateABNTReport(reportData);
  console.log('Relatório ABNT gerado:');
  console.log(abntReport);
  
  return {
    mockData,
    validationResults,
    insights,
    abntReport
  };
}

/**
 * Exemplo de validação específica para o marketplace
 */
export function validateMarketplaceSpecific() {
  console.log('🎮 Validação específica do marketplace...\n');
  
  // Dados específicos do marketplace de games
  const gameData = {
    skins: [
      { name: 'AK-47 Redline', category: 'Rara', price: 120, popularity: 85 },
      { name: 'AWP Dragon Lore', category: 'Lendária', price: 2500, popularity: 95 },
      { name: 'Glock-18 Water Elemental', category: 'Comum', price: 15, popularity: 60 },
      { name: 'M4A4 Howl', category: 'Contrabandeada', price: 800, popularity: 90 }
    ],
    users: [
      { week: 1, active: 1000, new: 150, returning: 850 },
      { week: 2, active: 1150, new: 180, returning: 970 },
      { week: 3, active: 1320, new: 200, returning: 1120 },
      { week: 4, active: 1500, new: 220, returning: 1280 }
    ],
    transactions: [
      { week: 1, count: 45, revenue: 3200 },
      { week: 2, count: 52, revenue: 3800 },
      { week: 3, count: 61, revenue: 4500 },
      { week: 4, count: 68, revenue: 5200 }
    ]
  };
  
  // Validações específicas
  const validations = {
    // 1. Skins raras devem ter preços mais altos
    rareSkinPricing: () => {
      const rareSkins = gameData.skins.filter(s => s.category === 'Rara' || s.category === 'Lendária');
      const commonSkins = gameData.skins.filter(s => s.category === 'Comum');
      const avgRarePrice = rareSkins.reduce((sum, s) => sum + s.price, 0) / rareSkins.length;
      const avgCommonPrice = commonSkins.reduce((sum, s) => sum + s.price, 0) / commonSkins.length;
      const ratio = avgRarePrice / avgCommonPrice;
      
      return {
        passed: ratio > 3, // Skins raras devem custar pelo menos 3x mais
        message: `Relação preço raro/comum: ${ratio.toFixed(1)}x`,
        insight: ratio > 5 ? 'Excelente segmentação de preços' : 'Segmentação adequada'
      };
    },
    
    // 2. Usuários ativos devem crescer consistentemente
    userGrowth: () => {
      const activeUsers = gameData.users.map(u => u.active);
      const growth = ((activeUsers[activeUsers.length - 1] - activeUsers[0]) / activeUsers[0]) * 100;
      
      return {
        passed: growth > 0,
        message: `Crescimento de usuários: ${growth.toFixed(1)}%`,
        insight: growth > 20 ? 'Crescimento acelerado' : 'Crescimento moderado'
      };
    },
    
    // 3. Transações devem correlacionar com usuários ativos
    transactionCorrelation: () => {
      const activeUsers = gameData.users.map(u => u.active);
      const transactions = gameData.transactions.map(t => t.count);
      
      const userGrowth = ((activeUsers[activeUsers.length - 1] - activeUsers[0]) / activeUsers[0]) * 100;
      const transactionGrowth = ((transactions[transactions.length - 1] - transactions[0]) / transactions[0]) * 100;
      
      return {
        passed: userGrowth > 0 && transactionGrowth > 0,
        message: `Usuários: ${userGrowth.toFixed(1)}%, Transações: ${transactionGrowth.toFixed(1)}%`,
        insight: 'Correlação positiva entre usuários e transações'
      };
    },
    
    // 4. Receita por transação deve ser estável ou crescente
    revenuePerTransaction: () => {
      const revenues = gameData.transactions.map(t => t.revenue);
      const counts = gameData.transactions.map(t => t.count);
      const revenuePerTransaction = revenues.map((rev, i) => rev / counts[i]);
      
      const firstRPT = revenuePerTransaction[0];
      const lastRPT = revenuePerTransaction[revenuePerTransaction.length - 1];
      const rptGrowth = ((lastRPT - firstRPT) / firstRPT) * 100;
      
      return {
        passed: rptGrowth >= -10, // Permite até 10% de queda
        message: `Receita por transação: R$ ${firstRPT.toFixed(2)} → R$ ${lastRPT.toFixed(2)} (${rptGrowth.toFixed(1)}%)`,
        insight: rptGrowth > 0 ? 'Ticket médio crescente' : 'Ticket médio estável'
      };
    }
  };
  
  // Executar todas as validações
  const results = Object.entries(validations).map(([name, validation]) => ({
    name,
    result: validation()
  }));
  
  console.log('Resultados da validação específica:');
  results.forEach(result => {
    console.log(`${result.name}: ${result.result.passed ? '✅' : '❌'} ${result.result.message}`);
    console.log(`  Insight: ${result.result.insight}\n`);
  });
  
  return results;
}

// Executar exemplos se chamado diretamente
if (typeof window !== 'undefined') {
  // No browser, adiciona ao console global para testes
  window.runValidationExample = runValidationExample;
  window.validateMarketplaceSpecific = validateMarketplaceSpecific;
}
