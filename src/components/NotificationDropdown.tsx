'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Briefcase, Zap, Star, UserPlus, Bell, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface DropdownNotifItem {
  id: number;
  type: 'job' | 'action' | 'connection' | 'system';
  title: string;
  desc: string;
  time: string;
  color: string;
  priority?: boolean;
}

const INITIAL_NOTIFS: DropdownNotifItem[] = [
  { id: 1, type: 'job', title: 'New Match: Sr. Frontend Engineer', desc: 'Google (100% match)', time: '2m ago', color: '#0ea5e9', priority: true },
  { id: 2, type: 'action', title: 'Radar Alert: Near You', desc: '3 professionals just active near you', time: '15m ago', color: '#f59e0b', priority: true },
  { id: 3, type: 'connection', title: 'New Connection Request', desc: 'Talent Scout from Apple wants to connect', time: '1h ago', color: '#10b981' },
  { id: 4, type: 'system', title: 'Profile Boost Active', desc: 'Your profile visibility is now boosted for 24h', time: '3h ago', color: '#a855f7' },
];

export const NotificationDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const router = useRouter();
  const [items, setItems] = useState<DropdownNotifItem[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<'all' | 'job' | 'connection' | 'system'>('all');

  const filtered = items.filter(n => filter === 'all' ? true : n.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase size={13} />;
      case 'action': return <Zap size={13} />;
      case 'connection': return <UserPlus size={13} />;
      case 'system': return <Star size={13} />;
      default: return <Bell size={13} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="notification-dropdown"
    >
      <GlassCard className="notification-card-dropdown" glowingEdge="azure">
        <div className="notif-header">
          <div>
            <h3>Notifications</h3>
            <span className="notif-unread-count-lbl">{items.length} unread updates</span>
          </div>
          <button className="mark-read" onClick={() => setItems([])}>Clear</button>
        </div>

        {/* Dropdown Filters tabs */}
        <div className="notif-dropdown-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'job', label: 'Jobs' },
            { id: 'connection', label: 'Network' },
            { id: 'system', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`dd-tab-btn ${filter === tab.id ? 'active' : ''}`}
              onClick={() => setFilter(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="notif-list">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((n) => (
                <motion.div 
                  key={n.id} 
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`notif-item ${n.priority ? 'dd-priority-notif' : ''}`}
                  onClick={() => {
                    onClose();
                    router.push('/notifications');
                  }}
                >
                  <div className="notif-icon" style={{ backgroundColor: `${n.color}15`, color: n.color }}>
                    {getIcon(n.type)}
                  </div>
                  <div className="notif-content">
                    <div className="notif-title-row-dd">
                      <span className="notif-title">{n.title}</span>
                      {n.priority && <span className="dd-priority-tag">Urgent</span>}
                    </div>
                    <div className="notif-desc">{n.desc}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="dd-notif-empty">
                <Bell size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <span>No new alerts here</span>
              </div>
            )}
          </AnimatePresence>
        </div>
        
        <button 
          className="view-all-notif" 
          onClick={() => {
            onClose();
            router.push('/notifications');
          }}
        >
          <span>View all in Notifications Hub</span>
          <ArrowRight size={13} style={{ marginLeft: '6px' }} />
        </button>
      </GlassCard>
    </motion.div>
  );
};

