import { Assumptions, ProjectionPoint } from './types';

/**
 * Aplica clamp em valores para manter em faixas seguras
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Aplica clamp nas taxas de crescimento e decaimento
 */
function clampRates(assumptions: Assumptions): Assumptions {
  return {
    ...assumptions,
    // Taxas de crescimento: máximo 100% (1.0)
    g: clamp(assumptions.g, 0, 1),
    pi: clamp(assumptions.pi, 0, 1),
    // Taxas de decaimento: máximo 99% (0.99), nunca negativas
    r: clamp(assumptions.r, 0, 0.99),
    c: clamp(assumptions.c, 0, 0.99),
    // Conversão e taxa de receita: entre 0 e 1
    cv: clamp(assumptions.cv, 0, 1),
    tau: clamp(assumptions.tau, 0, 1),
    // Valores iniciais: nunca negativos
    U0: Math.max(0, assumptions.U0),
    AOV0: Math.max(0, assumptions.AOV0),
    V0: Math.max(0, assumptions.V0),
    A0: Math.max(0, assumptions.A0),
    // Meses: mínimo 1
    months: Math.max(1, Math.floor(assumptions.months))
  };
}

/**
 * Computa projeções baseadas em funções exponenciais
 * 
 * Fórmulas aplicadas:
 * - Usuários: U(t) = U0 * (1 + g)^t
 * - Ticket: AOV(t) = AOV0 * (1 + pi)^t
 * - GMV: GMV(t) = U(t) * cv * AOV(t)
 * - Receita: R(t) = tau * GMV(t)
 * - Depreciação: V(t) = V0 * (1 - r)^t
 * - Retenção (coorte): A(t) = A0 * (1 - c)^t
 */
export function computeProjections(assumptions: Assumptions): ProjectionPoint[] {
  // Aplica clamp nas taxas para garantir valores seguros
  const safeAssumptions = clampRates(assumptions);
  
  const projections: ProjectionPoint[] = [];
  
  // Gera pontos para cada mês (t = 0 até months)
  for (let t = 0; t <= safeAssumptions.months; t++) {
    // Usuários: U(t) = U0 * (1 + g)^t
    const users = safeAssumptions.U0 * Math.pow(1 + safeAssumptions.g, t);
    
    // Ticket médio: AOV(t) = AOV0 * (1 + pi)^t
    const aov = safeAssumptions.AOV0 * Math.pow(1 + safeAssumptions.pi, t);
    
    // GMV: GMV(t) = U(t) * cv * AOV(t)
    const gmv = users * safeAssumptions.cv * aov;
    
    // Receita: R(t) = tau * GMV(t)
    const revenue = safeAssumptions.tau * gmv;
    
    // Valor da infraestrutura: V(t) = V0 * (1 - r)^t
    const infraValue = safeAssumptions.V0 * Math.pow(1 - safeAssumptions.r, t);
    
    // Usuários ativos da coorte: A(t) = A0 * (1 - c)^t
    const cohortActive = safeAssumptions.A0 * Math.pow(1 - safeAssumptions.c, t);
    
    projections.push({
      month: t,
      users: Math.round(users * 100) / 100, // Arredonda para 2 casas decimais
      aov: Math.round(aov * 100) / 100,
      gmv: Math.round(gmv * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
      infraValue: Math.round(infraValue * 100) / 100,
      cohortActive: Math.round(cohortActive * 100) / 100
    });
  }
  
  return projections;
}

/**
 * Função auxiliar para validar se as premissas são válidas
 */
export function validateAssumptions(assumptions: Assumptions): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (assumptions.U0 < 0) errors.push('Usuários iniciais não podem ser negativos');
  if (assumptions.AOV0 < 0) errors.push('Ticket médio inicial não pode ser negativo');
  if (assumptions.V0 < 0) errors.push('Valor inicial da infraestrutura não pode ser negativo');
  if (assumptions.A0 < 0) errors.push('Usuários ativos iniciais da coorte não podem ser negativos');
  if (assumptions.months < 1) errors.push('Número de meses deve ser pelo menos 1');
  if (assumptions.g < 0 || assumptions.g > 1) errors.push('Taxa de crescimento de usuários deve estar entre 0 e 1');
  if (assumptions.pi < 0 || assumptions.pi > 1) errors.push('Taxa de crescimento do ticket deve estar entre 0 e 1');
  if (assumptions.r < 0 || assumptions.r > 0.99) errors.push('Taxa de depreciação deve estar entre 0 e 0.99');
  if (assumptions.c < 0 || assumptions.c > 0.99) errors.push('Taxa de churn deve estar entre 0 e 0.99');
  if (assumptions.cv < 0 || assumptions.cv > 1) errors.push('Taxa de conversão deve estar entre 0 e 1');
  if (assumptions.tau < 0 || assumptions.tau > 1) errors.push('Taxa de receita deve estar entre 0 e 1');
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
