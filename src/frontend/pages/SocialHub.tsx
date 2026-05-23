import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Share2, Compass, BookOpen, 
  TrendingUp, Globe, MapPin, Briefcase, Lock, UserPlus, Link2, Repeat, Users
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import './SocialHub.css';

/* ─── Mock Data & Feed Map ─── */
const categories = ['Global', 'National', 'Business', 'Trending'];

const FEED_MAP: Record<string, string> = {
  'Global': 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
  'National': 'https://news.google.com/rss/search?q=India+hiring+tech',
  'Business': 'https://news.google.com/rss/search?q=startup+funding+jobs',
  'Trending': 'https://news.google.com/rss/search?q=AI+career+trends'
};

interface RssItem {
  guid?: string;
  link?: string;
  title?: string;
  pubDate?: string;
  author?: string;
  description?: string;
  content?: string;
  thumbnail?: string;
}

interface RssResponse {
  status?: string;
  items?: RssItem[];
}

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
  image: string;
}
const TECH_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
];

const FINANCE_IMAGES = [
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=600&auto=format&fit=crop',
];

const OFFICE_IMAGES = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
];

const INDIA_IMAGES = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596495578065-6e0763fa1141?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506461883276-594a12b11db3?q=80&w=600&auto=format&fit=crop',
];

const GLOBAL_IMAGES = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop',
];

const GENERAL_IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&auto=format&fit=crop',
];

const getNewsImage = (title: string, category: string): string => {
  const lowerTitle = title.toLowerCase();
  
  const getIndex = (arr: any[]) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % arr.length;
  };

  if (lowerTitle.includes('india') || lowerTitle.includes('mumbai') || lowerTitle.includes('delhi') || lowerTitle.includes('bengaluru') || lowerTitle.includes('bangalore') || lowerTitle.includes('national')) {
    return INDIA_IMAGES[getIndex(INDIA_IMAGES)];
  }
  
  if (lowerTitle.includes('ai') || lowerTitle.includes('llm') || lowerTitle.includes('gpt') || lowerTitle.includes('nvidia') || lowerTitle.includes('tech') || lowerTitle.includes('coding') || lowerTitle.includes('software') || lowerTitle.includes('security') || lowerTitle.includes('developer') || lowerTitle.includes('google') || lowerTitle.includes('microsoft') || lowerTitle.includes('apple')) {
    return TECH_IMAGES[getIndex(TECH_IMAGES)];
  }

  if (lowerTitle.includes('fund') || lowerTitle.includes('startup') || lowerTitle.includes('stock') || lowerTitle.includes('finance') || lowerTitle.includes('deal') || lowerTitle.includes('market') || lowerTitle.includes('ipo') || lowerTitle.includes('invest') || lowerTitle.includes('valuation') || lowerTitle.includes('acquisition') || lowerTitle.includes('billion')) {
    return FINANCE_IMAGES[getIndex(FINANCE_IMAGES)];
  }

  if (lowerTitle.includes('job') || lowerTitle.includes('hiring') || lowerTitle.includes('career') || lowerTitle.includes('layoff') || lowerTitle.includes('employee') || lowerTitle.includes('work') || lowerTitle.includes('salary') || lowerTitle.includes('interview') || lowerTitle.includes('hr')) {
    return OFFICE_IMAGES[getIndex(OFFICE_IMAGES)];
  }

  if (lowerTitle.includes('global') || lowerTitle.includes('us') || lowerTitle.includes('iran') || lowerTitle.includes('china') || lowerTitle.includes('war') || lowerTitle.includes('trump') || lowerTitle.includes('biden') || lowerTitle.includes('politics') || lowerTitle.includes('world') || lowerTitle.includes('talks')) {
    return GLOBAL_IMAGES[getIndex(GLOBAL_IMAGES)];
  }

  if (category === 'National') {
    return INDIA_IMAGES[getIndex(INDIA_IMAGES)];
  }
  if (category === 'Business') {
    return FINANCE_IMAGES[getIndex(FINANCE_IMAGES)];
  }
  if (category === 'Trending') {
    return TECH_IMAGES[getIndex(TECH_IMAGES)];
  }
  if (category === 'Global') {
    return GLOBAL_IMAGES[getIndex(GLOBAL_IMAGES)];
  }

  return GENERAL_IMAGES[getIndex(GENERAL_IMAGES)];
};

const normalizeNewsItem = (item: RssItem, index: number, category: string = 'Global'): NewsItem => ({
  id: item.guid || item.link || `news-${index}`,
  title: item.title || 'Untitled story',
  link: item.link || '#',
  pubDate: item.pubDate || new Date().toISOString(),
  source: item.author || 'Google News',
  snippet: item.description || item.content || '',
  image: item.thumbnail || getNewsImage(item.title || '', category),
});

const formatNewsDate = (dateString: string) => {
  const d = new Date(dateString);
  const day = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day}, ${time}`;
};

const sideLinks = [
  { icon: <Compass size={18} />, label: 'News Feed', active: true },
  { icon: <BookOpen size={18} />, label: 'Saved Articles', active: false },
  { icon: <Users size={18} />, label: 'Following', active: false },
];

const trendingTags = ['#TechLayoffs', '#AIStartups', '#WebRTC', '#FramerMotion', '#React15'];

// Top discussions moved to render logic or removed if redundant

const MOCK_SUGGESTIONS = [
  { id: 101, name: 'David Miller', role: 'Full-Stack Developer', match: '98%', reason: 'Skills Match', avatar: 'DM' },
  { id: 102, name: 'Sophia Wang', role: 'Product Designer', match: '95%', reason: 'Industry Match', avatar: 'SW' },
  { id: 103, name: 'James Wilson', role: 'AI Specialist', match: '92%', reason: 'Profile Match', avatar: 'JW' },
];

export const SocialHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Global');
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false); // Toggle for auth logic
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // News Data
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [topStory, setTopStory] = useState<NewsItem | null>(null);
  const [trendingTopics, setTrendingTopics] = useState<NewsItem[]>([]);

  // Post states
  const [postFocus, setPostFocus] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [commentsOpen, setCommentsOpen] = useState<Record<string, boolean>>({});
  const [shareOpen, setShareOpen] = useState<Record<string, boolean>>({});

  // Fetch RSS data when activeTab changes
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const feedUrl = FEED_MAP[activeTab];
        if (!feedUrl) return;

        // Use a reliable RSS to JSON service
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json() as RssResponse;
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const formattedItems = data.items.map((item, idx) => normalizeNewsItem(item, idx, activeTab));
          
          setTopStory(formattedItems[0]);
          setNewsItems(formattedItems.slice(1, 15)); // Next 14 items
        }
      } catch (err) {
        console.error("Error fetching RSS:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [activeTab]);

  // Fetch Trending for sidebar on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const feedUrl = FEED_MAP['Trending'];
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json() as RssResponse;
        if (data.status === 'ok' && data.items) {
          setTrendingTopics(data.items.slice(0, 3).map((item, idx) => normalizeNewsItem(item, idx, 'Trending')));
        }
      } catch (err) {
        console.error("Error fetching trending:", err);
      }
    };
    fetchTrending();
  }, []);

  const handleInteract = (action: string, id: string | number) => {
    const key = String(id);
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    
    if (action === 'like') {
      setLiked(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (action === 'comment') {
      setCommentsOpen(prev => ({ ...prev, [key]: !prev[key] }));
      setShareOpen(prev => ({ ...prev, [key]: false })); // Close share if open
    } else if (action === 'share') {
      setShareOpen(prev => ({ ...prev, [key]: !prev[key] }));
      setCommentsOpen(prev => ({ ...prev, [key]: false })); // Close comments if open
    }
  };

  return (
    <PageTransition>
      <div className="news-hub-page">

        {/* ── DEMO TOGGLE ── */}
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100 }}>
          <GlassButton variant={isGuest ? "secondary" : "primary"} onClick={() => setIsGuest(!isGuest)} style={{ fontSize: '12px', padding: '6px 12px' }}>
            {isGuest ? 'View as: Guest' : 'View as: Registered'}
          </GlassButton>
        </div>

        {/* ── AUTH MODAL ── */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div 
              className="auth-modal-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
            >
              <motion.div 
                className="auth-modal-content"
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="auth-modal-icon"><Lock size={32} /></div>
                <h3>Join the Junction to join the conversation.</h3>
                <p>Register to like, comment, and share with your professional network.</p>
                <div className="auth-modal-actions">
                  <GlassButton variant="secondary" onClick={() => setShowAuthModal(false)}>Log In</GlassButton>
                  <GlassButton variant="primary">Register</GlassButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hub-grid">
          
          {/* ══════ LEFT SIDEBAR ══════ */}
          <aside className="hub-sidebar left-sidebar">
            <div className="sticky-pane">
              <nav className="nav-menu">
                <span className="nav-section-title">Discovery</span>
                {sideLinks.map(link => (
                  <div key={link.label} className={`nav-item ${link.active ? 'active' : ''}`}>
                    {link.icon} <span>{link.label}</span>
                  </div>
                ))}
              </nav>

              <hr className="pane-divider" />

              <nav className="nav-menu">
                <span className="nav-section-title">Categories</span>
                <div className={`nav-item ${activeTab === 'Global' ? 'active' : ''}`} onClick={() => setActiveTab('Global')}><Globe size={18} /> Global</div>
                <div className={`nav-item ${activeTab === 'National' ? 'active' : ''}`} onClick={() => setActiveTab('National')}><MapPin size={18} /> National</div>
                <div className={`nav-item ${activeTab === 'Business' ? 'active' : ''}`} onClick={() => setActiveTab('Business')}><Briefcase size={18} /> Business</div>
                <div className={`nav-item ${activeTab === 'Trending' ? 'active' : ''}`} onClick={() => setActiveTab('Trending')}><TrendingUp size={18} /> Trending</div>
              </nav>
            </div>
          </aside>

          {/* ══════ CENTER FEED ══════ */}
          <main className="hub-feed">
            
            {/* ── Category Tabs (Pill Toggles) ── */}
            <div className="feed-header-tabs">
              {categories.map((tab) => (
                <button
                  key={tab}
                  className={`pill-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="pill-glow" 
                      className="pill-tab-glow"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="pill-tab-label">{tab}</span>
                </button>
              ))}
            </div>

            {/* ── Create Post Input (Registered Only) ── */}
            <AnimatePresence>
              {!isGuest && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="create-post-wrapper">
                  <GlassCard className="create-post-card">
                    <div className="post-avatar me">VU</div>
                    <div className="create-post-input-container">
                      <textarea 
                        className={`create-post-input ${postFocus ? 'expanded' : ''}`}
                        placeholder="Share an article, update, or professional insight..."
                        onFocus={() => setPostFocus(true)}
                        onBlur={(e) => { if(!e.target.value) setPostFocus(false); }}
                      />
                      <AnimatePresence>
                        {postFocus && (
                          <motion.div 
                            className="create-actions"
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          >
                            <GlassButton variant="primary" style={{ padding: '8px 24px' }}>Publish</GlassButton>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Feed Stream ── */}
            <div className="feed-stream">
              <AnimatePresence mode="wait">
                {loading ? (
                  // SKELETON LOADING
                  <motion.div key="skeleton" className="skeleton-loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                    <div className="shimmer-card" style={{ height: 320 }}>
                      <div className="shimmer-sweep" />
                    </div>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="shimmer-card" style={{ height: 240 }}>
                        <div className="shimmer-sweep" />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key={`feed-${activeTab}`} className="post-stream" initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.2 } }} variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}>
                    
                    {/* FEATURED NEWS HERO CARD */}
                    {topStory && (
                      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                        <a href={topStory.link} target="_blank" rel="noopener noreferrer" className="featured-news-card hover-lift" style={{ textDecoration: 'none', display: 'block' }}>
                          <div className="featured-bg" style={{ backgroundImage: `url(${topStory.image})` }} />
                          <div className="featured-content">
                            <span className="featured-tag">Top Story</span>
                            <h2 dangerouslySetInnerHTML={{ __html: topStory.title }} />
                            <span className="featured-meta">{topStory.source} • {formatNewsDate(topStory.pubDate)}</span>
                          </div>
                        </a>
                      </motion.div>
                    )}

                    {/* STANDARD POST CARDS FROM RSS */}
                    {newsItems.map((item, idx) => (
                      <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                        <GlassCard className="feed-post-card hover-lift">
                          <div className="post-header">
                            <div className="post-avatar" style={{ background: `linear-gradient(135deg, hsl(${idx * 45 % 360}, 70%, 50%), hsl(${(idx * 45 + 30) % 360}, 80%, 40%))` }}>
                              {item.source.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="post-meta">
                              <h4>{item.source}</h4>
                              <span>{formatNewsDate(item.pubDate)}</span>
                            </div>
                          </div>
                        
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="post-body has-thumb">
                            <div className="post-text">
                              <h3 className="post-headline" dangerouslySetInnerHTML={{ __html: item.title }} />
                              <div className="post-snippet rss-snippet" dangerouslySetInnerHTML={{ __html: item.snippet }} />
                            </div>
                            <div className="post-thumb" style={{ backgroundImage: `url(${item.image})` }}></div>
                          </div>
                        </a>

                        <div className="post-footer-actions">
                          <button className={`action-btn ${liked[item.id] ? 'liked' : ''}`} onClick={(e) => { e.preventDefault(); handleInteract('like', item.id); }}>
                            <Heart size={18} fill={liked[item.id] ? 'url(#vibrantGrad)' : 'transparent'} className="icon-pop" />
                            <span>{Math.floor((item.id.length || 0) * 2) + 10 + (liked[item.id] ? 1 : 0)}</span>
                          </button>
                          <button className={`action-btn ${commentsOpen[item.id] ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleInteract('comment', item.id); }}>
                            <MessageSquare size={18} />
                            <span>{Math.floor((item.id.length || 0) / 2) + 2}</span>
                          </button>
                          <button className={`action-btn ${shareOpen[item.id] ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleInteract('share', item.id); }}>
                            <Share2 size={18} />
                            <span>Share</span>
                          </button>
                        </div>

                        {/* Share Drawer */}
                        <AnimatePresence>
                          {shareOpen[item.id] && (
                            <motion.div 
                              className="share-drawer"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <div className="share-drawer-inner">
                                <button className="share-option"><Repeat size={16} /> Repost to my Feed</button>
                                <button className="share-option"><Users size={16} /> Send to Connection</button>
                                <button className="share-option" onClick={() => navigator.clipboard.writeText(item.link)}><Link2 size={16} /> Copy Link</button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Comment Thread */}
                        <AnimatePresence>
                          {commentsOpen[item.id] && (
                            <motion.div 
                              className="comment-thread"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <div className="thread-inner">
                                <div className="thread-tracing-line" />
                                <div className="comment-input-row">
                                  <div className="post-avatar comment-av me">VU</div>
                                  <input type="text" placeholder="Add a comment..." className="thread-input" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    </motion.div>
                  ))}

                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </main>

          {/* ══════ RIGHT SIDEBAR ══════ */}
          <aside className="hub-sidebar right-sidebar">
            <div className="sticky-pane">
              
              {/* Suggested Experts (Registered Users Only) */}
              {!isGuest && (
                <GlassCard className="pulse-widget suggestions-widget">
                  <h3 className="widget-title">Suggested Experts</h3>
                  <div className="sidebar-suggestions-list">
                    {MOCK_SUGGESTIONS.map((person) => (
                      <div key={person.id} className="sidebar-suggestion-item">
                        <div className="suggestion-av-sm">{person.avatar}</div>
                        <div className="suggestion-details">
                          <div className="suggestion-top">
                            <h4>{person.name}</h4>
                            <span className="match-tag">{person.match}</span>
                          </div>
                          <p>{person.role}</p>
                          <span className="reason-tag">{person.reason}</span>
                        </div>
                        <button className="mini-connect-btn"><UserPlus size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <button className="view-all-link">View All Matches</button>
                </GlassCard>
              )}

              {/* Top Discussions */}
              <GlassCard className="pulse-widget">
                <h3 className="widget-title">Top Discussions</h3>
                <div className="discussions-list">
                  {trendingTopics.length > 0 ? trendingTopics.map((topic, i) => (
                    <a href={topic.link} target="_blank" rel="noopener noreferrer" key={i} className="discussion-item" style={{ textDecoration: 'none' }}>
                      <span className="discussion-rank">{i+1}</span>
                      <div className="discussion-info">
                        <h4 dangerouslySetInnerHTML={{ __html: topic.title }} />
                        <span>{topic.source}</span>
                      </div>
                    </a>
                  )) : (
                    <div className="shimmer-card" style={{ height: 60, marginTop: 8 }}><div className="shimmer-sweep" /></div>
                  )}
                </div>
              </GlassCard>

              {/* Trending Tags */}
              <GlassCard className="pulse-widget">
                <h3 className="widget-title">Trending Tags</h3>
                <div className="tags-list">
                  {trendingTags.map((tag, i) => (
                    <span key={i} className="pulse-tag">{tag}</span>
                  ))}
                </div>
              </GlassCard>

            </div>
          </aside>

        </div>

        {/* SVG Definition for Vibrant Like Gradient */}
        <svg width="0" height="0">
          <linearGradient id="vibrantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#f43f5e" offset="0%" />
            <stop stopColor="#ec4899" offset="100%" />
          </linearGradient>
        </svg>

      </div>
    </PageTransition>
  );
};
