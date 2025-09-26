import React, { useMemo } from 'react';

const PriceModal = ({ onClose, data }) => {
  if (!data || data.length === 0) return null;

  const computed = useMemo(() => {
    const max = data.reduce((acc, d) => (d.avgPrice > acc.avgPrice ? d : acc), data[0]);
    return { topCategory: max.category, topAvg: max.avgPrice, topPrev: max.previsto };
  }, [data]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💰 Detalhes de Preços por Categoria</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Métricas Detalhadas</h3>
            <div className="metrics-grid-detailed">
              <div className="metric-item">
                <span className="metric-label">Maior preço médio</span>
                <span className="metric-value">{computed.topCategory} (R$ {computed.topAvg.toLocaleString()} → R$ {computed.topPrev.toLocaleString()})</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Média por Categoria</h3>
            <div className="resources-breakdown">
              {data.map((d, idx) => (
                <div className="resource-item" key={idx}>
                  <span className="resource-label">{d.category}</span>
                  <span className="resource-value">R$ {d.avgPrice.toLocaleString()}</span>
                  <span className="resource-depreciation">Previsto: R$ {d.previsto.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h3>Cenários</h3>
            <div className="scenarios-grid">
              <div className="scenario-card conservative">
                <h4>Conservador</h4>
                <p>Queda de -5% nos preços médios</p>
              </div>
              <div className="scenario-card optimistic">
                <h4>Otimista</h4>
                <p>Alta de +10% nos preços médios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceModal;


