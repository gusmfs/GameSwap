import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { computeProjections, validateAssumptions, conservativeAssumptions } from '../../lib/projections';
import './AdminDashboard.css';

// Lazy loading dos modais para reduzir bundle inicial
const UserGrowthModal = lazy(() => import('./modals/UserGrowthModal'));
const RevenueModal = lazy(() => import('./modals/RevenueModal'));
const DepreciationModal = lazy(() => import('./modals/DepreciationModal'));

// Componente genérico de Line Chart com hover e área
const LineChart = React.memo(({ data, valueKey, title, legend, color, valueFormat, axisValueFormat, footerLabel }) => {
  const [hover, setHover] = useState(null);

  const months = data.map(d => d.month);
  const values = data.map(d => d[valueKey]);
  const minMonth = months.length ? Math.min(...months) : 0;
  const maxMonth = months.length ? Math.max(...months) : 0;
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;

  const width = 640;
  const height = 260;
  const padding = 36;

  const xScale = (m) => {
    if (maxMonth === minMonth) return padding;
    return padding + (m - minMonth) * (width - padding * 2) / (maxMonth - minMonth);
  };
  const yScale = (v) => {
    if (maxValue === minValue) return height - padding;
    return height - padding - (v - minValue) * (height - padding * 2) / (maxValue - minValue);
  };

  const points = data.map(d => [xScale(d.month), yScale(d[valueKey])]);

  const controlPoint = (current, previous, next, reverse = false) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const o = {
      length: Math.hypot(n[0] - p[0], n[1] - p[1]),
      angle: Math.atan2(n[1] - p[1], n[0] - p[0])
    };
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
  };

  const bezierCommand = (point, i, a) => {
    const cps = controlPoint(a[i - 1], a[i - 2], point);
    const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
  };

  const d = points.reduce((acc, point, i, a) => {
    return i === 0
      ? `M ${point[0]},${point[1]}`
      : `${acc} ${bezierCommand(point, i, a)}`;
  }, '');

  const baseline = height - padding;
  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const dArea = points.reduce((acc, point, i, a) => {
    if (i === 0) {
      return `M ${firstPt?.[0] ?? padding},${baseline} L ${point[0]},${point[1]}`;
    }
    return `${acc} ${bezierCommand(point, i, a)}`;
  }, '');
  const dAreaClosed = `${dArea} L ${lastPt?.[0] ?? (width - padding)},${baseline} Z`;

  const xTicks = Array.from({ length: (maxMonth - minMonth) + 1 }, (_, idx) => minMonth + idx);
  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, idx) => minValue + (idx * (maxValue - minValue)) / yTicks);

  const last = data[data.length - 1];
  const formatValue = (v) => (valueFormat ? valueFormat(Math.round(v)) : Math.round(v).toLocaleString());
  const formatAxis = (v) => (axisValueFormat ? axisValueFormat(Math.round(v)) : Math.round(v).toLocaleString());

  const handleMouseMove = (evt) => {
    const svg = evt.currentTarget;
    const rect = svg.getBoundingClientRect();
    const relX = Math.max(padding, Math.min(width - padding, (evt.clientX - rect.left) / rect.width * width));
    let nearest = null;
    let minDist = Infinity;
    points.forEach((pt, idx) => {
      const dist = Math.abs(pt[0] - relX);
      if (dist < minDist) {
        minDist = dist;
        nearest = { x: pt[0], y: pt[1], month: data[idx].month, value: data[idx][valueKey] };
      }
    });
    setHover(nearest);
  };
  const handleMouseLeave = () => setHover(null);

  return (
    <div className="chart-container line-chart-container">
      <h4 className="chart-title">{title}</h4>
      <div className="line-chart-legend" style={{ color }}>{legend}</div>
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="line-chart-svg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <rect x="0" y="0" width={width} height={height} fill="#ffffff" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="axis-line" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="axis-line" />

        {xTicks.map((m, idx) => (
          <g key={idx}>
            <line x1={xScale(m)} y1={height - padding} x2={xScale(m)} y2={height - padding + 4} className="axis-tick" />
            <text x={xScale(m)} y={height - padding + 16} textAnchor="middle" className="axis-label">{m}</text>
          </g>
        ))}

        {yTickValues.map((v, idx) => (
          <g key={idx}>
            <line x1={padding - 4} y1={yScale(v)} x2={padding} y2={yScale(v)} className="axis-tick" />
            <text x={padding - 8} y={yScale(v) + 4} textAnchor="end" className="axis-label">{formatAxis(v)}</text>
          </g>
        ))}

        <path d={dAreaClosed} className="line-area" style={{ fill: color, fillOpacity: 0.12 }} />
        <path d={d} className="line-path" style={{ stroke: color }} />
        {points.map((p, idx) => (
          <circle key={idx} cx={p[0]} cy={p[1]} r="2.5" className="line-point" style={{ fill: color }} />
        ))}
        {hover && (
          <g>
            <line x1={hover.x} y1={padding} x2={hover.x} y2={height - padding} className="line-hover-line" style={{ stroke: color, strokeOpacity: 0.25 }} />
            <circle cx={hover.x} cy={hover.y} r="4" className="line-hover-point" style={{ fill: color }} />
            {(() => {
              const tooltipPadding = 8;
              const boxWidth = 140;
              const boxHeight = 42;
              const boxX = Math.min(Math.max(hover.x - boxWidth / 2, padding), width - padding - boxWidth);
              const boxY = Math.max(hover.y - boxHeight - 10, padding);
              return (
                <g className="line-tooltip" transform={`translate(${boxX}, ${boxY})`}>
                  <rect width={boxWidth} height={boxHeight} rx="6" ry="6" className="line-tooltip-box" />
                  <text x={tooltipPadding} y={16} className="line-tooltip-title" style={{ fill: color }}>Mês {hover.month}</text>
                  <text x={tooltipPadding} y={32} className="line-tooltip-value">{formatValue(hover.value)}</text>
                </g>
              );
            })()}
          </g>
        )}
      </svg>
      {last && (
        <div className="chart-footer">Valor projetado ao final: <strong>{formatValue(last[valueKey])}</strong>{footerLabel ? ` ${footerLabel}` : ''}</div>
      )}
    </div>
  );
});

const AdminDashboard = () => {
  const { user } = useAuth();
  const projections = useMemo(() => {
    try {
      const validation = validateAssumptions(conservativeAssumptions);
      if (validation.isValid) {
        return computeProjections(conservativeAssumptions);
      }
    } catch (error) {
      console.error('Erro ao calcular projeções:', error);
    }
    return null;
  }, []);
  const [selectedModal, setSelectedModal] = useState(null);
  const [lineHover, setLineHover] = useState(null);

  // Séries baseadas nas projeções matemáticas (fonte única de dados)
  const userSeries = useMemo(() => {
    if (!projections) return [];
    return projections.map(p => ({ month: p.month, users: p.users }));
  }, [projections]);

  const revenueSeries = useMemo(() => {
    if (!projections) return [];
    return projections.map(p => ({ month: p.month, revenue: p.revenue }));
  }, [projections]);

  const depreciationSeries = useMemo(() => {
    if (!projections) return [];
    return projections.map(p => ({ month: p.month, value: p.infraValue }));
  }, [projections]);

  const seriesMap = useMemo(() => ({
    userGrowth: userSeries,
    revenue: revenueSeries,
    depreciation: depreciationSeries,
  }), [userSeries, revenueSeries, depreciationSeries]);

  // Helper para calcular estatísticas de uma série
  const computeStats = useCallback((data) => {
    if (!data || data.length === 0) return null;
    const values = data.map(d => d.users || d.revenue || d.value);
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    return {
      maxValue: Math.max(...values),
      minValue: Math.min(...values),
      current,
      previous,
      growth: previous ?
        ((current.users || current.revenue || current.value) - (previous.users || previous.revenue || previous.value)) /
        (previous.users || previous.revenue || previous.value) * 100 : 0,
    };
  }, []);

  // Função de renderização de gráfico otimizada
  const renderBarChart = useCallback((data, title, color, formatValue) => {
    const stats = computeStats(data);
    
    return (
      <div className="chart-container">
        <h4 className="chart-title">{title}</h4>
        <div className="chart-bars">
          {data.map((point, index) => {
            const value = point.users || point.revenue || point.value;
            const percentage = ((value - stats.minValue) / (stats.maxValue - stats.minValue)) * 100;
            
            return (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar">
                  <div 
                    className="chart-bar-fill"
                    style={{ 
                      height: `${percentage}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <span className="chart-label">{point.month}m</span>
                <span className="chart-value">{formatValue(value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [computeStats]);

  // Gráfico genérico foi criado acima (LineChart)

  // Função de renderização de métricas otimizada
  const renderMetrics = useCallback((data, title, color, formatValue, modalType) => {
    const stats = computeStats(data);
    const currentValue = stats.current.users || stats.current.revenue || stats.current.value;
    
    return (
      <div className="metrics-card" onClick={() => setSelectedModal(modalType)}>
        <div className="metrics-header">
          <h3 className="metrics-title">{title}</h3>
        </div>
        <div className="metrics-content">
          <div className="metrics-value">
            {formatValue(currentValue)}
          </div>
          <div className="metrics-growth">
            <span className={`growth-indicator ${stats.growth >= 0 ? 'positive' : 'negative'}`}>
              {stats.growth >= 0 ? '↗' : '↘'} {Math.abs(stats.growth).toFixed(1)}%
            </span>
            <span className="growth-label">vs mês anterior</span>
          </div>
        </div>
        <div className="metrics-footer">
          <span className="click-hint">Clique para mais detalhes →</span>
        </div>
      </div>
    );
  }, [computeStats]);

  // Função para fechar modal
  const closeModal = useCallback(() => {
    setSelectedModal(null);
  }, []);

  // Renderização condicional de modais com Suspense
  const renderModal = useMemo(() => {
    if (!selectedModal) return null;
    
    const series = seriesMap[selectedModal] || [];
    const modalProps = {
      onClose: closeModal,
      data: series,
      stats: computeStats(series)
    };

    switch (selectedModal) {
      case 'userGrowth':
        return (
          <Suspense fallback={<div className="modal-loading">Carregando...</div>}>
            <UserGrowthModal {...modalProps} />
          </Suspense>
        );
      case 'revenue':
        return (
          <Suspense fallback={<div className="modal-loading">Carregando...</div>}>
            <RevenueModal {...modalProps} />
          </Suspense>
        );
      case 'depreciation':
        return (
          <Suspense fallback={<div className="modal-loading">Carregando...</div>}>
            <DepreciationModal {...modalProps} />
          </Suspense>
        );
      default:
        return null;
    }
  }, [selectedModal, closeModal, seriesMap, computeStats]);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <h1 className="admin-title">
              <span className="admin-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="admin-icon-svg">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </span>
              Dashboard Administrativo
            </h1>
          </div>
          
          <div className="admin-header-right">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                <div className="admin-user-initial">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">{user?.name || 'Administrador'}</span>
                <span className="admin-user-role">Administrador</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="admin-content">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <ul className="admin-nav-list">
              <li className="admin-nav-item">
                <button className="admin-nav-link active">
                  <span className="nav-icon">📊</span>
                  <span className="nav-label">Projeções</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="admin-main">
          <div className="dashboard-header">
            <h2>Visão Geral do Sistema</h2>
            <p>Métricas e projeções em tempo real</p>
          </div>

          {/* Cards de Métricas */}
          <div className="metrics-grid">
            {renderMetrics(
              userSeries, 
              'Crescimento de Usuários', 
              '#3b82f6',
              (value) => `${Math.round(value).toLocaleString()} usuários`,
              'userGrowth'
            )}
            {renderMetrics(
              revenueSeries, 
              'Receita Projetada', 
              '#10b981',
              (value) => `R$ ${value.toLocaleString()}`,
              'revenue'
            )}
            {renderMetrics(
              depreciationSeries, 
              'Depreciação de Recursos', 
              '#f59e0b',
              (value) => `R$ ${value.toLocaleString()}`,
              'depreciation'
            )}
          </div>

          {/* Cards de Gráficos */}
          <div className="charts-grid">
            <div className="chart-card">
              <LineChart
                data={userSeries}
                valueKey="users"
                title="Crescimento de Usuários"
                legend="Projeção de Usuários"
                color="#3b82f6"
                valueFormat={(v) => v.toLocaleString()}
                axisValueFormat={(v) => v.toLocaleString()}
                footerLabel="usuários"
              />
            </div>
            
            <div className="chart-card">
              <LineChart
                data={revenueSeries}
                valueKey="revenue"
                title="Receita Projetada"
                legend="Projeção de Receita"
                color="#10b981"
                valueFormat={(v) => `R$ ${v.toLocaleString()}`}
                axisValueFormat={(v) => `R$ ${v.toLocaleString()}`}
                footerLabel=""
              />
            </div>
            
            <div className="chart-card">
              <LineChart
                data={depreciationSeries}
                valueKey="value"
                title="Depreciação de Recursos"
                legend="Projeção de Depreciação"
                color="#f59e0b"
                valueFormat={(v) => `R$ ${v.toLocaleString()}`}
                axisValueFormat={(v) => `R$ ${v.toLocaleString()}`}
                footerLabel=""
              />
            </div>
          </div>

          
        </main>
      </div>

      {/* Modais com lazy loading */}
      {renderModal}
    </div>
  );
};

export default AdminDashboard;
