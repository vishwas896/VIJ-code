'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight, FileText, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';
import { InteractionBar } from './InteractionBar';

export interface PostAuthor {
  name: string;
  avatar: string;
  title: string;
  company: string;
  industry: string;
  isIncognito: boolean;
  incognitoTitle?: string;
}

export interface Post {
  id: number;
  author: PostAuthor;
  content: string;
  type: 'photos' | 'video' | 'pdf' | 'link' | 'code';
  skills: string[];
  media: string[]; // URL/paths or slide contents
  linkPreview?: {
    title: string;
    description: string;
    domain: string;
    logo: string;
    banner: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
  };
  applauds: number;
  comments: number;
}

interface FeedCardProps {
  post: Post;
  userSkills: string[];
  mockConnections: string[];
  globalPrivacyPrefs: {
    mask_profile_avatar_to_guests: boolean;
    allow_unregistered_viewing_of_posts: boolean;
    hide_current_employer_name: boolean;
    restrict_direct_messages_to_match_only: boolean;
    exclude_salary_expectations_from_search: boolean;
  };
  userIncognitoMode: boolean; // Simulation of seeker incognito override
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  userSkills = [],
  mockConnections,
  globalPrivacyPrefs,
  userIncognitoMode,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [pdfPageIndex, setPdfPageIndex] = useState(0);
  const [videoMuted, setVideoMuted] = useState(true);
  const [showMaskedProfileModal, setShowMaskedProfileModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play silently on scroll observer
  useEffect(() => {
    if (post.type !== 'video' || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);
    return () => {
      observer.disconnect();
    };
  }, [post.type]);

  // Masking logics
  const isAuthorIncognito = post.author.isIncognito || (post.author.name === 'Verified User' && userIncognitoMode);
  
  // Format Author Name: Masked if Incognito, or professional mask format
  const getDisplayName = () => {
    if (isAuthorIncognito) {
      return post.author.incognitoTitle || '[Verified Senior Engineer - FinTech]';
    }
    // Professional format: Alex D. | Lead Dev
    const parts = post.author.name.split(' ');
    const firstName = parts[0];
    const lastInitial = parts[1] ? ` ${parts[1][0]}.` : '';
    const cleanTitle = getDisplayTitle();
    return `${firstName}${lastInitial} | ${cleanTitle}`;
  };

  const getDisplayTitle = () => {
    return post.author.title;
  };

  const getDisplayCompany = () => {
    if (globalPrivacyPrefs.hide_current_employer_name || isAuthorIncognito) {
      return 'Confidential Employer';
    }
    return post.author.company;
  };

  // Check parameter matches for badges. Glow green (#059669) if matched.
  const isSkillMatched = (skill: string) => {
    return userSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
  };

  // Navigations for Photos
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === 0 ? post.media.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === post.media.length - 1 ? 0 : prev + 1));
  };

  // Navigations for PDF
  const handlePrevPdfPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPdfPageIndex((prev) => (prev === 0 ? post.media.length - 1 : prev - 1));
  };

  const handleNextPdfPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPdfPageIndex((prev) => (prev === post.media.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="feed-card">
        {/* ── CARD HEADER ── */}
        <div className="feed-card-header">
          <div className="feed-card-author-info" onClick={() => setShowMaskedProfileModal(true)}>
            <div className="feed-card-avatar-wrapper">
              <img
                src={post.author.avatar}
                alt="Author Avatar"
                className={`w-full h-full object-cover ${
                  globalPrivacyPrefs.mask_profile_avatar_to_guests || isAuthorIncognito
                    ? 'feed-card-avatar-masked'
                    : ''
                }`}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="feed-card-identity">
              <span className="feed-card-author-name">
                {getDisplayName()}
                {isAuthorIncognito && (
                  <span className="feed-card-incognito-badge">
                    Incognito
                  </span>
                )}
              </span>
              <span className="feed-card-author-title">
                {getDisplayCompany()} • {post.author.industry}
              </span>
            </div>
          </div>

          {/* Parameter Badges */}
          <div className="feed-card-parameters">
            {post.skills.map((skill) => {
              const matched = isSkillMatched(skill);
              return (
                <span
                  key={skill}
                  className={`param-badge ${matched ? 'param-badge-match' : ''}`}
                  title={matched ? 'Matches your profile parameters' : undefined}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* ── CARD BODY ── */}
        <div className="feed-card-body">
          <p className="feed-card-text">{post.content}</p>

          {/* Dynamic Media Handlers */}
          <div className="feed-media-container">
            {/* 1. Photos & Portfolios */}
            {post.type === 'photos' && (
              <div className="feed-image-gallery">
                <img
                  src={post.media[photoIndex]}
                  alt={`Portfolio ${photoIndex + 1}`}
                  className="feed-gallery-image"
                />
                {post.media.length > 1 && (
                  <>
                    <button className="feed-gallery-nav prev" onClick={handlePrevPhoto}>
                      <ChevronLeft size={18} />
                    </button>
                    <button className="feed-gallery-nav next" onClick={handleNextPhoto}>
                      <ChevronRight size={18} />
                    </button>
                    <div className="feed-gallery-dots">
                      {post.media.map((_, idx) => (
                        <span
                          key={idx}
                          className={`feed-gallery-dot ${idx === photoIndex ? 'active' : ''}`}
                          onClick={() => setPhotoIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 2. Videos & Reels with Hover-to-unmute */}
            {post.type === 'video' && (
              <div
                className="feed-video-wrapper"
                onMouseEnter={() => setVideoMuted(false)}
                onMouseLeave={() => setVideoMuted(true)}
              >
                <video
                  ref={videoRef}
                  src={post.media[0]}
                  className="feed-video-player"
                  loop
                  muted={videoMuted}
                  playsInline
                />
                <div 
                  className="feed-video-unmute-overlay"
                  onClick={() => setVideoMuted(!videoMuted)}
                >
                  {videoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{videoMuted ? 'Muted (Hover to Unmute)' : 'Playing'}</span>
                </div>
              </div>
            )}

            {/* 3. PDF Slide Deck Carousel */}
            {post.type === 'pdf' && (
              <div className="feed-pdf-slider">
                <div className="feed-pdf-content-area">
                  <div className="feed-pdf-page-view">
                    <div className="feed-pdf-header">
                      <span className="feed-pdf-title">Slide Presentation Deck</span>
                      <span className="feed-pdf-page-num">
                        Page {pdfPageIndex + 1} of {post.media.length}
                      </span>
                    </div>
                    <div className="feed-pdf-body">
                      <div className="feed-pdf-mock-visual">
                        <FileText size={32} className="text-red-500" />
                      </div>
                      <p style={{ fontWeight: 500 }}>{post.media[pdfPageIndex]}</p>
                    </div>
                    <div className="feed-pdf-footer">
                      VIJ Secure Documents Mediation Buckets (Anti-Scraping Active)
                    </div>
                  </div>
                  {post.media.length > 1 && (
                    <>
                      <button className="feed-gallery-nav prev" onClick={handlePrevPdfPage}>
                        <ChevronLeft size={16} />
                      </button>
                      <button className="feed-gallery-nav next" onClick={handleNextPdfPage}>
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>
                <div className="feed-pdf-indicator">Swipeable Case Study</div>
              </div>
            )}

            {/* 4. Link Frosted Preview Card */}
            {post.type === 'link' && post.linkPreview && (
              <a
                href={`https://${post.linkPreview.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="feed-link-preview"
                style={{ width: '100%', height: '100%' }}
              >
                <div
                  className="feed-link-banner"
                  style={{ backgroundImage: `url(${post.linkPreview.banner})` }}
                />
                <div className="feed-link-info">
                  <div className="feed-link-meta-row">
                    <img
                      src={post.linkPreview.logo}
                      alt="Favicon"
                      className="feed-link-logo"
                    />
                    <span>{post.linkPreview.domain}</span>
                    <ExternalLink size={10} />
                  </div>
                  <span className="feed-link-title">{post.linkPreview.title}</span>
                  <span className="feed-link-desc">{post.linkPreview.description}</span>
                </div>
              </a>
            )}

            {/* 5. Code snippet */}
            {post.type === 'code' && post.codeSnippet && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: 'var(--space-sm)',
                  background: '#1e1e2e',
                  color: '#cdd6f4',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #313244',
                    paddingBottom: '4px',
                    marginBottom: '8px',
                    color: '#a6adc8',
                  }}
                >
                  <span>snippet.{post.codeSnippet.language}</span>
                  <span>TypeScript Engine</span>
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  <code>{post.codeSnippet.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* ── CARD INTERACTION BAR ── */}
        <InteractionBar
          postId={post.id}
          commentsCount={post.comments}
          applaudsCount={post.applauds}
          mockConnections={mockConnections}
        />
      </div>

      {/* ── MASKED BENTO PORTFOLIO VIEW MODAL ── */}
      {showMaskedProfileModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowMaskedProfileModal(false)}
        >
          <div
            className="vij-glass"
            style={{
              width: '100%',
              maxWidth: '620px',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              background: 'rgba(255, 255, 255, 0.85)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bento Banner */}
            <div
              style={{
                height: '110px',
                background: 'linear-gradient(135deg, #fef2f2, #fffbeb)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '24px',
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid white',
                  background: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src={post.author.avatar}
                  alt="Avatar"
                  className={
                    globalPrivacyPrefs.mask_profile_avatar_to_guests || isAuthorIncognito
                      ? 'feed-card-avatar-masked'
                      : ''
                  }
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Bento Content */}
            <div style={{ padding: '40px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getDisplayName()}
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </h3>
                  <p style={{ fontSize: '12px', margin: 0, color: 'var(--vij-text-muted)' }}>
                    Senior Engineer • {post.author.industry} Sector
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="share-transmit-btn"
                    style={{ background: 'var(--accent-azure)', color: 'white', padding: '6px 16px', fontSize: '12px' }}
                    onClick={() => alert('Connection invitation transmitted.')}
                  >
                    Connect
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginTop: '8px',
                }}
              >
                {/* Stats Seeker Bento Card */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    padding: '12px',
                    borderRadius: '16px',
                  }}
                >
                  <span style={{ fontSize: '10px', color: 'var(--vij-text-muted)', fontWeight: 600 }}>
                    MATCH SCORE
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>
                    92% Alignment
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    padding: '12px',
                    borderRadius: '16px',
                  }}
                >
                  <span style={{ fontSize: '10px', color: 'var(--vij-text-muted)', fontWeight: 600 }}>
                    EXPERIENCE LAYER
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: 800 }}>6+ Years</div>
                </div>
              </div>

              {/* Masked Contact Overlay */}
              <div
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px dashed rgba(220, 38, 38, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  overflow: 'hidden',
                  marginTop: '8px',
                  textAlign: 'center',
                }}
              >
                {/* Blurry text placeholders */}
                <div style={{ filter: 'blur(4px)', opacity: 0.5, fontSize: '12px', pointerEvents: 'none' }}>
                  Email: alex.developer.example@gmail.com
                  <br />
                  Phone: +1 (555) 019-2834
                  <br />
                  Github: github.com/alex-dev-lead
                </div>

                {/* Frost overlay mask */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <Lock size={16} className="text-red-500" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--vij-text-main)' }}>
                    🔒 PII Privacy Shield Active
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--vij-text-muted)', maxWidth: '80%' }}>
                    Direct contact parameters are securely masked behind VIJ mediation. Apply to unlock parameters.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  className="interaction-btn"
                  onClick={() => setShowMaskedProfileModal(false)}
                  style={{ border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  Close Bento View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
