'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Briefcase, Zap, UserPlus, Star, AlertCircle, 
  Check, Trash2, Settings, ShieldCheck, Mail, Volume2, 
  Smartphone, Filter, CheckSquare, Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import './Notifications.css';

export interface NotificationItem {
  id: string;
  type: 'job' | 'action' | 'connection' | 'system';
  priority: 'high' | 'normal';
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  color: string;
  categoryLabel: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { 
    id: 'notif-1', 
    type: 'job', 
    priority: 'high', 
    title: 'Urgent Match: Lead React Architect', 
    desc: 'Netflix (98% match) — Recruiter requested your profile application.', 
    time: '3m ago', 
    unread: true, 
    color: '#ef4444', 
    categoryLabel: 'Job Match' 
  },
  { 
    id: 'notif-2', 
    type: 'action', 
    priority: 'high', 
    title: 'Radar Alert: Near You', 
    desc: '5 recruiters and 3 staff developers just active near your location.', 
    time: '12m ago', 
    unread: true, 
    color: '#f59e0b', 
    categoryLabel: 'Radar Action' 
  },
  { 
    id: 'notif-3', 
    type: 'connection', 
    priority: 'normal', 
    title: 'Connection Invitation', 
    desc: 'Aarav Sharma (Staff Engineer at Google) wants to connect with you.', 
    time: '45m ago', 
    unread: true, 
    color: '#10b981', 
    categoryLabel: 'Network' 
  },
  { 
    id: 'notif-4', 
    type: 'system', 
    priority: 'normal', 
    title: 'Profile Boost Active', 
    desc: 'Your profile search visibility is successfully boosted for 24h.', 
    time: '2h ago', 
    unread: true, 
    color: '#a855f7', 
    categoryLabel: 'System' 
  },
  { 
    id: 'notif-5', 
    type: 'job', 
    priority: 'normal', 
    title: 'New Job Match: Full Stack Engineer', 
    desc: 'Microsoft Corp (88% match) is seeking candidates with your node.js skills.', 
    time: '5h ago', 
    unread: false, 
    color: '#0ea5e9', 
    categoryLabel: 'Job Match' 
  },
  { 
    id: 'notif-6', 
    type: 'connection', 
    priority: 'normal', 
    title: 'Connection Accepted', 
    desc: 'Priya Patel (Senior Product Designer) accepted your connection request.', 
    time: '1d ago', 
    unread: false, 
    color: '#10b981', 
    categoryLabel: 'Network' 
  },
  { 
    id: 'notif-7', 
    type: 'system', 
    priority: 'normal', 
    title: 'Security Update: Account Logged In', 
    desc: 'Successful login from Chrome on Windows - Bangalore, India.', 
    time: '2d ago', 
    unread: false, 
    color: '#6366f1', 
    categoryLabel: 'Security' 
  },
  { 
    id: 'notif-8', 
    type: 'job', 
    priority: 'normal', 
    title: 'New Job Match: WebRTC Lead Developer', 
    desc: 'Twilio Inc (91% match) added a role matching your video-room skills.', 
    time: '3d ago', 
    unread: false, 
    color: '#0ea5e9', 
    categoryLabel: 'Job Match' 
  }
];

export const Notifications: React.FC = () => {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'job' | 'connection' | 'system'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  
  // Quick settings toggles
  const [settingsToggles, setSettingsToggles] = useState({
    email: true,
    push: true,
    sound: false,
    radarAlerts: true
  });

  // Action responses
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const toggleReadStatus = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, unread: !item.unread } : item
    ));
  };

  const deleteNotification = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const markAllAsRead = () => {
    setItems(prev => prev.map(item => ({ ...item, unread: false })));
  };

  const clearAllNotifications = () => {
    setItems([]);
  };

  const handleAction = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'high' ? item.priority === 'high' :
      item.type === activeFilter;
    
    const matchesUnread = showUnreadOnly ? item.unread : true;
    
    return matchesFilter && matchesUnread;
  });

  const unreadCount = items.filter(item => item.unread).length;
  const highPriorityCount = items.filter(item => item.priority === 'high' && item.unread).length;

  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'job':
        return <Briefcase size={16} style={{ color }} />;
      case 'action':
        return <Zap size={16} style={{ color }} />;
      case 'connection':
        return <UserPlus size={16} style={{ color }} />;
      case 'system':
        return <Star size={16} style={{ color }} />;
      default:
        return <Bell size={16} style={{ color }} />;
    }
  };

  return (
    <PageTransition>
      <div className="notif-page-root">
        <div className="notif-page-container">
          
          {/* Action Feedback Banner */}
          <AnimatePresence>
            {actionFeedback && (
              <motion.div 
                className="action-feedback-toast"
                initial={{ opacity: 0, y: -40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
              >
                <ShieldCheck size={18} color="#10b981" />
                <span>{actionFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Dashboard Banner */}
          <motion.div 
            className="notif-page-header-card"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="notif-header-content">
              <div className="notif-title-area">
                <div className="notif-bell-ring">
                  <Bell size={28} className="ringing-bell" />
                  {unreadCount > 0 && <span className="bell-badge-count">{unreadCount}</span>}
                </div>
                <div>
                  <h1>Notifications Hub</h1>
                  <p>Stay up to date with job matches, connections, and system updates.</p>
                </div>
              </div>
              <div className="notif-header-actions">
                <button className="notif-link-btn" onClick={markAllAsRead} disabled={unreadCount === 0}>
                  <CheckSquare size={14} /> Mark all read
                </button>
                <button className="notif-link-btn danger" onClick={clearAllNotifications} disabled={items.length === 0}>
                  <Trash2 size={14} /> Clear all
                </button>
              </div>
            </div>

            {/* Quick Stats overview */}
            <div className="notif-stats-grid">
              <div className="notif-stat-box">
                <span className="stat-num">{items.length}</span>
                <span className="stat-label">Total Notifications</span>
              </div>
              <div className="notif-stat-box">
                <span className="stat-num unread-num">{unreadCount}</span>
                <span className="stat-label">Unread Updates</span>
              </div>
              <div className="notif-stat-box">
                <span className="stat-num urgent-num">{highPriorityCount}</span>
                <span className="stat-label">Urgent Alerts</span>
              </div>
            </div>
          </motion.div>

          <div className="notif-grid-layout">
            
            {/* Left Sidebar: Filter Controls */}
            <aside className="notif-sidebar-left">
              <GlassCard className="notif-filter-card" glowingEdge="azure">
                <h3 className="sidebar-section-title">
                  <Filter size={15} /> Filter Alerts
                </h3>
                
                <div className="filter-pill-list">
                  <button 
                    className={`filter-sidebar-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    <Bell size={16} />
                    <span>All Alerts</span>
                    <span className="filter-badge">{items.length}</span>
                  </button>

                  <button 
                    className={`filter-sidebar-btn ${activeFilter === 'high' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('high')}
                  >
                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                    <span style={{ fontWeight: activeFilter === 'high' ? '700' : '500' }}>Critical Action</span>
                    <span className="filter-badge urgent">{items.filter(item => item.priority === 'high').length}</span>
                  </button>

                  <button 
                    className={`filter-sidebar-btn ${activeFilter === 'job' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('job')}
                  >
                    <Briefcase size={16} />
                    <span>Job Matches</span>
                    <span className="filter-badge">{items.filter(item => item.type === 'job').length}</span>
                  </button>

                  <button 
                    className={`filter-sidebar-btn ${activeFilter === 'connection' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('connection')}
                  >
                    <UserPlus size={16} />
                    <span>Connections</span>
                    <span className="filter-badge">{items.filter(item => item.type === 'connection').length}</span>
                  </button>

                  <button 
                    className={`filter-sidebar-btn ${activeFilter === 'system' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('system')}
                  >
                    <Star size={16} />
                    <span>System Boosts</span>
                    <span className="filter-badge">{items.filter(item => item.type === 'system').length}</span>
                  </button>
                </div>

                <hr className="sidebar-divider" />

                {/* Show Unread Toggle */}
                <div className="unread-toggle-row">
                  <label className="switch-label" htmlFor="unread-toggle">
                    <span>Show Unread Only</span>
                    <span className="toggle-sub">Filter out previously read logs</span>
                  </label>
                  <button 
                    id="unread-toggle"
                    className={`glass-switch ${showUnreadOnly ? 'on' : ''}`}
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    aria-label="Toggle Show Unread Only"
                  >
                    <div className="switch-handle" />
                  </button>
                </div>
              </GlassCard>
            </aside>

            {/* Center Area: Notifications Feed List */}
            <main className="notif-feed-center">
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  <div className="notif-items-list">
                    {filteredItems.map((n) => (
                      <motion.div 
                        key={n.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className={`notif-feed-item-card ${n.priority === 'high' ? 'priority-high-border' : ''} ${n.unread ? 'unread' : 'read'}`}
                      >
                        <div className="notif-item-body">
                          
                          {/* Read Status Circle Toggle */}
                          <button 
                            className={`read-status-dot-btn ${n.unread ? 'unread' : 'read'}`}
                            onClick={() => toggleReadStatus(n.id)}
                            title={n.unread ? "Mark as read" : "Mark as unread"}
                          >
                            <span className="dot-circle" />
                          </button>

                          {/* Category Visual Badge Icon */}
                          <div className="notif-avatar-icon" style={{ background: `${n.color}15`, border: `1px solid ${n.color}33` }}>
                            {getIcon(n.type, n.color)}
                          </div>

                          {/* Content */}
                          <div className="notif-item-text">
                            <div className="notif-item-title-row">
                              <h4 className={n.unread ? 'bold-text' : ''}>{n.title}</h4>
                              <div className="notif-tags-time">
                                {n.priority === 'high' && <span className="priority-badge-label">Action Required</span>}
                                <span className="category-pill-tag" style={{ border: `1px solid ${n.color}22`, background: `${n.color}0b`, color: n.color }}>
                                  {n.categoryLabel}
                                </span>
                                <span className="time-text">{n.time}</span>
                              </div>
                            </div>
                            <p className="desc-text">{n.desc}</p>

                            {/* Conditional Action Triggers based on Alert category */}
                            {n.unread && (
                              <div className="notif-interactive-row">
                                {n.type === 'job' && (
                                  <>
                                    <GlassButton variant="primary" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => handleAction('Application details sent to Recruiter!')}>
                                      Apply Now
                                    </GlassButton>
                                    <GlassButton variant="secondary" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => handleAction('Job match details bookmarked.')}>
                                      Bookmark Job
                                    </GlassButton>
                                  </>
                                )}
                                {n.type === 'action' && (
                                  <GlassButton variant="primary" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => handleAction('Geohash Radar tracking open.')}>
                                    Open Radar Map
                                  </GlassButton>
                                )}
                                {n.type === 'connection' && (
                                  <>
                                    <GlassButton variant="primary" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => handleAction('Connection Invitation Accepted!')}>
                                      Accept Request
                                    </GlassButton>
                                    <GlassButton variant="secondary" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => handleAction('Invitation ignored.')}>
                                      Ignore
                                    </GlassButton>
                                  </>
                                )}
                                {n.type === 'system' && (
                                  <GlassButton variant="primary" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => handleAction('Navigating to profile customization dashboard.')}>
                                    Customize Visibility
                                  </GlassButton>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quick Card Controls (Mark Read, Delete) */}
                          <div className="notif-quick-actions">
                            <button 
                              className="action-icon-btn check" 
                              onClick={() => toggleReadStatus(n.id)}
                              title={n.unread ? "Mark as Read" : "Mark as Unread"}
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              className="action-icon-btn trash" 
                              onClick={() => deleteNotification(n.id)}
                              title="Delete notification"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    key="empty"
                    className="notif-empty-state-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="empty-state-glow-icon">
                      <Bell size={40} />
                    </div>
                    <h3>All caught up!</h3>
                    <p>No notifications match your current filter settings.</p>
                    <GlassButton variant="secondary" style={{ marginTop: '12px' }} onClick={() => { setActiveFilter('all'); setShowUnreadOnly(false); }}>
                      Reset filters
                    </GlassButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Right Sidebar: Notification Preferences Controls */}
            <aside className="notif-sidebar-right">
              <GlassCard className="notif-preferences-card" glowingEdge="azure">
                <h3 className="sidebar-section-title">
                  <Settings size={15} /> Preferences
                </h3>
                
                <div className="preferences-toggles-list">
                  
                  <div className="preference-toggle-item">
                    <div className="pref-icon-text">
                      <Mail size={16} />
                      <div>
                        <strong>Email Alerts</strong>
                        <small>Receive updates via inbox</small>
                      </div>
                    </div>
                    <button 
                      className={`glass-switch ${settingsToggles.email ? 'on' : ''}`}
                      onClick={() => setSettingsToggles(p => ({ ...p, email: !p.email }))}
                      aria-label="Toggle Email Alerts"
                    >
                      <div className="switch-handle" />
                    </button>
                  </div>

                  <div className="preference-toggle-item">
                    <div className="pref-icon-text">
                      <Smartphone size={16} />
                      <div>
                        <strong>Push Notifications</strong>
                        <small>Direct browser notifications</small>
                      </div>
                    </div>
                    <button 
                      className={`glass-switch ${settingsToggles.push ? 'on' : ''}`}
                      onClick={() => setSettingsToggles(p => ({ ...p, push: !p.push }))}
                      aria-label="Toggle Push Notifications"
                    >
                      <div className="switch-handle" />
                    </button>
                  </div>

                  <div className="preference-toggle-item">
                    <div className="pref-icon-text">
                      <Volume2 size={16} />
                      <div>
                        <strong>Audible Alerts</strong>
                        <small>Play alert chime instantly</small>
                      </div>
                    </div>
                    <button 
                      className={`glass-switch ${settingsToggles.sound ? 'on' : ''}`}
                      onClick={() => setSettingsToggles(p => ({ ...p, sound: !p.sound }))}
                      aria-label="Toggle Audible Alerts"
                    >
                      <div className="switch-handle" />
                    </button>
                  </div>

                  <div className="preference-toggle-item">
                    <div className="pref-icon-text">
                      <Zap size={16} />
                      <div>
                        <strong>Radar Match Pings</strong>
                        <small>Notify when matches active near you</small>
                      </div>
                    </div>
                    <button 
                      className={`glass-switch ${settingsToggles.radarAlerts ? 'on' : ''}`}
                      onClick={() => setSettingsToggles(p => ({ ...p, radarAlerts: !p.radarAlerts }))}
                      aria-label="Toggle Radar Match Pings"
                    >
                      <div className="switch-handle" />
                    </button>
                  </div>

                </div>

                <hr className="sidebar-divider" />

                <div className="boost-sidebar-banner">
                  <div className="boost-banner-glow-strip" />
                  <Sparkles size={16} color="#e9d5ff" />
                  <h4>Boost matching speed!</h4>
                  <p>Increase match alerts limits and geohash range by upgrading your Junction Tier.</p>
                  <GlassButton variant="primary" style={{ width: '100%', padding: '6px 12px', fontSize: '11px', marginTop: '8px' }}>
                    View Premium Plans
                  </GlassButton>
                </div>
              </GlassCard>
            </aside>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};

