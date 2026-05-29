'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, Zap, Search, MapPin, Briefcase, 
  ArrowRight, Globe, Code, Laptop, BarChart, 
  Target, GraduationCap, Building2, TrendingUp,
  Star, Clock
} from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { ScrollReveal } from '../components/landing/ScrollReveal';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './PublicLanding.css';

// Stagger container/item variants
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const MARQUEE_LOGOS = [
  'Google', 'Amazon', 'Microsoft', 'Netflix', 'Meta', 'Apple', 
  'Tesla', 'TCS', 'Infosys', 'Wipro', 'Adobe', 'Salesforce',
  'Google', 'Amazon', 'Microsoft', 'Netflix', 'Meta', 'Apple',
];

const CATEGORIES = [
  { icon: <Globe size={24} />, label: 'Remote', count: '12k+' },
  { icon: <Code size={24} />, label: 'IT/Software', count: '45k+' },
  { icon: <Laptop size={24} />, label: 'Marketing', count: '8k+' },
  { icon: <BarChart size={24} />, label: 'Finance', count: '15k+' },
  { icon: <Building2 size={24} />, label: 'Sales', count: '22k+' },
  { icon: <GraduationCap size={24} />, label: 'Freshers', count: '5k+' },
  { icon: <Target size={24} />, label: 'Design', count: '7k+' },
  { icon: <Briefcase size={24} />, label: 'Data Science', count: '3k+' },
];

export const PublicLanding: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { formatCurrency } = useCurrency();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/news');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/jobs');
  };
  
  return (
    <PageTransition>
      <div className="landing-page">

        {/* ═══════ HERO SECTION ═══════ */}
        <section className="hero-section">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Your next career move <br /><span className="text-gradient">starts with intelligence.</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              India's first parameter-based matching engine. <br />
              Connected. Verified. Mediated.
            </motion.p>

            {/* --- SEARCH BAR --- */}
            <motion.div 
              className="hero-search-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <form className="hero-search-bar" onSubmit={handleSearch}>
                <div className="search-field">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Skills, Designation, Companies" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="search-divider" />
                <div className="search-field">
                  <MapPin size={18} className="search-icon" />
                  <input type="text" placeholder="Location or Remote" />
                </div>
                <div className="search-divider" />
                <div className="search-field experience-field">
                  <Briefcase size={18} className="search-icon" />
                  <select defaultValue="">
                    <option value="" disabled>Experience</option>
                    <option value="0">Fresher (0 years)</option>
                    <option value="1">1-3 years</option>
                    <option value="4">4-7 years</option>
                    <option value="8">8+ years</option>
                  </select>
                </div>
                <button type="submit" className="search-submit-btn">
                  Search Jobs
                </button>
              </form>
            </motion.div>

            <motion.div
              className="hero-trust-badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <span>Trusted by 2M+ Seekers</span>
              <span className="dot" />
              <span>50k+ Companies</span>
              <span className="dot" />
              <span>98% Match Accuracy</span>
            </motion.div>
          </div>
        </section>

        {/* ═══════ PHOTO INSPIRATION STRIP (below hero) ═══════ */}
        <section className="photo-strip-section">
          <div className="photo-strip-label">Real people. Real careers. Real India.</div>
          <div className="photo-strip-row">
            <div className="photo-strip-item tall">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80&auto=format&fit=crop"
                alt="Indian office team collaborating"
              />
              <div className="photo-strip-overlay"><span>Team Collaboration</span></div>
            </div>
            <div className="photo-strip-col">
              <div className="photo-strip-item">
                <img
                  src="https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=500&q=80&auto=format&fit=crop"
                  alt="Work from home setup"
                />
                <div className="photo-strip-overlay"><span>Work From Home</span></div>
              </div>
              <div className="photo-strip-item">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80&auto=format&fit=crop"
                  alt="Happy office employees working"
                />
                <div className="photo-strip-overlay"><span>Thriving Workplaces</span></div>
              </div>
            </div>
            <div className="photo-strip-col">
              <div className="photo-strip-item">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80&auto=format&fit=crop"
                  alt="Professional woman in office"
                />
                <div className="photo-strip-overlay"><span>Women in Tech</span></div>
              </div>
              <div className="photo-strip-item">
                <img
                  src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80&auto=format&fit=crop"
                  alt="Remote work video call"
                />
                <div className="photo-strip-overlay"><span>Remote First</span></div>
              </div>
            </div>
            <div className="photo-strip-item tall">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80&auto=format&fit=crop"
                alt="Modern Indian office"
              />
              <div className="photo-strip-overlay"><span>Modern Workspaces</span></div>
            </div>
          </div>
        </section>

        {/* ═══════ POPULAR CATEGORIES ═══════ */}
        <section className="categories-section">
          <ScrollReveal>
            <h2 className="section-title-center">Trending <span className="text-gradient">Categories</span></h2>
            <p className="section-subtitle">Discover roles across industries and work styles.</p>
          </ScrollReveal>

          <motion.div 
            className="categories-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Link href="/jobs" className="category-card-link">
                  <GlassCard className="category-card" glowingEdge="azure">
                    <div className="category-icon">{cat.icon}</div>
                    <div className="category-info">
                      <h3>{cat.label}</h3>
                      <p>{cat.count} Vacancies</p>
                    </div>
                    <ArrowRight size={16} className="category-arrow" />
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ═══════ LIVE STATS BAR ═══════ */}
        <section className="stats-bar">
          <ScrollReveal>
            <div className="stats-grid">
              <div className="stat-item">
                <AnimatedCounter target={142} className="stat-number" />
                <span className="stat-label">Interviews Today</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <AnimatedCounter target={98} suffix="%" className="stat-number" />
                <span className="stat-label">Match Accuracy</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <AnimatedCounter target={1200} suffix="+" className="stat-number" />
                <span className="stat-label">Active Postings</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <AnimatedCounter target={50} suffix="k+" className="stat-number" />
                <span className="stat-label">Verified Profiles</span>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══════ FEATURED JOBS (HOT JOBS) ═══════ */}
        <section className="featured-jobs-section">
          <ScrollReveal>
            <div className="section-header">
              <h2 className="section-title">Hiring <span className="text-gradient">Right Now</span></h2>
              <Link href="/jobs" className="view-all">View All Jobs <span className="arrow">→</span></Link>
            </div>
          </ScrollReveal>

          <div className="featured-jobs-grid">
            {[1, 2, 3].map((i) => (
              <ScrollReveal key={i}>
                <GlassCard className="job-display-card">
                  <div className="job-card-top">
                    <div className="job-company-logo">
                      {['G', 'A', 'M'][i-1]}
                    </div>
                    <div className="job-main-info">
                      <h4>{['Product Designer', 'Frontend Architect', 'AI Researcher'][i-1]}</h4>
                      <p>{['Google', 'Amazon', 'Meta'][i-1]} • {['Remote', 'Bangalore', 'Mumbai'][i-1]}</p>
                    </div>
                  </div>
                  <div className="job-card-details">
                    <span><Clock size={14} /> 2 hours ago</span>
                    <span><TrendingUp size={14} /> 94% Match</span>
                  </div>
                  <div className="job-card-footer">
                    <span className="job-salary">{formatCurrency(1800000 + i * 200000, true)} - {formatCurrency(2400000 + i * 200000, true)}</span>
                    <Link href="/register" className="apply-btn">Quick Apply</Link>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ═══════ WHY VIJ SECTION (AI ADVANTAGE) ═══════ */}
        <section className="why-section">
          <ScrollReveal>
            <h2 className="section-title-center">The <span className="text-gradient">VIJ Advantage</span></h2>
            <p className="section-subtitle">A fundamentally different approach to talent acquisition.</p>
          </ScrollReveal>

          <motion.div 
            className="why-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={staggerItem}>
              <GlassCard className="why-card" glowingEdge="azure">
                <div className="why-icon" style={{ background: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9' }}>
                  <Zap size={28} />
                </div>
                <h3>AI Profile Builder</h3>
                <p>Don't just upload a PDF. Our AI constructs a verified, high-performance identity that recruiters trust instantly.</p>
              </GlassCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <GlassCard className="why-card">
                <div className="why-icon" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>
                  <Shield size={28} />
                </div>
                <h3>Verified Mediation</h3>
                <p>Every skill, every credential, and every phone number is verified. PII remains hidden until a match is confirmed.</p>
              </GlassCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <GlassCard className="why-card" glowingEdge="gold">
                <div className="why-icon" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }}>
                  <Star size={28} />
                </div>
                <h3>Parameter Search</h3>
                <p>Search by exact salary, notice period, and specific tech stack version. No noise, just relevant matches.</p>
              </GlassCard>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════ COMPANY MARQUEE ═══════ */}
        <section className="marquee-section">
          <ScrollReveal>
            <p className="marquee-label">Top hiring companies on VIJ</p>
          </ScrollReveal>
          <div className="marquee-track-wrapper">
            <div className="marquee-track">
              {MARQUEE_LOGOS.map((logo, i) => (
                <span key={i} className="marquee-item">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ LIFE AT WORK — PHOTO MOSAIC ═══════ */}
        <section className="life-at-work-section">
          <ScrollReveal>
            <h2 className="section-title-center">Life at <span className="text-gradient">Work</span></h2>
            <p className="section-subtitle">Thousands of Indians found their dream role through VIJ. Here's a glimpse.</p>
          </ScrollReveal>
          <div className="law-mosaic">
            <div className="law-mosaic-left">
              <div className="law-photo-card wide">
                <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&q=80&auto=format&fit=crop" alt="Professional job interview" />
                <div className="law-photo-caption">
                  <span className="law-quote-mark">"</span>
                  <p>Got placed at a top startup within 2 weeks of joining VIJ.</p>
                  <small>— Arjun S., Full Stack Developer, Bangalore</small>
                </div>
              </div>
              <div className="law-photo-pair">
                <div className="law-photo-card">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80&auto=format&fit=crop" alt="Video call meeting" />
                  <div className="law-photo-caption small">
                    <p>Remote roles that actually pay well.</p>
                  </div>
                </div>
                <div className="law-photo-card">
                  <img src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80&auto=format&fit=crop" alt="Work from home laptop" />
                  <div className="law-photo-caption small">
                    <p>Flexibility that fits your life.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="law-mosaic-right">
              <div className="law-photo-card tall">
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80&auto=format&fit=crop" alt="Working on laptop in office" />
                <div className="law-photo-caption">
                  <span className="law-quote-mark">"</span>
                  <p>Switched careers at 30 — VIJ's roadmaps showed me exactly how.</p>
                  <small>— Priya M., Data Analyst, Mumbai</small>
                </div>
              </div>
              <div className="law-stat-row">
                <div className="law-stat"><span>2M+</span><p>Job Seekers</p></div>
                <div className="law-stat"><span>₹8L</span><p>Avg. Salary Placed</p></div>
                <div className="law-stat"><span>22 days</span><p>Avg. Time to Offer</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ FINAL CTA ═══════ */}
        <section className="final-cta-section">
          <ScrollReveal>
            <div className="final-cta-content">
              <h2>Ready to find your <span className="text-gradient">perfect match</span>?</h2>
              <p>Join thousands of professionals and recruiters already on the Junction.</p>
              <div className="hero-cta-group">
                <Link href="/register" className="primary-cta">Create Free Account →</Link>
                <Link href="/jobs" className="secondary-cta">Browse Opportunities</Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </div>
    </PageTransition>
  );
};

