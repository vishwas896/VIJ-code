import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Wallet, Plus, BellRing, 
  CheckCircle, ChevronRight, TrendingUp, Zap, 
  Search, Shield
} from 'lucide-react';
import { PageTransition } from '../../components/PageTransition';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import './Recruiter.css';

export const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const { user, walletBalance } = useAuth();

  const dashboardCustomization = React.useMemo(() => {
    const saved = localStorage.getItem(`vij_dashboard_customization_${user?.id || 'guest'}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      showJobAnalytics: true,
      showProfileViews: true,
      showApplications: true,
      showAISuggestions: true,
      showIndustryTrends: true
    };
  }, [user]);

  const activeJobs = [
    { id: 'job-123', title: 'Senior React Developer', location: 'Remote', salaryMin: 120000, salaryMax: 150000, matches: 12, target: 20 },
    { id: 'job-456', title: 'UX/UI Designer', location: 'New York (Hybrid)', salaryMin: 90000, salaryMax: 110000, matches: 4, target: 10 },
    { id: 'job-789', title: 'Backend Node.js Engineer', location: 'London', salaryMin: 70000, salaryMax: 90000, matches: 0, target: 5 },
  ];

  return (
    <PageTransition>
      <div className="recruiter-hud-root">
        
        {/* ── TOP HUD HEADER ── */}
        <header className="recruiter-hud-header">
          <div className="header-meta">
            <h1 className="hud-title">
              Match Terminal <span className="hud-status-tag">Live</span>
            </h1>
            <p className="hud-subtitle">Match Engine is active. Scanning 1.2M profiles for 100% parameter hits.</p>
          </div>
          <div className="hud-header-actions">
            <GlassButton variant="primary" onClick={() => navigate('/recruiter/jobs/create')} className="hud-pulse-btn">
              <Plus size={18} style={{ marginRight: '8px' }} /> Activate New Pipeline
            </GlassButton>
          </div>
        </header>

        {/* ── METRICS COMMAND BAR ── */}
        {dashboardCustomization.showJobAnalytics && (
          <div className="recruiter-metrics-grid">
            <GlassCard className="hud-metric-card">
              <div className="metric-icon-box" style={{ color: 'var(--accent-azure)', background: 'var(--accent-azure-glow)' }}>
                <Zap size={24} />
              </div>
              <div className="metric-data">
                <span className="metric-label">Active Pipelines</span>
                <span className="metric-value">03</span>
              </div>
            </GlassCard>
            
            <GlassCard className="hud-metric-card">
              <div className="metric-icon-box" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Users size={24} />
              </div>
              <div className="metric-data">
                <span className="metric-label">Engine Matches</span>
                <span className="metric-value">16</span>
              </div>
            </GlassCard>

            <GlassCard className="hud-metric-card">
              <div className="metric-icon-box" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                <Wallet size={24} />
              </div>
              <div className="metric-data">
                <span className="metric-label">VIJ Credit Balance</span>
                <span className="metric-value">{formatCurrency(walletBalance, true)}</span>
              </div>
            </GlassCard>
          </div>
        )}

        <div className="hud-content-layout">
          
          {/* ── MAIN PIPELINE FEED ── */}
          <main className="hud-pipeline-feed">
            <div className="section-header">
              <h3>Priority Flows</h3>
              <div className="filter-pills">
                <span className="pill active">All</span>
                <span className="pill">Active</span>
                <span className="pill">Paused</span>
              </div>
            </div>
            
            <div className="pipeline-cards-list">
              {activeJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="pipeline-hud-card" onClick={() => navigate(`/recruiter/jobs/${job.id}`)}>
                    <div className="card-top">
                      <div className="job-info">
                        <h4>{job.title}</h4>
                        <p>{job.location} • {formatCurrency(job.salaryMin, true)} - {formatCurrency(job.salaryMax, true)}</p>
                      </div>
                      <div className="engine-badge">
                        <Shield size={12} /> Parameter Strict
                      </div>
                    </div>
                    
                    <div className="progress-section">
                      <div className="progress-labels">
                        <span>{job.matches} Valid Candidates</span>
                        <span>{Math.round((job.matches/job.target)*100)}% to Target</span>
                      </div>
                      <div className="hud-progress-bar">
                        <motion.div 
                          className="hud-progress-fill" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (job.matches / job.target) * 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="card-actions">
                      <GlassButton variant="secondary" className="btn-sm">
                        <Search size={14} /> Inspect Matches
                      </GlassButton>
                      <GlassButton variant="secondary" className="btn-sm">
                        Manage <ChevronRight size={14} />
                      </GlassButton>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </main>

          {/* ── ACTION CENTER SIDEBAR ── */}
          <aside className="hud-sidebar">
            {dashboardCustomization.showAISuggestions && (
              <GlassCard className="hud-side-widget">
                <h3>Match Intelligence</h3>
                <div className="notification-flow">
                  <div className="flow-item">
                    <div className="flow-icon success"><CheckCircle size={16} /></div>
                    <div className="flow-body">
                      <p>Candidate #842 accepted interview</p>
                      <span>10m ago</span>
                    </div>
                  </div>
                  <div className="flow-item">
                    <div className="flow-icon info"><BellRing size={16} /></div>
                    <div className="flow-body">
                      <p>New 100% match found for <strong>UX/UI</strong></p>
                      <span>1h ago</span>
                    </div>
                  </div>
                  <div className="flow-item">
                    <div className="flow-icon warning"><TrendingUp size={16} /></div>
                    <div className="flow-body">
                      <p>Match velocity increased by 20%</p>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
                <GlassButton variant="primary" className="full-width" style={{ marginTop: '24px' }}>
                  Refill Match Credits
                </GlassButton>
              </GlassCard>
            )}

            {dashboardCustomization.showIndustryTrends && (
              <GlassCard className="hud-side-widget stats-widget">
                <h3>System Health</h3>
                <div className="health-grid">
                  <div className="health-stat">
                    <span>Uptime</span>
                    <strong>99.9%</strong>
                  </div>
                  <div className="health-stat">
                    <span>Engine</span>
                    <strong>v4.2-L</strong>
                  </div>
                </div>
              </GlassCard>
            )}
          </aside>

        </div>
      </div>
    </PageTransition>
  );
};
