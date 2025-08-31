import React, { useMemo } from 'react';
import LineChart from '../../../components/charts/LineChart';

const UserGrowthModal = ({ onClose, data, stats }) => {
  if (!data || !stats) return null;

  const computed = useMemo(() => {
    const first = Math.round(data?.[0]?.users ?? 0);
    const last = Math.round(data?.[data.length - 1]?.users ?? 0);
    const month0 = data?.[0]?.month ?? 0;
    const monthN = data?.[data.length - 1]?.month ?? 0;
    const months = Math.max(1, monthN - month0);
    const growthTotalPct = first > 0 ? ((last - first) / first) * 100 : 0;
    const monthlyRatePct = first > 0 ? ((Math.pow(last / first, 1 / months) - 1) * 100) : 0;
    const avg = Math.round(data.reduce((acc, d) => acc + (d.users || 0), 0) / data.length);
    return { first, last, months, growthTotalPct, monthlyRatePct, avg };
  }, [data]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📈 Detalhes do Crescimento de Usuários</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Projeção Mensal</h3>
            <div className="detailed-chart">
              <LineChart
                data={data}
                valueKey="users"
                title="Crescimento de Usuários"
                legend="Projeção de Usuários"
                color="#3b82f6"
                valueFormat={(v) => v.toLocaleString()}
                axisValueFormat={(v) => v.toLocaleString()}
                footerLabel="usuários"
                chartWidth={560}
                chartHeight={220}
                chartPadding={32}
              />
            </div>
          </div>
          
          <div className="modal-section">
            <h3>Métricas Detalhadas</h3>
            <div className="metrics-grid-detailed">
              <div className="metric-item">
                <span className="metric-label">Usuários Iniciais</span>
                <span className="metric-value">{computed.first.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Usuários Finais (24 meses)</span>
                <span className="metric-value">{computed.last.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Taxa de Crescimento Mensal</span>
                <span className="metric-value">{computed.monthlyRatePct.toFixed(1)}% ao mês</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Crescimento Total</span>
                <span className="metric-value">{computed.growthTotalPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Análise de Cenários</h3>
            <div className="scenarios-grid">
              <div className="scenario-card conservative">
                <h4>Cenário Conservador</h4>
                <p>Taxa de crescimento: 8% ao mês</p>
                <p>Usuários finais: 3.200</p>
              </div>
              <div className="scenario-card optimistic">
                <h4>Cenário Otimista</h4>
                <p>Taxa de crescimento: 15% ao mês</p>
                <p>Usuários finais: 8.500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthModal;
