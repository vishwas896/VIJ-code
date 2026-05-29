'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../../context/CurrencyContext';

interface TrendSparklineProps {
  data: number[]; // 6 numbers
  height?: number;
}

export const TrendSparkline: React.FC<TrendSparklineProps> = ({
  data,
  height = 90
}) => {
  const { formatCurrency } = useCurrency();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 300;
  const padding = 15;

  const minVal = Math.min(...data) * 0.98; // Pad lower bounds slightly for visuals
  const maxVal = Math.max(...data) * 1.02; // Pad upper bounds slightly
  const valueRange = maxVal - minVal;

  // Generate coordinates
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const y =
      height -
      padding -
      ((val - minVal) / (valueRange || 1)) * (height - 2 * padding);
    return { x, y, value: val };
  });

  // SVG path definitions
  const pathD = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Gradient area path definition (closing the path below the line)
  const areaD = `
    ${pathD} 
    L ${points[points.length - 1].x} ${height} 
    L ${points[0].x} ${height} 
    Z
  `;

  const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

  return (
    <div className="sparkline-container" style={{ position: 'relative', width: '100%', margin: '10px 0' }}>
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glowing line shadow */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--accent-azure)" floodOpacity="0.4" />
          </filter>
          
          {/* Gradient area fill */}
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-azure)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-azure)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Shaded Area underneath the line */}
        <motion.path
          d={areaD}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Sparkline Path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="var(--accent-azure)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Hover Grid Lines & Interaction dots */}
        {points.map((p, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g key={idx}>
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={p.x}
                  y1={0}
                  x2={p.x}
                  y2={height}
                  stroke="rgba(0,0,0,0.1)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              )}

              {/* Interaction zone (larger invisible circle for easy touch/mouse targets) */}
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Visible circle mark */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                animate={{
                  r: isHovered ? 6 : 4,
                  fill: isHovered ? '#fff' : 'var(--accent-azure)',
                  stroke: isHovered ? 'var(--accent-azure)' : 'transparent',
                  strokeWidth: isHovered ? 3 : 0
                }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: 'none' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Axis/Timeline Labels */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 8px',
          marginTop: '6px',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--vij-text-muted)'
        }}
      >
        {months.map((m, idx) => (
          <span 
            key={m}
            style={{
              color: hoveredIdx === idx ? 'var(--accent-azure)' : 'inherit',
              transition: 'color 0.2s ease'
            }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* Hover Information Display */}
      <div 
        style={{ 
          height: '24px', 
          marginTop: '6px', 
          textAlign: 'center', 
          fontSize: '12px', 
          fontWeight: 700 
        }}
      >
        {hoveredIdx !== null ? (
          <span style={{ color: 'var(--accent-azure)' }}>
            {months[hoveredIdx]} Salary: {formatCurrency(points[hoveredIdx].value, true)}
          </span>
        ) : (
          <span style={{ color: 'var(--vij-text-muted)', fontSize: '11px', fontWeight: 500 }}>
            Hover points to see monthly salary details
          </span>
        )}
      </div>
    </div>
  );
};
