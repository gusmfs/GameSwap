export type Assumptions = {
  U0: number;      // Usuários iniciais
  g: number;       // Taxa de crescimento de usuários
  cv: number;      // Conversão de usuários
  AOV0: number;    // Ticket médio inicial
  pi: number;      // Taxa de crescimento do ticket
  tau: number;     // Taxa de receita
  V0: number;      // Valor inicial da infraestrutura
  r: number;       // Taxa de depreciação
  A0: number;      // Usuários ativos iniciais da coorte
  c: number;       // Taxa de churn da coorte
  months: number;  // Número de meses para projeção
};

export type ProjectionPoint = {
  month: number;           // Mês da projeção
  users: number;           // Usuários totais
  aov: number;             // Ticket médio
  gmv: number;             // GMV (Gross Merchandise Value)
  revenue: number;         // Receita
  infraValue: number;      // Valor da infraestrutura
  cohortActive: number;    // Usuários ativos da coorte
};
