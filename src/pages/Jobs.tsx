import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Building2, DollarSign, Lightbulb,
  HelpCircle, ShieldCheck, ArrowRight, Bookmark, Lock,
  Eye, Zap, Code2, Palette, Megaphone, Landmark,
  HeartPulse, TrendingUp, BarChart3, Settings2,
  CheckCircle2, X, Send, Users, Clock, MapPin, Sparkles
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { useAuth, type UserDomain } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './Jobs.css';

/* ─── sidebar links ─── */
const sideLinks = [
  { icon: <Briefcase size={20} />, label: 'Jobs', active: true, to: '/jobs' },
  { icon: <Building2 size={20} />, label: 'Companies', active: false, to: '/companies' },
  { icon: <DollarSign size={20} />, label: 'Salaries', active: false, to: '/salary-insights' },
  { icon: <Lightbulb size={20} />, label: 'Career Advice', active: false, to: '/roadmaps' },
];

/* ─── marquee items ─── */
const marqueeItems = [
  { tag: 'Alert', tagColor: '#dd3a22', text: 'New public jobs available: 120+ open roles in Engineering and Design.' },
  { tag: 'News', tagColor: '#3b82f6', text: 'The 2026 AI Shift: How platform engineers are adapting to enterprise LLMs.' },
  { tag: 'Community', tagColor: '#16a34a', text: 'Join 2,400+ innovators worldwide collaborating on VIJ.' },
];

/* ─── domain filter config ─── */
const domainFilters: { value: UserDomain | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Domains', icon: <Sparkles size={14} /> },
  { value: 'engineering', label: 'Engineering', icon: <Code2 size={14} /> },
  { value: 'design', label: 'Design', icon: <Palette size={14} /> },
  { value: 'marketing', label: 'Marketing', icon: <Megaphone size={14} /> },
  { value: 'finance', label: 'Finance', icon: <Landmark size={14} /> },
  { value: 'healthcare', label: 'Healthcare', icon: <HeartPulse size={14} /> },
  { value: 'sales', label: 'Sales', icon: <TrendingUp size={14} /> },
  { value: 'data-science', label: 'Data Science', icon: <BarChart3 size={14} /> },
  { value: 'operations', label: 'Operations', icon: <Settings2 size={14} /> },
];

/* ─── job cards data ─── */
interface JobData {
  id: number;
  domain: UserDomain;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  isHourly?: boolean;
  mode: string;
  modeColor: string;
  skills: string[];
  postedAgo: string;
  applicants: number;
}

const allJobs: JobData[] = [
  { id: 1, domain: 'engineering', title: 'Senior Software Engineer (Platform)', company: 'Nexus Core Technologies', location: 'San Francisco, CA', type: 'Full-time', salaryMin: 180000, salaryMax: 240000, mode: 'Hybrid', modeColor: 'blue', skills: ['React', 'TypeScript', 'Go'], postedAgo: '2h ago', applicants: 142 },
  { id: 2, domain: 'design', title: 'Lead Product Designer', company: 'Synthetix Labs', location: 'Remote', type: 'Contract', salaryMin: 150, salaryMax: 210, isHourly: true, mode: 'Remote', modeColor: 'green', skills: ['Figma', 'Design Systems', 'Prototyping'], postedAgo: '5h ago', applicants: 89 },
  { id: 3, domain: 'engineering', title: 'Backend Engineer — Rust', company: 'QuantumGrid Inc.', location: 'Austin, TX', type: 'Full-time', salaryMin: 160000, salaryMax: 220000, mode: 'On-site', modeColor: 'blue', skills: ['Rust', 'Postgres', 'gRPC'], postedAgo: '1d ago', applicants: 67 },
  { id: 4, domain: 'marketing', title: 'Growth Marketing Manager', company: 'Bloom Digital', location: 'New York, NY', type: 'Full-time', salaryMin: 120000, salaryMax: 160000, mode: 'Hybrid', modeColor: 'blue', skills: ['SEO', 'Google Ads', 'Analytics'], postedAgo: '3h ago', applicants: 203 },
  { id: 5, domain: 'finance', title: 'Senior Financial Analyst', company: 'Apex Capital Group', location: 'Chicago, IL', type: 'Full-time', salaryMin: 130000, salaryMax: 175000, mode: 'On-site', modeColor: 'blue', skills: ['Financial Modeling', 'Excel', 'SQL'], postedAgo: '6h ago', applicants: 118 },
  { id: 6, domain: 'healthcare', title: 'Clinical Data Scientist', company: 'MedVantage AI', location: 'Boston, MA', type: 'Full-time', salaryMin: 145000, salaryMax: 195000, mode: 'Hybrid', modeColor: 'blue', skills: ['Python', 'Clinical Trials', 'NLP'], postedAgo: '1d ago', applicants: 54 },
  { id: 7, domain: 'sales', title: 'Enterprise Account Executive', company: 'CloudScale Solutions', location: 'Remote', type: 'Full-time', salaryMin: 110000, salaryMax: 180000, mode: 'Remote', modeColor: 'green', skills: ['Salesforce', 'SaaS', 'Negotiation'], postedAgo: '4h ago', applicants: 176 },
  { id: 8, domain: 'data-science', title: 'ML Engineer — LLM Infra', company: 'DeepForge Labs', location: 'San Jose, CA', type: 'Full-time', salaryMin: 200000, salaryMax: 280000, mode: 'Hybrid', modeColor: 'blue', skills: ['PyTorch', 'CUDA', 'Transformers'], postedAgo: '8h ago', applicants: 231 },
  { id: 9, domain: 'operations', title: 'Supply Chain Ops Manager', company: 'GlobalLink Logistics', location: 'Dallas, TX', type: 'Full-time', salaryMin: 95000, salaryMax: 135000, mode: 'On-site', modeColor: 'blue', skills: ['SAP', 'Lean Six Sigma', 'Forecasting'], postedAgo: '2d ago', applicants: 45 },
  { id: 10, domain: 'engineering', title: 'iOS Engineer (SwiftUI)', company: 'AppVerse Studios', location: 'Remote', type: 'Full-time', salaryMin: 155000, salaryMax: 200000, mode: 'Remote', modeColor: 'green', skills: ['Swift', 'SwiftUI', 'CoreData'], postedAgo: '12h ago', applicants: 98 },
  { id: 11, domain: 'design', title: 'UX Research Lead', company: 'UserPulse Co.', location: 'Seattle, WA', type: 'Full-time', salaryMin: 140000, salaryMax: 185000, mode: 'Hybrid', modeColor: 'blue', skills: ['User Interviews', 'Analytics', 'Figma'], postedAgo: '1d ago', applicants: 72 },
  { id: 12, domain: 'marketing', title: 'Content Strategy Director', company: 'NarrativeWorks', location: 'Remote', type: 'Full-time', salaryMin: 135000, salaryMax: 170000, mode: 'Remote', modeColor: 'green', skills: ['Content Strategy', 'SEO', 'Copywriting'], postedAgo: '3d ago', applicants: 158 },
  { id: 13, domain: 'finance', title: 'VP of FP&A', company: 'Horizon Ventures', location: 'New York, NY', type: 'Full-time', salaryMin: 200000, salaryMax: 280000, mode: 'On-site', modeColor: 'blue', skills: ['FP&A', 'Board Reporting', 'M&A'], postedAgo: '5h ago', applicants: 34 },
  { id: 14, domain: 'data-science', title: 'Data Analyst — Product', company: 'InsightGrid', location: 'Denver, CO', type: 'Full-time', salaryMin: 95000, salaryMax: 130000, mode: 'Hybrid', modeColor: 'blue', skills: ['SQL', 'Tableau', 'Python'], postedAgo: '2d ago', applicants: 189 },
  { id: 15, domain: 'healthcare', title: 'Health Informatics Engineer', company: 'CareSync Health', location: 'Remote', type: 'Contract', salaryMin: 130, salaryMax: 180, isHourly: true, mode: 'Remote', modeColor: 'green', skills: ['HL7 FHIR', 'AWS', 'Python'], postedAgo: '1d ago', applicants: 41 },
  { id: 16, domain: 'sales', title: 'SDR Team Lead', company: 'PipelineForce', location: 'Miami, FL', type: 'Full-time', salaryMin: 85000, salaryMax: 120000, mode: 'Hybrid', modeColor: 'blue', skills: ['Outreach', 'HubSpot', 'Cold Calling'], postedAgo: '6h ago', applicants: 92 },
];

/* ─── trending skills ─── */
const trendingSkills = [
  { name: 'Generative AI', pct: '+42%', color: '#dd3a22', bright: true },
  { name: 'Quantum Engineering', pct: '+18%', color: '#3b82f6', bright: true },
  { name: 'Next.js 15 Expert', pct: '+12%', color: '#d4d4d8', bright: false },
];

const barHeights = [40, 60, 45, 75, 100, 55];

const domainIcons: Record<string, React.ReactNode> = {
  engineering: <Code2 size={28} />, design: <Palette size={28} />,
  marketing: <Megaphone size={28} />, finance: <Landmark size={28} />,
  healthcare: <HeartPulse size={28} />, sales: <TrendingUp size={28} />,
  'data-science': <BarChart3 size={28} />, operations: <Settings2 size={28} />,
};

export const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, applyToJob, hasApplied } = useAuth();
  const { formatCurrency } = useCurrency();
  const [saved, setSaved] = useState<Record<number,boolean>>({});
  const [activeDomain, setActiveDomain] = useState<UserDomain | 'all'>(
    isAuthenticated && user?.domain ? user.domain : 'all'
  );
  const [applyModalJob, setApplyModalJob] = useState<JobData | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [justApplied, setJustApplied] = useState<number | null>(null);

  const toggleSave = (id: number) => setSaved(p => ({ ...p, [id]: !p[id] }));

  const filteredJobs = useMemo(() => {
    if (activeDomain === 'all') return allJobs;
    return allJobs.filter(j => j.domain === activeDomain);
  }, [activeDomain]);

  const handleApplyClick = (job: JobData) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setApplyModalJob(job);
  };

  const confirmApply = () => {
    if (applyModalJob) {
      applyToJob(applyModalJob.id);
      setJustApplied(applyModalJob.id);
      setTimeout(() => setJustApplied(null), 2000);
      setApplyModalJob(null);
    }
  };

  return (
    <PageTransition>
      <div className="exp-root">

        {/* ══════ JOBS PHOTO BANNER ══════ */}
        <div className="jobs-photo-banner">
          <div className="jobs-photo-banner-inner">
            {[
              { src: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80&auto=format&fit=crop', label: 'Office Culture' },
              { src: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&q=80&auto=format&fit=crop', label: 'Work From Home' },
              { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&auto=format&fit=crop', label: 'Team Synergy' },
              { src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80&auto=format&fit=crop', label: 'Career Growth' },
              { src: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80&auto=format&fit=crop', label: 'Remote Work' },
            ].map((p, i) => (
              <div key={i} className="jobs-banner-photo">
                <img src={p.src} alt={p.label} loading="lazy" />
                <span>{p.label}</span>
              </div>
            ))}
          </div>
          <div className="jobs-banner-text">
            <h2>Find work that <span>excites you</span></h2>
            <p>1,200+ active roles across India's top companies — remote, hybrid & in-office.</p>
          </div>
        </div>

        {/* ══════ MARQUEE NOTIFICATION BAR ══════ */}
        <div className="exp-marquee-bar">
          <div className="exp-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="exp-marquee-item">
                <span className="exp-marquee-tag" style={{ background: item.tagColor }}>{item.tag}</span>
                <span className="exp-marquee-text">{item.text}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══════ 3-COLUMN LAYOUT ══════ */}
        <div className="exp-columns">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="exp-sidebar">
            {!isAuthenticated && (
              <div className="exp-sidebar-cta-box">
                <p className="exp-sidebar-cta-label">Get Access</p>
                <p className="exp-sidebar-cta-sub">Sign up to apply for jobs &amp; unlock profiles.</p>
              </div>
            )}

            <nav className="exp-sidebar-nav">
              {sideLinks.map(link => (
                <a
                  key={link.label}
                  className={`exp-sidebar-link ${link.active ? 'active' : ''}`}
                  onClick={() => navigate(link.to)}
                >
                  {link.icon} {link.label}
                </a>
              ))}
            </nav>

            {!isAuthenticated && (
              <button className="exp-sidebar-start-btn" onClick={() => navigate('/register')}>
                Get Started <ArrowRight size={14} />
              </button>
            )}

            <div className="exp-sidebar-bottom">
              <a className="exp-sidebar-link"><HelpCircle size={20} /> Help Center</a>
              <a className="exp-sidebar-link"><ShieldCheck size={20} /> Privacy</a>
            </div>
          </aside>

          {/* ── MAIN FEED ── */}
          <main className="exp-feed">
            <div className="exp-feed-inner">

              {/* Hero Banner */}
              <motion.section
                className="exp-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <div className="exp-hero-overlay">
                  {isAuthenticated ? (
                    <>
                      <span className="exp-hero-badge success-badge">Welcome back, {user?.name.split(' ')[0]}</span>
                      <h1 className="exp-hero-title">Your next milestone awaits.</h1>
                      <p className="exp-hero-sub">We've found {filteredJobs.length} roles in your domain.</p>
                    </>
                  ) : (
                    <>
                      <span className="exp-hero-badge">Guest View Active</span>
                      <h1 className="exp-hero-title">Discover your next evolution.</h1>
                      <p className="exp-hero-sub">Join 2M+ professionals finding their peak potential on VIJ.</p>
                    </>
                  )}
                </div>
              </motion.section>

              {/* ── Domain Filter Chips ── */}
              <div className="exp-domain-filters">
                {domainFilters.map(df => (
                  <button
                    key={df.value}
                    className={`exp-domain-chip ${activeDomain === df.value ? 'active' : ''}`}
                    onClick={() => setActiveDomain(df.value)}
                  >
                    {df.icon}
                    <span>{df.label}</span>
                    {activeDomain === df.value && isAuthenticated && df.value === user?.domain && (
                      <span className="exp-domain-yours">Your Domain</span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Job Cards ── */}
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job, i) => {
                  const applied = hasApplied(job.id);
                  const wasJustApplied = justApplied === job.id;
                  return (
                    <motion.div
                      key={job.id}
                      className="exp-job-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                      layout
                    >
                      <div className="exp-job-left">
                        <div className="exp-job-icon">{domainIcons[job.domain] || <Zap size={28} />}</div>
                        <div>
                          <h3 className="exp-job-title">{job.title}</h3>
                          <p className="exp-job-company">{job.company} • {job.location}</p>
                          <div className="exp-job-chips">
                            <span className="exp-chip">{job.type}</span>
                            <span className="exp-chip">
                              {formatCurrency(job.salaryMin, true)} - {formatCurrency(job.salaryMax, true)}{job.isHourly ? ' /hr' : ''}
                            </span>
                            <span className={`exp-chip mode-${job.modeColor}`}>{job.mode}</span>
                          </div>
                          <div className="exp-job-skills">
                            {job.skills.map(s => (
                              <span key={s} className="exp-skill-chip">{s}</span>
                            ))}
                          </div>
                          <div className="exp-job-meta-row">
                            <span className="exp-meta-item"><Clock size={12} /> {job.postedAgo}</span>
                            <span className="exp-meta-item"><Users size={12} /> {job.applicants} applicants</span>
                          </div>
                        </div>
                      </div>
                      <div className="exp-job-actions">
                        <button
                          className={`exp-bookmark ${saved[job.id] ? 'saved' : ''}`}
                          onClick={() => toggleSave(job.id)}
                        >
                          <Bookmark size={18} fill={saved[job.id] ? '#dd3a22' : 'none'} />
                        </button>

                        {applied || wasJustApplied ? (
                          <motion.button
                            className="exp-apply-btn applied"
                            initial={wasJustApplied ? { scale: 0.8 } : false}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle2 size={15} />
                            <span>Applied</span>
                          </motion.button>
                        ) : (
                          <button
                            className="exp-apply-btn"
                            onClick={() => handleApplyClick(job)}
                          >
                            <Send size={14} />
                            <span>Apply</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredJobs.length === 0 && (
                <div className="exp-empty-state">
                  <Eye size={40} />
                  <h3>No jobs in this domain yet</h3>
                  <p>Try switching to "All Domains" to see all open roles.</p>
                </div>
              )}

              {/* News Card */}
              <motion.div
                className="exp-news-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => navigate('/news')}
              >
                <div className="exp-news-img">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" 
                    alt="The 2026 AI Shift" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </div>
                <div className="exp-news-body">
                  <span className="exp-news-label">Industry Insights</span>
                  <h3 className="exp-news-title">The 2026 AI Shift</h3>
                  <p className="exp-news-desc">How platform engineers are adapting to the explosion of LLM deployments in enterprise architecture.</p>
                  <span className="exp-news-link">
                    Read full article <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>

              {/* Locked Premium Card - Hide if authenticated */}
              {!isAuthenticated && (
                <motion.div
                  className="exp-locked-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <div className="exp-locked-glow" />
                  <div className="exp-locked-inner">
                    <div className="exp-locked-badge">
                      <Lock size={18} />
                      <span>Restricted Data</span>
                    </div>
                    <h3 className="exp-locked-title">Premium Market Intelligence</h3>
                    <p className="exp-locked-desc">Access salary benchmarks, competitor headcount trends, and hiring velocity reports powered by VIJ Data.</p>
                    <button className="exp-locked-btn" onClick={() => navigate('/register')}>
                      Unlock with a free account
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </main>

          {/* ── RIGHT INSIGHTS PANEL ── */}
          <aside className="exp-insights">
            {!isAuthenticated && (
              <div className="exp-insight-cta">
                <h4>Elevate your career</h4>
                <p>Create a profile to get personalized job recommendations and salary insights.</p>
                <button className="exp-insight-cta-primary" onClick={() => navigate('/register')}>Create Account</button>
                <button className="exp-insight-cta-secondary">Browse Limited Access</button>
              </div>
            )}

            <div className="exp-insight-section">
              <h5 className="exp-insight-label">Global Trending Skills</h5>
              <div className="exp-skills-list">
                {trendingSkills.map(skill => (
                  <div key={skill.name} className={`exp-skill-row ${!skill.bright ? 'dim' : ''}`}>
                    <div className="exp-skill-name">
                      <span className="exp-skill-dot" style={{ background: skill.color }} />
                      <span>{skill.name}</span>
                    </div>
                    <span className={`exp-skill-pct ${skill.bright ? 'green' : ''}`}>{skill.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="exp-insight-section exp-pulse-card">
              <h5 className="exp-insight-label">Market Match Pulse</h5>
              <div className="exp-pulse-bars">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`exp-pulse-bar ${i === 4 ? 'pulse' : ''}`}
                    style={{ height: `${h}%`, opacity: 0.2 + (h / 100) * 0.8 }}
                  />
                ))}
              </div>
              <div className="exp-pulse-footer">
                <span className="exp-pulse-label">Hiring Velocity</span>
                <span className="exp-pulse-value">Accelerating</span>
              </div>
            </div>

            <div className="exp-insight-footer">
              <div className="exp-insight-footer-links">
                <a>Privacy Policy</a>
                <a>Cookie Policy</a>
                <a>User Agreement</a>
              </div>
              <p>© 2026 Virtual Intelligent Junction</p>
            </div>
          </aside>
        </div>
      </div>

      {/* ══════ APPLY CONFIRMATION MODAL ══════ */}
      <AnimatePresence>
        {applyModalJob && (
          <motion.div
            className="exp-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setApplyModalJob(null)}
          >
            <motion.div
              className="exp-modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="exp-modal-close" onClick={() => setApplyModalJob(null)}><X size={20} /></button>
              <div className="exp-modal-icon">{domainIcons[applyModalJob.domain]}</div>
              <h2 className="exp-modal-title">Apply to this role?</h2>
              <h3 className="exp-modal-job-title">{applyModalJob.title}</h3>
              <p className="exp-modal-company">{applyModalJob.company} • {applyModalJob.location}</p>
              <div className="exp-modal-details">
                <span><MapPin size={14} /> {applyModalJob.mode}</span>
                <span><DollarSign size={14} /> {formatCurrency(applyModalJob.salaryMin, true)} - {formatCurrency(applyModalJob.salaryMax, true)}</span>
                <span><Users size={14} /> {applyModalJob.applicants} applicants</span>
              </div>
              <div className="exp-modal-resume-hint">
                <Sparkles size={16} />
                <span>Your VIJ profile will be shared with the recruiter</span>
              </div>
              <div className="exp-modal-actions">
                <button className="exp-modal-cancel" onClick={() => setApplyModalJob(null)}>Cancel</button>
                <button className="exp-modal-confirm" onClick={confirmApply}>
                  <Send size={16} /> Confirm Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ LOGIN PROMPT MODAL ══════ */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="exp-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              className="exp-modal exp-modal-login"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="exp-modal-close" onClick={() => setShowLoginPrompt(false)}><X size={20} /></button>
              <div className="exp-modal-lock-icon"><Lock size={32} /></div>
              <h2 className="exp-modal-title">Sign in to Apply</h2>
              <p className="exp-modal-desc">Create a free account to apply for jobs, save listings, and get matched with top companies.</p>
              <div className="exp-modal-actions">
                <button className="exp-modal-confirm" onClick={() => navigate('/register')}>
                  Create Free Account <ArrowRight size={16} />
                </button>
                <button className="exp-modal-cancel" onClick={() => navigate('/login')}>
                  Already have an account? Log in
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PageTransition>
  );
};
