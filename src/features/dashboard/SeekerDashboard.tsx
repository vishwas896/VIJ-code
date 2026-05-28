'use client';
import React from 'react';
import { Target, Kanban, Briefcase, BookOpen, ChevronRight } from 'lucide-react';
import './Dashboards.css';

export const SeekerDashboard: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-header glass-panel">
        <div>
          <h1>Welcome back, Alex! 👋</h1>
          <p>Your profile is 85% complete. You are on track for your Senior role.</p>
        </div>
        <button className="primary-btn">Update Status</button>
      </div>

      <div className="dashboard-bento-grid">
        <div className="bento-widget roadmap-widget glass-panel">
          <div className="widget-header">
            <h3><Target size={20} /> My Career Roadmap</h3>
            <button className="icon-btn"><ChevronRight size={16}/></button>
          </div>
          <div className="timeline-container">
            <div className="timeline-item completed">
              <div className="node"></div>
              <p>Profile Optimization</p>
            </div>
            <div className="timeline-item active">
              <div className="node"></div>
              <p>Master System Design</p>
            </div>
            <div className="timeline-item">
              <div className="node"></div>
              <p>Mock Interviews</p>
            </div>
          </div>
        </div>

        <div className="bento-widget app-tracker-widget glass-panel">
          <div className="widget-header">
            <h3><Kanban size={20} /> Applications</h3>
            <button className="icon-btn"><ChevronRight size={16}/></button>
          </div>
          <div className="mini-kanban">
            <div className="kanban-col">
              <span className="col-title">Applied (3)</span>
              <div className="kanban-card">Google - Sr. Engineer</div>
            </div>
            <div className="kanban-col">
              <span className="col-title">Interview (1)</span>
              <div className="kanban-card highlight">Apple - Lead Dev</div>
            </div>
          </div>
        </div>

        <div className="bento-widget jobs-widget glass-panel">
          <div className="widget-header">
            <h3><Briefcase size={20} /> Recommended Jobs</h3>
          </div>
          <div className="jobs-list">
            <div className="job-card">
              <div className="job-info">
                <h4>Frontend Architect</h4>
                <span>Stripe • Remote</span>
              </div>
              <div className="match-score">94% Match</div>
            </div>
            <div className="job-card">
              <div className="job-info">
                <h4>Sr. Software Engineer</h4>
                <span>Netflix • Los Gatos</span>
              </div>
              <div className="match-score">89% Match</div>
            </div>
          </div>
        </div>

        <div className="bento-widget learning-widget glass-panel">
          <div className="widget-header">
            <h3><BookOpen size={20} /> Learning Hub</h3>
          </div>
          <div className="course-card">
            <h4>Advanced React Patterns</h4>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: '60%'}}></div></div>
            <span>60% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};
