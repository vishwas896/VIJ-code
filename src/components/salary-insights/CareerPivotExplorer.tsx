'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../context/CurrencyContext';
import { ArrowRight, Compass, CheckCircle } from 'lucide-react';

interface CareerPivot {
  title: string;
  avgSalary: number; // (USD)
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  salaryBumpPct: number;
  skillsRequired: string[];
}

interface CareerPivotExplorerProps {
  currentTitle: string;
  currentSalary: number; // (USD)
  pivots: CareerPivot[];
}

export const CareerPivotExplorer: React.FC<CareerPivotExplorerProps> = ({
  currentTitle,
  currentSalary,
  pivots
}) => {
  const { formatCurrency } = useCurrency();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // SVG Dimension Constants
  const width = 500;
  const height = 240;
  const startX = 60;
  const startY = height / 2;
  const endX = 380;

  const difficultyColors = {
    Easy: '#10b981',      // Emerald Green
    Moderate: '#f59e0b',  // Gold Amber
    Hard: '#dc2626'       // Azure Red
  };

  return (
    <div className="career-pivot-explorer" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={18} className="text-blue-glow" />
        <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Career Pivot Paths</h4>
      </div>

      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* SVG Flow diagram */}
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ overflow: 'visible', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
        >
          <defs>
            {/* Pulsing glow filter */}
            <filter id="glow-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#0ea5e9" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Current Role Node */}
          <g>
            <circle
              cx={startX}
              cy={startY}
              r="24"
              fill="rgba(10, 110, 110, 0.1)"
              stroke="#0A6E6E"
              strokeWidth="2.5"
            />
            <circle
              cx={startX}
              cy={startY}
              r="10"
              fill="#0A6E6E"
            />
            <foreignObject x={10} y={startY - 65} width={100} height={35}>
              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--vij-text-main)', lineHeight: '1.2' }}>
                {currentTitle}
              </div>
            </foreignObject>
            <foreignObject x={10} y={startY + 28} width={100} height={20}>
              <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: 'var(--vij-text-muted)' }}>
                {formatCurrency(currentSalary, true)}
              </div>
            </foreignObject>
          </g>

          {/* Connections & Target Nodes */}
          {pivots.map((pivot, idx) => {
            const numPivots = pivots.length;
            // Spread nodes vertically on the right
            const gapY = (height - 60) / Math.max(1, numPivots - 1);
            const targetY = numPivots === 1 
              ? height / 2 
              : 30 + idx * gapY;

            // Draw clean bezier curves from Left node to Right nodes
            const pathD = `M ${startX + 24} ${startY} C ${startX + 140} ${startY}, ${endX - 140} ${targetY}, ${endX - 24} ${targetY}`;
            const isSelected = selectedIdx === idx;
            const nodeColor = difficultyColors[pivot.difficulty];

            return (
              <g key={pivot.title}>
                {/* Connecting Line path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? '#0ea5e9' : 'rgba(0, 0, 0, 0.12)'}
                  strokeWidth={isSelected ? 3.5 : 2}
                  strokeDasharray={isSelected ? '5 5' : 'none'}
                  style={{
                    transition: 'stroke 0.3s, stroke-width 0.3s',
                  }}
                />

                {/* Animated dash pulses flowing left-to-right along paths */}
                {isSelected && (
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeDasharray="15 30"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                )}

                {/* Target Node */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedIdx(isSelected ? null : idx)}
                >
                  <circle
                    cx={endX}
                    cy={targetY}
                    r="20"
                    fill="var(--vij-bg)"
                    stroke={nodeColor}
                    strokeWidth={isSelected ? 3.5 : 2}
                    style={{
                      transition: 'stroke-width 0.2s',
                      filter: isSelected ? `drop-shadow(0 0 5px ${nodeColor})` : 'none'
                    }}
                  />
                  
                  {/* Inside Circle symbol */}
                  <circle
                    cx={endX}
                    cy={targetY}
                    r="6"
                    fill={nodeColor}
                  />

                  {/* Target title */}
                  <foreignObject x={endX + 26} y={targetY - 15} width={120} height={35}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: isSelected ? 800 : 600, 
                      color: isSelected ? 'var(--accent-azure)' : 'var(--vij-text-main)', 
                      lineHeight: '1.2',
                      textAlign: 'left'
                    }}>
                      {pivot.title}
                    </div>
                  </foreignObject>

                  {/* Salary bump percentage tag on curve */}
                  <g transform={`translate(${(startX + endX) / 2}, ${(startY + targetY) / 2})`}>
                    <rect
                      x="-22"
                      y="-10"
                      width="44"
                      height="18"
                      rx="4"
                      fill="rgba(16, 185, 129, 0.9)"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize="9px"
                      fontWeight="800"
                    >
                      {pivot.salaryBumpPct >= 0 ? `+${pivot.salaryBumpPct}%` : `${pivot.salaryBumpPct}%`}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Target details overlay */}
      <div style={{ minHeight: '80px' }}>
        <AnimatePresence mode="wait">
          {selectedIdx !== null ? (
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--vij-text-main)' }}>
                  Pivot to {pivots[selectedIdx].title}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  background: difficultyColors[pivots[selectedIdx].difficulty],
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {pivots[selectedIdx].difficulty} Difficulty
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--vij-text-muted)' }}>Avg Pay:</span>{' '}
                  <strong style={{ color: 'var(--accent-emerald)' }}>
                    {formatCurrency(pivots[selectedIdx].avgSalary, true)}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--vij-text-muted)' }}>Difference:</span>{' '}
                  <strong style={{ color: 'var(--accent-emerald)' }}>
                    +{Math.round((pivots[selectedIdx].avgSalary - currentSalary) / currentSalary * 100)}%
                  </strong>
                </div>
              </div>

              {/* Skills checklist */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {pivots[selectedIdx].skillsRequired.map(skill => (
                  <span 
                    key={skill}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      background: 'rgba(10, 110, 110, 0.08)',
                      color: '#0A6E6E',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    <CheckCircle size={10} />
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70px',
                border: '1px dashed var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--vij-text-muted)',
                fontSize: '12px'
              }}
            >
              Click any circular target node to explore skills and pay metrics
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
