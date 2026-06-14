'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { VijLogo } from '../components/common/VijLogo';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/news', label: 'News' },
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/network', label: 'Network' },
  { to: '/services', label: 'Services' },
];

export const Auth: React.FC = () => {
  const pathname   = usePathname();
  const router    = useRouter();
  const { login } = useAuth();
  const isLogin   = pathname === '/login';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Default login — role will be set properly during onboarding
    login('job_seeker');
    
    if (!isLogin) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
    
    setIsSubmitting(false);
  };

  const handleSocialLogin = (provider: string) => {
    // UI-only placeholder — in production this would trigger OAuth
    setIsSubmitting(true);
    login('job_seeker');
    router.push('/onboarding');
    setIsSubmitting(false);
  };

  return (
    <div className="auth-root">
      {/* ══════ GLOBAL HEADER ══════ */}
      <header className="global-header">
        <Link href="/" className="logo-container">
          <VijLogo size="sm" theme="light" showText />
        </Link>

        <nav className="global-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              href={link.to}
              className={`nav-link ${pathname === link.to ? 'nav-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-utilities">
          <Link href="/login"    className="login-trigger-btn">Log In</Link>
          <Link href="/register" className="join-nav-btn">Join Junction</Link>
        </div>
      </header>

      {/* ══════ BODY ══════ */}
      <div className="auth-body">
        
        <div className="auth-left-pane">
          <div className="auth-left-photos">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop" alt="Team working" className="auth-bg-photo" />
            <div className="auth-left-photo-overlay" />
          </div>
          <div className="auth-left-content">
            <div className="auth-left-badge">🚀 Trusted by 50k+ Professionals</div>
            <h1 className="auth-left-title">
              The Smartest Way<br />to <span className="auth-left-accent">Find &amp; Hire</span>
            </h1>
            <p className="auth-left-sub">
              VIJ connects job seekers with top companies using intelligent matching.
              Join the platform and get discovered by the right people.
            </p>
            <div className="auth-left-stats">
              <div className="auth-stat-box">
                <div className="auth-stat-num">1,284</div>
                <div className="auth-stat-label">Live Matches Today</div>
              </div>
              <div className="auth-stat-box">
                <div className="auth-stat-num">450+</div>
                <div className="auth-stat-label">Active Companies</div>
              </div>
              <div className="auth-stat-box">
                <div className="auth-stat-num">98%</div>
                <div className="auth-stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right-pane">
          <div className="auth-form-card">
            
            <div className="auth-tab-bar">
              <Link href="/login"    className={`auth-tab ${isLogin  ? 'active' : ''}`}>Log In</Link>
              <Link href="/register" className={`auth-tab ${!isLogin ? 'active' : ''}`}>Sign Up</Link>
            </div>

            {/* ── Social Login Buttons ── */}
            <div className="auth-social-buttons">
              <button className="auth-social-btn" onClick={() => handleSocialLogin('google')} disabled={isSubmitting}>
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <button className="auth-social-btn" onClick={() => handleSocialLogin('linkedin')} disabled={isSubmitting}>
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#0A66C2" d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                Continue with LinkedIn
              </button>
              <button className="auth-social-btn" onClick={() => handleSocialLogin('github')} disabled={isSubmitting}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Continue with GitHub
              </button>
            </div>

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              
              {!isLogin && (
                <div className="auth-field-row">
                  <div className="auth-field">
                    <User size={15} className="auth-field-icon"/>
                    <input type="text" placeholder="First Name" required/>
                  </div>
                  <div className="auth-field">
                    <input type="text" placeholder="Last Name" required/>
                  </div>
                </div>
              )}

              <div className="auth-field">
                <Mail size={15} className="auth-field-icon"/>
                <input type="email" placeholder="Email Address" required/>
              </div>

              <div className="auth-field">
                <Lock size={15} className="auth-field-icon"/>
                <input type="password" placeholder={isLogin ? 'Password' : 'Create Password'} required/>
              </div>

              {isLogin && (
                <div className="auth-forgot-row">
                  <button type="button" className="auth-forgot-link">Forgot Password?</button>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                {isSubmitting
                  ? <span className="auth-spinner"/>
                  : isLogin ? 'Log In to VIJ' : 'Create Account & Start Onboarding'}
              </button>

              <p className="auth-switch-text">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link href={isLogin ? '/register' : '/login'} className="auth-switch-link">
                  {isLogin ? 'Sign up free' : 'Log in here'}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
