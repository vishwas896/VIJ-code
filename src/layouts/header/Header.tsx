'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Menu, X, Search } from 'lucide-react';
import { VijLogo } from '../../components/common/VijLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown, DropdownNotifItem } from '../NotificationDropdown';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const { preferences } = useTheme();
  const { t } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [notifications, setNotifications] = useState<DropdownNotifItem[]>([
    { id: 1, type: 'job', title: 'New Match: Sr. Frontend Engineer', desc: 'Google (100% match)', time: '2m ago', color: '#0ea5e9', priority: true },
    { id: 2, type: 'action', title: 'Radar Alert: Near You', desc: '3 professionals just active near you', time: '15m ago', color: '#f59e0b', priority: true },
    { id: 3, type: 'connection', title: 'New Connection Request', desc: 'Talent Scout from Apple wants to connect', time: '1h ago', color: '#10b981' },
    { id: 4, type: 'system', title: 'Profile Boost Active', desc: 'Your profile visibility is now boosted for 24h', time: '3h ago', color: '#a855f7' },
  ]);

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
    { to: isAuthenticated ? '/home' : '/', label: t('nav.home') },
    { to: '/jobs', label: t('nav.jobs') },
    { to: '/news', label: t('nav.news') },
    { to: '/roadmaps', label: t('nav.roadmaps') },
    { to: '/network', label: t('nav.network') },
    { to: '/services', label: t('nav.services') },
  ];

  return (
    <header className={`global-header ${scrolled ? 'header-scrolled' : ''} has-sidebar`}>
      {/* ── Logo ── */}
      <Link href={isAuthenticated ? '/home' : '/'} className="logo-container">
        <VijLogo size="sm" theme={preferences.darkMode ? 'dark' : 'light'} />
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
            : link.to === '/home'
              ? pathname === '/home'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              {/* Global Search */}
              <div className="header-search-box">
                <Search size={16} />
                <input type="text" placeholder="Search jobs, people..." />
              </div>

              <LanguageSelector />
              <CurrencySelector />
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                className={`nav-bell ${showNotifs ? 'active' : ''}`} 
                aria-label="Notifications"
                onClick={() => setShowNotifs(!showNotifs)}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="bell-badge">{notifications.length}</span>
                )}
              </button>
              {showNotifs && (
                <NotificationDropdown 
                  notifications={notifications}
                  setNotifications={setNotifications}
                  onClose={() => setShowNotifs(false)} 
                />
              )}
            </div>

            {/* Profile Avatar / Switcher */}
            <Link href="/settings" className="header-avatar" style={{ marginLeft: '8px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-azure)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Link>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LanguageSelector />
              <CurrencySelector />
            </div>
            <Link href="/login" className="login-trigger-btn">
              {t('nav.login')}
            </Link>

            <Link href="/register" className="join-nav-btn">
              {t('nav.join')}
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
export default Header;
