import React, { memo, useMemo } from 'react';

const PriceChart = memo(() => {
  const data = useMemo(() => (
    [
      { category: 'Consoles', avgPrice: 1800 },
      { category: 'Jogos', avgPrice: 180 },
      { category: 'Acessórios', avgPrice: 120 },
      { category: 'PC Gaming', avgPrice: 950 },
      { category: 'Colecionáveis', avgPrice: 280 },
    ]
  ), []);

  const maxValue = Math.max(...data.map(d => d.avgPrice));

  return (
    <div className="chart-container">
      <h4 className="chart-title">Preços Médios por Categoria</h4>
      <div className="chart-bars">
        {data.map((item, index) => {
          const percentage = (item.avgPrice / maxValue) * 100;
          return (
            <div key={index} className="chart-bar-group">
              <div className="chart-bar">
                <div
                  className="chart-bar-fill"
                  style={{ height: `${percentage}%`, backgroundColor: '#0ea5e9' }}
                />
              </div>
              <span className="chart-label">{item.category}</span>
              <span className="chart-value">R$ {item.avgPrice.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default PriceChart;


