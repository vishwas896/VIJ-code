'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Zap, Star, UserPlus, Bell, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface DropdownNotifItem {
  id: number;
  type: 'job' | 'action' | 'connection' | 'system';
  title: string;
  desc: string;
  time: string;
  color: string;
  priority?: boolean;
}

interface NotificationDropdownProps {
  notifications: DropdownNotifItem[];
  setNotifications: React.Dispatch<React.SetStateAction<DropdownNotifItem[]>>;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  notifications, 
  setNotifications, 
  onClose 
}) => {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'job' | 'connection' | 'system'>('all');

  const filtered = notifications.filter(n => filter === 'all' ? true : n.type === filter);

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
    <div className="notification-dropdown">
      <GlassCard className="notification-card-dropdown" glowingEdge="azure">
        <div className="notif-header">
          <div>
            <h3>Notifications</h3>
            <span className="notif-unread-count-lbl">{notifications.length} unread updates</span>
          </div>
          <button className="mark-read" onClick={() => setNotifications([])}>Clear</button>
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
          {filtered.length > 0 ? (
            filtered.map((n) => (
              <div 
                key={n.id} 
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
              </div>
            ))
          ) : (
            <div className="dd-notif-empty">
              <Bell size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <span>No new alerts here</span>
            </div>
          )}
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
    </div>
  );
};


