import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import './SocialHub.css';

export const SocialHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="social-hub-page">
      <div className="hub-layout">
        
        {/* Left Nav (Simulated) */}
        <div className="hub-left">
          <div className="nav-menu">
            <div className="nav-item active">Feed</div>
            <div className="nav-item">Articles</div>
            <div className="nav-item">Events</div>
          </div>
        </div>

        {/* Center Feed */}
        <div className="hub-center">
          
          {/* Animated Tabs */}
          <div className="category-tabs">
            {['Global', 'National', 'Local'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="active-tab" 
                    className="tab-indicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="tab-label">{tab}</span>
              </button>
            ))}
          </div>

          <div className="feed-stream">
            {loading ? (
              <div className="skeleton-loader">
                <div className="shimmer-card"></div>
                <div className="shimmer-card"></div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="post-stream"
              >
                <GlassCard className="post-card">
                  <div className="post-header">
                    <div className="post-avatar"></div>
                    <div className="post-meta">
                      <h4>Sarah Jenkins</h4>
                      <span>2h ago • Technical Lead</span>
                    </div>
                  </div>
                  <div className="post-body">
                    <p>Just published a new guide on implementing Framer Motion gracefully in React applications without sacrificing performance. The key is layoutId! 🚀</p>
                  </div>
                  <div className="post-actions">
                    <button><Heart size={18} /> 124</button>
                    <button><MessageSquare size={18} /> 12</button>
                    <button><Share2 size={18} /></button>
                  </div>
                  
                  {/* Nested Comments */}
                  <div className="post-comments">
                    <div className="commenting-line"></div>
                    <div className="comment">
                      <div className="comment-avatar"></div>
                      <div className="comment-content">
                        <strong>Mark D.</strong> This is incredibly helpful, especially the springs part.
                      </div>
                    </div>
                    <div className="comment nested">
                      <div className="comment-avatar small"></div>
                      <div className="comment-content">
                        <strong>Sarah Jenkins</strong> Thanks Mark! Let me know if you need code examples.
                      </div>
                    </div>
                  </div>
                </GlassCard>
                
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Trending */}
        <div className="hub-right">
          <GlassCard className="trending-widget">
            <h3>Trending Now</h3>
            <div className="trend-item">
              <span>#React19</span>
              <small>15k posts</small>
            </div>
            <div className="trend-item">
              <span>#WebRTC</span>
              <small>8.4k posts</small>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
