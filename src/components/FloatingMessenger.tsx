'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Minus, Maximize2, 
  Users, UserCircle, Bell, Search, MoreHorizontal
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Chat {
  id: number;
  name: string;
  role: string;
  lastMsg: string;
  time: string;
  online: boolean;
  unread: number;
  avatar?: string;
}

const recentChats: Chat[] = [
  { id: 1, name: 'Alex Rivera', role: 'Sr. Recruiter @ Google', lastMsg: 'Your profile matches our latest opening!', time: '2m', online: true, unread: 1 },
  { id: 2, name: 'Sarah Chen', role: 'Fullstack Dev • Friend', lastMsg: 'Did you see the new roadmap?', time: '1h', online: true, unread: 0 },
  { id: 3, name: 'Michael Scott', role: 'Engineering Lead', lastMsg: 'Interview scheduled for Thursday.', time: 'Yesterday', online: false, unread: 0 },
];

export const FloatingMessenger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'notifs'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="floating-messenger-container">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="messenger-window"
          >
            <GlassCard className="messenger-card" glowingEdge="azure">
              {/* Header */}
              <div className="messenger-header">
                <div className="header-nav">
                  <button 
                    className={activeTab === 'chats' ? 'active' : ''} 
                    onClick={() => { setActiveTab('chats'); setSelectedChat(null); }}
                  >
                    <MessageSquare size={16} />
                    <span>Chats</span>
                  </button>
                  <button 
                    className={activeTab === 'notifs' ? 'active' : ''} 
                    onClick={() => setActiveTab('notifs')}
                  >
                    <Bell size={16} />
                    <span>Updates</span>
                  </button>
                </div>
                <div className="header-actions">
                  <button onClick={() => setIsMinimized(true)}><Minus size={14} /></button>
                  <button onClick={() => setIsOpen(false)}><X size={14} /></button>
                </div>
              </div>

              <div className="messenger-body">
                {selectedChat ? (
                  <div className="active-chat-view">
                    <div className="chat-top-bar">
                      <button className="back-to-list" onClick={() => setSelectedChat(null)}>
                        <MoreHorizontal size={16} style={{ transform: 'rotate(180deg)' }} />
                      </button>
                      <div className="chat-user-info">
                        <h4>{selectedChat.name}</h4>
                        <span>{selectedChat.role}</span>
                      </div>
                    </div>
                    <div className="chat-messages-area">
                      <div className="msg-received">
                        <div className="msg-bubble">{selectedChat.lastMsg}</div>
                        <span className="msg-time">{selectedChat.time} ago</span>
                      </div>
                    </div>
                    <div className="messenger-input">
                      <input type="text" placeholder="Send message..." autoFocus />
                      <button className="msg-send-btn"><Send size={14} /></button>
                    </div>
                  </div>
                ) : activeTab === 'chats' ? (
                  <div className="chat-list-view">
                    <div className="messenger-search">
                      <Search size={14} />
                      <input type="text" placeholder="Search friends or recruiters..." />
                    </div>
                    {recentChats.map(chat => (
                      <div 
                        key={chat.id} 
                        className="chat-item"
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="chat-avatar">
                          <UserCircle size={32} />
                          {chat.online && <div className="online-status" />}
                        </div>
                        <div className="chat-preview">
                          <div className="chat-row">
                            <h4>{chat.name}</h4>
                            <span className="time">{chat.time}</span>
                          </div>
                          <p>{chat.lastMsg}</p>
                        </div>
                        {chat.unread > 0 && <div className="unread-dot" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="updates-list-view">
                    <div className="update-item">
                      <div className="update-icon boost"><Sparkles size={14} /></div>
                      <div className="update-text">
                        <strong>Profile Boosted!</strong> Your profile appeared in 12 new searches today.
                      </div>
                    </div>
                    <div className="update-item">
                      <div className="update-icon network"><Users size={14} /></div>
                      <div className="update-text">
                        <strong>Network Hit!</strong> Sarah Chen just joined the Junction nearby.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {isMinimized && (
        <div 
          className="minimized-messenger"
          onClick={() => setIsMinimized(false)}
        >
          <div className="minimized-info">
            <MessageSquare size={14} color="#059669" />
            <span>Communication Hub</span>
            <div className="unread-count">1</div>
          </div>
          <Maximize2 size={14} />
        </div>
      )}

      {!isOpen && !isMinimized && (
        <button
          className="messenger-fab"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={24} />
          <div className="fab-badge">1</div>
        </button>
      )}
    </div>
  );
};

const Sparkles = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

