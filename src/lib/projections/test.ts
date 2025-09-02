import { Assumptions, computeProjections, validateAssumptions } from './index';

/**
 * Teste básico da biblioteca de projeções
 */
export function testProjections() {
  console.log('🧪 Testando biblioteca de projeções...\n');

  // Teste 1: Premissas válidas
  const validAssumptions: Assumptions = {
    U0: 1000,
    g: 0.10,
    cv: 0.05,
    AOV0: 50,
    pi: 0.02,
    tau: 0.10,
    V0: 50000,
    r: 0.05,
    A0: 100,
    c: 0.20,
    months: 6
  };

  console.log('📊 Teste 1: Premissas válidas');
  const validation = validateAssumptions(validAssumptions);
  console.log('Validação:', validation.isValid ? '✅ Válida' : '❌ Inválida');
  
  if (validation.errors.length > 0) {
    console.log('Erros:', validation.errors);
  }

  const projections = computeProjections(validAssumptions);
  console.log(`Projeções geradas: ${projections.length} pontos`);
  
  // Mostra alguns pontos de exemplo
  console.log('\n📈 Exemplos de projeções:');
  [0, 3, 6].forEach(month => {
    const point = projections[month];
    if (point) {
      console.log(`Mês ${point.month}:`);
      console.log(`  Usuários: ${point.users.toLocaleString()}`);
      console.log(`  Ticket: R$ ${point.aov.toFixed(2)}`);
      console.log(`  GMV: R$ ${point.gmv.toLocaleString()}`);
      console.log(`  Receita: R$ ${point.revenue.toLocaleString()}`);
      console.log(`  Infraestrutura: R$ ${point.infraValue.toLocaleString()}`);
      console.log(`  Coorte Ativa: ${point.cohortActive.toFixed(0)}`);
      console.log('');
    }
  });

  // Teste 2: Premissas inválidas
  console.log('⚠️ Teste 2: Premissas inválidas');
  const invalidAssumptions: Assumptions = {
    U0: -100,  // Usuários negativos
    g: 1.5,    // Taxa de crescimento > 100%
    cv: 0.05,
    AOV0: 50,
    pi: 0.02,
    tau: 0.10,
    V0: 50000,
    r: 0.05,
    A0: 100,
    c: 0.20,
    months: 6
  };

  const invalidValidation = validateAssumptions(invalidAssumptions);
  console.log('Validação:', invalidValidation.isValid ? '✅ Válida' : '❌ Inválida');
  console.log('Erros encontrados:', invalidValidation.errors);

  // Teste 3: Verificação de fórmulas
  console.log('\n🔬 Teste 3: Verificação de fórmulas');
  const simpleAssumptions: Assumptions = {
    U0: 100,
    g: 0.10,  // 10% de crescimento
    cv: 0.10, // 10% de conversão
    AOV0: 100,
    pi: 0.05, // 5% de crescimento do ticket
    tau: 0.20, // 20% de taxa de receita
    V0: 1000,
    r: 0.10,  // 10% de depreciação
    A0: 50,
    c: 0.10,  // 10% de churn
    months: 1
  };

  const simpleProjections = computeProjections(simpleAssumptions);
  const month1 = simpleProjections[1]; // Mês 1
  
  console.log('Verificando fórmulas para o mês 1:');
  console.log(`Usuários esperados: ${100 * Math.pow(1.1, 1)} = ${month1.users}`);
  console.log(`Ticket esperado: ${100 * Math.pow(1.05, 1)} = ${month1.aov}`);
  console.log(`GMV esperado: ${month1.users} * 0.1 * ${month1.aov} = ${month1.gmv}`);
  console.log(`Receita esperada: 0.2 * ${month1.gmv} = ${month1.revenue}`);

  console.log('\n✅ Testes concluídos!');
  
  return {
    validProjections: projections,
    simpleProjections: simpleProjections,
    validation: validation,
    invalidValidation: invalidValidation
  };
}

// Executa o teste se o arquivo for executado diretamente
if (typeof window !== 'undefined') {
  // No browser, adiciona ao console global para testes
  (window as any).testProjections = testProjections;
}
