import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Send, UserCheck, Search, Smile } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PageTransition } from '../components/PageTransition';
import './Networking.css';

const contacts = [
  { id: 1, name: 'Hiring Manager • Google', status: 'Active 2m ago', online: true, unread: 2 },
  { id: 2, name: 'Talent Scout • Apple', status: 'Active 1hr ago', online: true, unread: 0 },
  { id: 3, name: 'Engineering Lead • Meta', status: 'Active 20m ago', online: true, unread: 1 },
  { id: 4, name: 'Recruiter • Stripe', status: 'Yesterday', online: false, unread: 0 },
  { id: 5, name: 'CTO • Startup X', status: '2 days ago', online: false, unread: 0 },
];

const messages = [
  { id: 1, type: 'received', text: "Hi! Your profile is a 100% match for our Sr. React open position. I noticed your work with Framer Motion.", time: '10:32 AM' },
  { id: 2, type: 'sent', text: "Thank you! Yes, I love building fluid interfaces. The liquid glass design system I built recently uses spring physics extensively.", time: '10:34 AM' },
  { id: 3, type: 'received', text: "That's exactly what we're looking for! Would you be available for a 3-pane mock interview this week?", time: '10:35 AM' },
  { id: 4, type: 'sent', text: "Absolutely! I can do Thursday afternoon. Should I prepare anything specific?", time: '10:37 AM' },
  { id: 5, type: 'received', text: "Perfect. Bring your best UI component showcase. We'll evaluate architecture decisions and animation craftsmanship. 🚀", time: '10:38 AM' },
];

const msgVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, type: 'spring' as const, stiffness: 300, damping: 24 }
  })
};

export const NetworkChat: React.FC = () => {
  const [activeContact, setActiveContact] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <PageTransition>
      <div className="networking-page">
        <div className="chat-layout">
          {/* Contacts Sidebar */}
          <motion.div 
            className="connections-list"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="connections-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Messages</h3>
              <motion.div 
                style={{ 
                  padding: '4px 12px', borderRadius: 'var(--radius-pill)', 
                  background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-azure)', 
                  fontSize: '12px', fontWeight: 600 
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                3 New
              </motion.div>
            </div>
            
            <div className={`conn-search ${searchFocused ? 'focused' : ''}`}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {contacts.map((contact, i) => (
              <motion.div 
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard 
                  className={`connection-card ${activeContact === contact.id ? 'active' : ''}`}
                  onClick={() => setActiveContact(contact.id)}
                >
                  <div className="conn-avatar">
                    {contact.online && <div className="online-dot" />}
                  </div>
                  <div className="conn-info">
                    <h4>{contact.name}</h4>
                    <span>{contact.status}</span>
                  </div>
                  {contact.unread > 0 && (
                    <motion.div 
                      className="unread-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {contact.unread}
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Chat Window */}
          <motion.div 
            className="chat-window"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="conn-avatar small">
                  <div className="online-dot" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px' }}>Hiring Manager • Google</h4>
                  <span style={{ fontSize: '12px', color: 'var(--vij-text-muted)' }}>Active now</span>
                </div>
              </div>
              <motion.div 
                className="identity-shield"
                whileHover={{ scale: 1.05 }}
              >
                <Shield size={14} />
                <span>Identity Protected</span>
                <UserCheck size={14} />
              </motion.div>
            </div>
            
            <div className="chat-messages">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={msg.id}
                    className={`message ${msg.type}`}
                    custom={i}
                    variants={msgVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="bubble">{msg.text}</div>
                    <span className="msg-time">{msg.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <motion.div 
              className="chat-input-area"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button 
                className="emoji-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Smile size={20} />
              </motion.button>
              <input 
                type="text" 
                placeholder="Send a secure message..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <motion.button 
                className="send-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={inputValue ? { backgroundColor: 'var(--accent-azure)' } : {}}
              >
                <Send size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};
