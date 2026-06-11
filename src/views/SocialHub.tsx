'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Share2, Compass, BookOpen, 
  TrendingUp, Globe, MapPin, Briefcase, Lock, UserPlus, Link2, Repeat, Users,
  X, ArrowRightLeft, ThumbsUp, Send, Plus
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { PageTransition } from '../components/common/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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

interface Comment {
  author: string;
  avatar: string;
  text: string;
  time: string;
}

const MOCK_WRITERS = [
  { name: 'Alex Mercer', role: 'Lead Infrastructure Engineer', avatar: 'AM' },
  { name: 'Elena Rostova', role: 'Senior Tech Reporter', avatar: 'ER' },
  { name: 'Marcus Aurelius', role: 'AI Alignment Researcher', avatar: 'MA' },
  { name: 'Chloe Fraser', role: 'Staff Product Designer', avatar: 'CF' },
  { name: 'Nathan Drake', role: 'Developer Relations Lead', avatar: 'ND' },
  { name: 'Sarah Connor', role: 'Robotics Analyst', avatar: 'SC' },
  { name: 'Vikram Seth', role: 'Global Tech Economist', avatar: 'VS' },
];

const MOCK_COMMENTS_POOL = [
  "This is a major milestone for the industry. Keen to see how this impacts scaling.",
  "Incredibly detailed write-up. The architectural trade-offs mentioned are spot on.",
  "We are experiencing a similar shift in our current project pipeline. Great insights!",
  "Adoptability remains the primary bottleneck here. We need better developer tooling.",
  "Very interesting perspective! Looking forward to seeing where this goes by next year.",
  "This makes perfect sense given the recent trends in cloud infrastructure cost optimization.",
  "Excellent summary. The industry is evolving faster than most organizations can adapt."
];

const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: { USD: 1, INR: 83.45, EUR: 0.92, GBP: 0.79 },
  INR: { USD: 0.012, INR: 1, EUR: 0.011, GBP: 0.0095 },
  EUR: { USD: 1.09, INR: 90.71, EUR: 1, GBP: 0.86 },
  GBP: { USD: 1.27, INR: 105.63, EUR: 1.16, GBP: 1 }
};

const RATE_DELTAS: Record<string, { price: string; delta: string; up: boolean }> = {
  'USD/INR': { price: '83.45', delta: '+0.12%', up: true },
  'EUR/USD': { price: '1.09', delta: '-0.05%', up: false },
  'GBP/USD': { price: '1.27', delta: '+0.22%', up: true },
  'USD/EUR': { price: '0.92', delta: '+0.08%', up: true },
};

export const SocialHub: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
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

  // Dynamic Post Interactions State
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [postAuthors, setPostAuthors] = useState<Record<string, { name: string; role: string; avatar: string }>>({});
  const [trendingScores, setTrendingScores] = useState<Record<string, string>>({});
  const [typingComment, setTypingComment] = useState<Record<string, string>>({});
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Currency conversion pop-up state
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [convAmount, setConvAmount] = useState('100');
  const [convFrom, setConvFrom] = useState('USD');
  const [convTo, setConvTo] = useState('INR');

  const isRegistered = !isGuest && isAuthenticated;

  const initializeInteractions = (items: NewsItem[]) => {
    setLikesCount(prev => {
      const next = { ...prev };
      items.forEach((item, idx) => {
        if (next[item.id] === undefined) {
          next[item.id] = (item.title.charCodeAt(0) * 7) % 180 + 20;
        }
      });
      return next;
    });

    setPostAuthors(prev => {
      const next = { ...prev };
      items.forEach((item) => {
        if (!next[item.id]) {
          const authorIdx = (item.title.charCodeAt(1) || 0) % MOCK_WRITERS.length;
          next[item.id] = MOCK_WRITERS[authorIdx];
        }
      });
      return next;
    });

    setTrendingScores(prev => {
      const next = { ...prev };
      items.forEach((item, idx) => {
        if (!next[item.id]) {
          const hotnessIdx = (item.title.charCodeAt(2) || 0) % 3;
          if (hotnessIdx === 0) {
            next[item.id] = `🔥 Trending #${(idx % 5) + 1}`;
          } else if (hotnessIdx === 1) {
            next[item.id] = `⚡ Hot Topic`;
          } else {
            next[item.id] = `📈 ${((item.title.length * 15) % 100) + 10}k views`;
          }
        }
      });
      return next;
    });

    setPostComments(prev => {
      const next = { ...prev };
      items.forEach((item) => {
        if (!next[item.id]) {
          const numComments = (item.title.charCodeAt(3) || 0) % 2 + 2; // 2 or 3 comments
          const commentsList: Comment[] = [];
          for (let c = 0; c < numComments; c++) {
            const commentIdx = ((item.title.charCodeAt(4) || 0) + c) % MOCK_COMMENTS_POOL.length;
            const writerIdx = ((item.title.charCodeAt(5) || 0) + c) % MOCK_WRITERS.length;
            commentsList.push({
              author: MOCK_WRITERS[writerIdx].name,
              avatar: MOCK_WRITERS[writerIdx].avatar,
              text: MOCK_COMMENTS_POOL[commentIdx],
              time: `${c + 1}h ago`
            });
          }
          next[item.id] = commentsList;
        }
      });
      return next;
    });
  };

  const handleAddComment = (postId: string) => {
    const text = typingComment[postId];
    if (!text || !text.trim()) return;

    if (isGuest) {
      setShowAuthModal(true);
      return;
    }

    const newComment: Comment = {
      author: user?.name || 'Registered User',
      avatar: user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ME',
      text: text.trim(),
      time: 'Just now'
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setTypingComment(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

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
          
          initializeInteractions(formattedItems);
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
      const isAlreadyLiked = liked[key];
      setLiked(prev => ({ ...prev, [key]: !isAlreadyLiked }));
      setLikesCount(prev => ({
        ...prev,
        [key]: (prev[key] || 0) + (isAlreadyLiked ? -1 : 1)
      }));
    } else if (action === 'comment') {
      setCommentsOpen(prev => ({ ...prev, [key]: !prev[key] }));
      setShareOpen(prev => ({ ...prev, [key]: false })); // Close share if open
    } else if (action === 'share') {
      setShareOpen(prev => ({ ...prev, [key]: !prev[key] }));
      setCommentsOpen(prev => ({ ...prev, [key]: false })); // Close comments if open
    }
  };

  const renderPostCard = (item: NewsItem, isFeatured: boolean = false, idx: number = 0) => {
    const author = postAuthors[item.id] || { name: 'Staff Writer', role: 'Platform Tech Writer', avatar: 'SW' };
    const likes = likesCount[item.id] || 0;
    const isLiked = liked[item.id] || false;
    const comments = postComments[item.id] || [];
    const trending = trendingScores[item.id] || '';

    return (
      <GlassCard className={`feed-post-card hover-lift`} key={item.id} style={{ padding: '24px', paddingBottom: '16px' }}>
        <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="post-avatar" style={{ 
              background: `linear-gradient(135deg, hsl(${idx * 45 % 360}, 70%, 50%), hsl(${(idx * 45 + 30) % 360}, 80%, 40%))`,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '16px',
              flexShrink: 0
            }}>
              {author.avatar}
            </div>
            <div className="post-meta">
              <h4 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 700, color: 'var(--vij-text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {author.name}
                <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>• 2nd</span>
              </h4>
              <p style={{ margin: '0 0 2px', fontSize: '12px', color: 'var(--vij-text-muted)', fontWeight: 500 }}>
                {author.role} | <strong style={{ color: 'var(--accent-azure)' }}>{item.source}</strong>
              </p>
              <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {formatNewsDate(item.pubDate)} • <Globe size={10} />
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-azure)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={16} /> Follow
            </button>
          </div>
        </div>
      
        <div className="post-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div className="post-text">
            <h3 className="post-headline" style={{ 
              fontSize: '15px', 
              fontWeight: 600, 
              lineHeight: 1.4, 
              margin: '0 0 4px', 
              color: 'var(--vij-text-main)' 
            }} dangerouslySetInnerHTML={{ __html: item.title }} />
            <div className="post-snippet rss-snippet" style={{ 
              fontSize: '14px', 
              lineHeight: 1.5, 
              color: 'var(--vij-text-muted)', 
              margin: 0 
            }} dangerouslySetInnerHTML={{ __html: item.snippet }} />
          </div>
          {item.image && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="post-full-image" style={{ 
                backgroundImage: `url(${item.image})`, 
                width: '100%',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)',
                marginTop: '8px'
              }}></div>
            </a>
          )}
        </div>

        <div className="post-engagement-counts" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px 8px', borderBottom: '1px solid rgba(0,0,0,0.06)', fontSize: '12px', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0f2fe', color: '#0284c7', borderRadius: '50%', width: '16px', height: '16px' }}>👍</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', width: '16px', height: '16px', marginLeft: '-6px' }}>👏</div>
            <span style={{ marginLeft: '4px' }}>{likes}</span>
          </div>
          <div>
            {comments.length} comments • 2 reposts
          </div>
        </div>

        <div className="post-footer-actions" style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          paddingTop: '8px', 
          alignItems: 'center'
        }}>
          <button className={`action-btn linkedin-btn ${isLiked ? 'liked' : ''}`} onClick={(e) => { e.preventDefault(); handleInteract('like', item.id); }} style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: isLiked ? '#0a66c2' : '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <ThumbsUp size={18} fill={isLiked ? '#0a66c2' : 'transparent'} />
            <span>Like</span>
          </button>
          <button className={`action-btn linkedin-btn ${commentsOpen[item.id] ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleInteract('comment', item.id); }} style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <MessageSquare size={18} />
            <span>Comment</span>
          </button>
          <button className={`action-btn linkedin-btn`} onClick={(e) => { e.preventDefault(); handleInteract('share', item.id); }} style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <Repeat size={18} />
            <span>Repost</span>
          </button>
          <button className={`action-btn linkedin-btn`} style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '4px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <Send size={18} />
            <span>Send</span>
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
              <div className="thread-inner" style={{ marginTop: '16px' }}>
                <div className="thread-tracing-line" style={{ top: '24px', bottom: '70px' }} />
                
                {/* Render Comments list */}
                <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                  {comments.map((cmt, cIdx) => (
                    <div key={cIdx} className="comment-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                      <div className="comment-av" style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#475569',
                        flexShrink: 0
                      }}>
                        {cmt.avatar}
                      </div>
                      <div className="comment-bubble" style={{ 
                        background: 'rgba(255, 255, 255, 0.75)', 
                        padding: '10px 14px', 
                        borderRadius: '0px 14px 14px 14px',
                        fontSize: '13px',
                        flex: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                        border: '1px solid rgba(0,0,0,0.03)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <strong style={{ fontWeight: 700, color: 'var(--vij-text-main)' }}>{cmt.author}</strong>
                          <span style={{ fontSize: '10px', color: 'var(--vij-text-muted)' }}>{cmt.time}</span>
                        </div>
                        <p style={{ margin: 0, color: '#52525b', lineHeight: 1.4 }}>{cmt.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="comment-input-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <div className="post-avatar comment-av me" style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ME'}
                  </div>
                  <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      className="thread-input" 
                      value={typingComment[item.id] || ''}
                      onChange={(e) => setTypingComment(prev => ({ ...prev, [item.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(item.id);
                        }
                      }}
                      style={{ flex: 1 }}
                    />
                    <GlassButton 
                      variant="primary" 
                      onClick={() => handleAddComment(item.id)}
                      style={{ padding: '4px 14px', fontSize: '12px', height: '36px', borderRadius: '99px' }}
                    >
                      Post
                    </GlassButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    );
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

        {/* ── EXCHANGE RATE CONVERTER MODAL ── */}
        <AnimatePresence>
          {isRateModalOpen && (
            <motion.div 
              className="rate-modal-overlay"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsRateModalOpen(false)}
            >
              <motion.div 
                className="rate-modal-content"
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="rate-modal-header">
                  <div className="title-area">
                    <Globe className="globe-icon-spin" size={24} />
                    <h3>Global Currency Rates</h3>
                  </div>
                  <button className="close-modal-btn" onClick={() => setIsRateModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="rate-modal-body">
                  {/* Cross Rates Grid */}
                  <div className="cross-rates-section">
                    <h4>Cross Currency Exchange Matrix</h4>
                    <p className="section-subtitle">Value of 1 unit of Base Currency (Row) in Target Currency (Col)</p>
                    <div className="cross-rates-table-wrapper">
                      <table className="cross-rates-table">
                        <thead>
                          <tr>
                            <th>Base</th>
                            <th>USD</th>
                            <th>INR</th>
                            <th>EUR</th>
                            <th>GBP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(EXCHANGE_RATES).map((base) => (
                            <tr key={base}>
                              <td className="base-currency-td">{base}</td>
                              <td>{EXCHANGE_RATES[base]['USD'].toFixed(4)}</td>
                              <td>{EXCHANGE_RATES[base]['INR'].toFixed(2)}</td>
                              <td>{EXCHANGE_RATES[base]['EUR'].toFixed(4)}</td>
                              <td>{EXCHANGE_RATES[base]['GBP'].toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Calculator Section */}
                  <div className="calculator-section">
                    <h4>Interactive Converter</h4>
                    <div className="calculator-grid">
                      <div className="calc-group">
                        <label>Amount</label>
                        <input 
                          type="number" 
                          value={convAmount}
                          onChange={(e) => setConvAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="calc-input"
                          min="0"
                        />
                      </div>
                      
                      <div className="calc-group">
                        <label>From</label>
                        <select 
                          value={convFrom} 
                          onChange={(e) => setConvFrom(e.target.value)}
                          className="calc-select"
                        >
                          {Object.keys(EXCHANGE_RATES).map(cur => (
                            <option key={cur} value={cur}>{cur}</option>
                          ))}
                        </select>
                      </div>

                      <div className="calc-swap-container">
                        <button className="swap-btn" onClick={() => {
                          const temp = convFrom;
                          setConvFrom(convTo);
                          setConvTo(temp);
                        }} title="Swap Currencies">
                          <ArrowRightLeft size={16} />
                        </button>
                      </div>

                      <div className="calc-group">
                        <label>To</label>
                        <select 
                          value={convTo} 
                          onChange={(e) => setConvTo(e.target.value)}
                          className="calc-select"
                        >
                          {Object.keys(EXCHANGE_RATES).map(cur => (
                            <option key={cur} value={cur}>{cur}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="calc-result-display">
                      <div className="result-label">Calculated Result</div>
                      <div className="result-value">
                        {(() => {
                          const amt = parseFloat(convAmount);
                          if (isNaN(amt)) return '0.00';
                          const rate = EXCHANGE_RATES[convFrom]?.[convTo] || 1;
                          const result = amt * rate;
                          
                          // Format cleanly depending on value
                          const formattedAmt = amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          const formattedResult = result.toLocaleString(undefined, { 
                            minimumFractionDigits: convTo === 'INR' ? 2 : 4,
                            maximumFractionDigits: convTo === 'INR' ? 2 : 4 
                          });
                          return `${formattedAmt} ${convFrom} = ${formattedResult} ${convTo}`;
                        })()}
                      </div>
                      <div className="result-sub">
                        1 {convFrom} = {EXCHANGE_RATES[convFrom]?.[convTo]} {convTo} • Live rates updated in real-time
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hub-grid">          {/* ══════ LEFT SIDEBAR ══════ */}
          <aside 
            className={`hub-sidebar left-sidebar ${isSidebarHovered ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
          >
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
                <div className={`nav-item ${activeTab === 'Global' ? 'active' : ''}`} onClick={() => setActiveTab('Global')}><Globe size={18} /> <span>{t('news.global')}</span></div>
                <div className={`nav-item ${activeTab === 'National' ? 'active' : ''}`} onClick={() => setActiveTab('National')}><MapPin size={18} /> <span>{t('news.national')}</span></div>
                <div className={`nav-item ${activeTab === 'Business' ? 'active' : ''}`} onClick={() => setActiveTab('Business')}><Briefcase size={18} /> <span>{t('news.business')}</span></div>
                <div className={`nav-item ${activeTab === 'Trending' ? 'active' : ''}`} onClick={() => setActiveTab('Trending')}><TrendingUp size={18} /> <span>{t('news.trending')}</span></div>
              </nav>
            </div>
          </aside>

          {/* ══════ CENTER FEED ══════ */}
          <main className="hub-feed">
            
            {/* ── Category Tabs (Pill Toggles) ── */}
            <div className="hub-tabs">
              {['Global', 'National', 'Business', 'Trending'].map((tab) => (
                <button
                  key={tab}
                  className={`hub-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {t(`news.${tab.toLowerCase()}`)}
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
                        {renderPostCard(topStory, true, 0)}
                      </motion.div>
                    )}

                    {/* STANDARD POST CARDS FROM RSS */}
                    {newsItems.map((item, idx) => (
                      <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                        {renderPostCard(item, false, idx + 1)}
                      </motion.div>
                    ))}

                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </main>

          {/* ══════ RIGHT SIDEBAR ══════ */}
          {isRegistered && (
            <aside className="hub-sidebar right-sidebar">
              <div className="sticky-pane">
                
                {/* Live Exchange Rates Billboard */}
                <GlassCard 
                  className="pulse-widget rates-billboard-widget hover-lift"
                  onClick={() => setIsRateModalOpen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="billboard-header">
                    <h3 className="widget-title">Live Exchange Rates</h3>
                    <span className="live-badge">
                      <span className="live-dot"></span> LIVE
                    </span>
                  </div>
                  <div className="billboard-ticker-board">
                    {Object.keys(RATE_DELTAS).map((pair) => {
                      const data = RATE_DELTAS[pair];
                      return (
                        <div key={pair} className="ticker-row">
                          <span className="ticker-pair">{pair}</span>
                          <span className="ticker-price">{data.price}</span>
                          <span className={`ticker-delta ${data.up ? 'delta-up' : 'delta-down'}`}>
                            {data.up ? '▲' : '▼'} {data.delta}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="billboard-footer">
                    <span>Click to open converter & cross rates</span>
                  </div>
                </GlassCard>

                {/* Market Insights */}
                <GlassCard className="pulse-widget insights-widget">
                  <h3 className="widget-title">Market Insights</h3>
                  <div className="insights-list">
                    <div className="insight-item">
                      <div className="insight-icon-wrapper salary">
                        <TrendingUp size={16} />
                      </div>
                      <div className="insight-content">
                        <h4>Tech Salary Index</h4>
                        <p>Global tech salaries increased by <strong>+4.8%</strong> this quarter, driven by AI roles.</p>
                      </div>
                    </div>
                    
                    <div className="insight-item">
                      <div className="insight-icon-wrapper remote">
                        <Globe size={16} />
                      </div>
                      <div className="insight-content">
                        <h4>Remote Hiring Trend</h4>
                        <p>Remote contracts compose <strong>32.4%</strong> of new tech postings, up from 30.1% last month.</p>
                      </div>
                    </div>

                    <div className="insight-item">
                      <div className="insight-icon-wrapper demand">
                        <Users size={16} />
                      </div>
                      <div className="insight-content">
                        <h4>Talent Supply</h4>
                        <p>Senior engineer vacancy duration is down to <strong>18 days</strong>, indicating high demand velocity.</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Trending News */}
                <GlassCard className="pulse-widget trending-news-widget">
                  <h3 className="widget-title">
                    {t('news.trending')} News
                  </h3>
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

              </div>
            </aside>
          )}

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

