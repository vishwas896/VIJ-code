'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Briefcase, LayoutDashboard, Settings, Activity, ShoppingBag, 
  Map, Users, GraduationCap, Building2, Calendar, FileText, LogOut
} from 'lucide-react';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'student' | 'job_seeker' | 'recruiter';
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [identity, setIdentity] = useState<'personal' | 'professional'>('personal');

  const personalLinks = [
    { label: 'Personal Dashboard', icon: <LayoutDashboard size={18} />, active: true },
    { label: 'My Services', icon: <Briefcase size={18} /> },
    { label: 'My Activity', icon: <Activity size={18} /> },
    { label: 'Orders', icon: <ShoppingBag size={18} /> },
    { label: 'Settings', icon: <Settings size={18} /> },
  ];

  const getProfessionalLinks = () => {
    switch(userRole) {
      case 'student':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
          { label: 'My Skills', icon: <FileText size={18} /> },
          { label: 'My Jobs (18+)', icon: <Briefcase size={18} /> },
          { label: 'Roadmaps', icon: <Map size={18} /> },
          { label: 'Connections', icon: <Users size={18} /> },
          { label: 'Internships', icon: <GraduationCap size={18} /> },
          { label: 'Workshops', icon: <Calendar size={18} /> },
        ];
      case 'job_seeker':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
          { label: 'My Jobs', icon: <Briefcase size={18} /> },
          { label: 'My Skills', icon: <FileText size={18} /> },
          { label: 'Roadmaps', icon: <Map size={18} /> },
          { label: 'Connections', icon: <Users size={18} /> },
        ];
      case 'recruiter':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
          { label: 'My Company', icon: <Building2 size={18} /> },
          { label: 'Create Jobs', icon: <Briefcase size={18} /> },
          { label: 'Interviews', icon: <Calendar size={18} /> },
          { label: 'Employees', icon: <Users size={18} /> },
          { label: 'Connections', icon: <Users size={18} /> },
        ];
    }
  };

  const currentLinks = identity === 'personal' ? personalLinks : getProfessionalLinks();

  return (
    <div className="dashboard-root">
      
      {/* Top Navbar */}
      <nav className="dash-navbar">
        <div className="dash-nav-left">
          <h1 className="dash-logo">VIJ</h1>
        </div>

        <div className="identity-toggle-container">
          <motion.div 
            className="identity-pill-slider" 
            animate={{ 
              x: identity === 'personal' ? '4px' : 'calc(100% + 4px)',
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <button 
            className={`identity-btn ${identity === 'personal' ? 'active' : ''}`}
            onClick={() => setIdentity('personal')}
          >
            <User size={16} /> Personal
          </button>
          <button 
            className={`identity-btn ${identity === 'professional' ? 'active' : ''}`}
            onClick={() => setIdentity('professional')}
          >
            <Briefcase size={16} /> Professional
          </button>
        </div>

        <div className="dash-nav-right">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '2px solid rgba(255,255,255,0.5)' }} />
        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="dash-layout">
        
        {/* Dynamic Sidebar */}
        <aside className="dash-sidebar">
          <div className="sidebar-role-badge">
            {identity === 'personal' ? 'Personal Account' : userRole.replace('_', ' ')}
          </div>
          
          {currentLinks.map(link => (
            <a key={link.label} className={`dash-nav-item ${link.active ? 'active' : ''}`}>
              {link.icon} {link.label}
            </a>
          ))}

          <a className="dash-nav-item logout" style={{ marginTop: 'auto' }}>
            <LogOut size={18} /> Log out
          </a>
        </aside>

        {/* Dynamic Main Content */}
        <main className="dash-content">
          <motion.div
            key={identity}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>
              {identity === 'personal' ? 'Personal Overview' : 'Professional Operations'}
            </h2>
            {children}
          </motion.div>
        </main>

      </div>
    </div>
  );
}
