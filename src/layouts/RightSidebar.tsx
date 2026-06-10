'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, Activity, Briefcase, ShoppingBag, 
  Settings, Palette, LogOut, LogIn, Rocket, Menu, X, 
  ChevronLeft, ChevronRight, UserCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { VijLogo } from '../components/common/VijLogo';
import './RightSidebar.css';

export const RightSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { preferences } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside (if locked)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isLocked) {
          setIsLocked(false);
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLocked]);

  // Support toggling from header avatar clicks (e.g. on mobile/desktop)
  useEffect(() => {
    const handleExternalToggle = () => {
      setIsOpen(prev => !prev);
      setIsLocked(prev => !prev);
    };
    window.addEventListener('toggle-right-sidebar', handleExternalToggle);
    return () => window.removeEventListener('toggle-right-sidebar', handleExternalToggle);
  }, []);

  const isRecruiter = user?.role === 'recruiter';
  const profileHref = isAuthenticated 
    ? (isRecruiter ? '/recruiter/profile' : '/profile/me') 
    : '/login';

  // Role-specific links inspired by the reference layout, fallback for guests
  const navItems = isAuthenticated ? [
    {
      label: 'Dashboard',
      icon: <LayoutGrid size={20} />,
      href: isRecruiter ? '/recruiter/dashboard' : (user?.onboardingCompleted ? '/seeker/dashboard' : '/onboarding/parameters'),
      active: pathname.startsWith('/recruiter/dashboard') || pathname.startsWith('/seeker/dashboard') || pathname.startsWith('/onboarding/parameters')
    },
    {
      label: 'My activity',
      icon: <Activity size={20} />,
      href: '/activity',
      active: pathname.startsWith('/activity')
    },
    {
      label: 'Services',
      icon: <Briefcase size={20} />,
      href: '/services',
      active: pathname.startsWith('/services')
    },
    {
      label: 'Orders',
      icon: <ShoppingBag size={20} />,
      href: '/wallet',
      active: pathname.startsWith('/wallet')
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />,
      href: '/settings/account',
      active: pathname.startsWith('/settings') && !pathname.includes('/appearance')
    },
    {
      label: 'Themes',
      icon: <Palette size={20} />,
      href: '/settings/appearance',
      active: pathname.includes('/appearance')
    }
  ] : [
    {
      label: 'Dashboard',
      icon: <LayoutGrid size={20} />,
      href: '/login',
      active: false
    },
    {
      label: 'My activity',
      icon: <Activity size={20} />,
      href: '/login',
      active: false
    },
    {
      label: 'Services',
      icon: <Briefcase size={20} />,
      href: '/services',
      active: pathname.startsWith('/services')
    },
    {
      label: 'Orders',
      icon: <ShoppingBag size={20} />,
      href: '/login',
      active: false
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />,
      href: '/login',
      active: false
    },
    {
      label: 'Themes',
      icon: <Palette size={20} />,
      href: '/login',
      active: false
    }
  ];

  const handleMouseEnter = () => {
    if (!isLocked) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked) {
      setIsOpen(false);
    }
  };

  const handleMenuClick = () => {
    setIsOpen(true);
    setIsLocked(true);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsLocked(false);
  };

  return (
    <div 
      ref={sidebarRef}
      className={`right-sidebar-container ${isOpen ? 'expanded' : 'collapsed'} ${isLocked ? 'locked' : ''} layout-${preferences.layoutMode}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Header / Brand Logo ── */}
      <div className="sidebar-brand-area">
        {!isOpen ? (
          <button 
            className="sidebar-menu-btn collapsed-btn" 
            onClick={handleMenuClick}
            title="Open Menu"
          >
            <Menu size={20} />
          </button>
        ) : (
          <>
            <motion.div 
              className="brand-logo-group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VijLogo size="sm" showText={true} theme={preferences.darkMode ? 'dark' : 'light'} />
            </motion.div>
            
            <button 
              className="sidebar-menu-btn close-btn" 
              onClick={handleCloseClick}
              title="Close Menu"
            >
              <X size={20} />
            </button>
          </>
        )}
      </div>

      {/* ── User Profile Badge ── */}
      <Link href={profileHref} className="sidebar-profile-card">
        <div className="sidebar-avatar-wrapper">
          {isAuthenticated ? (
            <img 
              src="/profile_avatar.png" 
              alt={user?.name || "Profile"} 
              className="sidebar-avatar-img"
            />
          ) : (
            <div className="sidebar-avatar-circle guest">
              <UserCircle size={24} />
            </div>
          )}
          <span className="online-indicator-dot" />
        </div>
        {isOpen && (
          <motion.div 
            className="sidebar-profile-details"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <h4 className="profile-name-text">{isAuthenticated ? (user?.name || 'Alex Thompson') : 'Guest User'}</h4>
            <span className="profile-role-title">
              {isAuthenticated ? (isRecruiter ? (user?.roleTitle || 'Recruiter') : (user?.roleTitle || 'Executive')) : 'Explore Junction'}
            </span>
          </motion.div>
        )}
      </Link>

      {/* ── Navigation Links ── */}
      <nav className="sidebar-nav-links">
        {navItems.map((item, idx) => (
          <Link 
            key={item.label}
            href={item.href}
            className={`sidebar-nav-item-link ${item.active ? 'active' : ''}`}
          >
            <div className="sidebar-nav-icon">{item.icon}</div>
            {isOpen && (
              <motion.span 
                className="sidebar-nav-label"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
              >
                {item.label}
              </motion.span>
            )}
            {item.active && (
              <motion.div 
                className="sidebar-active-indicator" 
                layoutId="sidebar-active-line"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* ── Footer Logout/Login Action ── */}
      <div className="sidebar-footer-area">
        {isAuthenticated ? (
          <button className="sidebar-logout-button-item" onClick={logout}>
            <div className="sidebar-nav-icon"><LogOut size={20} /></div>
            {isOpen && (
              <motion.span 
                className="sidebar-nav-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Logout
              </motion.span>
            )}
          </button>
        ) : (
          <Link href="/login" className="sidebar-logout-button-item" style={{ textDecoration: 'none' }}>
            <div className="sidebar-nav-icon"><LogIn size={20} style={{ color: '#10b981' }} /></div>
            {isOpen && (
              <motion.span 
                className="sidebar-nav-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: '#10b981' }}
              >
                Login
              </motion.span>
            )}
          </Link>
        )}
      </div>
    </div>
  );
};
