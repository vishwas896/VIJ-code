'use client';
import React from 'react';
import { Building, Users, Briefcase, Activity, ChevronRight } from 'lucide-react';
import './Dashboards.css';

export const RecruiterDashboard: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-header glass-panel">
        <div>
          <h1>Acme Corp Talent Portal</h1>
          <p>You have 12 new applicants to review today.</p>
        </div>
        <button className="primary-btn">Post a New Job</button>
      </div>

      <div className="dashboard-bento-grid recruiter-grid">
        <div className="bento-widget pipeline-widget glass-panel">
          <div className="widget-header">
            <h3><Users size={20} /> Talent Pipeline</h3>
            <button className="icon-btn"><ChevronRight size={16}/></button>
          </div>
          <div className="pipeline-kanban">
            <div className="kanban-col">
              <span className="col-title">New (12)</span>
              <div className="kanban-card">Alex R. - 94% Match</div>
              <div className="kanban-card">Sarah C. - 88% Match</div>
            </div>
            <div className="kanban-col">
              <span className="col-title">Screening (4)</span>
              <div className="kanban-card highlight">Mike T. - Phone Screen</div>
            </div>
            <div className="kanban-col">
              <span className="col-title">Interview (2)</span>
              <div className="kanban-card">Emily W. - Technical</div>
            </div>
          </div>
        </div>

        <div className="bento-widget active-jobs-widget glass-panel">
          <div className="widget-header">
            <h3><Briefcase size={20} /> Active Listings</h3>
          </div>
          <div className="jobs-list">
            <div className="job-card">
              <div className="job-info">
                <h4>Sr. Frontend Engineer</h4>
                <span>45 Applicants • 12 New</span>
              </div>
              <button className="outline-btn">Manage</button>
            </div>
            <div className="job-card">
              <div className="job-info">
                <h4>Product Designer</h4>
                <span>18 Applicants • 3 New</span>
              </div>
              <button className="outline-btn">Manage</button>
            </div>
          </div>
        </div>

        <div className="bento-widget radar-widget glass-panel">
          <div className="widget-header">
            <h3><Activity size={20} /> Talent Radar</h3>
          </div>
          <div className="radar-map-placeholder">
            <p>14 top candidates active near San Francisco</p>
            <button className="primary-btn">Open Radar Map</button>
          </div>
        </div>

        <div className="bento-widget brand-widget glass-panel">
          <div className="widget-header">
            <h3><Building size={20} /> Company Brand</h3>
          </div>
          <div className="brand-preview">
            <div className="brand-score">Excellent</div>
            <p>Your profile is highly attractive to candidates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
