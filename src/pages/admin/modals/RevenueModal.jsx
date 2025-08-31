import React, { useMemo } from 'react';
import LineChart from '../../../components/charts/LineChart';

const RevenueModal = ({ onClose, data, stats }) => {
  if (!data || !stats) return null;

  const computed = useMemo(() => {
    const first = Math.round(data?.[0]?.revenue ?? 0);
    const last = Math.round(data?.[data.length - 1]?.revenue ?? 0);
    const month0 = data?.[0]?.month ?? 0;
    const monthN = data?.[data.length - 1]?.month ?? 0;
    const months = Math.max(1, monthN - month0);
    const growthTotalPct = first > 0 ? ((last - first) / first) * 100 : 0;
    const monthlyRatePct = first > 0 ? ((Math.pow(last / first, 1 / months) - 1) * 100) : 0;
    const avg = Math.round(data.reduce((acc, d) => acc + (d.revenue || 0), 0) / data.length);
    return { first, last, months, growthTotalPct, monthlyRatePct, avg };
  }, [data]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💰 Detalhes da Receita Projetada</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Projeção de Receita</h3>
            <div className="detailed-chart">
              <LineChart
                data={data}
                valueKey="revenue"
                title="Receita Projetada"
                legend="Projeção de Receita"
                color="#10b981"
                valueFormat={(v) => `R$ ${v.toLocaleString()}`}
                axisValueFormat={(v) => `R$ ${v.toLocaleString()}`}
                chartWidth={560}
                chartHeight={220}
                chartPadding={32}
              />
            </div>
          </div>
          
          <div className="modal-section">
            <h3>Métricas Financeiras</h3>
            <div className="metrics-grid-detailed">
              <div className="metric-item">
                <span className="metric-label">Receita Inicial</span>
                <span className="metric-value">R$ {computed.first.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Receita Final (24 meses)</span>
                <span className="metric-value">R$ {computed.last.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Média de Receita</span>
                <span className="metric-value">R$ {computed.avg.toLocaleString()}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Crescimento Total</span>
                <span className="metric-value">{computed.growthTotalPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Breakdown por Período</h3>
            <div className="period-breakdown">
              <div className="period-item">
                <span className="period-label">Primeiro Trimestre</span>
                <span className="period-value">R$ 1.064</span>
              </div>
              <div className="period-item">
                <span className="period-label">Primeiro Semestre</span>
                <span className="period-value">R$ 1.415</span>
              </div>
              <div className="period-item">
                <span className="period-label">Primeiro Ano</span>
                <span className="period-value">R$ 2.505</span>
              </div>
              <div className="period-item">
                <span className="period-label">Segundo Ano</span>
                <span className="period-value">R$ 7.856</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueModal;
