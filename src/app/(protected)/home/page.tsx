'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FilterTabs } from './components/FilterTabs';
import { FeedCard, Post } from './components/FeedCard';
import { Shield, Sparkles, Filter, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
import './components/Feed.css';

// Mock list of 1st-degree connections for sharing
const MOCK_CONNECTIONS = [
  'Alex Rivera | Tech Lead',
  'Jessica Vance | Talent Partner',
  'Liam Murphy | Director of Eng',
  'Sophia Chen | Senior Designer',
];

// Mock posts
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: {
      name: 'Sarah Jenkins',
      avatar: '/profile_avatar.png',
      title: 'Sr. Frontend Architect',
      company: 'Stripe',
      industry: 'Engineering',
      isIncognito: false,
    },
    content: 'Just finished preparing our architectural guidelines for the next-generation micro-frontend platform. Here is a flip-through slide deck summarizing the key design points. Fully secure and anti-scraping protected.',
    type: 'pdf',
    skills: ['React', 'Next.js', 'System Design', 'Micro-frontends'],
    media: [
      'Design Principles: Modularity & Lazy Loading. Splitting bundles by feature boundaries.',
      'State Hydration across Micro-Apps. Storing shared state in a lightweight window event bus.',
      'Routing & Layout Nesting in Next.js App Router using segment layouts.',
      'Performance Optimization Benchmarks: Achieving sub-200ms hydration times.'
    ],
    applauds: 42,
    comments: 7,
  },
  {
    id: 2,
    author: {
      name: 'David Chen',
      avatar: '/profile_avatar.png',
      title: 'Lead Video Engineer',
      company: 'Netflix',
      industry: 'Engineering',
      isIncognito: false,
    },
    content: 'Quick live demo of our low-latency real-time video stream component using WebRTC and Canvas rendering. Auto-plays silently, hover over to unmute and hear the sound profile!',
    type: 'video',
    skills: ['WebRTC', 'TypeScript', 'React', 'Video Rendering'],
    media: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'],
    applauds: 108,
    comments: 24,
  },
  {
    id: 3,
    author: {
      name: 'Emily Watson',
      avatar: '/profile_avatar.png',
      title: 'Principal Designer',
      company: 'Vercel',
      industry: 'Design',
      isIncognito: false,
    },
    content: 'Visual walkthrough of our new design system components. Implementing glassmorphic panels and fluid dark-mode transitions. Let me know your thoughts on the grid spacing!',
    type: 'photos',
    skills: ['Figma', 'CSS', 'Design System', 'UI/UX'],
    media: [
      '/media__1779956329601.png',
      '/media__1779889340932.png',
      '/media__1779621181454.png'
    ],
    applauds: 88,
    comments: 18,
  },
  {
    id: 4,
    author: {
      name: 'Marcus Vance',
      avatar: '/profile_avatar.png',
      title: 'Principal Product Manager',
      company: 'Google',
      industry: 'Product',
      isIncognito: true,
      incognitoTitle: '[Verified Senior PM - FinTech]',
    },
    content: 'Fascinating write-up on the evolution of career mediation portals and the critical importance of PII privacy layers for high-signal job searching. Read the full piece below.',
    type: 'link',
    skills: ['Product Management', 'Privacy Layer', 'Data Protection'],
    media: [],
    linkPreview: {
      title: 'The Evolution of Career Mediation: Why Privacy Matters',
      description: 'How modern platforms are using PII masking and verified credentials to bypass recruiter bias and protect intellectual property.',
      domain: 'techcrunch.com',
      logo: 'https://www.google.com/s2/favicons?domain=techcrunch.com&sz=64',
      banner: '/media__1779954740633.png',
    },
    applauds: 35,
    comments: 5,
  },
  {
    id: 5,
    author: {
      name: 'Verified User',
      avatar: '/profile_avatar.png',
      title: 'Security Lead',
      company: 'Google',
      industry: 'Engineering',
      isIncognito: false,
    },
    content: 'Here is a code snippet of our PII masking parser. It dynamically replaces user-identifying regex patterns (emails, telephone numbers, external links) with secure mediation badges before sending payloads.',
    type: 'code',
    skills: ['TypeScript', 'Git', 'Security', 'Data Masking'],
    media: [],
    codeSnippet: {
      language: 'typescript',
      code: `export function maskPersonalInfo(payload: UserPayload): MaskedPayload {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g;
  const phoneRegex = /\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}/g;
  
  return {
    ...payload,
    email: '[🔒 Locked PII Overlay]',
    phone: '[🔒 Locked PII Overlay]',
    bio: payload.bio
      .replace(emailRegex, '[Email Masked]')
      .replace(phoneRegex, '[Phone Masked]')
  };
}`,
    },
    applauds: 56,
    comments: 12,
  },
];

export default function HomeFeedPage() {
  const { user } = useAuth();
  
  // User skills default backup
  const userSkills = user?.skills || ['React', 'TypeScript', 'CSS', 'Next.js', 'Git'];

  // Tab State
  const [activeTab, setActiveTab] = useState<'industry' | 'trending' | 'connections'>('industry');

  // User Privacy Configuration Matrix State (local state simulated for the demo panel)
  const [privacyPrefs, setPrivacyPrefs] = useState({
    mask_profile_avatar_to_guests: true,
    allow_unregistered_viewing_of_posts: false,
    hide_current_employer_name: false,
    restrict_direct_messages_to_match_only: true,
    exclude_salary_expectations_from_search: false,
  });

  // Incognito Mode Seeker override simulation state
  const [seekerIncognito, setSeekerIncognito] = useState(false);

  const togglePreference = (key: keyof typeof privacyPrefs) => {
    setPrivacyPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter logic based on active tab
  const getFilteredPosts = () => {
    let posts = [...INITIAL_POSTS];

    // Priority 1: Industry Relevance (My Industry)
    if (activeTab === 'industry') {
      const userIndustry = user?.industry || 'Engineering';
      posts.sort((a, b) => {
        const aMatches = a.author.industry.toLowerCase() === userIndustry.toLowerCase();
        const bMatches = b.author.industry.toLowerCase() === userIndustry.toLowerCase();
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return b.applauds - a.applauds; // secondary sorting by applauds
      });
    }

    // Priority 2: Trending Value
    if (activeTab === 'trending') {
      posts.sort((a, b) => b.applauds + b.comments - (a.applauds + a.comments));
    }

    // Priority 3: Connections
    if (activeTab === 'connections') {
      // For demonstration, connection posts are subset of items representing connections' company or author name matches
      posts = posts.filter(
        (p) =>
          p.author.name.includes('Jenkins') ||
          p.author.name.includes('Watson') ||
          p.author.isIncognito
      );
    }

    return posts;
  };

  const filteredPosts = getFilteredPosts();

  // Count active matched badges in current visible feed
  const totalMatchedBadges = filteredPosts.reduce((acc, post) => {
    const matches = post.skills.filter((skill) =>
      userSkills.some((us) => us.toLowerCase() === skill.toLowerCase())
    ).length;
    return acc + matches;
  }, 0);

  return (
    <div className="vij-page" style={{ padding: 'var(--space-md) var(--space-sm)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-md)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Junction Stream Pipeline
          <Sparkles size={20} className="text-red-500" />
        </h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--vij-text-muted)', margin: 0 }}>
          High-signal professional feed matching your parameter values. Strict PII masking and secure mediation enabled.
        </p>
      </div>

      <div className="feed-layout-container">
        {/* ── LEFT COLUMN: Filter & Feed Cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {/* Sliders to filter feed */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <FilterTabs activeTab={activeTab} onChangeTab={setActiveTab} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-xs)', color: 'var(--vij-text-muted)' }}>
              <Filter size={12} />
              <span>Prioritized by: {activeTab === 'industry' ? 'Skill & Industry Relevance' : activeTab === 'trending' ? 'Global Engagement Velocity' : '1st-Degree Circle'}</span>
            </div>
          </div>

          {/* Feed Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredPosts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                userSkills={userSkills}
                mockConnections={MOCK_CONNECTIONS}
                globalPrivacyPrefs={privacyPrefs}
                userIncognitoMode={seekerIncognito}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Privacy Controls & Stats Bento ── */}
        <div className="privacy-panel-wrapper">
          <div className="privacy-control-card">
            <div className="privacy-panel-header">
              <Shield size={18} className="text-red-500" />
              <span className="privacy-panel-title">Privacy Preference Control Matrix</span>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--vij-text-muted)', marginBottom: 'var(--space-sm)' }}>
              Select how your personal credentials, portfolio, and identity are distributed through VIJ's secure client buckets.
            </p>

            {/* Matrix Options */}
            <div className="privacy-option-item">
              <div className="privacy-checkbox-wrapper">
                <input
                  id="mask_profile_avatar_to_guests"
                  type="checkbox"
                  className="privacy-toggle-input"
                  checked={privacyPrefs.mask_profile_avatar_to_guests}
                  onChange={() => togglePreference('mask_profile_avatar_to_guests')}
                />
              </div>
              <div className="privacy-option-text">
                <label htmlFor="mask_profile_avatar_to_guests" className="privacy-option-label">
                  Mask Profile Avatar to Guests
                </label>
                <span className="privacy-option-desc">
                  Blurs headshots and images to unauthenticated viewers.
                </span>
              </div>
            </div>

            <div className="privacy-option-item">
              <div className="privacy-checkbox-wrapper">
                <input
                  id="allow_unregistered_viewing_of_posts"
                  type="checkbox"
                  className="privacy-toggle-input"
                  checked={privacyPrefs.allow_unregistered_viewing_of_posts}
                  onChange={() => togglePreference('allow_unregistered_viewing_of_posts')}
                />
              </div>
              <div className="privacy-option-text">
                <label htmlFor="allow_unregistered_viewing_of_posts" className="privacy-option-label">
                  Allow Public Viewing
                </label>
                <span className="privacy-option-desc">
                  If off, posts require logged-in sessions to load content assets.
                </span>
              </div>
            </div>

            <div className="privacy-option-item">
              <div className="privacy-checkbox-wrapper">
                <input
                  id="hide_current_employer_name"
                  type="checkbox"
                  className="privacy-toggle-input"
                  checked={privacyPrefs.hide_current_employer_name}
                  onChange={() => togglePreference('hide_current_employer_name')}
                />
              </div>
              <div className="privacy-option-text">
                <label htmlFor="hide_current_employer_name" className="privacy-option-label">
                  Hide Current Employer Name
                </label>
                <span className="privacy-option-desc">
                  Replaces company titles with 'Confidential Employer' sector info.
                </span>
              </div>
            </div>

            <div className="privacy-option-item">
              <div className="privacy-checkbox-wrapper">
                <input
                  id="restrict_direct_messages_to_match_only"
                  type="checkbox"
                  className="privacy-toggle-input"
                  checked={privacyPrefs.restrict_direct_messages_to_match_only}
                  onChange={() => togglePreference('restrict_direct_messages_to_match_only')}
                />
              </div>
              <div className="privacy-option-text">
                <label htmlFor="restrict_direct_messages_to_match_only" className="privacy-option-label">
                  Match-Only Direct Messaging
                </label>
                <span className="privacy-option-desc">
                  Restricts unsolicited messages unless skill alignment score &gt; 80%.
                </span>
              </div>
            </div>

            {/* Incognito Seeker Mode Banner */}
            <div className="incognito-toggle-banner">
              <div className="incognito-toggle-header">
                <span className="incognito-toggle-title">
                  <UserCheck size={14} />
                  Strict Mediation Seeker Mode
                </span>
                <button
                  onClick={() => setSeekerIncognito(!seekerIncognito)}
                  style={{
                    background: seekerIncognito ? '#4f46e5' : 'rgba(0,0,0,0.1)',
                    color: seekerIncognito ? 'white' : 'var(--vij-text-muted)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {seekerIncognito ? <EyeOff size={10} /> : <Eye size={10} />}
                  {seekerIncognito ? 'Incognito ON' : 'Incognito OFF'}
                </button>
              </div>
              <p style={{ fontSize: '10px', margin: 0, color: 'rgba(0,0,0,0.6)', lineHeight: 1.4 }}>
                If enabled, your public posts & documents display verified anonymous labels (e.g. <code>[Verified Senior Engineer - FinTech]</code>) to keep you safe from current employer detection.
              </p>
            </div>

            {/* Real-time stats */}
            <div
              style={{
                marginTop: 'var(--space-md)',
                paddingTop: 'var(--space-sm)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)' }}>
                <span style={{ color: 'var(--vij-text-muted)' }}>Active Seeker Skills:</span>
                <span style={{ fontWeight: 600 }}>{userSkills.length} Parameter Tags</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)' }}>
                <span style={{ color: 'var(--vij-text-muted)' }}>Glowing Seeker Matches:</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>{totalMatchedBadges} in Feed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)' }}>
                <span style={{ color: 'var(--vij-text-muted)' }}>Anti-Scraping Buckets:</span>
                <span style={{ color: '#0ea5e9', fontWeight: 600 }}>Active & Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
