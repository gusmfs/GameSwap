import React, { memo, useMemo } from 'react';
import LineChart from './LineChart';

const RetentionChart = memo(() => {
  const data = useMemo(() => (
    [
      { month: 1, retention: 92 },
      { month: 2, retention: 88 },
      { month: 3, retention: 84 },
      { month: 4, retention: 81 },
      { month: 5, retention: 79 },
      { month: 6, retention: 78 },
      { month: 7, retention: 77 },
      { month: 8, retention: 76 },
      { month: 9, retention: 75 },
      { month: 10, retention: 74 },
      { month: 11, retention: 73 },
      { month: 12, retention: 72 },
    ]
  ), []);

  return (
    <div className="chart-container line-chart-container">
      <LineChart
        data={data}
        valueKey="retention"
        title="Retenção de Usuários"
        color="#ef4444"
        valueFormat={(v) => `${v}%`}
        axisValueFormat={(v) => `${v}%`}
        footerLabel="de usuários ativos"
      />
    </div>
  );
});

export default RetentionChart;


