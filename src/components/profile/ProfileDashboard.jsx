import React, { useMemo } from 'react';
import { getInventoryStats, fetchInventoryItems } from '../../services/inventoryApi';
import { getProfileViewsSeries, getTotalProfileViews } from '../../services/profileMetrics';

const currency = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);

const Bar = ({ value, max, label }) => {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bar">
      <div className="bar-fill" style={{ width: `${pct}%` }} aria-hidden="true"></div>
      <span className="bar-label">{label}</span>
      <span className="bar-value">{value}</span>
    </div>
  );
};

const Sparkline = ({ data, height = 80, color = '#00d4ff' }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  const n = Math.max(data.length - 1, 1);
  const points = data.map((d, i) => {
    const x = (i / n) * 100; // 0..100
    const y = 100 - (d.count / max) * 100; // invertido para origem no topo
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const ProfileDashboard = ({ userId }) => {
  const stats = getInventoryStats();
  const items = fetchInventoryItems();
  const sold = items.filter(i => i.status === 'sold');

  const salesSeries = useMemo(() => {
    const map = {};
    sold.forEach(s => {
      if (!s.soldAt) return;
      const d = new Date(s.soldAt); d.setHours(0,0,0,0);
      const key = d.toISOString().slice(0,10);
      map[key] = (map[key] || 0) + parseFloat(s.price || 0);
    });
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b))
      .slice(-14).map(([date, total]) => ({ date, total }));
  }, [sold]);

  const viewsSeries = getProfileViewsSeries(userId, 14);
  const totalViews = getTotalProfileViews(userId);
  const maxRevenue = Math.max(...salesSeries.map(v => v.total), 0);

  return (
    <section aria-label="Resumo do perfil" className="dashboard">
      <div className="kpis" style={{ width: '100%' }}>
        <div className="kpi"><span className="kpi-label">Receita total</span><span className="kpi-value">{currency(stats.totalEarnings)}</span></div>
        <div className="kpi"><span className="kpi-label">Itens vendidos</span><span className="kpi-value">{stats.totalSold}</span></div>
        <div className="kpi"><span className="kpi-label">Anúncios ativos</span><span className="kpi-value">{stats.activeItems}</span></div>
        <div className="kpi"><span className="kpi-label">Visitas ao perfil</span><span className="kpi-value">{totalViews}</span></div>
      </div>

      <div className="charts" style={{ width: '100%' }}>
        <div className="chart" aria-label="Visitas nos últimos 14 dias">
          <h3>Visitas (14 dias)</h3>
          {viewsSeries.length > 0 ? (
            <Sparkline data={viewsSeries} />
          ) : (
            <p className="muted">Sem dados recentes</p>
          )}
        </div>
        <div className="chart" aria-label="Receita nos últimos dias">
          <h3>Receita por dia</h3>
          <div className="bars">
            {salesSeries.map(v => (
              <Bar key={v.date} value={v.total} max={maxRevenue} label={v.date.slice(5)} />
            ))}
            {salesSeries.length === 0 && <p className="muted">Sem vendas registradas</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileDashboard;


