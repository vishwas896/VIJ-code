'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Video, Target, CreditCard, Users, 
  CheckCircle2, AlertCircle, ExternalLink, Lock, Unlock, 
  TrendingUp, Wallet, Award, Sparkles, HelpCircle, ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { useAuth } from '../context/AuthContext';
import './MyActivity.css';

interface ActivityLog {
  id: string;
  type: 'match' | 'interview' | 'financial' | 'social';
  timestamp: string;
  timeAgo: string;
  title: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
  // Recruiter Masked PII fields
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
}

export const MyActivity: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, walletBalance, addFunds, purchaseItem } = useAuth();
  
  const userRole = user?.role || 'seeker';
  const isRecruiter = userRole === 'recruiter';

  const [activeTab, setActiveTab] = useState<'all' | 'match' | 'interview' | 'financial' | 'social'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Trigger transient screen toast
  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Mock activity logs
  const activityLogs: ActivityLog[] = [
    {
      id: 'log-1',
      type: 'match',
      timestamp: '⏱ 12 mins ago',
      timeAgo: '12m',
      title: isRecruiter ? 'Top Talent Match Found' : '100% AI Alignment Match',
      description: isRecruiter 
        ? 'Arjun Patel scored 96% compatibility on your AI Research Scientist pipeline criteria.' 
        : 'Your profile has matched Google DeepMind\'s \'AI Product Engineer\' parameters perfectly.',
      actionText: isRecruiter ? 'Review Profile' : 'Apply Now',
      actionUrl: isRecruiter ? '/network' : '/jobs'
    },
    {
      id: 'log-2',
      type: 'interview',
      timestamp: '⏱ 1 hour ago',
      timeAgo: '1h',
      title: isRecruiter ? 'Candidate Interview Scheduled' : 'Interview Scheduled with Stripe',
      description: isRecruiter 
        ? 'Video room #402 has been provisioned for the AI/ML Specialist role interview on Friday.'
        : 'Video room #324 has been provisioned for your Senior UX Architect interview on Thursday at 2:00 PM.',
      actionText: isRecruiter ? 'View Feedback' : 'Enter Room',
      actionUrl: isRecruiter ? '/network' : '/services',
      candidateId: 'USR-104',
      candidateName: 'Sarah Chen',
      candidateEmail: 'sarah.chen@gatech.edu',
      candidatePhone: '+91 98765 43210'
    },
    {
      id: 'log-3',
      type: 'financial',
      timestamp: '⏱ 3 hours ago',
      timeAgo: '3h',
      title: isRecruiter ? 'Tokens Deposit Successful' : 'Premium Boost Package Purchased',
      description: isRecruiter
        ? 'Deposited 500 coins into your corporate wallet account (TxID: TX-90234).'
        : 'Successfully deducted 150 coins from your VIJ Wallet for 24h profile boost visibility.',
      actionText: 'Wallet Logs',
      actionUrl: '/wallet'
    },
    {
      id: 'log-4',
      type: 'social',
      timestamp: '⏱ 1 day ago',
      timeAgo: '1d',
      title: isRecruiter ? 'Recruitment Network Expanded' : 'Career Roadmap Forked',
      description: isRecruiter 
        ? 'Connected with 3 talent scouts from Apple and Microsoft in the Junction.'
        : 'Your \'React Architect Roadmap\' was shared and forked by 14 professionals in the network.',
      actionText: 'View Network',
      actionUrl: '/roadmaps'
    },
    {
      id: 'log-5',
      type: 'interview',
      timestamp: '⏱ 2 days ago',
      timeAgo: '2d',
      title: 'Interview Completed - Technical Round',
      description: isRecruiter 
        ? 'Evaluation logs are ready for candidate USR-202 (Senior Frontend Architect position).'
        : 'Stripe recruiter submitted positive evaluation feedback for your Senior UX Architect interview.',
      actionText: isRecruiter ? 'Review Assessment' : 'View Feedback',
      actionUrl: isRecruiter ? '/network' : '/seeker/dashboard',
      candidateId: 'USR-202',
      candidateName: 'Alex Rivera',
      candidateEmail: 'alex.rivera@stanford.edu',
      candidatePhone: '+91 91234 56789'
    }
  ];

  // Filter logs based on selection
  const filteredLogs = activityLogs.filter(log => activeTab === 'all' || log.type === activeTab);

  // Manage PII unlock state locally, but backed by wallet check
  const handleUnlockPII = (candidateId: string) => {
    const itemId = `pii-unlock-${candidateId}`;
    const alreadyUnlocked = user?.purchasedItems?.includes(itemId);

    if (alreadyUnlocked) {
      triggerToast('Candidate details already unlocked.');
      return;
    }

    if (walletBalance < 50) {
      triggerToast('Insufficient funds! Unlock requires 50 coins.', 'error');
      return;
    }

    // Deduct 50 coins & record purchase
    addFunds(-50);
    purchaseItem(itemId);
    triggerToast('PII Unlocked successfully! 🎉', 'success');
  };

  return (
    <div className="activity-dashboard-container">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`activity-toast ${toastType}`}
          >
            {toastType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="activity-dashboard-header">
        <h1>My Activity & Smart Analytics</h1>
        <p>Monitor your platform engagement, active milestones, and connections network.</p>
      </div>

      {/* ── SECTION 1: GLOBAL TOP RIBBON ── */}
      <div className="analytics-ribbon-grid">
        {!isRecruiter ? (
          <>
            {/* Seeker Card 1: Matches */}
            <GlassCard className="analytics-card" glowingEdge="azure" tilt={false}>
              <div className="analytics-card-header">
                <Target className="analytics-icon match" size={24} />
                <span className="analytics-label">System Matches</span>
              </div>
              <div className="analytics-value-wrap">
                <h3>94%</h3>
                <span className="analytics-trend positive">
                  <TrendingUp size={12} /> 12 listings
                </span>
              </div>
              <p className="analytics-desc">Perfect fit matches based on your skills criteria.</p>
            </GlassCard>

            {/* Seeker Card 2: Interviews */}
            <GlassCard className="analytics-card" glowingEdge="azure" tilt={false}>
              <div className="analytics-card-header">
                <Video className="analytics-icon interview" size={24} />
                <span className="analytics-label">Scheduled Interviews</span>
              </div>
              <div className="analytics-value-wrap">
                <h3>3</h3>
                <span className="analytics-trend info">Next: Thursday</span>
              </div>
              <p className="analytics-desc">Upcoming active video rooms for technical assessment.</p>
            </GlassCard>

            {/* Seeker Card 3: Learning Completion Radial Progress */}
            <GlassCard className="analytics-card radial-card" glowingEdge="azure" tilt={false}>
              <div className="radial-content-left">
                <div className="analytics-card-header">
                  <Award className="analytics-icon social" size={24} />
                  <span className="analytics-label">Learning Completion</span>
                </div>
                <h3>78%</h3>
                <p className="analytics-desc">Roadmaps modules completed.</p>
              </div>
              <div className="radial-progress-wrapper">
                <svg className="radial-svg" viewBox="0 0 36 36">
                  <path
                    className="radial-bg-circle"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="radial-fill-circle"
                    strokeDasharray="78, 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </GlassCard>
          </>
        ) : (
          <>
            {/* Recruiter Card 1: Pipelines */}
            <GlassCard className="analytics-card" glowingEdge="azure" tilt={false}>
              <div className="analytics-card-header">
                <Target className="analytics-icon match" size={24} />
                <span className="analytics-label">Active Parameter Pipelines</span>
              </div>
              <div className="analytics-value-wrap">
                <h3>8</h3>
                <span className="analytics-trend positive">Active Filters</span>
              </div>
              <p className="analytics-desc">Hiring algorithms monitoring seeker parameter sets.</p>
            </GlassCard>

            {/* Recruiter Card 2: Conversion Rate */}
            <GlassCard className="analytics-card" glowingEdge="azure" tilt={false}>
              <div className="analytics-card-header">
                <Video className="analytics-icon interview" size={24} />
                <span className="analytics-label">Hiring Conversion</span>
              </div>
              <div className="analytics-value-wrap">
                <h3>64%</h3>
                <span className="analytics-trend positive">Above Avg</span>
              </div>
              <div className="linear-progress-bar">
                <motion.div 
                  className="linear-progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="analytics-desc">Percentage of completed interviews leading to contract offers.</p>
            </GlassCard>

            {/* Recruiter Card 3: Wallet Analysis */}
            <GlassCard className="analytics-card sparkline-card" glowingEdge="azure" tilt={false}>
              <div className="sparkline-content-left">
                <div className="analytics-card-header">
                  <Wallet className="analytics-icon wallet" size={24} />
                  <span className="analytics-label">Wallet Balance</span>
                </div>
                <h3>{walletBalance} Coins</h3>
                <p className="analytics-desc">Available recruitment tokens.</p>
              </div>
              <div className="sparkline-graph-wrapper">
                <svg className="sparkline-svg" viewBox="0 0 100 40">
                  <motion.path
                    className="sparkline-line"
                    d="M0,35 Q15,10 30,28 T60,15 T90,30 L100,20"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                  <path
                    className="sparkline-line-dash"
                    d="M0,35 Q15,10 30,28 T60,15 T90,30 L100,20"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeOpacity="0.15"
                  />
                </svg>
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {/* ── SECTION 2: BENTO CONTAINER GRID ── */}
      <div className="activity-bento-grid">
        
        {/* LEFT COLUMN: ACTIVITY FEED */}
        <div className="bento-col-left">
          <GlassCard className="feed-panel-card" glowingEdge="none" tilt={false}>
            {/* Filter Header */}
            <div className="feed-header-filters">
              <h4>Activity Feed</h4>
              <div className="filter-pills-row">
                <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
                <button className={activeTab === 'match' ? 'active' : ''} onClick={() => setActiveTab('match')}>Matches</button>
                <button className={activeTab === 'interview' ? 'active' : ''} onClick={() => setActiveTab('interview')}>Interviews</button>
                <button className={activeTab === 'financial' ? 'active' : ''} onClick={() => setActiveTab('financial')}>Financial</button>
                <button className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}>Social</button>
              </div>
            </div>

            {/* List */}
            <div className="feed-items-list">
              <AnimatePresence mode="popLayout">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const isPIILocked = isRecruiter && log.candidateId && !user?.purchasedItems?.includes(`pii-unlock-${log.candidateId}`);
                    
                    return (
                      <motion.div 
                        key={log.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="feed-item-card"
                      >
                        {/* Context Icon */}
                        <div className={`feed-item-icon-wrap ${log.type}`}>
                          {log.type === 'match' && <Target size={18} />}
                          {log.type === 'interview' && <Video size={18} />}
                          {log.type === 'financial' && <CreditCard size={18} />}
                          {log.type === 'social' && <Users size={18} />}
                        </div>

                        {/* Details */}
                        <div className="feed-item-details">
                          <div className="feed-item-top-row">
                            <h5>{log.title}</h5>
                            <span className="feed-item-time">{log.timestamp}</span>
                          </div>
                          <p className="feed-item-description">{log.description}</p>

                          {/* Recruiter Masked PII Area */}
                          {isRecruiter && log.candidateId && (
                            <div className="pii-shield-box">
                              {isPIILocked ? (
                                <div className="pii-locked-overlay">
                                  <div className="locked-badge">
                                    <Lock size={12} />
                                    <span>Candidate PII Locked (Name, Email, Phone)</span>
                                  </div>
                                  <GlassButton 
                                    className="pii-unlock-btn" 
                                    variant="primary"
                                    onClick={() => handleUnlockPII(log.candidateId!)}
                                  >
                                    Unlock for 50 Coins
                                  </GlassButton>
                                </div>
                              ) : (
                                <motion.div 
                                  initial={{ opacity: 0 }} 
                                  animate={{ opacity: 1 }} 
                                  className="pii-unlocked-details"
                                >
                                  <div className="unlocked-header">
                                    <Unlock size={12} className="unlocked-icon" />
                                    <span>Unlocked Candidate Credentials</span>
                                  </div>
                                  <div className="pii-grid">
                                    <div><strong>Name:</strong> {log.candidateName}</div>
                                    <div><strong>Email:</strong> {log.candidateEmail}</div>
                                    <div><strong>Phone:</strong> {log.candidatePhone}</div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Link Button */}
                        {log.actionText && log.actionUrl && (
                          <div className="feed-item-action-wrapper">
                            <GlassButton
                              className="feed-action-btn"
                              variant="secondary"
                              onClick={() => router.push(log.actionUrl!)}
                            >
                              <span>{log.actionText}</span>
                              <ExternalLink size={12} />
                            </GlassButton>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="empty-feed-state">
                    <AlertCircle size={24} />
                    <p>No activity logs found for the selected category.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: NETWORK REACH MATRIX */}
        <div className="bento-col-right">
          <GlassCard className="network-panel-card" glowingEdge="none" tilt={false}>
            <h4>Network Reach Matrix</h4>
            <p className="network-subtitle">Interactive mapping of your professional ecosystem.</p>

            {/* Interactive Floating Node SVG Graph */}
            <div className="network-node-graph-area">
              <svg className="node-graph-svg" viewBox="0 0 200 200">
                {/* Connecting Lines */}
                <motion.line x1="100" y1="100" x2="40" y2="60" className="node-graph-line" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                <motion.line x1="100" y1="100" x2="160" y2="70" className="node-graph-line" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                <motion.line x1="100" y1="100" x2="60" y2="150" className="node-graph-line" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                <motion.line x1="100" y1="100" x2="140" y2="140" className="node-graph-line" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                
                {/* Secondary Connection Lines */}
                <line x1="40" y1="60" x2="20" y2="30" stroke="#64748b" strokeWidth="1" strokeOpacity="0.2" />
                <line x1="160" y1="70" x2="180" y2="40" stroke="#64748b" strokeWidth="1" strokeOpacity="0.2" />
                
                {/* Central Node (YOU) */}
                <motion.circle 
                  cx="100" 
                  cy="100" 
                  r="14" 
                  className="central-node"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.2 }}
                />
                <text x="100" y="103" className="node-text central" textAnchor="middle">YOU</text>

                {/* Node 1: Connections */}
                <motion.circle 
                  cx="40" 
                  cy="60" 
                  r="10" 
                  className="sub-node connections"
                  animate={{ y: [60, 56, 60] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  whileHover={{ r: 12, fill: '#0252D9' }}
                  onClick={() => triggerToast('Connections Node: Arjun Patel (1st)')}
                />
                <text x="40" y="63" className="node-text sub" textAnchor="middle">1st</text>

                {/* Node 2: Recruiters */}
                <motion.circle 
                  cx="160" 
                  cy="70" 
                  r="10" 
                  className="sub-node recruiters"
                  animate={{ y: [70, 74, 70] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
                  whileHover={{ r: 12, fill: '#059669' }}
                  onClick={() => triggerToast(isRecruiter ? 'Hiring Lead Node: David (1st)' : 'Recruiter Node: Alex (1st)')}
                />
                <text x="160" y="73" className="node-text sub" textAnchor="middle">2nd</text>

                {/* Node 3: Clients / Network Depth */}
                <motion.circle 
                  cx="60" 
                  cy="150" 
                  r="10" 
                  className="sub-node clients"
                  animate={{ y: [150, 146, 150] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                  whileHover={{ r: 12, fill: '#f59e0b' }}
                  onClick={() => triggerToast('3rd Degree Network: 140+ Professionals active')}
                />
                <text x="60" y="153" className="node-text sub" textAnchor="middle">3rd</text>

                {/* Node 4: Platform Activities */}
                <motion.circle 
                  cx="140" 
                  cy="140" 
                  r="10" 
                  className="sub-node social"
                  animate={{ y: [140, 144, 140] }}
                  transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.8 }}
                  whileHover={{ r: 12, fill: '#a855f7' }}
                  onClick={() => triggerToast('Recent Roadmaps Share Hub active')}
                />
                <text x="140" y="143" className="node-text sub" textAnchor="middle">Hub</text>
              </svg>
            </div>

            {/* Network Statistics Column */}
            <div className="network-stats-column">
              <div className="stat-row">
                <span className="stat-label">1st-Degree (Direct Contacts)</span>
                <span className="stat-count">24</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">2nd-Degree (Mutual Connections)</span>
                <span className="stat-count">140+</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">3rd-Degree (Network Depth)</span>
                <span className="stat-count">1.4K</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">News Hub Engagements</span>
                <span className="stat-count">18</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Roadmaps Share Rate</span>
                <span className="stat-count">4.8%</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
