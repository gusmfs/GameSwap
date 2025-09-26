import React, { memo, useMemo } from 'react';
import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';
import { growthData } from '../../Data/growthData';

const GrowthChart = memo(() => {
  const data = useMemo(() => growthData, []);
  const maxActual = useMemo(() => data.reduce((m, d) => (d.anuncios > m.anuncios ? d : m), data[0] || { anuncios: 0 }), [data]);

  return (
    <div className="chart-container line-chart-container">
      <h4 className="chart-title">Crescimento de Anúncios</h4>
      <ResponsiveContainer width="100%" height={260}>
        <RLineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={{ stroke: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={{ stroke: '#94a3b8' }} />
          <Tooltip formatter={(v) => [Number(v).toLocaleString(), '']} contentStyle={{ background: '#111827', border: '1px solid #1f2937' }} />
          <Legend />
          <Line type="monotone" dataKey="anuncios" name="Anúncios" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="previsto" name="Previsto" stroke="#94a3b8" strokeDasharray="6 4" strokeWidth={2} dot={false} />
          {maxActual && (
            <ReferenceDot x={maxActual.month} y={maxActual.anuncios} r={5} fill="#22c55e" stroke="#ffffff" strokeWidth={2} />
          )}
        </RLineChart>
      </ResponsiveContainer>
      <div className="chart-footer">Valor projetado ao final: <strong>{(data[data.length - 1]?.previsto || 0).toLocaleString()}</strong> anúncios</div>
    </div>
  );
});

export default GrowthChart;


