'use client';
import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { motion } from 'framer-motion';

interface SalaryRangeBarProps {
  min: number;
  mid: number;
  max: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export const SalaryRangeBar: React.FC<SalaryRangeBarProps> = ({
  min,
  mid,
  max,
  percentiles
}) => {
  const { formatCurrency } = useCurrency();
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const p10 = percentiles.p10;
  const p25 = percentiles.p25;
  const p50 = percentiles.p50;
  const p75 = percentiles.p75;
  const p90 = percentiles.p90;

  // Calculate percentage positions relative to the p10 - p90 range
  const range = p90 - p10;
  const getPercentage = (val: number) => {
    if (range === 0) return 50;
    const pct = ((val - p10) / range) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const markers = [
    { label: '10th Percentile', value: p10, key: 'p10', short: '10%' },
    { label: '25th Percentile', value: p25, key: 'p25', short: '25%' },
    { label: 'Median (50th)', value: p50, key: 'p50', short: '50%' },
    { label: '75th Percentile', value: p75, key: 'p75', short: '75%' },
    { label: '90th Percentile', value: p90, key: 'p90', short: '90%' },
  ];

  return (
    <div className="salary-range-container" style={{ padding: '20px 0', position: 'relative' }}>
      <div className="range-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--vij-text-muted)', fontWeight: 500 }}>Min Base Pay</span>
          <h4 style={{ fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>
            {formatCurrency(min, true)}
          </h4>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--accent-azure)', fontWeight: 600 }}>Median Pay (50th)</span>
          <h4 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-azure)', marginTop: '2px' }}>
            {formatCurrency(p50, true)}
          </h4>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: 'var(--vij-text-muted)', fontWeight: 500 }}>Max Base Pay</span>
          <h4 style={{ fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>
            {formatCurrency(max, true)}
          </h4>
        </div>
      </div>

      {/* Interactive Bar Track */}
      <div 
        className="range-track-wrapper" 
        style={{
          height: '12px',
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '999px',
          position: 'relative',
          margin: '35px 10px 45px 10px',
        }}
      >
        {/* Main Gradient Bar between p10 and p90 */}
        <motion.div
          className="range-fill"
          initial={{ width: 0, left: '0%' }}
          animate={{ width: '100%', left: '0%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            position: 'absolute',
            background: 'linear-gradient(90deg, #0A6E6E 0%, #dc2626 50%, #10b981 100%)',
            borderRadius: '999px',
            opacity: 0.85,
          }}
        />

        {/* Percentile Markers */}
        {markers.map((marker) => {
          const position = getPercentage(marker.value);
          const isHovered = hoveredMarker === marker.key;
          const isMedian = marker.key === 'p50';

          return (
            <div
              key={marker.key}
              style={{
                position: 'absolute',
                left: `${position}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 10 : 2,
              }}
            >
              {/* Vertical Tick / Circle */}
              <motion.div
                onMouseEnter={() => setHoveredMarker(marker.key)}
                onMouseLeave={() => setHoveredMarker(null)}
                animate={{
                  scale: isHovered ? 1.4 : 1.0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  width: isMedian ? '24px' : '16px',
                  height: isMedian ? '24px' : '16px',
                  background: isMedian ? 'var(--vij-bg)' : 'rgba(255, 255, 255, 0.95)',
                  border: isMedian 
                    ? '4px solid var(--accent-azure)' 
                    : `3px solid ${marker.key === 'p10' ? '#0A6E6E' : marker.key === 'p90' ? '#10b981' : 'var(--vij-text-muted)'}`,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: isMedian 
                    ? '0 0 12px var(--accent-azure-glow)' 
                    : '0 2px 6px rgba(0,0,0,0.15)',
                }}
              />

              {/* Tooltip Card (Framer Motion Animated) */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{
                  opacity: isHovered || isMedian ? 1 : 0,
                  y: isHovered || isMedian ? -48 : -30,
                  scale: isHovered || isMedian ? 1 : 0.8,
                  pointerEvents: isHovered ? 'auto' : 'none'
                }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  background: 'rgba(24, 24, 27, 0.9)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span>{marker.label}</span>
                <span style={{ color: isMedian ? '#ff8b8b' : '#10b981', fontSize: '12px', fontWeight: 800, marginTop: '2px' }}>
                  {formatCurrency(marker.value, false)}
                </span>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid rgba(24, 24, 27, 0.9)',
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }} />
              </motion.div>

              {/* Bottom Percentage Labels */}
              <span
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  fontWeight: isMedian ? 700 : 500,
                  color: isMedian ? 'var(--accent-azure)' : 'var(--vij-text-muted)',
                }}
              >
                {marker.short}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Legend info */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          fontSize: '12px',
          color: 'var(--vij-text-muted)',
          marginTop: '10px'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0A6E6E' }} />
          10th Percentile (Entry Level Base)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-azure)' }} />
          50th Percentile (Market Average)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          90th Percentile (Top Earners)
        </span>
      </div>
    </div>
  );
};
