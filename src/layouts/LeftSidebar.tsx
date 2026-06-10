'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Compass, 
  Users, 
  UserPlus, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Bookmark, 
  Radio
} from 'lucide-react';
import './LeftSidebar.css';
import { useLanguage } from '../context/LanguageContext';

export const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { icon: <Compass size={18} />, label: 'Discover Talent', to: '/network/discover', highlight: true },
    { icon: <Users size={18} />, label: 'My Connections', to: '/network', badge: 1 },
    { icon: <UserPlus size={18} />, label: 'Requests', to: '/network/requests', badge: 1 },
    { icon: <MapPin size={18} />, label: 'Nearby People', to: '/network/nearby' },
    { icon: <Briefcase size={18} />, label: 'Industry Groups', to: '/groups', badge: 6 },
    { icon: <Calendar size={18} />, label: 'Events', to: '/events' },
    { icon: <Bookmark size={18} />, label: 'Saved Profiles', to: '/saved' },
  ];

  return (
    <aside className="global-left-sidebar">
      <div className="left-sidebar-inner">
        
        <nav className="ls-nav-menu">
          {navItems.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.to}
              className={`ls-nav-item ${pathname === item.to || (item.highlight && pathname === '/network') ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
            >
              <div className="ls-nav-icon">{item.icon}</div>
              <span className="ls-nav-label">{item.label}</span>
              {item.badge && <span className="ls-nav-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className="ls-radar-scanner">
          <div className="radar-icon-wrap">
            <Radio size={20} className="radar-pulse-icon" />
          </div>
          <div className="radar-info">
            <h5 className="radar-title">RADAR SCANNER</h5>
            <span className="radar-status">Active Globally</span>
          </div>
        </div>

      </div>
    </aside>
  );
};
