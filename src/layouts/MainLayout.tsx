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
          <Link to="/onboarding" className="nav-link">Onboarding</Link>
          <Link to="/recruiter" className="nav-link">Recruiter</Link>
          <Link to="/interview" className="nav-link">Interview</Link>
          <Link to="/social" className="nav-link">Social Hub</Link>
          <Link to="/networking" className="nav-link">Networking</Link>
          <Link to="/wallet" className="nav-link">Wallet</Link>
        </nav>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
    </LiquidBackground>
  );
};
