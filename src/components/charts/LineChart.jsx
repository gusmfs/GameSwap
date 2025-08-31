import React, { useState, memo } from 'react';

const LineChart = memo(({ data, valueKey, title, legend, color = '#3b82f6', valueFormat, axisValueFormat, footerLabel, chartWidth = 640, chartHeight = 260, chartPadding = 36 }) => {
  const [hover, setHover] = useState(null);

  const months = data.map(d => d.month);
  const values = data.map(d => d[valueKey]);
  const minMonth = months.length ? Math.min(...months) : 0;
  const maxMonth = months.length ? Math.max(...months) : 0;
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;

  const width = chartWidth;
  const height = chartHeight;
  const padding = chartPadding;

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

export default LineChart;


