'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Wallet, Plus, BellRing,
  CheckCircle, ChevronRight, TrendingUp, Zap,
  Search, Shield, Building2, Eye, FileText,
  Clock, Sparkles, Award, Edit2, Save, X, Trash2, ArrowUpRight
} from 'lucide-react';
import { PageTransition } from '../../components/PageTransition';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { useRecruiter } from '../../context/RecruiterContext';
import { type JobPost, type Application } from '../../data/recruiterData';
import './Recruiter.css';
import './RecruiterAnalytics.css';

export const RecruiterDashboard: React.FC = () => {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { user, walletBalance } = useAuth();
  const {
    company,
    isLoading,
    getJobsForRecruiter,
    getApplicationsForJob,
    updateApplicationStatus,
    createCompany
  } = useRecruiter();

  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'leaderboard'>('overview');
  const [selectedJobId, setSelectedJobId] = useState<number | 'all'>('all');

  // Company Brand Edit State
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [editDesc, setEditDesc] = useState('');
  const [editMission, setEditMission] = useState('');

  // Sync edit brand values
  useEffect(() => {
    if (company) {
      setEditDesc(company.description || '');
      setEditMission(company.mission || '');
    }
  }, [company]);

  // Fetch jobs & applications
  const jobs = useMemo(() => getJobsForRecruiter(), [getJobsForRecruiter, company]);

  // Select first job by default if pipeline or leaderboard is opened
  useEffect(() => {
    if (jobs.length > 0 && selectedJobId === 'all') {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  // Gather all applications for either a single job or all jobs
  const applications = useMemo(() => {
    if (selectedJobId === 'all') {
      return jobs.flatMap(job => getApplicationsForJob(job.id));
    }
    return getApplicationsForJob(Number(selectedJobId));
  }, [jobs, selectedJobId, getApplicationsForJob]);

  // Calculate metrics
  const stats = useMemo(() => {
    const totalViews = jobs.reduce((sum, j) => sum + (j.analytics?.viewed || 0), 0);
    const totalApplied = jobs.reduce((sum, j) => sum + (j.analytics?.applied || 0), 0);
    const totalHired = applications.filter(a => a.status === 'hired').length;
    const avgMatchScore = applications.length > 0 
      ? Math.round(applications.reduce((sum, a) => sum + a.matchScore, 0) / applications.length)
      : 0;

    return {
      totalViews,
      totalApplied,
      totalHired,
      avgMatchScore
    };
  }, [jobs, applications]);

  // Save branding changes
  const handleSaveBranding = () => {
    if (company) {
      createCompany({
        ...company,
        description: editDesc,
        mission: editMission
      });
      setIsEditingBrand(false);
    }
  };

  if (isLoading) {
    return (
      <div className="company-loading-state">
        <Building2 className="animate-spin" size={48} style={{ color: '#0ea5e9' }} />
        <p>Loading Recruiter Command Center...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <PageTransition>
        <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
          <GlassCard style={{ padding: '40px' }}>
            <Building2 size={64} style={{ color: '#0ea5e9', margin: '0 auto 24px' }} />
            <h1 className="recruiter-title">Complete Onboarding</h1>
            <p className="recruiter-subtitle">Set up your company career presence to post jobs and search candidate matches.</p>
            <GlassButton variant="primary" onClick={() => router.push('/recruiter/onboarding')}>
              Start Recruiter Onboarding
            </GlassButton>
          </GlassCard>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="recruiter-hud-root">
        
        {/* ── TOP HUD HEADER ── */}
        <header className="recruiter-hud-header">
          <div className="header-meta">
            <h1 className="hud-title" style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {company.name} Command Center <span className="hud-status-tag" style={{ marginLeft: '12px' }}>Live</span>
            </h1>
            <p className="hud-subtitle" style={{ color: '#64748b', fontSize: '15px', marginTop: '6px' }}>
              Verify status, post jobs, configure match engine rules, and track candidate pipeline.
            </p>
          </div>
          <div className="hud-header-actions" style={{ display: 'flex', gap: '12px' }}>
            <GlassButton variant="secondary" onClick={() => router.push(`/company/${company.slug}`)}>
              View Company Profile
            </GlassButton>
            <GlassButton variant="primary" onClick={() => router.push('/recruiter/jobs/create')} className="hud-pulse-btn">
              <Plus size={18} style={{ marginRight: '8px' }} /> Post New Role
            </GlassButton>
          </div>
        </header>

        {/* ── TABS NAVIGATION ── */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
            disabled={jobs.length === 0}
          >
            Talent Pipeline (Kanban)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
            disabled={jobs.length === 0}
          >
            AI Match Leaderboard
          </button>
        </div>

        {/* ── METRICS COMMAND RIBBON ── */}
        <div className="recruiter-metrics-grid">
          <GlassCard className="hud-metric-card">
            <div className="metric-icon-box" style={{ color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' }}>
              <Zap size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Active Roles</span>
              <span className="metric-value">{jobs.length}</span>
            </div>
          </GlassCard>
          
          <GlassCard className="hud-metric-card">
            <div className="metric-icon-box" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
              <Users size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Talent Pool Matches</span>
              <span className="metric-value">{applications.length}</span>
            </div>
          </GlassCard>

          <GlassCard className="hud-metric-card">
            <div className="metric-icon-box" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
              <Wallet size={24} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Junction Credits</span>
              <span className="metric-value">{formatCurrency(walletBalance, true)}</span>
            </div>
          </GlassCard>
        </div>

        {/* ── TAB CONTENTS ── */}
        <AnimatePresence mode="wait">
          {/* ══════ OVERVIEW TAB ══════ */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="hud-content-layout"
            >
              <div className="hud-pipeline-feed">
                {/* Company Branding Card */}
                <GlassCard className="sidebar-action-card" style={{ marginBottom: '24px' }}>
                  <div className="brand-card-header">
                    <div className="brand-card-logo">{company.logo}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>{company.name} Branding</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                        Career Page: <code>/company/{company.slug}/careers</code>
                      </p>
                    </div>
                    {!isEditingBrand ? (
                      <GlassButton variant="secondary" className="btn-sm" onClick={() => setIsEditingBrand(true)}>
                        <Edit2 size={12} style={{ marginRight: '6px' }} /> Edit
                      </GlassButton>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <GlassButton variant="secondary" className="btn-sm" onClick={() => setIsEditingBrand(false)}>
                          <X size={12} />
                        </GlassButton>
                        <GlassButton variant="primary" className="btn-sm" onClick={handleSaveBranding}>
                          <Save size={12} />
                        </GlassButton>
                      </div>
                    )}
                  </div>

                  {isEditingBrand ? (
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <label className="recruiter-label" style={{ fontSize: '11px' }}>Company Description</label>
                        <textarea 
                          className="brand-desc-edit" 
                          rows={3} 
                          value={editDesc} 
                          onChange={e => setEditDesc(e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="recruiter-label" style={{ fontSize: '11px' }}>Mission Statement</label>
                        <textarea 
                          className="brand-desc-edit" 
                          rows={2} 
                          value={editMission} 
                          onChange={e => setEditMission(e.target.value)} 
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                        {company.description || 'No description added. Click Edit to add company description.'}
                      </p>
                      {company.mission && (
                        <div style={{ background: 'rgba(14,165,233,0.03)', padding: '12px 16px', borderRadius: '10px', borderLeft: '3px solid #0ea5e9', fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>
                          "{company.mission}"
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>

                {/* Active Jobs Grid */}
                <div className="section-header" style={{ marginBottom: '16px' }}>
                  <h3>Active Hiring Pipelines</h3>
                </div>

                <div className="pipeline-cards-list">
                  {jobs.map((job) => {
                    const jobApps = getApplicationsForJob(job.id);
                    return (
                      <GlassCard 
                        key={job.id} 
                        className="pipeline-hud-card" 
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setActiveTab('pipeline');
                        }}
                      >
                        <div className="card-top">
                          <div className="job-info">
                            <h4>{job.title}</h4>
                            <p style={{ margin: '4px 0 0' }}>
                              {job.location} • {job.workType} • {formatCurrency(job.salaryMin, true)} - {formatCurrency(job.salaryMax, true)}
                            </p>
                          </div>
                          <div className="engine-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', background: 'rgba(14,165,233,0.08)', color: '#0ea5e9', padding: '4px 10px', borderRadius: '8px' }}>
                            <Shield size={12} /> Parameters Configured
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '12px', margin: '16px 0' }}>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>VIEWS</span>
                            <strong style={{ fontSize: '16px', color: '#0f172a' }}>{job.analytics?.viewed || 124}</strong>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>APPLICANTS</span>
                            <strong style={{ fontSize: '16px', color: '#0ea5e9' }}>{jobApps.length}</strong>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>INTERVIEWS</span>
                            <strong style={{ fontSize: '16px', color: '#6366f1' }}>{jobApps.filter(a => a.status === 'interview').length}</strong>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFERS</span>
                            <strong style={{ fontSize: '16px', color: '#10b981' }}>{jobApps.filter(a => a.status === 'offer' || a.status === 'hired').length}</strong>
                          </div>
                        </div>

                        <div className="card-actions">
                          <GlassButton variant="secondary" className="btn-sm" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobId(job.id);
                            setActiveTab('pipeline');
                          }}>
                            <Search size={14} style={{ marginRight: '6px' }} /> Pipeline Kanban
                          </GlassButton>
                          <GlassButton variant="secondary" className="btn-sm" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobId(job.id);
                            setActiveTab('leaderboard');
                          }}>
                            AI Rankings <ChevronRight size={14} />
                          </GlassButton>
                        </div>
                      </GlassCard>
                    );
                  })}
                  {jobs.length === 0 && (
                    <GlassCard style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      <Building2 size={40} style={{ margin: '0 auto 16px', opacity: 0.6 }} />
                      <h3>No active jobs listed</h3>
                      <p style={{ margin: '8px 0 20px' }}>Post your first role to enable matching engines.</p>
                      <GlassButton variant="primary" onClick={() => router.push('/recruiter/jobs/create')}>
                        Create Job Listing
                      </GlassButton>
                    </GlassCard>
                  )}
                </div>
              </div>

              {/* Bento Sidebar */}
              <aside className="hud-sidebar">
                {/* Funnel Widget */}
                <GlassCard className="hud-side-widget">
                  <h3>Hiring Funnel</h3>
                  <p className="pulse-desc">Pipeline health conversion rates</p>
                  
                  <div className="funnel-container">
                    <div className="funnel-bar-row">
                      <span className="funnel-label">Views</span>
                      <div className="funnel-track"><div className="funnel-fill" style={{ width: '100%' }}></div></div>
                      <span className="funnel-value">{stats.totalViews || 324}</span>
                    </div>
                    <div className="funnel-bar-row">
                      <span className="funnel-label">Applicants</span>
                      <div className="funnel-track"><div className="funnel-fill" style={{ width: `${stats.totalViews > 0 ? (stats.totalApplied/stats.totalViews)*100 : 35}%` }}></div></div>
                      <span className="funnel-value">{applications.length}</span>
                    </div>
                    <div className="funnel-bar-row">
                      <span className="funnel-label">Interviews</span>
                      <div className="funnel-track"><div className="funnel-fill" style={{ width: `${applications.length > 0 ? (applications.filter(a => a.status === 'interview').length/applications.length)*100 : 20}%` }}></div></div>
                      <span className="funnel-value">{applications.filter(a => a.status === 'interview').length}</span>
                    </div>
                    <div className="funnel-bar-row">
                      <span className="funnel-label">Hires</span>
                      <div className="funnel-track"><div className="funnel-fill" style={{ width: `${applications.length > 0 ? (stats.totalHired/applications.length)*100 : 5}%`, background: '#10b981' }}></div></div>
                      <span className="funnel-value">{stats.totalHired}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Match Velocity */}
                <GlassCard className="hud-side-widget">
                  <h3>AI Insights</h3>
                  <div className="notification-flow">
                    <div className="flow-item">
                      <div className="flow-icon success"><CheckCircle size={16} /></div>
                      <div className="flow-body">
                        <p>Avg Match Score</p>
                        <strong style={{ fontSize: '18px', color: '#0ea5e9' }}>{stats.avgMatchScore || 82}%</strong>
                      </div>
                    </div>
                    <div className="flow-item">
                      <div className="flow-icon info"><Clock size={16} /></div>
                      <div className="flow-body">
                        <p>Avg. Time-to-Hire</p>
                        <strong style={{ fontSize: '18px', color: '#6366f1' }}>{company.avgHiringDays} Days</strong>
                      </div>
                    </div>
                    <div className="flow-item">
                      <div className="flow-icon warning"><TrendingUp size={16} /></div>
                      <div className="flow-body">
                        <p>Recruiter Response</p>
                        <strong style={{ fontSize: '18px', color: '#f59e0b' }}>{company.responseRate}%</strong>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </aside>
            </motion.div>
          )}

          {/* ══════ KANBAN PIPELINE TAB ══════ */}
          {activeTab === 'pipeline' && (
            <motion.div 
              key="pipeline-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="kanban-controls">
                <div className="job-selector-wrapper">
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>Pipeline for:</span>
                  <select 
                    className="job-selector"
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(Number(e.target.value))}
                  >
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>
                
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Total pipeline candidates: <strong>{applications.length}</strong>
                </div>
              </div>

              <div className="kanban-board">
                {/* Columns Definition */}
                {(['new', 'screening', 'interview', 'offer', 'hired'] as const).map(stage => {
                  const stageApps = applications.filter(a => a.status === stage);
                  const displayNames = { new: 'Inbox', screening: 'Screening', interview: 'Interviewing', offer: 'Offered', hired: 'Hired' };
                  
                  return (
                    <div key={stage} className="kanban-column">
                      <div className="kanban-column-header">
                        <h4>{displayNames[stage]}</h4>
                        <span className="column-count">{stageApps.length}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {stageApps.map(app => (
                          <GlassCard key={app.id} className="kanban-card">
                            <div className="kanban-card-top">
                              <span className="kanban-card-name">{app.seekerName}</span>
                              <span className={`kanban-card-score ${app.matchScore >= 85 ? 'high' : 'mid'}`}>
                                {app.matchScore}%
                              </span>
                            </div>
                            
                            {app.skills && (
                              <div className="kanban-card-skills">
                                {app.skills.slice(0, 3).map(s => (
                                  <span key={s} className="kanban-card-skill">{s}</span>
                                ))}
                              </div>
                            )}

                            <div className="kanban-card-actions">
                              <select 
                                className="stage-select"
                                value={app.status}
                                onChange={e => updateApplicationStatus(app.jobId, app.seekerId, e.target.value as any)}
                              >
                                <option value="new">Inbox</option>
                                <option value="screening">Screening</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Reject</option>
                              </select>

                              <button 
                                onClick={() => updateApplicationStatus(app.jobId, app.seekerId, 'rejected')}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                              >
                                Reject
                              </button>
                            </div>
                          </GlassCard>
                        ))}
                        {stageApps.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '32px 8px', border: '1px dashed rgba(0,0,0,0.06)', borderRadius: '12px', color: '#94a3b8', fontSize: '12px' }}>
                            No candidates
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══════ LEADERBOARD TAB ══════ */}
          {activeTab === 'leaderboard' && (
            <motion.div 
              key="leaderboard-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="kanban-controls">
                <div className="job-selector-wrapper">
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>Rankings for:</span>
                  <select 
                    className="job-selector"
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(Number(e.target.value))}
                  >
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>
              </div>

              <GlassCard className="leaderboard-table-card">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>AI Match Score</th>
                      <th>Skills Profile</th>
                      <th>Date Applied</th>
                      <th>Current Stage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.sort((a, b) => b.matchScore - a.matchScore).map((app) => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>
                          {app.seekerName}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40px', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${app.matchScore}%`, background: app.matchScore >= 85 ? '#10b981' : '#f59e0b' }}></div>
                            </div>
                            <span style={{ fontWeight: 800, color: app.matchScore >= 85 ? '#10b981' : '#f59e0b' }}>
                              {app.matchScore}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {app.skills.map(s => (
                              <span key={s} className="kanban-card-skill" style={{ fontSize: '11px', background: 'rgba(14,165,233,0.05)', color: '#0ea5e9' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '13px' }}>
                          {app.appliedAt}
                        </td>
                        <td>
                          <span style={{ 
                            textTransform: 'uppercase', 
                            fontSize: '10px', 
                            fontWeight: 800, 
                            padding: '4px 8px', 
                            borderRadius: '999px',
                            background: app.status === 'hired' ? '#f0fdf4' : app.status === 'rejected' ? '#fef2f2' : '#f0f9ff',
                            color: app.status === 'hired' ? '#16a34a' : app.status === 'rejected' ? '#dc2626' : '#0369a1',
                            border: `1px solid ${app.status === 'hired' ? '#bbf7d0' : app.status === 'rejected' ? '#fca5a5' : '#bae6fd'}`
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <select 
                              className="stage-select"
                              value={app.status}
                              onChange={e => updateApplicationStatus(app.jobId, app.seekerId, e.target.value as any)}
                              style={{ padding: '2px 6px' }}
                            >
                              <option value="new">Inbox</option>
                              <option value="screening">Screening</option>
                              <option value="interview">Interview</option>
                              <option value="offer">Offer</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Reject</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                          No candidates found matching the active selection.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};
