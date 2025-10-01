import React, { useMemo } from 'react';
import LineChart from '../../../components/charts/LineChart';

const AdsGrowthModal = ({ onClose, data }) => {
  if (!data || data.length === 0) return null;

  const computed = useMemo(() => {
    const first = data[0]?.anuncios ?? 0;
    const last = data[data.length - 1]?.anuncios ?? 0;
    const previstoFinal = data[data.length - 1]?.previsto ?? last;
    return {
      first,
      last,
      previstoFinal,
    };
  }, [data]);

  const chartSeries = useMemo(() => {
    return data.map((d, idx) => ({ month: idx + 1, anuncios: d.anuncios }));
  }, [data]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📈 Detalhes do Crescimento de Anúncios</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Curva de Crescimento</h3>
            <div className="detailed-chart">
              <LineChart
                data={chartSeries}
                valueKey="anuncios"
                title="Crescimento de Anúncios"
                legend="Projeção de Anúncios"
                color="#6366f1"
                valueFormat={(v) => v.toLocaleString()}
                axisValueFormat={(v) => v.toLocaleString()}
                footerLabel="anúncios"
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
                <span className="metric-label">Anúncios Iniciais</span>
                <span className="metric-value">{computed.first}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Anúncios Finais</span>
                <span className="metric-value">{computed.last}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Projeção Prevista</span>
                <span className="metric-value">{computed.previstoFinal}</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Análise de Cenários</h3>
            <div className="scenarios-grid">
              <div className="scenario-card conservative">
                <h4>Cenário Conservador</h4>
                <p>Crescimento 5% ao mês</p>
                <p>Anúncios finais: 90</p>
              </div>
              <div className="scenario-card optimistic">
                <h4>Cenário Otimista</h4>
                <p>Crescimento 15% ao mês</p>
                <p>Anúncios finais: 150</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsGrowthModal;


