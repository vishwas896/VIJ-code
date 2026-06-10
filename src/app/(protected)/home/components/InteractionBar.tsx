'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Send, Repeat2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: number;
  author: string;
  text: string;
}

interface InteractionBarProps {
  postId: number;
  commentsCount: number;
  applaudsCount: number;
  mockConnections: string[];
}

export const InteractionBar: React.FC<InteractionBarProps> = ({
  postId,
  commentsCount: initialCommentsCount,
  applaudsCount: initialApplaudsCount,
  mockConnections,
}) => {
  const [applauds, setApplauds] = useState(initialApplaudsCount);
  const [isApplauded, setIsApplauded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Sarah M. | Lead Product Designer', text: 'This looks fantastic! The UX flow is very clean.' },
    { id: 2, author: 'David K. | Staff Engineer', text: 'Excellent system architecture, very secure.' },
  ]);
  const [newComment, setNewComment] = useState('');

  // Share state
  const [selectedConnection, setSelectedConnection] = useState(mockConnections[0] || '');
  const [shareSuccess, setShareSuccess] = useState('');

  const handleApplaud = () => {
    setIsApplauded(!isApplauded);
    setApplauds((prev) => (isApplauded ? prev - 1 : prev + 1));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: Date.now(),
      author: 'You (Verified Professional)',
      text: newComment,
    };
    setComments((prev) => [...prev, added]);
    setNewComment('');
  };

  const handleTransmit = () => {
    if (!selectedConnection) return;
    setShareSuccess(`Securely transmitted to ${selectedConnection}'s private chat.`);
    setTimeout(() => setShareSuccess(''), 4000);
  };

  const handleRepost = () => {
    setShareSuccess('Successfully reposted to your professional timeline.');
    setTimeout(() => setShareSuccess(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* ── Action buttons ── */}
      <div className="interaction-bar-container" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '4px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <div className="interaction-actions" style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          {/* Like Button with spring scale animation */}
          <motion.button
            className={`interaction-btn linkedin-btn ${isApplauded ? 'applauded' : ''}`}
            onClick={handleApplaud}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: isApplauded ? '#0a66c2' : '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <Heart size={18} fill={isApplauded ? '#0a66c2' : 'none'} />
            <span>Like ({applauds})</span>
          </motion.button>

          {/* Comment Button */}
          <button
            className={`interaction-btn linkedin-btn ${showComments ? 'active' : ''}`}
            onClick={() => {
              setShowComments(!showComments);
              if (showShare) setShowShare(false);
            }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <MessageSquare size={18} />
            <span>Comment ({comments.length})</span>
          </button>
          
          {/* Repost Button */}
          <button
            className={`interaction-btn linkedin-btn ${showShare ? 'active' : ''}`}
            onClick={() => {
              setShowShare(!showShare);
              if (showComments) setShowComments(false);
            }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <Repeat2 size={18} />
            <span>Repost</span>
          </button>

          {/* Send Button */}
          <button
            className={`interaction-btn linkedin-btn`}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <Send size={18} />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* ── Discuss comments panel ── */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            className="feed-comments-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="feed-comment-list">
              {comments.map((comment) => (
                <div key={comment.id} className="feed-comment-item">
                  <span className="feed-comment-author">{comment.author}</span>
                  <span className="feed-comment-text">{comment.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="feed-comment-input-row">
              <input
                type="text"
                className="feed-comment-input"
                placeholder="Write a constructive review..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="feed-comment-submit">
                Comment
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Circulate sharing panel ── */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            className="feed-share-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="share-panel-title">Circulate Post Option Matrix</span>
            
            <div className="share-options-grid">
              <button className="share-option-btn" onClick={handleRepost}>
                <Repeat2 size={16} className="text-blue-500" />
                <span>Repost on Timeline</span>
              </button>
              
              <div className="share-connection-select">
                <span style={{ fontSize: '10px', color: 'var(--vij-text-muted)', fontWeight: 600 }}>
                  Transmit to 1st-Degree Connection:
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <select
                    className="share-connection-dropdown"
                    value={selectedConnection}
                    onChange={(e) => setSelectedConnection(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {mockConnections.map((conn) => (
                      <option key={conn} value={conn}>
                        {conn}
                      </option>
                    ))}
                  </select>
                  <button className="share-transmit-btn" onClick={handleTransmit}>
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </div>

            {shareSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '11px', color: '#059669', marginTop: '6px', fontWeight: 500 }}
              >
                {shareSuccess}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
