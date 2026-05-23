import React, { useState, useEffect } from 'react';
import { useLocation, useOutlet, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LayoutDashboard, LogOut, User, Menu, X, Settings } from 'lucide-react';
import { LiquidBackground } from '../components/LiquidBackground';
import { GuestBanner } from '../components/GuestBanner';
import { VijLogo } from '../components/VijLogo';
import { BackJobsBar } from '../components/BackJobsBar';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { FloatingMessenger } from '../components/FloatingMessenger';
import { CurrencySelector } from '../components/CurrencySelector';
import { useTheme } from '../context/ThemeContext';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const element = useOutlet();
  const { isAuthenticated, user, logout } = useAuth();
  const { preferences } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isBottom, setIsBottom] = useState(false);

  // Scroll-aware header and footer bottom detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const threshold = 100; // px tolerance
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + threshold;
      const scrolledToBottom = isScrollable && 
        (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold);
      setIsBottom(scrolledToBottom);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Close mobile nav and collapse footer on route change
  useEffect(() => {
    setIsBottom(false);
    const timer = window.setTimeout(() => setMobileNavOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/news', label: 'News' },
    { to: '/roadmaps', label: 'Roadmaps' },
    { to: '/network', label: 'Network' },
    { to: '/services', label: 'Services' },
  ];

  return (
    <LiquidBackground>
      {preferences.backgroundImage && (
        <div 
          className="personalization-bg-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${preferences.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
            filter: `blur(${preferences.blurIntensity}px)`,
            pointerEvents: 'none',
            zIndex: -1,
            transition: 'background-image 0.5s ease, filter 0.5s ease, opacity 0.5s ease',
          }}
        />
      )}
      <header className={`global-header ${scrolled ? 'header-scrolled' : ''}`}>
        {/* ── Logo ── */}
        <Link to="/" className="logo-container">
          <VijLogo size="sm" theme="light" />
        </Link>

        {/* ── Mobile Hamburger ── */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* ── Center Navigation with Sliding Indicator ── */}
        <nav className={`global-nav ${mobileNavOpen ? 'nav-open' : ''}`}>
          {navLinks.map((link) => {
            const isActive = link.to === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive ? 'nav-active' : ''}`}
              >
                {link.label}
                {isActive && (
                  <motion.span 
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Utilities ── */}
        <div className="nav-utilities">
          {isAuthenticated ? (
            <>
              {/* Dashboard Link */}
              <Link 
                to={
                  user?.role === 'recruiter' 
                    ? '/recruiter/dashboard' 
                    : user?.onboardingCompleted 
                      ? '/seeker/dashboard' 
                      : '/onboarding/parameters'
                } 
                className="nav-dashboard-btn"
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <CurrencySelector />
                {/* Wallet hidden — coming soon */}
              </div>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  className={`nav-bell ${showNotifs ? 'active' : ''}`} 
                  aria-label="Notifications"
                  onClick={() => setShowNotifs(!showNotifs)}
                >
                  <Bell size={18} />
                  <span className="bell-dot" />
                </button>
                <AnimatePresence>
                  {showNotifs && (
                    <NotificationDropdown onClose={() => setShowNotifs(false)} />
                  )}
                </AnimatePresence>
              </div>

              {/* Settings button */}
              <Link 
                to="/settings" 
                className="nav-settings-btn"
                title="Settings"
              >
                <Settings size={18} />
              </Link>

              {/* User Profile Avatar with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  className="nav-avatar" 
                  title="My Profile"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <span>{user?.name?.split(' ').map((n: string) => n[0]).join('') || 'VU'}</span>
                </button>
                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="profile-dropdown-header">
                        <h4>{user?.name || 'VIJ User'}</h4>
                        <span>{user?.role || 'Guest'}</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        <Link to="/profile/me" className="profile-dropdown-item" onClick={() => setShowProfile(false)}>
                          <User size={16} /> My Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <button className="profile-dropdown-item logout-item" onClick={logout}>
                          <LogOut size={16} /> Log Out
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <CurrencySelector />
              <Link to="/login" className="login-trigger-btn">
                Log In
              </Link>

              <Link to="/register" className="join-nav-btn">
                Join Junction
              </Link>
            </>
          )}
        </div>
      </header>

      <BackJobsBar />
      
      <main className="main-content" style={{ position: 'relative', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          {element && React.cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
        
        {!isAuthenticated && <GuestBanner />}
      </main>

      {/* ── GLOBAL FOOTER ── */}
      <footer className={`global-footer ${isBottom ? 'footer-expanded-bottom' : ''}`}>
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo-container">
              <VijLogo size="sm" theme="light" />
            </Link>
            <p>A skill-based hiring ecosystem designed to bridge the gap between talent and opportunity.</p>
          </div>
          <div className="footer-columns">
            <div className="footer-col">
              <h4>Browse Jobs</h4>
              <Link to="/jobs">Jobs by Role</Link>
              <Link to="/jobs">Jobs by City</Link>
              <Link to="/jobs">Jobs by Industry</Link>
              <Link to="/salary-insights">Salary Insights</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <Link to="/roadmaps">Career Roadmaps</Link>
              <Link to="/services">Premium Services</Link>
              <Link to="/learning-center/1">Learning Center</Link>
              <Link to="/about">Success Stories</Link>
            </div>
            <div className="footer-col">
              <h4>Social</h4>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-status-left">
            <span>© 2026 Virtual Intelligent Junction (VIJ). All rights reserved.</span>
          </div>
          <div className="footer-status-right">
            <span className="footer-msme-badge">Registered MSME</span>
            <span className="footer-status-dot-green">● Platform Active</span>
          </div>
        </div>
      </footer>
      
      {isAuthenticated && <FloatingMessenger />}
    </LiquidBackground>
  );
};
