'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, Lock, Unlock, Mail, Phone, ExternalLink, 
  Briefcase, Award, BookOpen, Users, CheckCircle, 
  TrendingUp, Coins, MessageSquare, ThumbsUp, Share2, 
  Globe, Building, Users2, ArrowRight, Clock, Shield,
  ChevronLeft, ChevronRight, Play, EyeOff, Eye, FileText,
  Pencil, Trash2, Plus, Check, Loader
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { VijLogo } from '../../../../components/common/VijLogo';
import './UserProfile.css';

// ── Mock Data Pools ──
const STUDENT_MOCK = {
  institution: "IGNOU BCA (Indira Gandhi National Open University)",
  semester: "Semester 4",
  grades: "CGPA 9.20 / 10.00",
  certifications: ["Oracle Java SE Certified", "AWS Developer Associate", "Interactive UX Principles"],
  roadmap: [
    { id: 1, title: "Next.js Core Concepts", desc: "Routing, Server actions, and layout trees", completed: true },
    { id: 2, title: "TypeScript & State Management", desc: "Context API, reducer actions, hooks", completed: true },
    { id: 3, title: "Tailwind CSS & Design Systems", desc: "Frosted layouts, custom frames, variables", completed: false },
    { id: 4, title: "Node.js & Database Systems", desc: "SQL schema design, REST API endpoints", completed: false }
  ],
  badges: ["React Core", "Git Master", "UI Architect", "Next-Gen Developer"]
};

const SEEKER_MOCK = {
  experience: [
    { id: 1, role: "Senior Frontend Architect", company: "Aether Tech Solutions", duration: "2024 - Present", desc: "Spearheaded Next.js migration, reducing page load latency by 32%. Managed team of 4 designers and developers." },
    { id: 2, role: "Frontend UI Developer", company: "Nexus Core Solutions", duration: "2022 - 2024", desc: "Built highly interactive components using Tailwind CSS and Framer Motion. Accelerated queue response rate by 14% through layout optimizations." }
  ],
  parameters: {
    desiredTitle: "Lead UI/UX Interaction Engineer",
    targetSalary: "$110,000 - $140,000 / yr",
    location: "Bengaluru, India (Hybrid / Remote)",
    coreTech: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"]
  },
  pii: {
    email: "alex.thompson@junction.vij",
    phone: "+91 98765 43210",
    website: "https://alex-designs.vij"
  },
  highlights: [
    { id: 1, title: "Interactive Bento Dashboard", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-38622-large.mp4", thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80" },
    { id: 2, title: "Core System Case Study", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80" },
    { id: 3, title: "Liquid Glass Figma Layout", type: "image", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80" }
  ]
};

const RECRUITER_MOCK = {
  company: "Virtual Intelligent Junction Inc.",
  rating: "Tier-1 Verified Partner",
  employees: "150-200 Active Workers",
  reviews: "94% Aggregate Score",
  pipeline: [
    { id: 1, role: "Senior Rust Architect", matched: "18 Candidates", progress: 85 },
    { id: 2, role: "UI/UX Interaction Lead", matched: "24 Candidates", progress: 60 },
    { id: 3, role: "Next.js Frontend Developer", matched: "9 Candidates", progress: 40 }
  ],
  activity: [
    { id: 1, title: "Unlocked Candidate Portfolio", desc: "Verified Front-End Architect from Delhi", time: "2h ago", type: "unlock" },
    { id: 2, title: "Scheduled Interview Room", desc: "3-Pane interview for Rust Lead", time: "4h ago", type: "interview" },
    { id: 3, title: "Approved Hiring Ticket", desc: "Tech Lead added to Aether Team", time: "1d ago", type: "hire" }
  ]
};

const INITIAL_FEED_POSTS = [
  { id: 1, author: "Alex Thompson", text: "Excited to share that we just finalized our new Liquid Glass design tokens! Check out the backdrop blurs and spring curves.", applauds: 48, comments: [ { author: "Sarah Jenkins", text: "Looks clean! The blurs are gorgeous." } ], applauded: false, discussed: false, circulated: false },
  { id: 2, author: "Alex Thompson", text: "Is anyone attending the Next.js meetup in Gurugram tomorrow? Looking forward to connecting and discussing performance.", applauds: 24, comments: [], applauded: false, discussed: false, circulated: false },
  { id: 3, author: "Alex Thompson", text: "Our latest case study on 'Strict Privacy Protocols & Wallet Deductions in Professional Networks' is officially live. Feedback welcomed!", applauds: 92, comments: [], applauded: false, discussed: false, circulated: false }
];

export default function AdaptiveProfilePage() {
  const { isAuthenticated, user, walletBalance, addFunds, updateProfile, logout } = useAuth();
  const router = useRouter();
  
  // Adaptive Role Switcher state
  const [roleMode, setRoleMode] = useState<'STUDENT' | 'JOB_SEEKER' | 'RECRUITER'>('JOB_SEEKER');
  
  // Incognito Preference state
  const [incognitoMode, setIncognitoMode] = useState<boolean>(false);
  
  // PII Unlock Lockout state
  const [piiUnlocked, setPiiUnlocked] = useState<boolean>(false);
  const [unmaskModalOpen, setUnmaskModalOpen] = useState<boolean>(false);

  // Social Feed state
  const [feedPosts, setFeedPosts] = useState(INITIAL_FEED_POSTS);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Horizontal Highlights Carousel Active state
  const [activePdfPage, setActivePdfPage] = useState<number>(1);
  const [hoveredReelId, setHoveredReelId] = useState<number | null>(null);

  // Autosave / Edit States
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | ''>('');
  const [isEditingHero, setIsEditingHero] = useState<boolean>(false);
  const [isEditingStudentNode, setIsEditingStudentNode] = useState<boolean>(false);
  const [isEditingSeekerParams, setIsEditingSeekerParams] = useState<boolean>(false);
  const [isEditingRecruiterCompany, setIsEditingRecruiterCompany] = useState<boolean>(false);

  // Local Form States
  const [heroForm, setHeroForm] = useState({ name: '', roleTitle: '', bio: '' });
  const [studentForm, setStudentForm] = useState({ institution: '', semester: '', grades: '' });
  const [seekerParamsForm, setSeekerParamsForm] = useState({ desiredTitle: '', targetSalary: '', location: '' });
  const [recruiterCompanyForm, setRecruiterCompanyForm] = useState({ company: '', employees: '', reviews: '' });

  // Experience Blocks State
  const [experienceList, setExperienceList] = useState(SEEKER_MOCK.experience);
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);
  const [experienceForm, setExperienceForm] = useState({ role: '', company: '', duration: '', desc: '' });

  // Delete Profile Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Sync state to actual auth role
  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        setRoleMode('RECRUITER');
      } else if (user.education?.includes('BCA') || user.skills?.includes('BCA') || user.education === 'IGNOU BCA') {
        setRoleMode('STUDENT');
      } else {
        setRoleMode('JOB_SEEKER');
      }
    }
  }, [user]);

  // Sync form states from user context
  useEffect(() => {
    if (user) {
      setHeroForm({
        name: user.name || 'Alex Thompson',
        roleTitle: user.roleTitle || (roleMode === 'STUDENT' ? 'Scholar & App Developer' : roleMode === 'RECRUITER' ? RECRUITER_MOCK.company : SEEKER_MOCK.parameters.desiredTitle),
        bio: user.bio || (roleMode === 'STUDENT' ? 'Dedicated computer science candidate exploring enterprise microservices.' : roleMode === 'RECRUITER' ? 'Managing executive hiring velocity.' : 'Driven Full-Stack developer.')
      });
      setStudentForm({
        institution: user.education || STUDENT_MOCK.institution,
        semester: STUDENT_MOCK.semester,
        grades: STUDENT_MOCK.grades
      });
      setSeekerParamsForm({
        desiredTitle: user.roleTitle || SEEKER_MOCK.parameters.desiredTitle,
        targetSalary: SEEKER_MOCK.parameters.targetSalary,
        location: SEEKER_MOCK.parameters.location
      });
      setRecruiterCompanyForm({
        company: user.currentCompany || RECRUITER_MOCK.company,
        employees: RECRUITER_MOCK.employees,
        reviews: RECRUITER_MOCK.reviews
      });
    }
  }, [user, roleMode]);

  // Autosave handler
  const handleAutosave = (updatedFields: any) => {
    setSaveStatus('saving');
    setTimeout(() => {
      updateProfile(updatedFields);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 600);
  };

  const handleHeroAutosave = () => {
    handleAutosave({
      name: heroForm.name,
      roleTitle: heroForm.roleTitle,
      bio: heroForm.bio
    });
    setIsEditingHero(false);
  };

  const handleStudentNodeAutosave = () => {
    STUDENT_MOCK.semester = studentForm.semester;
    STUDENT_MOCK.grades = studentForm.grades;
    handleAutosave({
      education: studentForm.institution
    });
    setIsEditingStudentNode(false);
  };

  const handleSeekerParamsAutosave = () => {
    SEEKER_MOCK.parameters.targetSalary = seekerParamsForm.targetSalary;
    SEEKER_MOCK.parameters.location = seekerParamsForm.location;
    handleAutosave({
      roleTitle: seekerParamsForm.desiredTitle
    });
    setIsEditingSeekerParams(false);
  };

  const handleRecruiterCompanyAutosave = () => {
    RECRUITER_MOCK.employees = recruiterCompanyForm.employees;
    RECRUITER_MOCK.reviews = recruiterCompanyForm.reviews;
    handleAutosave({
      currentCompany: recruiterCompanyForm.company
    });
    setIsEditingRecruiterCompany(false);
  };

  // Experience Handlers
  const handleEditExperience = (exp: any) => {
    setEditingExperienceId(exp.id);
    setExperienceForm({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      desc: exp.desc
    });
  };

  const handleSaveExperience = (id: number) => {
    setSaveStatus('saving');
    const updated = experienceList.map(exp => exp.id === id ? { id, ...experienceForm } : exp);
    setExperienceList(updated);
    SEEKER_MOCK.experience = updated;
    setEditingExperienceId(null);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 600);
  };

  const handleDeleteExperience = (id: number) => {
    setSaveStatus('saving');
    const updated = experienceList.filter(exp => exp.id !== id);
    setExperienceList(updated);
    SEEKER_MOCK.experience = updated;
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 600);
  };

  const handleAddExperience = () => {
    setSaveStatus('saving');
    const nextId = experienceList.length > 0 ? Math.max(...experienceList.map(e => e.id)) + 1 : 1;
    const newExp = {
      id: nextId,
      role: 'Frontend UI Engineer',
      company: 'Virtual Junction Partner',
      duration: '2025 - Present',
      desc: 'Collaborated on premium designs, adding micro-animations and ensuring responsiveness.'
    };
    const updated = [...experienceList, newExp];
    setExperienceList(updated);
    SEEKER_MOCK.experience = updated;
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 600);
  };

  // Handle PII Unmasking with Wallet Coins Deduction
  const handleUnlockPii = () => {
    if (walletBalance >= 50) {
      addFunds(-50); // deducts 50 coins from Global Wallet balance
      setPiiUnlocked(true);
      setUnmaskModalOpen(false);
    } else {
      alert("Insufficient funds! Please add coins to your VIJ Wallet.");
    }
  };

  // Confirm delete profile
  const handleConfirmDelete = () => {
    logout();
    localStorage.removeItem('vij_wallet');
    setDeleteModalOpen(false);
    router.push('/login');
  };

  // Incognito name resolver
  const getProfileName = () => {
    if (incognitoMode) {
      if (roleMode === 'STUDENT') return '[Verified Scholar - BCA]';
      if (roleMode === 'RECRUITER') return '[Corporate Agent - Tier-1]';
      return '[Senior Front-End Architect - Bengaluru]';
    }
    return user?.name || 'Alex Thompson';
  };

  // Incognito role resolver
  const getProfileRole = () => {
    if (roleMode === 'STUDENT') return 'Scholar & App Developer';
    if (roleMode === 'RECRUITER') return RECRUITER_MOCK.company;
    return SEEKER_MOCK.parameters.desiredTitle;
  };

  // Social Action Handlers
  const handleApplaud = (postId: number) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          applauded: !p.applauded,
          applauds: p.applauded ? p.applauds - 1 : p.applauds + 1
        };
      }
      return p;
    }));
  };

  const handleDiscussToggle = (postId: number) => {
    setActiveCommentPostId(prev => prev === postId ? null : postId);
  };

  const handleAddComment = (postId: number) => {
    if (!newCommentText.trim()) return;
    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { author: getProfileName(), text: newCommentText }]
        };
      }
      return p;
    }));
    setNewCommentText('');
  };

  const handleCirculate = (postId: number) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          circulated: !p.circulated
        };
      }
      return p;
    }));
    alert("Post shared successfully inside the private connection feed!");
  };

  return (
    <div className="profile-wrapper">
      {/* ── Header Area with Flaming VIJ Logo ── */}
      <div className="vij-flaming-header">
        <div className="brand-flame-wrapper">
          <div className="glowing-flame-logo">
            <VijLogo size="sm" showText={false} />
          </div>
          <span className="brand-title">Virtual Intelligent Junction</span>
        </div>
        <div className="role-badge-tag">Adaptive Hub</div>
      </div>

      {/* ── Toolbar Area ── */}
      <div className="profile-toolbar">
        {/* Switchers for Elite UX verification */}
        <div className="role-switcher-container">
          <button 
            className={`role-switch-btn ${roleMode === 'STUDENT' ? 'active' : ''}`}
            onClick={() => setRoleMode('STUDENT')}
          >
            Student Canvas
            {roleMode === 'STUDENT' && (
              <motion.div layoutId="active-mode" className="role-indicator" />
            )}
          </button>
          <button 
            className={`role-switch-btn ${roleMode === 'JOB_SEEKER' ? 'active' : ''}`}
            onClick={() => setRoleMode('JOB_SEEKER')}
          >
            Job Seeker Canvas
            {roleMode === 'JOB_SEEKER' && (
              <motion.div layoutId="active-mode" className="role-indicator" />
            )}
          </button>
          <button 
            className={`role-switch-btn ${roleMode === 'RECRUITER' ? 'active' : ''}`}
            onClick={() => setRoleMode('RECRUITER')}
          >
            Recruiter Command
            {roleMode === 'RECRUITER' && (
              <motion.div layoutId="active-mode" className="role-indicator" />
            )}
          </button>
        </div>

        {/* Incognito settings layer */}
        <div className="settings-panel">
          <label className="toggle-label">
            <Shield size={16} style={{ color: incognitoMode ? '#059669' : '#64748b' }} />
            <span>Strict Mediation Mode</span>
            <input 
              type="checkbox" 
              className="toggle-switch-input"
              checked={incognitoMode} 
              onChange={() => setIncognitoMode(!incognitoMode)} 
            />
            <span className="toggle-switch-visual" />
          </label>
        </div>
      </div>

      {/* ── Hero Profile Card ── */}
      <div className="profile-hero-card" style={{ position: 'relative' }}>
        {!isEditingHero ? (
          <button className="edit-trigger-icon" style={{ position: 'absolute', top: '16px', right: '16px' }} onClick={() => setIsEditingHero(true)}>
            <Pencil size={15} />
          </button>
        ) : (
          <button className="edit-trigger-icon" style={{ position: 'absolute', top: '16px', right: '16px', color: '#059669' }} onClick={handleHeroAutosave}>
            <Check size={16} />
          </button>
        )}

        <div className="hero-avatar-container">
          <img 
            src="/profile_avatar.png" 
            alt="Profile Avatar" 
            className={`hero-avatar-image ${incognitoMode ? 'blurred-avatar' : ''}`}
          />
          {incognitoMode && (
            <div className="hero-incognito-badge">
              <EyeOff size={14} />
            </div>
          )}
        </div>

        <div className="hero-meta-details">
          {!isEditingHero ? (
            <>
              <div className="hero-name-row">
                <h2 className="hero-name-text">{getProfileName()}</h2>
                <span className="role-badge-tag">{roleMode}</span>
              </div>
              <h3 className="hero-headline-title">{getProfileRole()}</h3>
              <p className="hero-bio-description">{heroForm.bio}</p>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <input 
                type="text" 
                className="edit-input-field" 
                value={heroForm.name} 
                placeholder="Your name"
                onChange={e => setHeroForm(prev => ({ ...prev, name: e.target.value }))}
                onBlur={handleHeroAutosave}
              />
              <input 
                type="text" 
                className="edit-input-field" 
                value={heroForm.roleTitle} 
                placeholder="Professional Headline"
                onChange={e => setHeroForm(prev => ({ ...prev, roleTitle: e.target.value }))}
                onBlur={handleHeroAutosave}
              />
              <textarea 
                className="edit-textarea-field" 
                value={heroForm.bio} 
                placeholder="Short bio description..."
                onChange={e => setHeroForm(prev => ({ ...prev, bio: e.target.value }))}
                onBlur={handleHeroAutosave}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Adaptive Bento Grid matrices ── */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={roleMode}
          className="profile-bento-grid"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {roleMode === 'STUDENT' && (
            <>
              {/* STUDENT: Academic Node Card */}
              <div className="bento-card col-span-6" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="bento-card-title">
                    <BookOpen className="bento-card-icon" size={18} />
                    Academic Node Details
                  </h4>
                  {!isEditingStudentNode ? (
                    <button className="edit-trigger-icon" onClick={() => setIsEditingStudentNode(true)}>
                      <Pencil size={14} />
                    </button>
                  ) : (
                    <button className="edit-trigger-icon" style={{ color: '#059669' }} onClick={handleStudentNodeAutosave}>
                      <Check size={15} />
                    </button>
                  )}
                </div>

                {!isEditingStudentNode ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="academic-row-item">
                      <span className="academic-label">University</span>
                      <span className="academic-value">{studentForm.institution}</span>
                    </div>
                    <div className="academic-row-item">
                      <span className="academic-label">Academic Tenure</span>
                      <span className="academic-value">{studentForm.semester}</span>
                    </div>
                    <div className="academic-row-item">
                      <span className="academic-label">Performance Gauge</span>
                      <span className="academic-value success-highlight">{studentForm.grades}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <span className="academic-label" style={{ display: 'block', marginBottom: '4px' }}>University</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={studentForm.institution} 
                        onChange={e => setStudentForm(prev => ({ ...prev, institution: e.target.value }))}
                        onBlur={handleStudentNodeAutosave}
                      />
                    </div>
                    <div>
                      <span className="academic-label" style={{ display: 'block', marginBottom: '4px' }}>Semester</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={studentForm.semester} 
                        onChange={e => setStudentForm(prev => ({ ...prev, semester: e.target.value }))}
                        onBlur={handleStudentNodeAutosave}
                      />
                    </div>
                    <div>
                      <span className="academic-label" style={{ display: 'block', marginBottom: '4px' }}>CGPA/Grades</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={studentForm.grades} 
                        onChange={e => setStudentForm(prev => ({ ...prev, grades: e.target.value }))}
                        onBlur={handleStudentNodeAutosave}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STUDENT: Up-Skilling Roadmap Track */}
              <div className="bento-card col-span-6">
                <h4 className="bento-card-title">
                  <TrendingUp className="bento-card-icon" size={18} />
                  Up-Skilling Roadmap Track
                </h4>
                <div className="vertical-roadmap-track">
                  {STUDENT_MOCK.roadmap.map(step => (
                    <div key={step.id} className={`roadmap-step-item ${step.completed ? 'completed' : ''}`}>
                      <div className="roadmap-step-bullet" />
                      <div className="roadmap-step-content">
                        <span className="roadmap-step-title">{step.title}</span>
                        <span className="roadmap-step-desc">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STUDENT: Learning Hub Showcase */}
              <div className="bento-card col-span-8">
                <h4 className="bento-card-title">
                  <Award className="bento-card-icon" size={18} />
                  Learning Hub Showcase
                </h4>
                <p className="hero-bio-description" style={{ fontSize: '13px' }}>
                  Demonstrating technical capacity through verified program completions and core capstone frameworks.
                </p>
                <div className="badges-showcase-grid">
                  {STUDENT_MOCK.badges.map(badge => (
                    <div key={badge} className="badge-item-capsule">
                      <CheckCircle size={13} />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '16px' }}>
                  <Link href="/explore" className="lock-shield-button-action" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Explore Roads
                  </Link>
                  <Link href="/news" className="action-trigger-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <span>Trending news</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* STUDENT: Connections Node Graph */}
              <div className="bento-card col-span-4">
                <h4 className="bento-card-title">
                  <Users className="bento-card-icon" size={18} />
                  Network reach
                </h4>
                <div className="node-graph-svg-container">
                  <svg width="100%" height="100%" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="12" fill="#0252D9" />
                    {/* Connections paths */}
                    <line x1="100" y1="100" x2="50" y2="60" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1="100" y1="100" x2="150" y2="50" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1="100" y1="100" x2="80" y2="150" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1="100" y1="100" x2="140" y2="130" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                    
                    {/* Floating nodes */}
                    <circle className="floating-node-element" cx="50" cy="60" r="8" fill="#059669" />
                    <circle className="floating-node-element" cx="150" cy="50" r="6" fill="#f59e0b" />
                    <circle className="floating-node-element" cx="80" cy="150" r="7" fill="#059669" />
                    <circle className="floating-node-element" cx="140" cy="130" r="8" fill="#8b5cf6" />
                  </svg>
                  <div className="connections-overlay-stats">124 connections</div>
                </div>
              </div>
            </>
          )}

          {roleMode === 'JOB_SEEKER' && (
            <>
              {/* JOB SEEKER: Experience Matrix */}
              <div className="bento-card col-span-8">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="bento-card-title">
                    <Briefcase className="bento-card-icon" size={18} />
                    Verified Experience Matrix
                  </h4>
                  <button className="plus-btn" onClick={handleAddExperience}>
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                <div className="experience-matrix">
                  {experienceList.map(exp => (
                    <div key={exp.id} className="experience-block" style={{ position: 'relative' }}>
                      {editingExperienceId !== exp.id ? (
                        <>
                          <div className="experience-action-btns" style={{ position: 'absolute', top: '0', right: '0' }}>
                            <button className="edit-trigger-icon" onClick={() => handleEditExperience(exp)}>
                              <Pencil size={13} />
                            </button>
                            <button className="edit-trigger-icon" style={{ color: '#ef4444' }} onClick={() => handleDeleteExperience(exp.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="exp-header">
                            <span className="exp-role">{exp.role}</span>
                            <span className="exp-duration">{exp.duration}</span>
                          </div>
                          <span className="exp-company">{exp.company}</span>
                          <p className="exp-bullet-desc">{exp.desc}</p>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '40px' }}>
                          <button className="edit-trigger-icon" style={{ position: 'absolute', top: '0', right: '0', color: '#059669' }} onClick={() => handleSaveExperience(exp.id)}>
                            <Check size={15} />
                          </button>
                          <input 
                            type="text" 
                            className="edit-input-field" 
                            value={experienceForm.role} 
                            placeholder="Job Title"
                            onChange={e => setExperienceForm(prev => ({ ...prev, role: e.target.value }))}
                          />
                          <input 
                            type="text" 
                            className="edit-input-field" 
                            value={experienceForm.company} 
                            placeholder="Company Name"
                            onChange={e => setExperienceForm(prev => ({ ...prev, company: e.target.value }))}
                          />
                          <input 
                            type="text" 
                            className="edit-input-field" 
                            value={experienceForm.duration} 
                            placeholder="Duration (e.g. 2024 - Present)"
                            onChange={e => setExperienceForm(prev => ({ ...prev, duration: e.target.value }))}
                          />
                          <textarea 
                            className="edit-textarea-field" 
                            value={experienceForm.desc} 
                            placeholder="Responsibilities and achievements description..."
                            onChange={e => setExperienceForm(prev => ({ ...prev, desc: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* JOB SEEKER: Parametric Match Hub */}
              <div className="bento-card col-span-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="bento-card-title">
                    <TrendingUp className="bento-card-icon" size={18} />
                    Parametric Target Hub
                  </h4>
                  {!isEditingSeekerParams ? (
                    <button className="edit-trigger-icon" onClick={() => setIsEditingSeekerParams(true)}>
                      <Pencil size={14} />
                    </button>
                  ) : (
                    <button className="edit-trigger-icon" style={{ color: '#059669' }} onClick={handleSeekerParamsAutosave}>
                      <Check size={15} />
                    </button>
                  )}
                </div>

                {!isEditingSeekerParams ? (
                  <div className="parametric-chip-grid">
                    <div className="parametric-chip-item">
                      <span className="parametric-label">Target Title</span>
                      <span className="parametric-value-highlight">{seekerParamsForm.desiredTitle}</span>
                    </div>
                    <div className="parametric-chip-item">
                      <span className="parametric-label">Salary Index</span>
                      <span className="parametric-value-highlight">{seekerParamsForm.targetSalary}</span>
                    </div>
                    <div className="parametric-chip-item">
                      <span className="parametric-label">Coordinates</span>
                      <span className="parametric-value-highlight">{seekerParamsForm.location}</span>
                    </div>
                    <div className="parametric-chip-item">
                      <span className="parametric-label">Tech Match</span>
                      <span className="parametric-value-highlight">5/5 Parameters</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <span className="parametric-label" style={{ display: 'block', marginBottom: '4px' }}>Target Title</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={seekerParamsForm.desiredTitle} 
                        onChange={e => setSeekerParamsForm(prev => ({ ...prev, desiredTitle: e.target.value }))}
                        onBlur={handleSeekerParamsAutosave}
                      />
                    </div>
                    <div>
                      <span className="parametric-label" style={{ display: 'block', marginBottom: '4px' }}>Salary Range</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={seekerParamsForm.targetSalary} 
                        onChange={e => setSeekerParamsForm(prev => ({ ...prev, targetSalary: e.target.value }))}
                        onBlur={handleSeekerParamsAutosave}
                      />
                    </div>
                    <div>
                      <span className="parametric-label" style={{ display: 'block', marginBottom: '4px' }}>Location coordinates</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={seekerParamsForm.location} 
                        onChange={e => setSeekerParamsForm(prev => ({ ...prev, location: e.target.value }))}
                        onBlur={handleSeekerParamsAutosave}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {SEEKER_MOCK.parameters.coreTech.map(tech => (
                    <span key={tech} className="badge-item-capsule" style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(2, 82, 217, 0.08)', color: '#0252D9', borderColor: 'rgba(2, 82, 217, 0.15)' }}>{tech}</span>
                  ))}
                </div>
              </div>

              {/* JOB SEEKER: Highlights Reels horizontal carousel */}
              <div className="bento-card col-span-6">
                <h4 className="bento-card-title">
                  <Award className="bento-card-icon" size={18} />
                  Portfolio Highlights Reels
                </h4>
                <div className="reels-carousel-container">
                  <div className="reels-slides-track">
                    {SEEKER_MOCK.highlights.map(reel => (
                      <div 
                        key={reel.id} 
                        className="reels-slide-card"
                        onMouseEnter={() => setHoveredReelId(reel.id)}
                        onMouseLeave={() => setHoveredReelId(null)}
                      >
                        <img src={reel.thumbnail} alt={reel.title} className="reels-thumbnail-bg" />
                        
                        {reel.type === 'video' && (
                          <video 
                            src={reel.url} 
                            className="reels-video-element"
                            loop
                            muted
                            playsInline
                            autoPlay={hoveredReelId === reel.id}
                          />
                        )}

                        <div className="reels-card-overlay">
                          <span className="reels-badge-title">
                            {reel.type === 'video' ? 'Video Pitch' : reel.type === 'pdf' ? 'PDF Case Study' : 'Figma Layout'}
                          </span>
                          <h5 className="reels-slide-name">{reel.title}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* JOB SEEKER: Strict Data Privacy Guard */}
              <div className="bento-card col-span-6 privacy-masked-overlay">
                <h4 className="bento-card-title">
                  <Shield className="bento-card-icon" size={18} />
                  Verification Details
                </h4>

                <div className={`academic-row-item ${!piiUnlocked ? 'blurred-mask-panel' : ''}`}>
                  <span className="academic-label">Secure Email</span>
                  <span className="academic-value">{SEEKER_MOCK.pii.email}</span>
                </div>
                <div className={`academic-row-item ${!piiUnlocked ? 'blurred-mask-panel' : ''}`}>
                  <span className="academic-label">Mobile Index</span>
                  <span className="academic-value">{SEEKER_MOCK.pii.phone}</span>
                </div>
                <div className={`academic-row-item ${!piiUnlocked ? 'blurred-mask-panel' : ''}`}>
                  <span className="academic-label">Web Credentials</span>
                  <span className="academic-value">{SEEKER_MOCK.pii.website}</span>
                </div>

                {!piiUnlocked && (
                  <div className="privacy-lock-shield">
                    <Lock className="lock-shield-icon-glow" size={28} />
                    <span className="lock-shield-headline">Contact Details Masked</span>
                    <button 
                      className="lock-shield-button-action"
                      onClick={() => setUnmaskModalOpen(true)}
                    >
                      Unlock for 50 Coins
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {roleMode === 'RECRUITER' && (
            <>
              {/* RECRUITER: Company Brand Card */}
              <div className="bento-card col-span-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="bento-card-title">
                    <Building className="bento-card-icon" size={18} />
                    Corporate Brand card
                  </h4>
                  {!isEditingRecruiterCompany ? (
                    <button className="edit-trigger-icon" onClick={() => setIsEditingRecruiterCompany(true)}>
                      <Pencil size={14} />
                    </button>
                  ) : (
                    <button className="edit-trigger-icon" style={{ color: '#059669' }} onClick={handleRecruiterCompanyAutosave}>
                      <Check size={15} />
                    </button>
                  )}
                </div>

                {!isEditingRecruiterCompany ? (
                  <>
                    <div className="recruiter-brand-layout">
                      <div className="company-logo-element">VIJ</div>
                      <div className="company-brand-details">
                        <h5 className="company-brand-name">{recruiterCompanyForm.company}</h5>
                        <span className="company-brand-meta">{recruiterCompanyForm.employees}</span>
                        <span className="tier-verified-badge">{RECRUITER_MOCK.rating}</span>
                      </div>
                    </div>
                    <div className="academic-row-item">
                      <span className="academic-label">Cultural Review score</span>
                      <span className="academic-value success-highlight">{recruiterCompanyForm.reviews}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <span className="parametric-label" style={{ display: 'block', marginBottom: '4px' }}>Company Name</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={recruiterCompanyForm.company} 
                        onChange={e => setRecruiterCompanyForm(prev => ({ ...prev, company: e.target.value }))}
                        onBlur={handleRecruiterCompanyAutosave}
                      />
                    </div>
                    <div>
                      <span className="parametric-label" style={{ display: 'block', marginBottom: '4px' }}>Employee benchmarks</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={recruiterCompanyForm.employees} 
                        onChange={e => setRecruiterCompanyForm(prev => ({ ...prev, employees: e.target.value }))}
                        onBlur={handleRecruiterCompanyAutosave}
                      />
                    </div>
                    <div>
                      <span className="parametric-label" style={{ display: 'block', marginBottom: '4px' }}>Reviews score</span>
                      <input 
                        type="text" 
                        className="edit-input-field" 
                        value={recruiterCompanyForm.reviews} 
                        onChange={e => setRecruiterCompanyForm(prev => ({ ...prev, reviews: e.target.value }))}
                        onBlur={handleRecruiterCompanyAutosave}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RECRUITER: Active Pipeline Terminal */}
              <div className="bento-card col-span-6">
                <h4 className="bento-card-title">
                  <TrendingUp className="bento-card-icon" size={18} />
                  Active Pipelines
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {RECRUITER_MOCK.pipeline.map(pipe => (
                    <div key={pipe.id} className="pipeline-progress-wrapper">
                      <div className="pipeline-stats-row">
                        <span>{pipe.role}</span>
                        <span>{pipe.matched}</span>
                      </div>
                      <div className="pipeline-progress-track">
                        <div className="pipeline-progress-bar" style={{ width: `${pipe.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECRUITER: VIJ Wallet Summary Widget */}
              <div className="bento-card col-span-6">
                <h4 className="bento-card-title">
                  <Coins className="bento-card-icon" size={18} />
                  VIJ Account funding
                </h4>
                <div className="wallet-hologram-card">
                  <div className="wallet-card-grid-layer" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="wallet-card-chip" />
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>VIJ Business</span>
                  </div>
                  <div style={{ zIndex: 2 }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>Holographic Balance</span>
                    <div className="slot-machine-numbers">
                      <span className="slot-digit">$</span>
                      {walletBalance.toString().split('').map((char, index) => (
                        <motion.span 
                          key={index}
                          className="slot-digit"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.05 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                      <span className="slot-digit" style={{ fontSize: '12px', marginLeft: '4px', color: '#34d399' }}>Coins</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECRUITER: Premium Activity Log */}
              <div className="bento-card col-span-6">
                <h4 className="bento-card-title">
                  <Clock className="bento-card-icon" size={18} />
                  Executive Activity Log
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {RECRUITER_MOCK.activity.map(act => (
                    <div key={act.id} className="premium-log-item">
                      {act.type === 'unlock' ? (
                        <Unlock size={14} className="log-icon-blue" />
                      ) : act.type === 'interview' ? (
                        <Clock size={14} className="log-icon-blue" />
                      ) : (
                        <CheckCircle size={14} className="log-icon-green" />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <span style={{ fontWeight: '700' }}>{act.title}</span>
                        <span style={{ color: '#64748b' }}>{act.desc}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{act.time}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '16px' }}>
                  <Link href="/recruiter/dashboard" className="lock-shield-button-action" style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}>
                    Dashboard
                  </Link>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Social Feed & Contribution Grid ── */}
      <div className="contribution-grid-header">
        <h3 className="bento-card-title" style={{ fontSize: '18px' }}>
          <MessageSquare className="bento-card-icon" size={20} />
          Shared Feed Contributions
        </h3>
        <p className="hero-bio-description">Latest posts, reels, and articles circulating across Virtual Intelligent Junction networks.</p>
      </div>

      <div className="contribution-posts-grid">
        {feedPosts.map(post => (
          <div key={post.id} className="post-feed-card">
            <div className="post-card-author">
              <img 
                src="/profile_avatar.png" 
                alt="Author Avatar" 
                className={`post-card-author-img ${incognitoMode ? 'blurred-avatar' : ''}`}
              />
              <div>
                <h5 className="post-card-author-name">{incognitoMode ? getProfileName() : post.author}</h5>
                <span className="post-card-time">2d ago</span>
              </div>
            </div>
            <p className="post-card-text">{post.text}</p>
            
            <div className="post-action-dock">
              <button 
                className={`action-trigger-btn ${post.applauded ? 'applauded' : ''}`}
                onClick={() => handleApplaud(post.id)}
              >
                <ThumbsUp size={14} />
                <span>{post.applauds} Applaud</span>
              </button>
              
              <button 
                className={`action-trigger-btn ${post.id === activeCommentPostId ? 'discussed' : ''}`}
                onClick={() => handleDiscussToggle(post.id)}
              >
                <MessageSquare size={14} />
                <span>Discuss ({post.comments.length})</span>
              </button>

              <button 
                className={`action-trigger-btn ${post.circulated ? 'circulated' : ''}`}
                onClick={() => handleCirculate(post.id)}
              >
                <Share2 size={14} />
                <span>Circulate</span>
              </button>
            </div>

            {/* Discussion comments expansion */}
            {post.id === activeCommentPostId && (
              <div className="discussion-drawer-panel">
                <div className="discussion-input-row">
                  <input 
                    type="text" 
                    className="discussion-textbox" 
                    placeholder="Contribute to discussion..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <button 
                    className="discussion-submit-btn"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Reply
                  </button>
                </div>
                {post.comments.map((comm, cIndex) => (
                  <div key={cIndex} className="discussion-comment-item">
                    <span className="comment-author">{comm.author}</span>
                    <span className="comment-content">{comm.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Danger Zone / Profile Deletion ── */}
      <div className="bento-card col-span-12" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', marginTop: '20px' }}>
        <h4 className="bento-card-title" style={{ color: '#ef4444' }}>
          <Shield size={18} />
          Danger Zone
        </h4>
        <p className="hero-bio-description" style={{ color: '#ef4444' }}>
          Deleting your profile is permanent and will wipe all credentials, wallet logs, and connection details from Virtual Intelligent Junction.
        </p>
        <div>
          <button 
            className="lock-shield-button-action" 
            style={{ background: '#ef4444', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Profile & Account
          </button>
        </div>
      </div>

      {/* ── Secure Unlock Modal ── */}
      <AnimatePresence>
        {unmaskModalOpen && (
          <div className="privacy-lock-shield" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bento-card"
              style={{ width: '400px', background: 'white', padding: '32px', textAlign: 'center', margin: 'auto' }}
            >
              <Lock className="lock-shield-icon-glow" size={32} style={{ margin: '0 auto 16px', color: '#ef4444' }} />
              <h4 className="lock-shield-headline" style={{ fontSize: '18px', marginBottom: '12px' }}>Confirm Metadata Unmasking</h4>
              <p className="hero-bio-description" style={{ marginBottom: '24px' }}>
                Unmasking primary contact parameters will deduct <span style={{ fontWeight: '700', color: '#ef4444' }}>50 coins</span> from your VIJ balance.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button 
                  className="action-trigger-btn"
                  onClick={() => setUnmaskModalOpen(false)}
                  style={{ border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '12px' }}
                >
                  Cancel
                </button>
                <button 
                  className="lock-shield-button-action"
                  onClick={handleUnlockPii}
                >
                  Confirm & Deduct
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="privacy-lock-shield" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bento-card"
              style={{ width: '420px', background: 'white', padding: '32px', textAlign: 'center', margin: 'auto' }}
            >
              <Shield className="lock-shield-icon-glow" size={32} style={{ margin: '0 auto 16px', color: '#ef4444' }} />
              <h4 className="lock-shield-headline" style={{ fontSize: '18px', marginBottom: '12px' }}>Permanent Account Deletion</h4>
              <p className="hero-bio-description" style={{ marginBottom: '24px', color: '#ef4444', fontWeight: '500' }}>
                Are you absolutely sure? This action is immediate and cannot be undone. All data will be wiped.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button 
                  className="action-trigger-btn"
                  onClick={() => setDeleteModalOpen(false)}
                  style={{ border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '12px' }}
                >
                  Cancel
                </button>
                <button 
                  className="lock-shield-button-action"
                  onClick={handleConfirmDelete}
                  style={{ background: '#ef4444', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}
                >
                  Yes, Wipe Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Floating Autosave Status Bar Indicator ── */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="autosave-status-bar"
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader size={14} className="animate-spin" style={{ color: '#f59e0b' }} />
                <span>Saving changes...</span>
              </>
            ) : (
              <>
                <Check size={14} style={{ color: '#059669' }} />
                <span>Profile autosaved!</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
