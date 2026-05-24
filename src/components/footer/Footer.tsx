'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import { VijLogo } from '../VijLogo';
import { useTheme } from '../../context/ThemeContext';
import './Footer.css';

// Inline brand icon SVGs to support all lucide-react version variations
const LinkedinIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const GithubIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const DiscordIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 127.14 96.36" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,73.1,0c.81.71,1.68,1.4,2.58,2a68.45,68.45,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,48.12,123.6,25.26,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.9,46,53.9,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.14,46,96.14,53,91,65.69,84.69,65.69Z" />
  </svg>
);

interface FooterLink {
  label: string;
  to: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const Footer: React.FC = () => {
  const { preferences } = useTheme();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Mobile accordion state (which sections are expanded)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Platform': false,
    'Resources': false,
    'Company': false
  });

  const sections: FooterSection[] = [
    {
      title: 'Platform',
      links: [
        { label: 'Career Roadmaps', to: '/roadmaps' },
        { label: 'Salary Insights', to: '/salary-insights' },
        { label: 'Skill Gap Analyzer', to: '/services' },
        { label: 'Pivot Explorer', to: '/services' },
        { label: 'Interview Prep', to: '/services' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', to: '/about' },
        { label: 'Blog', to: '/news' },
        { label: 'Community Bowls', to: '/network' },
        { label: 'Career Stories', to: '/about' },
        { label: 'Webinars', to: '/about' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Privacy Policy', to: '/policy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Cookie Policy', to: '/policy' }
      ]
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setErrorMsg('Please enter an email address.');
      return;
    }
    
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // Simulate API registration call
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg('Subscription failed. Please try again.');
    }
  };

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <footer className={`vij-footer-wrapper ${preferences.darkMode ? 'dark-theme' : 'light-theme'}`}>
      <GlassCard className="vij-footer-card" glowingEdge="none" tilt={false}>
        <div className="vij-footer-container">
          
          {/* ── Brand description column ── */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-logo-link" aria-label="Project VIJ Home">
              <VijLogo size="sm" theme={preferences.darkMode ? 'dark' : 'light'} />
            </Link>
            <p className="footer-tagline">“Your career, mapped by experience.”</p>
            <p className="footer-desc">
              AI‑powered career roadmaps, community mentorship, and transparent job insights.
            </p>
          </div>

          {/* ── Link columns ── */}
          {sections.map((section) => (
            <div key={section.title} className="footer-links-col">
              {/* Desktop heading */}
              <h4 className="footer-col-title desktop-only">{section.title}</h4>
              
              {/* Mobile accordion trigger */}
              <button 
                className="footer-col-title-btn mobile-only" 
                onClick={() => toggleSection(section.title)}
                aria-expanded={expandedSections[section.title]}
                aria-controls={`footer-links-${section.title}`}
              >
                <span>{section.title}</span>
                {expandedSections[section.title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Link List */}
              <ul 
                id={`footer-links-${section.title}`} 
                className={`footer-links-list ${expandedSections[section.title] ? 'expanded' : ''}`}
              >
                {section.links.map((link) => {
                  const isActive = pathname === link.to;
                  return (
                    <li key={link.label}>
                      <Link 
                        href={link.to} 
                        className={`footer-link ${isActive ? 'active' : ''}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* ── Newsletter signup & social column ── */}
          <div className="footer-newsletter-col">
            <h4 className="footer-col-title">Stay Connected</h4>
            <p className="newsletter-text">Subscribe to our newsletter for insights and feature releases.</p>
            
            <form onSubmit={handleSubscribe} className="newsletter-form" noValidate>
              <div className="newsletter-input-group">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className={`newsletter-input ${status === 'error' ? 'input-error' : ''}`}
                  disabled={status === 'loading' || status === 'success'}
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? 'footer-newsletter-error' : undefined}
                />
                
                <GlassButton
                  type="submit"
                  variant="primary"
                  className="newsletter-submit-btn"
                  loading={status === 'loading'}
                  disabled={status === 'success'}
                  aria-label="Subscribe to newsletter"
                >
                  <Send size={14} />
                </GlassButton>
              </div>

              {/* Status messages */}
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div 
                    className="newsletter-feedback success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Thanks for subscribing!</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div 
                    id="footer-newsletter-error"
                    className="newsletter-feedback error"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Social media icons */}
            <div className="footer-social-row">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn" 
                aria-label="VIJ on LinkedIn"
              >
                <LinkedinIcon size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn" 
                aria-label="VIJ on Twitter"
              >
                <TwitterIcon size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn" 
                aria-label="VIJ on YouTube"
              >
                <YoutubeIcon size={20} />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn" 
                aria-label="VIJ on Discord"
              >
                <DiscordIcon size={20} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn" 
                aria-label="VIJ on GitHub"
              >
                <GithubIcon size={20} />
              </a>
            </div>

          </div>
        </div>

        {/* ── Copyright footer bottom ── */}
        <div className="vij-footer-bottom">
          <div className="footer-bottom-container">
            <span>© 2025 Project VIJ. All rights reserved.</span>
            <div className="footer-bottom-badges">
              <span className="msme-badge">Registered MSME</span>
              <span className="status-badge"><span className="status-dot"></span>Platform Active</span>
            </div>
          </div>
        </div>

      </GlassCard>
    </footer>
  );
};

