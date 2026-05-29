'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, TrendingUp, Users, MessageSquare, Bell, Search, 
  MapPin, Clock, DollarSign,
  Eye, Send, CheckCircle2, Layout, Plus, Filter, UserPlus
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { PageTransition } from '../components/common/PageTransition';
import { VijLogo } from '../components/common/VijLogo';
import { useAuth } from '../context/AuthContext';
import './SeekerDashboard.css';

export const SeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const [dashboardCustomization, setDashboardCustomization] = React.useState({
    showJobAnalytics: true,
    showProfileViews: true,
    showApplications: true,
    showAISuggestions: true,
    showIndustryTrends: true
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`vij_dashboard_customization_${user?.id || 'guest'}`);
      if (saved) {
        try {
          setDashboardCustomization(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user]);

  const matches = [
    {
      id: 1,
      title: "AI Product Engineer",
      company: "Google DeepMind",
      matchScore: 94,
      salary: "₹18L – ₹24L",
      location: "Remote",
      skills: ["React", "TensorFlow", "Node.js"],
      posted: "2h ago"
    },
    {
      id: 2,
      title: "Senior UX Architect",
      company: "Stripe",
      matchScore: 89,
      salary: "₹22L – ₹30L",
      location: "Hybrid (Bangalore)",
      skills: ["Figma", "Design Systems", "A/B Testing"],
      posted: "5h ago"
    },
    {
      id: 3,
      title: "Fullstack Web3 Developer",
      company: "Polygon",
      matchScore: 82,
      salary: "₹15L – ₹20L",
      location: "Remote",
      skills: ["Solidity", "Next.js", "Ethereum"],
      posted: "1d ago"
    }
  ];

  return (
    <PageTransition>
      <div className="seeker-dashboard-container">
        
        {/* --- TOP NAVIGATION --- */}
        <nav className="dashboard-nav">
          <div className="nav-left">
            <VijLogo size="sm" showText={false} />
            <div className="search-bar-glass">
              <Search size={18} />
              <input type="text" placeholder="Search matches, companies..." />
            </div>
          </div>
          <div className="nav-right">
            <button className="nav-icon-btn"><MessageSquare size={20} /><span className="badge">3</span></button>
            <button className="nav-icon-btn"><Bell size={20} /><span className="badge">1</span></button>
            <div className="profile-pill">
              <div className="profile-strength-mini">84%</div>
              <div className="avatar-circle">V</div>
            </div>
          </div>
        </nav>

        <main className="dashboard-main">
          
          {/* --- HERO SECTION --- */}
          <section className="hero-section">
            <div className="hero-content">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
              >
                Good evening, Vishwas 👋
              </motion.h1>
              <p>Your match engine found 12 new opportunities today.</p>
            </div>
            <div className="hero-actions">
              <GlassButton variant="primary"><Plus size={18} /> Add Resume</GlassButton>
            </div>
          </section>

          <div className="dashboard-grid">
            
            {/* --- LEFT COLUMN: MATCHES --- */}
            <div className="grid-left">
              <header className="section-header">
                <h3>Recommended Matches</h3>
                <div className="header-filters">
                  <button className="filter-chip active">All</button>
                  <button className="filter-chip">Remote</button>
                  <button className="filter-chip">High Match</button>
                  <Filter size={18} className="filter-icon" />
                </div>
              </header>

              <div className="match-cards-container">
                {matches.map((job, i) => (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="job-match-card">
                      <div className="card-top">
                        <div className="match-score">
                          <div className="score-ring">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <path className="circle" strokeDasharray={`${job.matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="score-text">{job.matchScore}%</span>
                          </div>
                          <span>Match</span>
                        </div>
                        <div className="job-info">
                          <h4>{job.title}</h4>
                          <p>{job.company}</p>
                        </div>
                        <button className="quick-apply-btn">Quick Apply</button>
                      </div>
                      
                      <div className="card-details">
                        <div className="detail-item"><DollarSign size={14} /> {job.salary}</div>
                        <div className="detail-item"><MapPin size={14} /> {job.location}</div>
                        <div className="detail-item"><Clock size={14} /> {job.posted}</div>
                      </div>

                      <div className="skill-overlap">
                        {job.skills.map(skill => (
                          <span key={skill} className="overlap-tag">{skill}</span>
                        ))}
                        <span className="overlap-count">+4 more overlap</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* --- RIGHT COLUMN: ANALYTICS & WIDGETS --- */}
            <div className="grid-right">
              
              {/* Analytics Hub */}
              {(dashboardCustomization.showProfileViews || dashboardCustomization.showApplications || dashboardCustomization.showJobAnalytics) && (
                <div className="analytics-section">
                  <h3>Personal Analytics</h3>
                  <div className="analytics-grid">
                    {dashboardCustomization.showProfileViews && (
                      <div className="analytics-card">
                        <div className="card-label">Profile Views <Eye size={14} /></div>
                        <div className="card-value">128</div>
                        <div className="card-trend up"><TrendingUp size={12} /> 12%</div>
                      </div>
                    )}
                    {dashboardCustomization.showApplications && (
                      <div className="analytics-card">
                        <div className="card-label">Applications <Send size={14} /></div>
                        <div className="card-value">42</div>
                        <div className="card-trend">Stable</div>
                      </div>
                    )}
                    {dashboardCustomization.showJobAnalytics && (
                      <>
                        <div className="analytics-card">
                          <div className="card-label">Response Rate <Zap size={14} /></div>
                          <div className="card-value">18%</div>
                          <div className="card-trend up"><TrendingUp size={12} /> 5%</div>
                        </div>
                        <div className="analytics-card">
                          <div className="card-label">Skill Trends <TrendingUp size={14} /></div>
                          <div className="card-value">+12%</div>
                          <div className="card-sub">React demand</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Strength Widget */}
              {dashboardCustomization.showAISuggestions && (
                <GlassCard className="profile-strength-widget">
                  <div className="widget-header">
                    <div className="strength-progress">
                      <div className="strength-fill" style={{ width: '84%' }} />
                    </div>
                    <span className="strength-value">84% Strength</span>
                  </div>
                  <h4>Complete your identity</h4>
                  <p>Profiles with 95%+ strength get 4x more visibility.</p>
                  <ul className="suggestion-list">
                    <li><Plus size={14} /> Add your portfolio link</li>
                    <li><Plus size={14} /> Verify your email address</li>
                    <li><CheckCircle2 size={14} className="done" /> Phone verified</li>
                  </ul>
                </GlassCard>
              )}

              {/* Networking Snapshot */}
              {dashboardCustomization.showIndustryTrends && (
                <div className="networking-snapshot">
                  <div className="section-header">
                    <h3>Network</h3>
                    <button className="view-all">View Map</button>
                  </div>
                  <div className="network-cards">
                    {[1, 2].map(i => (
                      <div key={i} className="network-mini-card">
                        <div className="avatar-mini">J</div>
                        <div className="mini-info">
                          <h5>John Doe</h5>
                          <span>Principal at Google</span>
                        </div>
                        <button className="connect-btn"><UserPlus size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </main>

        {/* --- MOBILE BOTTOM NAV --- */}
        <nav className="mobile-bottom-nav">
          <button className="mobile-nav-item active"><Layout size={24} /><span>Home</span></button>
          <button className="mobile-nav-item"><Search size={24} /><span>Jobs</span></button>
          <button className="mobile-nav-item center"><div className="scan-btn"><Zap size={24} /></div></button>
          <button className="mobile-nav-item"><MessageSquare size={24} /><span>Inbox</span></button>
          <button className="mobile-nav-item"><Users size={24} /><span>Network</span></button>
        </nav>

      </div>
    </PageTransition>
  );
};

