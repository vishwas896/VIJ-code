'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/common/PageTransition';
import { BookOpen, GraduationCap, Code, Target, Compass, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'student') return null;

  return (
    <PageTransition>
      <div className="student-dash-root">
        
        {/* Header */}
        <div className="student-dash-header">
          <div>
            <h1 className="student-dash-title">Student Hub</h1>
            <p className="student-dash-subtitle">Welcome back, {user.name}. Here is your learning and career progress.</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="student-kpi-grid">
          <div className="student-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Profile Completion</span>
              <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><CheckCircle2 size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">85%</div>
              <div className="kpi-trend positive"><ArrowUpRight size={14} /> +15% this week</div>
            </div>
          </div>
          
          <div className="student-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Skills Score</span>
              <div className="kpi-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}><Code size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">720</div>
              <div className="kpi-trend positive"><ArrowUpRight size={14} /> Top 20% of peers</div>
            </div>
          </div>

          <div className="student-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Roadmap Progress</span>
              <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><Compass size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">40%</div>
              <div className="kpi-trend">"Frontend Developer" path</div>
            </div>
          </div>

          <div className="student-kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Internship Matches</span>
              <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Target size={20} /></div>
            </div>
            <div>
              <div className="kpi-value">12</div>
              <div className="kpi-trend positive">3 new this week</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="student-modules-grid">
          
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="student-module">
              <div className="module-header">
                <h2 className="module-title"><Compass size={20} color="var(--accent-azure)" /> My Career Roadmaps</h2>
                <button className="item-action" style={{ border: 'none', cursor: 'pointer' }}>View All</button>
              </div>
              <div className="module-list">
                <div className="module-list-item">
                  <div className="item-icon"><Code size={20} /></div>
                  <div className="item-content">
                    <h3 className="item-title">Frontend Developer 2026</h3>
                    <p className="item-subtitle">Next Milestone: Advanced React Patterns</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>40%</div>
                    <div style={{ width: '60px', height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', marginTop: '4px' }}>
                      <div style={{ width: '40%', height: '100%', background: 'var(--accent-azure)', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="student-module">
              <div className="module-header">
                <h2 className="module-title"><Target size={20} color="var(--accent-azure)" /> Recommended Internships</h2>
                <button className="item-action" style={{ border: 'none', cursor: 'pointer' }}>Search Internships</button>
              </div>
              <div className="module-list">
                <div className="module-list-item">
                  <div className="item-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>GO</div>
                  <div className="item-content">
                    <h3 className="item-title">Software Engineering Intern</h3>
                    <p className="item-subtitle">Google • Remote • Summer 2026</p>
                  </div>
                  <button className="item-action" style={{ border: 'none', cursor: 'pointer', background: 'var(--accent-azure)', color: '#fff' }}>Apply</button>
                </div>
                <div className="module-list-item">
                  <div className="item-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>MS</div>
                  <div className="item-content">
                    <h3 className="item-title">Frontend Intern</h3>
                    <p className="item-subtitle">Microsoft • Hyderabad • 6 Months</p>
                  </div>
                  <button className="item-action" style={{ border: 'none', cursor: 'pointer', background: 'var(--accent-azure)', color: '#fff' }}>Apply</button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="student-module">
              <div className="module-header">
                <h2 className="module-title"><Users size={20} color="var(--accent-azure)" /> Mentorship Matches</h2>
              </div>
              <div className="module-list">
                <div className="module-list-item" style={{ padding: '12px 8px' }}>
                  <img src="https://i.pravatar.cc/100?img=11" alt="Mentor" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                  <div className="item-content">
                    <h3 className="item-title" style={{ fontSize: '13px' }}>Sarah Jenkins</h3>
                    <p className="item-subtitle">Senior SDE at Amazon</p>
                  </div>
                  <button className="item-action" style={{ border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '11px' }}>Connect</button>
                </div>
                <div className="module-list-item" style={{ padding: '12px 8px' }}>
                  <img src="https://i.pravatar.cc/100?img=12" alt="Mentor" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                  <div className="item-content">
                    <h3 className="item-title" style={{ fontSize: '13px' }}>Raj Patel</h3>
                    <p className="item-subtitle">Frontend Lead at Flipkart</p>
                  </div>
                  <button className="item-action" style={{ border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '11px' }}>Connect</button>
                </div>
              </div>
            </div>

            <div className="student-module">
              <div className="module-header">
                <h2 className="module-title"><BookOpen size={20} color="var(--accent-azure)" /> Workshops</h2>
              </div>
              <div className="module-list">
                <div className="module-list-item" style={{ padding: '12px 8px' }}>
                  <div className="item-icon" style={{ width: '36px', height: '36px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><GraduationCap size={16} /></div>
                  <div className="item-content">
                    <h3 className="item-title" style={{ fontSize: '13px' }}>System Design 101</h3>
                    <p className="item-subtitle">Tomorrow, 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageTransition>
  );
}
