/**
 * Utilitários para validação de resultados do marketplace
 */

/**
 * Calcula a precisão de uma previsão comparando com dados reais
 * @param {number} projected - Valor projetado
 * @param {number} actual - Valor real
 * @returns {Object} Objeto com precisão, direção e se é preciso
 */
export function calculateAccuracy(projected, actual) {
  if (projected === 0) {
    return {
      percentage: 100,
      direction: 'infinite',
      isAccurate: false
    };
  }
  
  const accuracy = ((actual - projected) / projected) * 100;
  return {
    percentage: Math.abs(accuracy),
    direction: accuracy >= 0 ? 'positive' : 'negative',
    isAccurate: Math.abs(accuracy) <= 15 // Considera preciso se diferença <= 15%
  };
}

/**
 * Valida se uma tendência de crescimento faz sentido
 * @param {Array} data - Array de dados históricos
 * @param {string} key - Chave do valor a analisar
 * @returns {Object} Resultado da validação
 */
export function validateGrowthTrend(data, key) {
  if (data.length < 2) {
    return {
      passed: false,
      message: 'Dados insuficientes para análise de tendência',
      insight: 'Necessário mais dados históricos'
    };
  }

  const values = data.map(d => d[key]);
  const growth = ((values[values.length - 1] - values[0]) / values[0]) * 100;
  
  return {
    passed: growth > 0,
    message: growth > 0 ? `Crescimento de ${growth.toFixed(1)}%` : 'Crescimento negativo detectado',
    insight: growth > 10 ? 'Crescimento acelerado' : growth > 0 ? 'Crescimento moderado' : 'Declínio detectado'
  };
}

/**
 * Valida correlação entre duas métricas
 * @param {Array} data - Array de dados
 * @param {string} key1 - Primeira métrica
 * @param {string} key2 - Segunda métrica
 * @returns {Object} Resultado da correlação
 */
export function validateCorrelation(data, key1, key2) {
  if (data.length < 2) {
    return {
      passed: false,
      message: 'Dados insuficientes para análise de correlação',
      insight: 'Necessário mais dados históricos'
    };
  }

  const values1 = data.map(d => d[key1]);
  const values2 = data.map(d => d[key2]);
  
  const growth1 = ((values1[values1.length - 1] - values1[0]) / values1[0]) * 100;
  const growth2 = ((values2[values2.length - 1] - values2[0]) / values2[0]) * 100;
  
  const correlation = (growth1 > 0 && growth2 > 0) || (growth1 < 0 && growth2 < 0);
  
  return {
    passed: correlation,
    message: correlation ? 'Correlação positiva confirmada' : 'Correlação negativa detectada',
    insight: correlation ? 'Métricas alinhadas' : 'Possível desalinhamento entre métricas'
  };
}

/**
 * Valida se os preços seguem lógica de mercado
 * @param {Array} priceData - Dados de preços por categoria
 * @returns {Object} Resultado da validação
 */
export function validatePriceLogic(priceData) {
  const categories = priceData.map(d => d.category);
  const avgPrices = priceData.map(d => d.avgPrice);
  
  // Verifica se skins raras têm preços mais altos
  const rareCategories = categories.filter(cat => 
    cat.toLowerCase().includes('rara') || 
    cat.toLowerCase().includes('legendary') ||
    cat.toLowerCase().includes('epic')
  );
  
  const commonCategories = categories.filter(cat => 
    cat.toLowerCase().includes('comum') || 
    cat.toLowerCase().includes('common') ||
    cat.toLowerCase().includes('normal')
  );
  
  if (rareCategories.length === 0 || commonCategories.length === 0) {
    return {
      passed: true,
      message: 'Dados de categorias insuficientes para validação',
      insight: 'Estrutura de categorias precisa ser definida'
    };
  }
  
  const rarePrices = priceData
    .filter(d => rareCategories.includes(d.category))
    .map(d => d.avgPrice);
    
  const commonPrices = priceData
    .filter(d => commonCategories.includes(d.category))
    .map(d => d.avgPrice);
  
  const avgRarePrice = rarePrices.reduce((a, b) => a + b, 0) / rarePrices.length;
  const avgCommonPrice = commonPrices.reduce((a, b) => a + b, 0) / commonPrices.length;
  
  const priceRatio = avgRarePrice / avgCommonPrice;
  
  return {
    passed: priceRatio > 1.5, // Skins raras devem custar pelo menos 50% mais
    message: `Relação preço raro/comum: ${priceRatio.toFixed(1)}x`,
    insight: priceRatio > 2 ? 'Mercado bem segmentado' : 'Possível subvalorização de itens raros'
  };
}

/**
 * Valida se o crescimento de usuários é sustentável
 * @param {Array} userData - Dados de usuários
 * @returns {Object} Resultado da validação
 */
export function validateSustainableGrowth(userData) {
  if (userData.length < 3) {
    return {
      passed: false,
      message: 'Dados insuficientes para análise de sustentabilidade',
      insight: 'Necessário pelo menos 3 períodos de dados'
    };
  }

  const users = userData.map(d => d.users);
  const growthRates = [];
  
  for (let i = 1; i < users.length; i++) {
    const rate = ((users[i] - users[i-1]) / users[i-1]) * 100;
    growthRates.push(rate);
  }
  
  const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
  const growthVariance = growthRates.reduce((acc, rate) => acc + Math.pow(rate - avgGrowth, 2), 0) / growthRates.length;
  const growthStability = Math.sqrt(growthVariance);
  
  return {
    passed: avgGrowth > 0 && growthStability < avgGrowth * 0.5, // Crescimento positivo e estável
    message: `Crescimento médio: ${avgGrowth.toFixed(1)}% (estabilidade: ${growthStability.toFixed(1)}%)`,
    insight: growthStability < avgGrowth * 0.3 ? 'Crescimento muito estável' : 
             growthStability < avgGrowth * 0.5 ? 'Crescimento estável' : 'Crescimento volátil'
  };
}

/**
 * Gera insights para o relatório baseado nos resultados de validação
 * @param {Array} validationResults - Resultados de todas as validações
 * @returns {Object} Insights consolidados
 */
export function generateInsights(validationResults) {
  const totalTests = validationResults.length;
  const passedTests = validationResults.filter(r => r.passed).length;
  const accuracy = (passedTests / totalTests) * 100;
  
  const insights = {
    overallAccuracy: accuracy,
    keyFindings: [],
    recommendations: [],
    confidence: 'low'
  };
  
  // Análise de precisão
  if (accuracy >= 90) {
    insights.confidence = 'high';
    insights.keyFindings.push('Modelo de previsão altamente preciso');
  } else if (accuracy >= 75) {
    insights.confidence = 'medium';
    insights.keyFindings.push('Modelo de previsão moderadamente preciso');
  } else {
    insights.confidence = 'low';
    insights.keyFindings.push('Modelo de previsão precisa de calibração');
  }
  
  // Análise de tendências
  const trendTests = validationResults.filter(r => r.type === 'trend');
  const trendAccuracy = trendTests.length > 0 ? 
    (trendTests.filter(t => t.passed).length / trendTests.length) * 100 : 0;
  
  if (trendAccuracy >= 80) {
    insights.keyFindings.push('Tendências de mercado bem identificadas');
  } else {
    insights.recommendations.push('Revisar identificação de tendências de mercado');
  }
  
  // Análise de correlações
  const correlationTests = validationResults.filter(r => r.type === 'correlation');
  const correlationAccuracy = correlationTests.length > 0 ? 
    (correlationTests.filter(t => t.passed).length / correlationTests.length) * 100 : 0;
  
  if (correlationAccuracy >= 70) {
    insights.keyFindings.push('Correlações de negócio bem estabelecidas');
  } else {
    insights.recommendations.push('Investigar correlações entre métricas de negócio');
  }
  
  return insights;
}

/**
 * Simula dados históricos para teste de validação
 * @param {number} weeks - Número de semanas de dados
 * @returns {Object} Dados simulados
 */
export function generateMockData(weeks = 4) {
  const data = [];
  let users = 1000;
  let revenue = 5000;
  let ads = 30;
  let avgPrice = 50;
  
  for (let week = 1; week <= weeks; week++) {
    // Simula crescimento com alguma variação
    const userGrowth = 0.05 + (Math.random() - 0.5) * 0.02; // 3-7% com variação
    const revenueGrowth = 0.08 + (Math.random() - 0.5) * 0.03; // 5-11% com variação
    const adGrowth = 0.10 + (Math.random() - 0.5) * 0.04; // 6-14% com variação
    const priceGrowth = 0.02 + (Math.random() - 0.5) * 0.01; // 1.5-2.5% com variação
    
    users = Math.round(users * (1 + userGrowth));
    revenue = Math.round(revenue * (1 + revenueGrowth));
    ads = Math.round(ads * (1 + adGrowth));
    avgPrice = Math.round(avgPrice * (1 + priceGrowth) * 100) / 100;
    
    data.push({
      week,
      users,
      revenue,
      ads,
      avgPrice,
      timestamp: new Date(Date.now() - (weeks - week) * 7 * 24 * 60 * 60 * 1000)
    });
  }
  
  return data;
}
