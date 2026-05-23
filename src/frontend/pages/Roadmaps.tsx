import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Map,
  TrendingUp, ChevronRight,
  Activity, Users, Bookmark, Building2,
  Sparkles, Award, Flame, Compass, ChevronDown, 
  Check, Info, Download, Volume2, Smile
} from 'lucide-react';
import { useRoadmaps } from '../context/RoadmapContext';
import { ROADMAP_DATABASE, type Roadmap, type RoadmapNode } from '../data/roadmapData';
import './Roadmaps.css';

// Custom interfaces for mock data and interactions
interface PivotOption {
  role: string;
  salaryJump: string;
  percentPivot: number;
  timeToTransition: string;
  popularity: 'High' | 'Medium' | 'Low';
  industry: string;
  isUnconventional?: boolean;
}

const MOCK_PIVOTS: Record<string, PivotOption[]> = {
  'it-frontend-entry': [
    { role: 'Senior Frontend Engineer', salaryJump: '+$45,000', percentPivot: 68, timeToTransition: '1-2 Years', popularity: 'High', industry: 'Technology' },
    { role: 'Full Stack Developer', salaryJump: '+$35,000', percentPivot: 55, timeToTransition: '1 Year', popularity: 'High', industry: 'Technology' },
    { role: 'Product Manager', salaryJump: '+$50,000', percentPivot: 25, timeToTransition: '2 Years', popularity: 'Medium', industry: 'Management' },
    { role: 'UI/UX Designer', salaryJump: '+$15,000', percentPivot: 18, timeToTransition: '1 Year', popularity: 'Low', industry: 'Design', isUnconventional: true }
  ],
  'it-ai-mid': [
    { role: 'Senior AI Research Scientist', salaryJump: '+$75,000', percentPivot: 42, timeToTransition: '2-3 Years', popularity: 'High', industry: 'Research' },
    { role: 'Director of AI & ML', salaryJump: '+$120,000', percentPivot: 15, timeToTransition: '4-5 Years', popularity: 'Medium', industry: 'Management' },
    { role: 'AI Product Strategy Lead', salaryJump: '+$60,000', percentPivot: 28, timeToTransition: '2 Years', popularity: 'Medium', industry: 'Management' },
    { role: 'Quantitative Analyst', salaryJump: '+$90,000', percentPivot: 12, timeToTransition: '2 Years', popularity: 'Low', industry: 'Finance', isUnconventional: true }
  ],
  'fin-ib-entry': [
    { role: 'Investment Banking Associate', salaryJump: '+$65,000', percentPivot: 75, timeToTransition: '2 Years', popularity: 'High', industry: 'Finance' },
    { role: 'Private Equity Analyst', salaryJump: '+$80,000', percentPivot: 40, timeToTransition: '2 Years', popularity: 'High', industry: 'Finance' },
    { role: 'Corporate Development Lead', salaryJump: '+$35,000', percentPivot: 30, timeToTransition: '3 Years', popularity: 'Medium', industry: 'Corporate' },
    { role: 'Venture Capital Associate', salaryJump: '+$50,000', percentPivot: 20, timeToTransition: '2 Years', popularity: 'Low', industry: 'Finance', isUnconventional: true }
  ],
  'mkt-dm-entry': [
    { role: 'Growth Marketing Manager', salaryJump: '+$28,000', percentPivot: 62, timeToTransition: '1-2 Years', popularity: 'High', industry: 'Marketing' },
    { role: 'Brand Strategy Director', salaryJump: '+$55,000', percentPivot: 20, timeToTransition: '3-4 Years', popularity: 'Medium', industry: 'Marketing' },
    { role: 'Product Marketing Manager', salaryJump: '+$40,000', percentPivot: 35, timeToTransition: '2 Years', popularity: 'High', industry: 'Management' },
    { role: 'Data Storyteller / Analyst', salaryJump: '+$25,000', percentPivot: 15, timeToTransition: '1 Year', popularity: 'Low', industry: 'Technology', isUnconventional: true }
  ]
};

const DEFAULT_PIVOTS: PivotOption[] = [
  { role: 'Senior Developer', salaryJump: '+$40,000', percentPivot: 60, timeToTransition: '2 Years', popularity: 'High', industry: 'Technology' },
  { role: 'Product Lead', salaryJump: '+$55,000', percentPivot: 30, timeToTransition: '2-3 Years', popularity: 'Medium', industry: 'Management' },
  { role: 'Tech Consultant', salaryJump: '+$30,000', percentPivot: 45, timeToTransition: '1-2 Years', popularity: 'High', industry: 'Consulting' },
  { role: 'Founder / Solopreneur', salaryJump: '+$80,000', percentPivot: 8, timeToTransition: '3 Years', popularity: 'Low', industry: 'Entrepreneurship', isUnconventional: true }
];

export const Roadmaps: React.FC = () => {
  const { 
    startRoute, 
    completeNode, 
    toggleSave, 
    isNodeCompleted, 
    isPathSaved 
  } = useRoadmaps();

  // --- STATE SYSTEM ---
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(() => ROADMAP_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [skillsRatings, setSkillsRatings] = useState<Record<string, number>>({});
  const [activeRatingSkill, setActiveRatingSkill] = useState<string | null>(null);

  // Smiley gauge state
  const [jobSatisfaction, setJobSatisfaction] = useState(3); // 1 to 5 scale

  // Explorer states
  const [selectedPivot, setSelectedPivot] = useState<PivotOption | null>(null);
  const [filterRemoteOnly, setFilterRemoteOnly] = useState(false);
  const [filterSalaryTier, setFilterSalaryTier] = useState('all');
  const [filterTransitionTime, setFilterTransitionTime] = useState('all');

  // Timeline pacing state
  const [pacing, setPacing] = useState<'steady' | 'aggressive'>('steady');
  const [activeEmpathyPanel, setActiveEmpathyPanel] = useState<string | null>(null);

  // Custom milestones
  const [customMilestones, setCustomMilestones] = useState<RoadmapNode[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  // Inspiration wall tabs
  const [communityTab, setCommunityTab] = useState<'stories' | 'mentors' | 'pulse'>('stories');
  const [selectedStory, setSelectedStory] = useState<{ name: string; before: string; after: string; duration: string; details: string } | null>(null);

  // Vision Simulator states
  const [cityTier, setCityTier] = useState('tier1'); // tier1, tier2, tier3
  const [remotePercent, setRemotePercent] = useState(50);
  const [educationLevel, setEducationLevel] = useState('bachelor');
  const [workHours, setWorkHours] = useState(40);
  const [compareTrack, setCompareTrack] = useState<'ic' | 'manager'>('ic');

  // Waveform play simulator state
  const [playingMentorId, setPlayingMentorId] = useState<number | null>(null);

  // Autocomplete data suggestions
  const searchSuggestions = useMemo(() => {
    return ROADMAP_DATABASE.map(r => ({
      id: r.id,
      title: r.title,
      sector: r.sector
    }));
  }, []);

  const currentPivots = useMemo(() => {
    if (!selectedRoadmap) return DEFAULT_PIVOTS;
    return MOCK_PIVOTS[selectedRoadmap.id] || DEFAULT_PIVOTS;
  }, [selectedRoadmap]);

  // Handle autocomplete click
  const handleSelectQuery = (rmId: string) => {
    const rm = ROADMAP_DATABASE.find(r => r.id === rmId);
    if (rm) {
      setSelectedRoadmap(rm);
      setSearchQuery(rm.title);
      setShowAutocomplete(false);
      setSelectedPivot(null);
    }
  };

  // Select pivot and generate customized view
  const handleSelectPivot = (pivot: PivotOption) => {
    setSelectedPivot(pivot);
  };

  const handleSurpriseMe = () => {
    const uncon = currentPivots.find(p => p.isUnconventional);
    if (uncon) {
      setSelectedPivot(uncon);
    } else {
      setSelectedPivot(currentPivots[Math.floor(Math.random() * currentPivots.length)]);
    }
  };

  // Skill assessments
  const handleRateSkill = (skill: string, rating: number) => {
    setSkillsRatings(prev => ({ ...prev, [skill]: rating }));
    setActiveRatingSkill(null);
  };

  // Add customized step
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle) return;
    const newM: RoadmapNode = {
      id: `custom-${Date.now()}`,
      title: newMilestoneTitle,
      desc: newMilestoneDesc || 'Custom milestone step details.',
      skills: [],
      milestone: 'Self-defined milestone goal.',
      duration: pacing === 'aggressive' ? '1 Month' : '2 Months'
    };
    setCustomMilestones(prev => [...prev, newM]);
    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
  };

  const handleDeleteMilestone = (id: string) => {
    setCustomMilestones(prev => prev.filter(m => m.id !== id));
  };

  // Compute combined nodes
  const combinedNodes = useMemo(() => {
    if (!selectedRoadmap) return [];
    return [...selectedRoadmap.nodes, ...customMilestones];
  }, [selectedRoadmap, customMilestones]);

  const completedCount = useMemo(() => {
    return combinedNodes.filter(n => isNodeCompleted(n.id)).length;
  }, [combinedNodes, isNodeCompleted]);

  const roadmapProgress = useMemo(() => {
    if (combinedNodes.length === 0) return 0;
    return Math.round((completedCount / combinedNodes.length) * 100);
  }, [combinedNodes, completedCount]);

  // Satisfaction label emoji helper
  const getSatisfactionEmoji = (val: number) => {
    switch (val) {
      case 1: return { emoji: '😐', label: 'Mediocre' };
      case 2: return { emoji: '🙂', label: 'Satisfied' };
      case 3: return { emoji: '😄', label: 'Engaged' };
      case 4: return { emoji: '🤩', label: 'Thriving' };
      case 5: return { emoji: '👑', label: 'Empowered' };
      default: return { emoji: '😄', label: 'Engaged' };
    }
  };

  // Simulator output computing
  const simulatedSalary = useMemo(() => {
    let base = 85000;
    if (selectedRoadmap?.id.includes('ai')) base = 135000;
    if (selectedRoadmap?.id.includes('ib')) base = 120000;
    if (selectedRoadmap?.id.includes('dm')) base = 68000;

    // Levers modifiers
    const cityMultiplier = cityTier === 'tier1' ? 1.15 : cityTier === 'tier2' ? 0.95 : 0.8;
    const remoteDiscount = remotePercent > 80 ? 0.92 : 1.0;
    const eduBoost = educationLevel === 'master' ? 1.12 : educationLevel === 'phd' ? 1.25 : 1.0;
    const hoursMultiplier = workHours > 45 ? 1.08 : workHours < 35 ? 0.85 : 1.0;
    const trackBoost = compareTrack === 'manager' ? 1.2 : 1.0;

    return Math.round(base * cityMultiplier * remoteDiscount * eduBoost * hoursMultiplier * trackBoost);
  }, [selectedRoadmap, cityTier, remotePercent, educationLevel, workHours, compareTrack]);

  const workLifeMeter = useMemo(() => {
    let base = 7.5;
    if (workHours > 50) base -= 2.5;
    if (remotePercent > 80) base += 1.5;
    if (compareTrack === 'manager') base -= 1.0;
    return Math.min(10, Math.max(1, Math.round(base * 10) / 10));
  }, [workHours, remotePercent, compareTrack]);

  const happinessIndex = useMemo(() => {
    let base = 78;
    if (jobSatisfaction > 3) base += 10;
    if (workLifeMeter > 8) base += 8;
    if (workHours > 55) base -= 15;
    return Math.min(100, base);
  }, [jobSatisfaction, workLifeMeter, workHours]);

  return (
    <div className="roadmaps-page">
      
      {/* ── HERO SECTION ── */}
      <section className="rm-hero">
        <div className="rm-hero-content">
          <div className="rm-hero-badge">
            <Compass size={14} />
            <span>Community-Validated Path Finder</span>
          </div>
          <h1>Your career, mapped by people who've been there.</h1>
          <p>
            Anonymized insight graphs and clear milestone checklists to guide your path. Explore, simulate, and plan with confidence.
          </p>

          {/* Autocomplete Input Search */}
          <div className="rm-search-container">
            <div className="rm-search-bar">
              <Search size={20} color="#0A6E6E" />
              <input 
                type="text" 
                placeholder="e.g. Frontend Developer, AI/ML Specialist..." 
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
              />
              <Sparkles size={18} style={{ color: '#FF6B6B' }} />
            </div>

            {showAutocomplete && (
              <ul className="rm-autocomplete-list">
                {searchSuggestions
                  .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(s => (
                    <li 
                      key={s.id} 
                      className="rm-autocomplete-item"
                      onClick={() => handleSelectQuery(s.id)}
                    >
                      <strong>{s.title}</strong>
                      <span className="rm-autocomplete-sector">{s.sector}</span>
                    </li>
                  ))}
                <li 
                  className="rm-autocomplete-item" 
                  onClick={() => {
                    handleSelectQuery('it-frontend-entry');
                  }}
                  style={{ fontStyle: 'italic', color: '#64748b' }}
                >
                  Can't find yours? Start with Frontend Developer
                </li>
              </ul>
            )}
          </div>

          {/* Quick choices */}
          <div className="rm-quick-toggles">
            <button className="rm-toggle-btn" onClick={() => handleSelectQuery('it-frontend-entry')}>I want a higher salary</button>
            <button className="rm-toggle-btn" onClick={() => handleSelectQuery('it-ai-mid')}>I want to switch industries</button>
            <button className="rm-toggle-btn" onClick={() => handleSelectQuery('mkt-dm-entry')}>I'm just exploring</button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* ── CURRENT ROLE SNAPSHOT & SKILL ASSESSMENT ── */}
        {selectedRoadmap && (
          <section style={{ marginTop: '40px' }}>
            <h2 className="rm-section-title">
              <Building2 size={20} />
              Current Profile Snapshot: {selectedRoadmap.title}
            </h2>

            <div className="rm-snapshot-grid">
              {/* Salary Snapshot */}
              <div className="rm-snapshot-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="rm-card-badge">Based on 1,450 salary reports</span>
                  <Award size={14} style={{ color: '#0A6E6E' }} />
                </div>
                <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#64748b' }}>Median Base Salary</h4>
                <div className="rm-metric-val">
                  {selectedRoadmap.id.includes('ai') ? '$145,000' : selectedRoadmap.id.includes('ib') ? '$118,000' : '$88,000'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Updated 3 days ago.</div>
              </div>

              {/* Smiley gauge slider */}
              <div className="rm-snapshot-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="rm-card-badge">Job Satisfaction</span>
                  <Smile size={14} style={{ color: '#FF6B6B' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '32px' }}>{getSatisfactionEmoji(jobSatisfaction).emoji}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '16px', color: '#0A6E6E' }}>{getSatisfactionEmoji(jobSatisfaction).label}</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Index score of {jobSatisfaction * 20}/100</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={jobSatisfaction} 
                  onChange={e => setJobSatisfaction(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#0A6E6E', marginTop: '10px' }}
                />
              </div>

              {/* Experience distribution */}
              <div className="rm-snapshot-card">
                <span className="rm-card-badge">Industry Experience Spread</span>
                <div className="rm-dist-bars">
                  <div className="rm-dist-col active">
                    <div className="rm-dist-bar" style={{ height: '24px' }} />
                    <span className="rm-dist-lbl">0-1Y</span>
                  </div>
                  <div className="rm-dist-col active">
                    <div className="rm-dist-bar" style={{ height: '40px' }} />
                    <span className="rm-dist-lbl">1-3Y</span>
                  </div>
                  <div className="rm-dist-col">
                    <div className="rm-dist-bar" style={{ height: '18px' }} />
                    <span className="rm-dist-lbl">3-5Y</span>
                  </div>
                  <div className="rm-dist-col">
                    <div className="rm-dist-bar" style={{ height: '8px' }} />
                    <span className="rm-dist-lbl">5Y+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Cloud with rating options */}
            <div className="rm-skills-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#0A6E6E', fontWeight: 800 }}>Self-Assess Your Baseline Skills</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Rate your comfort level to customize recommended milestones.</p>
                </div>
                <span className="rm-card-badge">Rating improves match metrics</span>
              </div>

              <div className="rm-skills-cloud">
                {selectedRoadmap.nodes.flatMap(n => n.skills).map(skill => {
                  const rating = skillsRatings[skill];
                  return (
                    <div key={skill} style={{ position: 'relative' }}>
                      <div 
                        className={`rm-skill-bubble ${rating ? 'rated' : ''}`}
                        onClick={() => setActiveRatingSkill(activeRatingSkill === skill ? null : skill)}
                      >
                        <span>{skill}</span>
                        {rating && <span className="rm-skill-rating">{rating}</span>}
                      </div>

                      {activeRatingSkill === skill && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', display: 'flex', gap: '4px', zIndex: 50, marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                          {[1, 2, 3, 4, 5].map(r => (
                            <button 
                              key={r}
                              onClick={() => handleRateSkill(skill, r)}
                              style={{ width: '22px', height: '22px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 800 }}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── "WHERE CAN YOU GO?" EXPLORER ── */}
        {selectedRoadmap && (
          <section className="rm-explorer-section">
            <h2 className="rm-section-title">
              <TrendingUp size={20} />
              "Where Can You Go?" Pivot Explorer
            </h2>

            <div className="rm-explorer-box">
              {/* Filter controls */}
              <div className="rm-explorer-filters">
                <select 
                  className="rm-exp-filter-select" 
                  value={filterSalaryTier}
                  onChange={e => setFilterSalaryTier(e.target.value)}
                >
                  <option value="all">All Salary Jumps</option>
                  <option value="high">+$40k+ Jumps</option>
                </select>

                <select 
                  className="rm-exp-filter-select"
                  value={filterTransitionTime}
                  onChange={e => setFilterTransitionTime(e.target.value)}
                >
                  <option value="all">All Transition Times</option>
                  <option value="quick">Under 1.5 Years</option>
                </select>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={filterRemoteOnly}
                    onChange={e => setFilterRemoteOnly(e.target.checked)}
                    style={{ accentColor: '#0A6E6E' }}
                  />
                  Remote Friendly Paths Only
                </label>

                <button 
                  className="rm-toggle-btn"
                  onClick={handleSurpriseMe}
                  style={{ background: 'var(--color-teal-light)', border: 'none', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Flame size={14} style={{ color: '#FF6B6B' }} />
                  <span>Surprise Me pivot</span>
                </button>
              </div>

              <div className="rm-explorer-layout">
                {/* Node branching tree canvas */}
                <div className="rm-branch-canvas">
                  <svg className="rm-branch-svg">
                    {/* Render branches to nodes */}
                    <path d="M 120 150 Q 220 60 300 60" className={`rm-branch-path ${selectedPivot?.role.includes('Senior') ? 'active' : ''}`} />
                    <path d="M 120 150 Q 220 120 300 130" className={`rm-branch-path ${selectedPivot?.role.includes('Full Stack') || selectedPivot?.role.includes('Director') ? 'active' : ''}`} />
                    <path d="M 120 150 Q 220 180 300 200" className={`rm-branch-path ${selectedPivot?.role.includes('Product') ? 'active' : ''}`} />
                    <path d="M 120 150 Q 220 240 300 270" className={`rm-branch-path ${selectedPivot?.isUnconventional ? 'active' : ''}`} />
                  </svg>

                  <div className="rm-branch-center">{selectedRoadmap.domain}</div>

                  {currentPivots.map((p, idx) => {
                    const topPos = 60 + idx * 70;
                    return (
                      <div 
                        key={p.role}
                        className={`rm-branch-node ${selectedPivot?.role === p.role ? 'selected' : ''}`}
                        style={{ top: `${topPos}px`, left: '50%' }}
                        onClick={() => handleSelectPivot(p)}
                      >
                        {p.role}
                        <span>{p.salaryJump} jump • {p.percentPivot}% transitioned</span>
                      </div>
                    );
                  })}
                </div>

                {/* Selected target pivot statistics card */}
                <div className="rm-pivot-card">
                  {selectedPivot ? (
                    <>
                      <div className="rm-pivot-header">
                        <h4 className="rm-pivot-title">{selectedPivot.role}</h4>
                        {selectedPivot.isUnconventional && <span className="rm-pivot-tag">Unconventional Pivot</span>}
                      </div>

                      <div className="rm-pivot-meta">
                        <div className="rm-pivot-row">
                          <span>Salary Jump</span>
                          <strong style={{ color: '#16a34a' }}>{selectedPivot.salaryJump}</strong>
                        </div>
                        <div className="rm-pivot-row">
                          <span>Transition Time</span>
                          <span>{selectedPivot.timeToTransition}</span>
                        </div>
                        <div className="rm-pivot-row">
                          <span>Popularity</span>
                          <span style={{ color: selectedPivot.popularity === 'High' ? '#0A6E6E' : '#64748b' }}>{selectedPivot.popularity}</span>
                        </div>
                        <div className="rm-pivot-row">
                          <span>Transition Success Rate</span>
                          <span>{selectedPivot.percentPivot}% of seekers</span>
                        </div>
                      </div>

                      <button 
                        className="rm-hub-btn primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => startRoute(selectedRoadmap.id)}
                      >
                        Generate Personalised Roadmap
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                      <Info size={24} style={{ color: '#0A6E6E', marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '13px' }}>Select a target role node in the branching network tree map to view personalized roadmap steps.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── PERSONALIZED ROADMAP TIMELINE ── */}
        {selectedRoadmap && (
          <section className="rm-timeline-section">
            <div className="rm-timeline-controls">
              <div>
                <h2 className="rm-section-title" style={{ margin: 0 }}>
                  <Map size={20} />
                  Roadmap Milestone Timeline
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Progressive stages generated based on community reports.
                </p>
              </div>

              {/* Steady/Aggressive pace toggle */}
              <div className="rm-pace-toggles">
                <button 
                  className={`rm-pace-btn ${pacing === 'steady' ? 'active' : ''}`}
                  onClick={() => setPacing('steady')}
                >
                  Steady Pace (18 Months)
                </button>
                <button 
                  className={`rm-pace-btn ${pacing === 'aggressive' ? 'active' : ''}`}
                  onClick={() => setPacing('aggressive')}
                >
                  Aggressive Pace (6 Months)
                </button>
              </div>
            </div>

            {/* Custom Milestone Entry form */}
            <form onSubmit={handleAddMilestone} className="rm-add-milestone-box" style={{ marginBottom: '20px' }}>
              <strong style={{ fontSize: '12px', color: '#0A6E6E' }}>Add Custom Roadmap Step</strong>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Step title (e.g. Learn Docker foundations)"
                  value={newMilestoneTitle}
                  onChange={e => setNewMilestoneTitle(e.target.value)}
                  style={{ flex: 1 }}
                />
                <input 
                  type="text" 
                  placeholder="Brief description (optional)"
                  value={newMilestoneDesc}
                  onChange={e => setNewMilestoneDesc(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button 
                  type="submit" 
                  className="rm-hub-btn primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Add Step
                </button>
              </div>
            </form>

            {/* Horizontal Timeline Scroller */}
            <div className="rm-timeline-scroller">
              {/* Render dynamic phases based on pacing */}
              {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase, pIdx) => {
                const phaseDuration = pacing === 'aggressive' 
                  ? `${pIdx * 1.5} - ${(pIdx + 1) * 1.5} Months` 
                  : `${pIdx * 4} - ${(pIdx + 1) * 4} Months`;

                // Distribute database and custom nodes across phases
                const phaseNodes = combinedNodes.filter((_, idx) => idx % 4 === pIdx);

                return (
                  <div key={phase} className="rm-timeline-phase">
                    <div className="rm-phase-header">
                      <span className="rm-phase-title">{phase}</span>
                      <div className="rm-phase-sub">Target Duration: {phaseDuration}</div>
                    </div>

                    {phaseNodes.map(node => {
                      const isCompleted = isNodeCompleted(node.id);
                      return (
                        <div key={node.id} className={`rm-node-item ${isCompleted ? 'checked' : ''}`}>
                          <div className="rm-node-dot" />
                          <h5>{node.title}</h5>
                          <p className="rm-node-desc">{node.desc}</p>
                          
                          {/* Checklist check */}
                          <label className="rm-node-check-row">
                            <input 
                              type="checkbox" 
                              checked={isCompleted}
                              onChange={() => completeNode(node.id)}
                            />
                            <span>{isCompleted ? 'Completed ✓' : 'Mark as done'}</span>
                          </label>

                          {/* Predicted salary point */}
                          <div className="rm-node-salary-badge">
                            <TrendingUp size={10} />
                            <span>Checkpoint: {pacing === 'aggressive' ? '+$12k/yr boost' : '+$8k/yr boost'}</span>
                          </div>

                          {/* Skill resource links tooltips */}
                          {node.skills && node.skills.length > 0 && (
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {node.skills.map(s => (
                                <span 
                                  key={s} 
                                  className="rm-card-badge"
                                  style={{ fontSize: '9px', background: '#eff6ff', color: '#1d4ed8', cursor: 'help' }}
                                  title={`Community Resources for ${s}: MDN Web Docs, freeCodeCamp path.`}
                                >
                                  {s} 💡 Resource
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Delete custom milestones buttons */}
                          {node.id.startsWith('custom') && (
                            <button 
                              onClick={() => handleDeleteMilestone(node.id)}
                              style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '9px', fontWeight: 700, padding: 0, marginTop: '8px', cursor: 'pointer' }}
                            >
                              Delete Step
                            </button>
                          )}

                          {/* Expandable Empathy obstacle panel */}
                          <div className="rm-empathy-panel">
                            <div 
                              className="rm-empathy-toggle"
                              onClick={() => setActiveEmpathyPanel(activeEmpathyPanel === node.id ? null : node.id)}
                            >
                              <span>⚠️ The Hard Part</span>
                              <ChevronDown size={10} />
                            </div>

                            {activeEmpathyPanel === node.id && (
                              <div className="rm-empathy-quote">
                                "The first few weeks trying to learn this skill were tough. I almost gave up, but finding code examples in Swiggy's tech blogs saved me."
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── INSPIRATION & COMMUNITY WALL ── */}
        <section className="rm-community-section">
          <h2 className="rm-section-title">
            <Users size={20} />
            Community Insights & Mentor Voices
          </h2>

          <div className="rm-tabs-row">
            <button 
              className={`rm-tab-btn ${communityTab === 'stories' ? 'active' : ''}`}
              onClick={() => setCommunityTab('stories')}
            >
              Success Stories
            </button>
            <button 
              className={`rm-tab-btn ${communityTab === 'mentors' ? 'active' : ''}`}
              onClick={() => setCommunityTab('mentors')}
            >
              Mentor Voices
            </button>
            <button 
              className={`rm-tab-btn ${communityTab === 'pulse' ? 'active' : ''}`}
              onClick={() => setCommunityTab('pulse')}
            >
              Industry Trends
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Success Stories Carousel */}
            {communityTab === 'stories' && (
              <motion.div 
                key="stories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rm-carousel-container"
              >
                {[
                  { name: "Ananya S.", before: "Retail Associate", after: "Digital Marketing Specialist", duration: "1 Year", details: "Switched careers after studying SEO and Content paths on VIJ. Landed a role at a tech agency." },
                  { name: "Rohan M.", before: "Junior Frontend Dev", after: "Senior Frontend Engineer", duration: "1.5 Years", details: "Followed the frontend timeline path and completed intermediate algorithms. Cracking Swiggy's technical test." },
                  { name: "Kunal P.", before: "QA Tester", after: "AI/ML Engineer", duration: "2 Years", details: "Focused on PyTorch models in MLOps stages. Landed a research associate internship." }
                ].map(story => (
                  <div key={story.name} className="rm-carousel-card">
                    <h4>{story.name}</h4>
                    <p style={{ fontWeight: 700, color: '#0A6E6E', fontSize: '13px' }}>
                      {story.before} ➔ {story.after}
                    </p>
                    <p>{story.details}</p>
                    <div className="rm-story-meta">
                      <span>Timeline: {story.duration}</span>
                      <span 
                        className="rm-story-link"
                        onClick={() => setSelectedStory({ ...story, details: story.details })}
                      >
                        See journey details ➔
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Mentor Audio Waveform Voices */}
            {communityTab === 'mentors' && (
              <motion.div 
                key="mentors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rm-mentor-grid"
              >
                {[
                  { id: 1, name: "Harish V. (Principal Architect)", quote: "Build real projects instead of watching tutorial videos. That's what hiring managers care about." },
                  { id: 2, name: "Sarah C. (Lead Product Designer)", quote: "Do not neglect soft skills. Presentation is 50% of the job when scaling into senior roles." }
                ].map(mentor => (
                  <div key={mentor.id} className="rm-mentor-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="rm-play-btn" onClick={() => setPlayingMentorId(playingMentorId === mentor.id ? null : mentor.id)}>
                        <Volume2 size={16} />
                      </div>
                      <div>
                        <strong>{mentor.name}</strong>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Anonymized Audio Advice</p>
                      </div>
                    </div>

                    <div className={`rm-voice-player`}>
                      <div className={`rm-waveform ${playingMentorId === mentor.id ? 'playing' : ''}`}>
                        {[12, 18, 6, 24, 15, 8, 20, 14, 22, 6, 12, 18, 8, 14].map((h, i) => (
                          <div 
                            key={i} 
                            className="rm-wave-bar" 
                            style={{ 
                              height: playingMentorId === mentor.id ? undefined : `${h}px`,
                              animationDelay: `${i * 0.1}s`
                            }} 
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>0:18s</span>
                    </div>

                    <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: '#475569' }}>
                      "{mentor.quote}"
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Industry Pulse Hot Trends */}
            {communityTab === 'pulse' && (
              <motion.div 
                key="pulse"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div className="rm-skills-section" style={{ marginTop: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Flame size={20} style={{ color: '#FF6B6B' }} />
                    <strong>Trending in Technology sector right now:</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <span className="rm-card-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>
                      AI prompting skills +240% demand growth
                    </span>
                    <span className="rm-card-badge" style={{ background: '#ecfdf5', color: '#10b981' }}>
                      Next.js App Router competency in 68% of job posts
                    </span>
                    <span className="rm-card-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      DevOps Docker usage +35% in hybrid setups
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── SALARY & VISION SIMULATOR ── */}
        <section className="rm-simulator-section">
          <h2 className="rm-section-title">
            <Activity size={20} />
            Salary & Vision Simulator
          </h2>

          <div className="rm-simulator-box">
            <div className="rm-simulator-layout">
              {/* Levers slider controls */}
              <div className="rm-sim-levers">
                <div className="rm-sim-lever-row">
                  <label>
                    <span>City Cost Index Tier</span>
                    <strong>{cityTier === 'tier1' ? 'Tier 1 (Metro)' : cityTier === 'tier2' ? 'Tier 2 (City)' : 'Tier 3 (Suburbs)'}</strong>
                  </label>
                  <select 
                    value={cityTier} 
                    onChange={e => setCityTier(e.target.value)}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', outline: 'none' }}
                  >
                    <option value="tier1">Tier 1 Metro (e.g. San Francisco, Bengaluru Core)</option>
                    <option value="tier2">Tier 2 Medium City (e.g. Austin, Pune)</option>
                    <option value="tier3">Tier 3 Suburbs / Rural</option>
                  </select>
                </div>

                <div className="rm-sim-lever-row">
                  <label>
                    <span>Remote work allocation</span>
                    <span>{remotePercent}% Remote</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={remotePercent} 
                    onChange={e => setRemotePercent(parseInt(e.target.value))}
                  />
                </div>

                <div className="rm-sim-lever-row">
                  <label>
                    <span>Education Level</span>
                    <span>{educationLevel === 'bachelor' ? 'Bachelors Degree' : educationLevel === 'master' ? 'Masters Degree' : 'PHD Doctor'}</span>
                  </label>
                  <select 
                    value={educationLevel} 
                    onChange={e => setEducationLevel(e.target.value)}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', outline: 'none' }}
                  >
                    <option value="bachelor">Bachelors Degree</option>
                    <option value="master">Masters Degree</option>
                    <option value="phd">Ph.D. / Doctor degree</option>
                  </select>
                </div>

                <div className="rm-sim-lever-row">
                  <label>
                    <span>Weekly Work Hours Allocation</span>
                    <span>{workHours} hours / week</span>
                  </label>
                  <input 
                    type="range" 
                    min="20" 
                    max="70" 
                    value={workHours} 
                    onChange={e => setWorkHours(parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Real-time output visualization */}
              <div className="rm-sim-output">
                <div className="rm-sim-chart-mini">
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Predicted Compensation Curve</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '36px', fontWeight: 850, color: '#0A6E6E', margin: 0 }}>
                        ${simulatedSalary.toLocaleString()}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Estimated annual base salary pay</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                      <TrendingUp size={12} />
                      <span>Optimized</span>
                    </div>
                  </div>
                </div>

                <div className="rm-sim-gauge-group">
                  <div className="rm-sim-gauge-card">
                    <h5>Work-Life Balance</h5>
                    <div className="rm-sim-gauge-val">{workLifeMeter} / 10</div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>Based on work hours & remote</span>
                  </div>

                  <div className="rm-sim-gauge-card">
                    <h5>Happiness Index</h5>
                    <div className="rm-sim-gauge-val">{happinessIndex}%</div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>Aggregated satisfaction index</span>
                  </div>
                </div>

                {/* Compare Manager vs IC tracks */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '10px' }}>Compare tracks side-by-side</span>
                  <div className="rm-compare-row">
                    <div 
                      className={`rm-compare-col ${compareTrack === 'ic' ? 'active' : ''}`}
                      onClick={() => setCompareTrack('ic')}
                      style={{ cursor: 'pointer' }}
                    >
                      <strong style={{ fontSize: '13px', display: 'block' }}>Individual Contributor</strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Deep technical mastery focus.</span>
                    </div>
                    <div 
                      className={`rm-compare-col ${compareTrack === 'manager' ? 'active' : ''}`}
                      onClick={() => setCompareTrack('manager')}
                      style={{ cursor: 'pointer' }}
                    >
                      <strong style={{ fontSize: '13px', display: 'block' }}>Manager Track</strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Leadership & resource scaling focus.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── ACTION HUB & EXPORT BOTTOM STICKY BAR ── */}
      <div className="rm-action-hub-dock">
        <div className="rm-action-hub-container">
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', color: '#0A6E6E', fontWeight: 800 }}>
              {selectedRoadmap ? selectedRoadmap.title : 'No Roadmap Selected'}
            </h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {roadmapProgress}% Completed ({completedCount} / {combinedNodes.length} milestones)
            </span>
          </div>

          <div className="rm-hub-buttons">
            <button 
              className="rm-hub-btn outline"
              onClick={() => {
                window.print();
              }}
            >
              <Download size={14} />
              <span>Export PDF Summary</span>
            </button>

            <button 
              className="rm-hub-btn outline"
              onClick={() => {
                if (selectedRoadmap) {
                  toggleSave(selectedRoadmap.id);
                }
              }}
            >
              <Bookmark size={14} style={{ fill: selectedRoadmap && isPathSaved(selectedRoadmap.id) ? '#0A6E6E' : 'none' }} />
              <span>{selectedRoadmap && isPathSaved(selectedRoadmap.id) ? 'Saved' : 'Bookmark Roadmap'}</span>
            </button>

            <button className="rm-hub-btn primary">
              <span>Apply to matching roles</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── SUCCESS STORY DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedStory && (
          <div className="rm-modal-overlay" onClick={() => setSelectedStory(null)}>
            <motion.div 
              className="rm-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="rm-modal-close" onClick={() => setSelectedStory(null)}>
                <Check size={16} />
              </button>

              <h3 style={{ color: 'var(--color-teal-primary)', fontWeight: 850, margin: '0 0 16px' }}>
                Full Journey Step-By-Step
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <strong>Contributor:</strong> {selectedStory.name}
                </div>
                <div>
                  <strong>Career Switch:</strong> {selectedStory.before} ➔ {selectedStory.after}
                </div>
                <div>
                  <strong>Timeline Duration:</strong> {selectedStory.duration}
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
                  <strong>How they did it:</strong>
                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#475569', marginTop: '6px' }}>
                    {selectedStory.details} Following the roadmap sequentially, prioritizing 3 hours of focused learning every day after work. Tapped mentors to audit progress.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
