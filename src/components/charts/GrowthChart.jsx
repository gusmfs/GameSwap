import React, { memo, useMemo } from 'react';
import LineChart from './LineChart';

const GrowthChart = memo(() => {
  const data = useMemo(() => (
    [
      { month: 1, ads: 12 },
      { month: 2, ads: 20 },
      { month: 3, ads: 28 },
      { month: 4, ads: 40 },
      { month: 5, ads: 58 },
      { month: 6, ads: 76 },
      { month: 7, ads: 96 },
      { month: 8, ads: 120 },
      { month: 9, ads: 150 },
      { month: 10, ads: 188 },
      { month: 11, ads: 220 },
      { month: 12, ads: 260 },
    ]
  ), []);

  return (
    <div className="chart-container line-chart-container">
      <LineChart
        data={data}
        valueKey="ads"
        title="Crescimento de Anúncios"
        color="#6366f1"
        valueFormat={(v) => v.toLocaleString()}
        axisValueFormat={(v) => v.toLocaleString()}
        footerLabel="anúncios"
      />
    </div>
  );
});

export default GrowthChart;


