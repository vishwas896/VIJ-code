'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Users, Briefcase, 
  DollarSign, ExternalLink, ArrowRight
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ChatItem {
  id: number;
  name: string;
  role: string;
  lastMsg: string;
  time: string;
  online: boolean;
  unread: boolean;
  avatar: string;
}

const connectionChats: ChatItem[] = [
  { id: 1, name: 'Sarah Chen', role: 'Fullstack Dev • Friend', lastMsg: 'Did you see the new roadmap?', time: '1h', online: true, unread: true, avatar: 'SC' },
  { id: 2, name: 'Arjun Patel', role: 'AI Researcher', lastMsg: 'Let\'s catch up at the tech meetup.', time: '3h', online: true, unread: false, avatar: 'AP' },
  { id: 3, name: 'Karan Sharma', role: 'Designer', lastMsg: 'Sent you the Figma files.', time: '1d', online: false, unread: false, avatar: 'KS' }
];

const recruiterChats: ChatItem[] = [
  { id: 4, name: 'Alex Rivera', role: 'Sr. Recruiter @ Google', lastMsg: 'Your profile matches our latest opening!', time: '2m', online: true, unread: true, avatar: 'AR' },
  { id: 5, name: 'David Miller', role: 'Talent Lead @ Apple', lastMsg: 'Can we hop on a brief call tomorrow?', time: '4h', online: true, unread: false, avatar: 'DM' },
  { id: 6, name: 'Sophia Wang', role: 'HR Specialist @ Stripe', lastMsg: 'Thanks for submitting your resume.', time: '2d', online: false, unread: false, avatar: 'SW' }
];

const clientChats: ChatItem[] = [
  { id: 7, name: 'John Doe', role: 'Product Manager @ Acme', lastMsg: 'Milestone 1 has been approved and paid.', time: '15m', online: true, unread: true, avatar: 'JD' },
  { id: 8, name: 'Emma Watson', role: 'Founder @ DesignSpace', lastMsg: 'Can you update the dashboard views?', time: '5h', online: false, unread: false, avatar: 'EW' },
  { id: 9, name: 'James Wilson', role: 'Director @ InnovaTech', lastMsg: 'Here is the contract for the next sprint.', time: '1d', online: true, unread: false, avatar: 'JW' }
];

export const FloatingMessenger: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'connections' | 'recruiters' | 'clients'>('connections');
  const messengerRef = useRef<HTMLDivElement>(null);

  // Auto close on clicking outside if open
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messengerRef.current && !messengerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/network/messages');
  };

  const renderChatItem = (chat: ChatItem) => (
    <div 
      key={chat.id} 
      className={`messenger-chat-item ${chat.unread ? 'unread' : ''}`}
      onClick={(e) => handleOpenPage(e)}
    >
      <div className="chat-avatar-wrapper">
        <div className="chat-avatar-circle">
          <span>{chat.avatar}</span>
        </div>
        {chat.online && <span className="online-indicator" />}
      </div>
      <div className="chat-info-wrapper">
        <div className="chat-header-row">
          <span className="chat-name">{chat.name}</span>
          <span className="chat-time">{chat.time}</span>
        </div>
        <span className="chat-role">{chat.role}</span>
        <p className="chat-last-msg">{chat.lastMsg}</p>
      </div>
      {chat.unread && <span className="chat-unread-dot" />}
    </div>
  );

  return (
    <div ref={messengerRef} className="floating-messenger-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="messenger-upside-panel"
          >
            <GlassCard className="messenger-panel-card" glowingEdge="azure">
              {/* Header */}
              <div className="messenger-panel-header">
                <div className="messenger-header-left" onClick={(e) => handleOpenPage(e)}>
                  <MessageSquare size={18} className="header-icon" />
                  <h4>Communication Hub</h4>
                  <span className="header-badge">3 New</span>
                </div>
                <div className="messenger-header-actions">
                  <button className="header-action-btn" onClick={(e) => handleOpenPage(e)} title="Open in Full Page">
                    <ExternalLink size={16} />
                  </button>
                  <button className="header-action-btn" onClick={() => setIsOpen(false)} title="Close Panel">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Mobile Tab Switcher */}
              <div className="messenger-mobile-tabs">
                <button 
                  className={mobileTab === 'connections' ? 'active' : ''} 
                  onClick={() => setMobileTab('connections')}
                >
                  Connections
                </button>
                <button 
                  className={mobileTab === 'recruiters' ? 'active' : ''} 
                  onClick={() => setMobileTab('recruiters')}
                >
                  Recruiters
                </button>
                <button 
                  className={mobileTab === 'clients' ? 'active' : ''} 
                  onClick={() => setMobileTab('clients')}
                >
                  Clients
                </button>
              </div>

              {/* Columns Area */}
              <div className="messenger-panel-columns">
                {/* Column 1: Connections */}
                <div className={`messenger-column ${mobileTab === 'connections' ? 'mobile-visible' : 'mobile-hidden'}`}>
                  <div className="column-title-bar">
                    <Users size={14} className="col-icon" />
                    <h5>Connections</h5>
                    <span className="col-badge">1</span>
                  </div>
                  <div className="column-chats-list">
                    {connectionChats.map(renderChatItem)}
                  </div>
                </div>

                {/* Column 2: Recruiters */}
                <div className={`messenger-column ${mobileTab === 'recruiters' ? 'mobile-visible' : 'mobile-hidden'}`}>
                  <div className="column-title-bar">
                    <Briefcase size={14} className="col-icon" />
                    <h5>Recruiters</h5>
                    <span className="col-badge">1</span>
                  </div>
                  <div className="column-chats-list">
                    {recruiterChats.map(renderChatItem)}
                  </div>
                </div>

                {/* Column 3: Clients */}
                <div className={`messenger-column ${mobileTab === 'clients' ? 'mobile-visible' : 'mobile-hidden'}`}>
                  <div className="column-title-bar">
                    <DollarSign size={14} className="col-icon" />
                    <h5>Clients</h5>
                    <span className="col-badge">1</span>
                  </div>
                  <div className="column-chats-list">
                    {clientChats.map(renderChatItem)}
                  </div>
                </div>
              </div>

              {/* Footer inside Messenger */}
              <div className="messenger-panel-footer" onClick={(e) => handleOpenPage(e)}>
                <span>Access all messages and advanced filters</span>
                <ArrowRight size={14} />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docked Collapsed Bar */}
      {!isOpen && (
        <div 
          className="messenger-docked-bar"
          onClick={() => setIsOpen(true)}
        >
          <div className="messenger-docked-left">
            <MessageSquare size={16} className="message-icon-pulse" />
            <span className="docked-title">Communication Hub</span>
          </div>
          <div className="messenger-docked-badge">
            <span>!</span>
          </div>
        </div>
      )}
    </div>
  );
};
