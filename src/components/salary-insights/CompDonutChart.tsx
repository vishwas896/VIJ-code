'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CompDonutChartProps {
  base: number;   // base % (e.g. 70)
  bonus: number;  // bonus % (e.g. 15)
  equity: number; // equity % (e.g. 15)
}

export const CompDonutChart: React.FC<CompDonutChartProps> = ({
  base,
  bonus,
  equity
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG parameters
  const radius = 50;
  const strokeWidth = 14;
  const size = 150;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius; // ~314.159

  // Sectors definitions
  const sectors = [
    { name: 'Base Pay', value: base, color: '#0A6E6E', glow: 'rgba(10, 110, 110, 0.3)' },
    { name: 'Annual Bonus', value: bonus, color: '#dc2626', glow: 'rgba(220, 38, 38, 0.3)' },
    { name: 'Equity / Stock', value: equity, color: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' },
  ].filter(s => s.value > 0);

  // Calculate accumulated angles/offsets
  let currentOffset = 0;

  return (
    <div 
      className="comp-donut-container" 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '10px 0'
      }}
    >
      {/* SVG Donut */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }} // start from top
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={strokeWidth}
          />

          {sectors.map((sector, idx) => {
            const length = (sector.value / 100) * circumference;
            const offset = currentOffset;
            currentOffset -= length; // Accumulate negative offset for counter-clockwise rotation

            const isHovered = hoveredIdx === idx;

            return (
              <motion.circle
                key={sector.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={sector.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  cursor: 'pointer',
                  filter: isHovered ? `drop-shadow(0 0 6px ${sector.color})` : 'none',
                  transition: 'stroke-width 0.2s ease, filter 0.2s ease',
                }}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            );
          })}
        </svg>

        {/* Center overlay showing active hover percentage */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {hoveredIdx !== null ? (
            <>
              <span style={{ fontSize: '18px', fontWeight: 800, color: sectors[hoveredIdx].color }}>
                {sectors[hoveredIdx].value}%
              </span>
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--vij-text-muted)', textTransform: 'uppercase' }}>
                {sectors[hoveredIdx].name.split(' ')[0]}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--vij-text-main)' }}>
                100%
              </span>
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--vij-text-muted)', textTransform: 'uppercase' }}>
                Total Comp
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        {sectors.map((sector, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={sector.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isHovered ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
                border: isHovered ? '1px solid var(--glass-border)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border 0.2s ease'
              }}
            >
              <span 
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: sector.color,
                  boxShadow: isHovered ? `0 0 8px ${sector.color}` : 'none'
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: isHovered ? 700 : 500, color: 'var(--vij-text-main)' }}>
                  {sector.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--vij-text-muted)' }}>
                  {sector.value}% of package
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
