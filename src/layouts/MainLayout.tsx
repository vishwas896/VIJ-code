import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LiquidBackground } from '../components/LiquidBackground';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  return (
    <LiquidBackground>
      <header className="global-header">
        <Link to="/" className="logo-container">
          <div className="logo-nodes">
            <div className="node talent-node"></div>
            <div className="node opp-node"></div>
          </div>
          <span className="logo-text">VIJ</span>
        </Link>
        <nav className="global-nav">
          <Link to="/explore" className="nav-link">Explore</Link>
          <Link to="/news" className="nav-link">Social Hub</Link>
          <Link to="/roadmaps" className="nav-link">Roadmaps</Link>
          <Link to="/register" className="nav-link" style={{ 
            background: 'rgba(255,255,255,0.4)', 
            backdropFilter: 'blur(12px)', 
            padding: '8px 24px', 
            borderRadius: '999px',
            color: 'var(--vij-text-main)'
          }}>Join the Junction</Link>
        </nav>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
    </LiquidBackground>
  );
};
