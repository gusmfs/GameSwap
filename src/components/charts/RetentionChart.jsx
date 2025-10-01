import React, { memo, useMemo } from 'react';
import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';
import { retentionData } from '../../Data/retentionData';

const RetentionChart = memo(() => {
  const data = useMemo(() => retentionData.map((d, idx) => ({ month: d.month, ativos: d.usuarios, retidos: d.retidos, taxa: Math.round((d.retidos / d.usuarios) * 100) })), []);
  const max = useMemo(() => data.reduce((a, b) => (b.taxa > a.taxa ? b : a), data[0] || { taxa: 0 }), [data]);

  return (
    <div className="chart-container line-chart-container">
      <h4 className="chart-title">Retenção de Usuários</h4>
      <ResponsiveContainer width="100%" height={260}>
        <RLineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={{ stroke: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={{ stroke: '#94a3b8' }} domain={[0, 100]} />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(0)}%`, '']} contentStyle={{ background: '#111827', border: '1px solid #1f2937' }} />
          <Legend />
          <Line type="monotone" dataKey="taxa" name="Retenção (%)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
          {max && (
            <ReferenceDot x={max.month} y={max.taxa} r={5} fill="#22c55e" stroke="#ffffff" strokeWidth={2} />
          )}
        </RLineChart>
      </ResponsiveContainer>
      <div className="chart-footer">Taxa no último mês: <strong>{(data[data.length - 1]?.taxa || 0)}%</strong></div>
    </div>
  );
});

export default RetentionChart;


