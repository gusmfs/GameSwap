import { Assumptions, computeProjections, validateAssumptions } from './index';

/**
 * Exemplo de uso da biblioteca de projeções
 */
export function exampleProjection() {
  // Exemplo de premissas para um marketplace de games
  const assumptions: Assumptions = {
    U0: 1000,        // 1000 usuários iniciais
    g: 0.15,         // 15% de crescimento mensal de usuários
    cv: 0.05,        // 5% de conversão de usuários
    AOV0: 50,        // Ticket médio inicial de R$ 50
    pi: 0.02,        // 2% de crescimento mensal do ticket
    tau: 0.10,       // 10% de taxa de receita (comissão)
    V0: 50000,       // R$ 50.000 de infraestrutura inicial
    r: 0.05,         // 5% de depreciação mensal
    A0: 100,         // 100 usuários ativos iniciais da coorte
    c: 0.20,         // 20% de churn mensal da coorte
    months: 12       // Projeção para 12 meses
  };

  // Valida as premissas
  const validation = validateAssumptions(assumptions);
  
  if (!validation.isValid) {
    console.error('Premissas inválidas:', validation.errors);
    return null;
  }

  // Computa as projeções
  const projections = computeProjections(assumptions);
  
  return {
    assumptions,
    projections,
    summary: {
      totalUsers: projections[projections.length - 1].users,
      totalRevenue: projections[projections.length - 1].revenue,
      totalGMV: projections[projections.length - 1].gmv,
      finalInfraValue: projections[projections.length - 1].infraValue
    }
  };
}

/**
 * Exemplo de premissas conservadoras
 */
export const conservativeAssumptions: Assumptions = {
  U0: 500,
  g: 0.10,
  cv: 0.03,
  AOV0: 30,
  pi: 0.01,
  tau: 0.08,
  V0: 25000,
  r: 0.03,
  A0: 50,
  c: 0.15,
  months: 24
};

/**
 * Exemplo de premissas otimistas
 */
export const optimisticAssumptions: Assumptions = {
  U0: 2000,
  g: 0.25,
  cv: 0.08,
  AOV0: 80,
  pi: 0.03,
  tau: 0.12,
  V0: 100000,
  r: 0.02,
  A0: 200,
  c: 0.10,
  months: 18
};
