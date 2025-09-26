import React, { useMemo } from 'react';
import LineChart from '../../../components/charts/LineChart';

const RetentionModal = ({ onClose, data }) => {
  if (!data || data.length === 0) return null;

  const computed = useMemo(() => {
    const firstUsers = data[0]?.usuarios ?? 0;
    const lastUsers = data[data.length - 1]?.usuarios ?? 0;
    const lastRetidos = data[data.length - 1]?.retidos ?? 0;
    const taxaMesFinal = lastUsers > 0 ? Math.round((lastRetidos / lastUsers) * 100) : 0;
    const taxaTotal = Math.round((lastRetidos / (data[0]?.retidos || 1)) * 100);
    return { firstUsers, lastUsers, lastRetidos, taxaMesFinal, taxaTotal };
  }, [data]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📉 Detalhes de Retenção de Usuários</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Curva de Retenção</h3>
            <div className="detailed-chart">
              {(() => {
                const chartSeries = data.map((d, idx) => ({ month: idx + 1, retidos: d.retidos }));
                return (
                  <LineChart
                    data={chartSeries}
                    valueKey="retidos"
                    title="Retenção de Usuários"
                    legend="Usuários Retidos"
                    color="#ef4444"
                    valueFormat={(v) => v.toLocaleString()}
                    axisValueFormat={(v) => v.toLocaleString()}
                    chartWidth={560}
                    chartHeight={220}
                    chartPadding={32}
                    footerLabel="retidos"
                  />
                );
              })()}
            </div>
          </div>
          <div className="modal-section">
            <h3>Métricas Detalhadas</h3>
            <div className="metrics-grid-detailed">
              <div className="metric-item">
                <span className="metric-label">Usuários Iniciais</span>
                <span className="metric-value">{computed.firstUsers}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Usuários Finais</span>
                <span className="metric-value">{computed.lastUsers}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Retidos</span>
                <span className="metric-value">{computed.lastRetidos}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Taxa de Retenção (mês final)</span>
                <span className="metric-value">{computed.taxaMesFinal}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Taxa de Retenção Total</span>
                <span className="metric-value">{computed.taxaTotal}%</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Cenários</h3>
            <div className="scenarios-grid">
              <div className="scenario-card conservative">
                <h4>Conservador</h4>
                <p>Queda para 50% em 6 meses</p>
              </div>
              <div className="scenario-card optimistic">
                <h4>Otimista</h4>
                <p>Estabilização em 75% de retenção</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetentionModal;


