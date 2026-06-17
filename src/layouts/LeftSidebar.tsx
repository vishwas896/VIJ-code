import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Briefcase, Users, MessageSquare, Settings, BarChart3
} from 'lucide-react';
import './LeftSidebar.css';

export const LeftSidebar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated || !user) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const getNavItems = () => {
    const commonItems = [
      { label: 'Home', icon: <Home size={20} />, path: '/home', active: pathname === '/home' },
      { label: 'Jobs', icon: <Briefcase size={20} />, path: '/jobs', active: isActive('/jobs') },
      { label: 'Network', icon: <Users size={20} />, path: '/network', active: isActive('/network') },
      { label: 'Messages', icon: <MessageSquare size={20} />, path: '/network/messages', active: isActive('/network/messages') },
    ];

    if (user.role === 'recruiter') {
      return [
        ...commonItems,
        { label: 'Recruiter KPI', icon: <BarChart3 size={20} />, path: '/recruiter/dashboard', active: isActive('/recruiter/dashboard') },
      ];
    }

    return [
      ...commonItems,
      {
        label: user.role === 'student' ? 'Student KPI' : 'Job Seeker KPI',
        icon: <BarChart3 size={20} />,
        path: user.role === 'student' ? '/student/dashboard' : '/seeker/dashboard',
        active: user.role === 'student' ? isActive('/student/dashboard') : isActive('/seeker/dashboard'),
      },
    ];
  };

  return (
    <aside className="global-left-sidebar">
      <div className="sidebar-nav">
        {getNavItems().map((item) => (
          <Link 
            key={item.label}
            href={item.path}
            className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <Link 
          href="/settings"
          className={`sidebar-nav-item ${isActive('/settings') ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <span className="nav-icon"><Settings size={20} /></span>
          <span className="nav-label">Settings</span>
        </Link>
      </div>
    </aside>
  );
};
