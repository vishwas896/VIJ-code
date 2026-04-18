import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { LiquidBackground } from '../components/LiquidBackground';
import './Auth.css';

export const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';
  const [role, setRole] = useState<'seeker' | 'recruiter'>('seeker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'seeker') {
      navigate('/onboarding/parameters');
    } else {
      navigate('/recruiter/dashboard');
    }
  };

  return (
    <LiquidBackground>
      <div className="auth-page">
        <GlassCard className="auth-card">
          <div className="auth-left">
            <div className="auth-branding">
              <div className="logo-nodes mb-8">
                <div className="node talent-node"></div>
                <div className="node opp-node"></div>
              </div>
              <h1>{isLogin ? 'Welcome Back' : 'Join the Junction'}</h1>
              <p>The 100% Match environment secured by VIJ Mediation.</p>
            </div>
          </div>
          
          <div className="auth-right">
            <div className="role-toggle">
              <button 
                className={role === 'seeker' ? 'active' : ''} 
                onClick={() => setRole('seeker')}
              >
                Job Seeker
              </button>
              <button 
                className={role === 'recruiter' ? 'active' : ''} 
                onClick={() => setRole('recruiter')}
              >
                Recruiter
              </button>
              <motion.div 
                className="role-slider"
                animate={{ left: role === 'seeker' ? '0%' : '50%' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <input type="text" className="fluid-input" placeholder="Full Name" required />
              )}
              <input type="email" className="fluid-input" placeholder="Email Address" required />
              <input type="password" className="fluid-input" placeholder="Password" required />
              
              <button type="submit" className="solid-auth-btn">
                Authenticate
              </button>
            </form>

            <div className="auth-links">
              {isLogin ? (
                <>
                  <Link to="/reset-password">Forgot Password?</Link>
                  <span>•</span>
                  <Link to="/register">Create an account</Link>
                </>
              ) : (
                <Link to="/login">Already have an account? Sign in</Link>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </LiquidBackground>
  );
};
