'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/common/PageTransition';
import { Briefcase, Target, Users, ArrowUpRight, CheckCircle2, TrendingUp, Zap, FileText, Send } from 'lucide-react';
import './SeekerDashboard.css';

export const SeekerDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'job_seeker') return null;

  return (
    <PageTransition>
      <div className="seeker-dash-root">
        
        {/* Header */}
        <div className="seeker-dash-header">
          <div>
            <h1 className="seeker-dash-title">Job Seeker Hub</h1>
            <p className="seeker-dash-subtitle">Welcome back, {user.name}. Track your applications and career growth.</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="seeker-kpi-grid">
          <div className="seeker-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Resume Score</span>
              <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><FileText size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">92/100</div>
              <div className="kpi-trend positive"><ArrowUpRight size={14} /> Outstanding</div>
            </div>
          </div>
          
          <div className="seeker-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Interviews Scheduled</span>
              <div className="kpi-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}><Users size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">3</div>
              <div className="kpi-trend positive"><ArrowUpRight size={14} /> This week</div>
            </div>
          </div>

          <div className="seeker-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Offers Received</span>
              <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><CheckCircle2 size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">1</div>
              <div className="kpi-trend positive">Awaiting decision</div>
            </div>
          </div>

          <div className="seeker-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Skill Gap Score</span>
              <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><Zap size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">Low</div>
              <div className="kpi-trend positive">Ready for target roles</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="seeker-modules-grid">
          
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="seeker-module">
              <div className="module-header">
                <h2 className="module-title"><Target size={20} color="var(--accent-azure)" /> Recommended Jobs</h2>
                <button className="item-action">Search Jobs</button>
              </div>
              <div className="module-list">
                <div className="module-list-item">
                  <div className="item-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>S</div>
                  <div className="item-content">
                    <h3 className="item-title">Senior Frontend Engineer</h3>
                    <p className="item-subtitle">Stripe • Remote • ₹35L - ₹45L</p>
                  </div>
                  <button className="item-action" style={{ background: 'var(--accent-azure)', color: '#fff' }}>Apply</button>
                </div>
                <div className="module-list-item">
                  <div className="item-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>M</div>
                  <div className="item-content">
                    <h3 className="item-title">Full Stack Developer</h3>
                    <p className="item-subtitle">Microsoft • Bangalore • ₹25L - ₹30L</p>
                  </div>
                  <button className="item-action" style={{ background: 'var(--accent-azure)', color: '#fff' }}>Apply</button>
                </div>
              </div>
            </div>

            <div className="seeker-module">
              <div className="module-header">
                <h2 className="module-title"><Send size={20} color="var(--accent-azure)" /> Applied Jobs & Interviews</h2>
                <button className="item-action">View All</button>
              </div>
              <div className="module-list">
                <div className="module-list-item">
                  <div className="item-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>A</div>
                  <div className="item-content">
                    <h3 className="item-title">Frontend Lead</h3>
                    <p className="item-subtitle">Amazon • Technical Round Scheduled</p>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>In Progress</div>
                </div>
                <div className="module-list-item">
                  <div className="item-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>N</div>
                  <div className="item-content">
                    <h3 className="item-title">React Developer</h3>
                    <p className="item-subtitle">Netflix • Under Review</p>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>Applied</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="seeker-module">
              <div className="module-header">
                <h2 className="module-title"><TrendingUp size={20} color="var(--accent-azure)" /> Salary Benchmark</h2>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)' }}>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--vij-text-body)' }}>Your expected salary matches the top 15% of the industry for your skills.</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--vij-text-h1)', marginBottom: '8px' }}>₹25L <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--vij-text-muted)' }}>Average</span></div>
                <button className="item-action" style={{ width: '100%' }}>View Insights</button>
              </div>
            </div>

            <div className="seeker-module">
              <div className="module-header">
                <h2 className="module-title"><Briefcase size={20} color="var(--accent-azure)" /> Saved Jobs</h2>
              </div>
              <div className="module-list">
                <div className="module-list-item" style={{ padding: '12px 8px' }}>
                  <div className="item-icon" style={{ width: '36px', height: '36px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>O</div>
                  <div className="item-content">
                    <h3 className="item-title" style={{ fontSize: '13px' }}>UI Engineer</h3>
                    <p className="item-subtitle">OpenAI • Remote</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageTransition>
  );
};
