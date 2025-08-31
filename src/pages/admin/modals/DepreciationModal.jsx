import React, { useMemo } from 'react';
import LineChart from '../../../components/charts/LineChart';

const DepreciationModal = ({ onClose, data, stats }) => {
  if (!data || !stats) return null;

  const computed = useMemo(() => {
    const first = Math.round(data?.[0]?.value ?? 0);
    const last = Math.round(data?.[data.length - 1]?.value ?? 0);
    const dropPct = first > 0 ? ((first - last) / first) * 100 : 0;
    const avg = Math.round(data.reduce((acc, d) => acc + (d.value || 0), 0) / data.length);
    return { first, last, dropPct, avg };
  }, [data]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📉 Detalhes da Depreciação de Recursos</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Curva de Depreciação</h3>
            <div className="detailed-chart">
              <LineChart
                data={data}
                valueKey="value"
                title="Depreciação de Recursos"
                legend="Projeção de Depreciação"
                color="#f59e0b"
                valueFormat={(v) => `R$ ${v.toLocaleString()}`}
                axisValueFormat={(v) => `R$ ${v.toLocaleString()}`}
                chartWidth={560}
                chartHeight={220}
                chartPadding={32}
              />
            </div>
          </div>
          
          <div className="modal-section">
            <h3>Métricas de Depreciação</h3>
            <div className="metrics-grid-detailed">
              <div className="metric-item">
                <span className="metric-label">Valor Inicial</span>
                <span className="metric-value">R$ {computed.first.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Valor Final (24 meses)</span>
                <span className="metric-value">R$ {computed.last.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Média de Valor</span>
                <span className="metric-value">R$ {computed.avg.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Depreciação Total</span>
                <span className="metric-value">{computed.dropPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Análise de Recursos</h3>
            <div className="resources-breakdown">
              <div className="resource-item">
                <span className="resource-label">Infraestrutura de TI</span>
                <span className="resource-value">R$ 4.500</span>
                <span className="resource-depreciation">-45%</span>
              </div>
              <div className="resource-item">
                <span className="resource-label">Equipamentos</span>
                <span className="resource-value">R$ 2.500</span>
                <span className="resource-depreciation">-60%</span>
              </div>
              <div className="resource-item">
                <span className="resource-label">Software</span>
                <span className="resource-value">R$ 1.500</span>
                <span className="resource-depreciation">-30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepreciationModal;
