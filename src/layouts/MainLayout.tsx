'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
import { Footer } from '../components/footer/Footer';
import './MainLayout.css';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { preferences } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Scroll-aware header detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    const timer = window.setTimeout(() => setMobileNavOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

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
        <Link href="/" className="logo-container">
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
              ? pathname === '/' 
              : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                href={link.to}
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
                href={
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
                href="/settings" 
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
                        <Link href="/profile/me" className="profile-dropdown-item" onClick={() => setShowProfile(false)}>
                          <User size={16} /> My Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                      >
                        <Link href="/settings/account" className="profile-dropdown-item" onClick={() => setShowProfile(false)}>
                          <Settings size={16} /> Settings
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
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
              <Link href="/login" className="login-trigger-btn">
                Log In
              </Link>

              <Link href="/register" className="join-nav-btn">
                Join Junction
              </Link>
            </>
          )}
        </div>
      </header>

      <BackJobsBar />
      
      <main className="main-content" style={{ position: 'relative', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={pathname} style={{ width: '100%' }}>
            {children}
          </motion.div>
        </AnimatePresence>
        
        {!isAuthenticated && <GuestBanner />}
      </main>

      <Footer />
      
      {isAuthenticated && <FloatingMessenger />}
    </LiquidBackground>
  );
};
