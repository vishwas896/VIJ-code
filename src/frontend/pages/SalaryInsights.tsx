import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import { useCurrency } from '../context/CurrencyContext';
import './SalaryInsights.css';

export const SalaryInsights: React.FC = () => {
  const { formatCurrency } = useCurrency();
  return (
    <PageTransition>
      <div className="salary-page">
        <header className="page-header">
          <h1 className="text-gradient">Salary Insights</h1>
          <p>Real-time data synchronization across locations and skills.</p>
        </header>

        <div className="insights-grid">
          <GlassCard className="chart-placeholder">
            <h3>Salary by Location</h3>
            <div className="bar-chart-sim">
              <div className="bar" style={{ height: '80%' }}><span>NY</span></div>
              <div className="bar" style={{ height: '60%' }}><span>LDN</span></div>
              <div className="bar" style={{ height: '90%' }}><span>SF</span></div>
              <div className="bar" style={{ height: '40%' }}><span>BLR</span></div>
            </div>
          </GlassCard>

          <GlassCard className="dimension-stats">
            <h3>Top Paying Skills</h3>
            <ul>
              <li>Solidity - {formatCurrency(180000, true)} Avg</li>
              <li>React + Framer - {formatCurrency(165000, true)} Avg</li>
              <li>Node.js Architect - {formatCurrency(170000, true)} Avg</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
};
