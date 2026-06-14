import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Compass, Briefcase, Users, MessageSquare, 
  Bell, Bookmark, Settings, Building2, BookOpen
} from 'lucide-react';
import './LeftSidebar.css';

export const LeftSidebar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!isAuthenticated || !user) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const getNavItems = () => {
    const baseItems = [
      { label: 'Home Feed', icon: <Home size={20} />, path: '/network', active: pathname === '/network' || pathname === '/' },
      { label: 'Network', icon: <Users size={20} />, path: '/network/connections', active: isActive('/network/connections') },
      { label: 'Messages', icon: <MessageSquare size={20} />, path: '/network/chat', active: isActive('/network/chat') },
      { label: 'Notifications', icon: <Bell size={20} />, path: '/notifications', active: isActive('/notifications') },
    ];

    if (user.role === 'student') {
      return [
        ...baseItems,
        { label: 'Student Hub', icon: <Compass size={20} />, path: '/student/dashboard', active: isActive('/student/dashboard') },
        { label: 'Learning Center', icon: <BookOpen size={20} />, path: '/learning-center', active: isActive('/learning-center') },
        { label: 'Saved Jobs', icon: <Bookmark size={20} />, path: '/jobs/saved', active: isActive('/jobs/saved') },
      ];
    }

    if (user.role === 'job_seeker') {
      return [
        ...baseItems,
        { label: 'Career Hub', icon: <Compass size={20} />, path: '/seeker/dashboard', active: isActive('/seeker/dashboard') },
        { label: 'Jobs Search', icon: <Briefcase size={20} />, path: '/jobs', active: isActive('/jobs') },
        { label: 'Saved Jobs', icon: <Bookmark size={20} />, path: '/jobs/saved', active: isActive('/jobs/saved') },
      ];
    }

    if (user.role === 'recruiter') {
      return [
        ...baseItems,
        { label: 'Recruiter Hub', icon: <Briefcase size={20} />, path: '/recruiter/dashboard', active: isActive('/recruiter/dashboard') },
        { label: 'My Company', icon: <Building2 size={20} />, path: '/company-setup', active: isActive('/company') },
        { label: 'Talent Pool', icon: <Users size={20} />, path: '/recruiter/talent', active: isActive('/recruiter/talent') },
      ];
    }

    return baseItems;
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
