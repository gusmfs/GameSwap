import React, { memo, useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';
import { priceData } from '../../Data/priceData';

const PriceChart = memo(() => {
  const data = useMemo(() => priceData, []);
  const max = useMemo(() => data.reduce((a, b) => (b.avgPrice > a.avgPrice ? b : a), data[0] || { avgPrice: 0 }), [data]);

  return (
    <div className="chart-container">
      <h4 className="chart-title">Preços Médios por Categoria</h4>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={{ stroke: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={{ stroke: '#94a3b8' }} />
          <Tooltip formatter={(v) => [`R$ ${Number(v).toLocaleString()}`, '']} contentStyle={{ background: '#111827', border: '1px solid #1f2937' }} />
          <Legend />
          <Bar dataKey="avgPrice" name="Atual" fill="#0ea5e9" radius={[4,4,0,0]} />
          <Line type="monotone" dataKey="previsto" name="Previsto" stroke="#64748b" strokeDasharray="6 4" strokeWidth={2} dot={false} />
          {max && (
            <ReferenceDot x={max.category} y={max.avgPrice} r={5} fill="#22c55e" stroke="#ffffff" strokeWidth={2} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PriceChart;


