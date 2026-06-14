'use client';
import React, { useState } from 'react';
import { BookOpen, GraduationCap, Code, Trophy, MapPin, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './StudentProfile.css';

export default function StudentProfile() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    school: '',
    college: '',
    university: '',
    degree: user?.education || '',
    cgpa: '',
    technicalSkills: user?.skills?.join(', ') || '',
    softSkills: '',
    languages: '',
    workshops: '',
    courses: '',
    certifications: user?.certifications?.join(', ') || '',
    projects: '',
    internships: '',
    volunteerWork: '',
    desiredRole: '',
    desiredIndustry: '',
    desiredLocation: '',
    mentorPreference: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile({
      education: formData.degree,
      skills: formData.technicalSkills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
      // we could expand User type to save other student fields here
    });
  };

  if (!user || user.role !== 'student') return null;

  return (
    <div className="student-profile-root">
      
      <div className="sp-banner">
        <div className="sp-banner-text">
          <h1>Student Profile</h1>
          <p>Highlight your learning journey, projects, and career aspirations.</p>
        </div>
        <GraduationCap size={48} color="var(--accent-azure)" style={{ opacity: 0.8 }} />
      </div>

      <div className="sp-section">
        <h2 className="sp-section-title"><BookOpen size={18} color="var(--accent-azure)" /> Education</h2>
        <div className="sp-grid">
          <div className="sp-field">
            <label className="sp-label">School</label>
            <input name="school" className="sp-input" value={formData.school} onChange={handleChange} placeholder="High School Name" />
          </div>
          <div className="sp-field">
            <label className="sp-label">College</label>
            <input name="college" className="sp-input" value={formData.college} onChange={handleChange} placeholder="College Name" />
          </div>
          <div className="sp-field">
            <label className="sp-label">University</label>
            <input name="university" className="sp-input" value={formData.university} onChange={handleChange} placeholder="University Name" />
          </div>
          <div className="sp-field">
            <label className="sp-label">Degree</label>
            <input name="degree" className="sp-input" value={formData.degree} onChange={handleChange} placeholder="B.Tech, B.Sc, etc." />
          </div>
          <div className="sp-field">
            <label className="sp-label">CGPA / Percentage</label>
            <input name="cgpa" className="sp-input" value={formData.cgpa} onChange={handleChange} placeholder="8.5 / 85%" />
          </div>
        </div>
      </div>

      <div className="sp-section">
        <h2 className="sp-section-title"><Code size={18} color="var(--accent-azure)" /> Skills & Learning</h2>
        <div className="sp-grid">
          <div className="sp-field full">
            <label className="sp-label">Technical Skills (comma separated)</label>
            <input name="technicalSkills" className="sp-input" value={formData.technicalSkills} onChange={handleChange} placeholder="React, Python, Figma..." />
          </div>
          <div className="sp-field">
            <label className="sp-label">Soft Skills</label>
            <input name="softSkills" className="sp-input" value={formData.softSkills} onChange={handleChange} placeholder="Leadership, Communication..." />
          </div>
          <div className="sp-field">
            <label className="sp-label">Languages</label>
            <input name="languages" className="sp-input" value={formData.languages} onChange={handleChange} placeholder="English, Hindi..." />
          </div>
          <div className="sp-field full">
            <label className="sp-label">Certifications</label>
            <input name="certifications" className="sp-input" value={formData.certifications} onChange={handleChange} placeholder="AWS Cloud Practitioner, Coursera React..." />
          </div>
          <div className="sp-field full">
            <label className="sp-label">Workshops & Courses Attended</label>
            <textarea name="workshops" className="sp-input sp-textarea" value={formData.workshops} onChange={handleChange} placeholder="List major workshops or courses..." />
          </div>
        </div>
      </div>

      <div className="sp-section">
        <h2 className="sp-section-title"><Trophy size={18} color="var(--accent-azure)" /> Experience & Projects</h2>
        <div className="sp-grid">
          <div className="sp-field full">
            <label className="sp-label">Major Projects</label>
            <textarea name="projects" className="sp-input sp-textarea" value={formData.projects} onChange={handleChange} placeholder="Describe your key academic or personal projects..." />
          </div>
          <div className="sp-field full">
            <label className="sp-label">Internships</label>
            <textarea name="internships" className="sp-input sp-textarea" value={formData.internships} onChange={handleChange} placeholder="Any internship experience..." />
          </div>
          <div className="sp-field full">
            <label className="sp-label">Volunteer Work / Extracurriculars</label>
            <textarea name="volunteerWork" className="sp-input sp-textarea" value={formData.volunteerWork} onChange={handleChange} placeholder="Clubs, societies, volunteer work..." />
          </div>
        </div>
      </div>

      <div className="sp-section">
        <h2 className="sp-section-title"><Target size={18} color="var(--accent-azure)" /> Career Goals</h2>
        <div className="sp-grid">
          <div className="sp-field">
            <label className="sp-label">Desired Role</label>
            <input name="desiredRole" className="sp-input" value={formData.desiredRole} onChange={handleChange} placeholder="Frontend Developer, Data Analyst..." />
          </div>
          <div className="sp-field">
            <label className="sp-label">Industry</label>
            <input name="desiredIndustry" className="sp-input" value={formData.desiredIndustry} onChange={handleChange} placeholder="Tech, Finance, Healthcare..." />
          </div>
          <div className="sp-field">
            <label className="sp-label"><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Desired Location</label>
            <input name="desiredLocation" className="sp-input" value={formData.desiredLocation} onChange={handleChange} placeholder="Bangalore, Remote..." />
          </div>
          <div className="sp-field">
            <label className="sp-label">Mentor Preference</label>
            <input name="mentorPreference" className="sp-input" value={formData.mentorPreference} onChange={handleChange} placeholder="Looking for mentors in..." />
          </div>
        </div>
      </div>

      <button className="sp-save-btn" onClick={handleSave}>
        Save Student Profile
      </button>

    </div>
  );
}
