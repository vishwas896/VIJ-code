/* eslint-disable */
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Map,
  TrendingUp, ChevronRight,
  Activity, Users, Bookmark, Building2,
  Sparkles, Award, Flame, Compass, ChevronDown, 
  Check, Info, Download, Volume2,
  Clock, Play, Pause, RotateCcw, Share2,
  MapPin, CheckCircle, ExternalLink
} from 'lucide-react';
import { useRoadmaps } from '../context/RoadmapContext';
import { useCurrency } from '../context/CurrencyContext';
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
  const { formatCurrency } = useCurrency();

  const formatPivotSalary = (jumpStr: string) => {
    const digits = jumpStr.replace(/[^0-9]/g, '');
    const num = parseInt(digits, 10);
    if (isNaN(num)) return jumpStr;
    const formatted = formatCurrency(num, true);
    return jumpStr.startsWith('+') ? `+${formatted}` : formatted;
  };

  // --- SCRAPING SYSTEM ---
  const [scrapedRoadmaps, setScrapedRoadmaps] = useState<Roadmap[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [scrapingLog, setScrapingLog] = useState<string[]>([]);

  // --- POMODORO TIMER SYSTEM ---
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 mins
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // --- SHARING EXPERIENCE SYSTEM ---
  const [experienceText, setExperienceText] = useState('');
  const [isJourneyShared, setIsJourneyShared] = useState(false);

  // --- MENTORSHIP REQUESTS STATE ---
  const [sentMentorshipRequests, setSentMentorshipRequests] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

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

  // Pomodoro Interval Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            if (!isBreak) {
              alert("Great job focusing! Take a 5-minute break.");
              setIsBreak(true);
              return 300;
            } else {
              alert("Break's over! Let's focus again.");
              setIsBreak(false);
              return 1500;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timerRunning, isBreak]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Autocomplete data suggestions (merged with scraped roadmaps)
  const searchSuggestions = useMemo(() => {
    const local = ROADMAP_DATABASE.map(r => ({
      id: r.id,
      title: r.title,
      sector: r.sector
    }));
    const scraped = scrapedRoadmaps.map(r => ({
      id: r.id,
      title: r.title,
      sector: r.sector
    }));
    return [...local, ...scraped];
  }, [scrapedRoadmaps]);

  const currentPivots = useMemo(() => {
    if (!selectedRoadmap) return DEFAULT_PIVOTS;
    return MOCK_PIVOTS[selectedRoadmap.id] || DEFAULT_PIVOTS;
  }, [selectedRoadmap]);

  // Handle autocomplete click
  const handleSelectQuery = (rmId: string) => {
    let rm = ROADMAP_DATABASE.find(r => r.id === rmId);
    if (!rm) {
      rm = scrapedRoadmaps.find(r => r.id === rmId);
    }
    if (rm) {
      setSelectedRoadmap(rm);
      setSearchQuery(rm.title);
      setShowAutocomplete(false);
      setSelectedPivot(null);
      setIsJourneyShared(false);
      setExperienceText('');
    }
  };

  // Web Scraping Scraper Simulation Function
  const handleScrapeAndGenerate = (query: string) => {
    if (!query || query.trim() === '') return;
    setIsScraping(true);
    setScrapingProgress(5);
    setScrapingLog(['Establishing connection to job engines (Indeed, LinkedIn, Glassdoor, levels.fyi)...']);
    setShowAutocomplete(false);

    let progress = 5;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setScrapingProgress(100);

        const customId = `scraped-${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`;
        const newMap: Roadmap = {
          id: customId,
          sector: 'IT',
          domain: query,
          level: 'Mid',
          title: `${query} Specialist`,
          description: `AI-synthesized custom path for ${query} based on live listings from Indeed, Glassdoor & LinkedIn.`,
          iconId: 'Sparkles',
          likes: 412,
          saves: 198,
          learners: 320,
          nodes: [
            {
              id: `${customId}-n1`,
              title: `Foundations of ${query}`,
              desc: `Master core workflows, terminology, and baseline tools required for entry-level work.`,
              skills: [`${query} basics`, 'Version Control', 'Agile Principles'],
              milestone: `Complete a verified project covering foundational concepts of ${query}.`,
              duration: '4-6 Weeks'
            },
            {
              id: `${customId}-n2`,
              title: `Advanced Application & Integration`,
              desc: `Deep dive into automation, optimization, and deploying enterprise workflows.`,
              skills: ['Architecture Design', 'APIs', 'Error Telemetry'],
              milestone: 'Deploy a high-availability modular system in staging.',
              duration: '6-8 Weeks'
            },
            {
              id: `${customId}-n3`,
              title: `Enterprise Scaling & Systems Oversight`,
              desc: `Secure architectures, lead operational metrics, and master resource monitoring.`,
              skills: ['Security Controls', 'Systems Tuning', 'Mentorship'],
              milestone: 'Deliver a final optimized project reviewed by industry mentors.',
              duration: '8-10 Weeks'
            }
          ]
        };

        MOCK_PIVOTS[customId] = [
          { role: `Senior ${query}`, salaryJump: '+$45,000', percentPivot: 65, timeToTransition: '1.5 Years', popularity: 'High', industry: 'Technology' },
          { role: `${query} Consultant`, salaryJump: '+$35,000', percentPivot: 40, timeToTransition: '1 Year', popularity: 'Medium', industry: 'Technology', isUnconventional: true },
          { role: `Director of ${query}`, salaryJump: '+$85,000', percentPivot: 15, timeToTransition: '3 Years', popularity: 'Low', industry: 'Technology' }
        ];

        setScrapedRoadmaps(prev => [...prev, newMap]);
        setSelectedRoadmap(newMap);
        setCustomMilestones([]);
        setIsScraping(false);
        setIsJourneyShared(false);
        setExperienceText('');
      } else {
        setScrapingProgress(progress);
        if (progress === 25) {
          setScrapingLog(prev => [...prev, `🔍 Live crawling: searching keywords "${query}" in 1,200 active job postings...`]);
        } else if (progress === 45) {
          setScrapingLog(prev => [...prev, '📊 Extracting core skill cloud & certification requirements...']);
        } else if (progress === 65) {
          setScrapingLog(prev => [...prev, '💵 Parsing salary datasets & matching location bounds...']);
        } else if (progress === 85) {
          setScrapingLog(prev => [...prev, '💡 AI synthesis: assembling optimal 3-stage milestone checkpoints...']);
        }
      }
    }, 600);
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
                placeholder="e.g. Cloud Architect, Cybersecurity Architect, Mobile Dev..." 
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleScrapeAndGenerate(searchQuery);
                  }
                }}
              />
              <Sparkles size={18} style={{ color: '#FF6B6B' }} />
            </div>

            {showAutocomplete && (
              <ul className="rm-autocomplete-list">
                {searchQuery.trim().length > 0 && (
                  <li 
                    className="rm-autocomplete-item" 
                    onClick={() => handleScrapeAndGenerate(searchQuery)}
                    style={{ background: 'linear-gradient(90deg, #eff6ff, #f0fdf4)', borderLeft: '3px solid #0A6E6E', fontWeight: 800 }}
                  >
                    <Sparkles size={14} style={{ color: '#0A6E6E', marginRight: '6px' }} />
                    <span>Scrape & Generate Custom AI Roadmap for "{searchQuery}"</span>
                  </li>
                )}
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

          {/* Web Scraper Live Console Overlay */}
          {isScraping && (
            <div className="rm-scraper-loader" style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(10, 110, 110, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '580px',
              margin: '20px auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A6E6E', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} style={{ color: '#FF6B6B' }} />
                  Live Web-Scraping & Roadmap Synthesis
                </span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#FF6B6B' }}>{scrapingProgress}%</span>
              </div>
              <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ width: `${scrapingProgress}%`, height: '100%', background: 'linear-gradient(90deg, #0A6E6E, #FF6B6B)', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#38bdf8', height: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {scrapingLog.map((log, index) => (
                  <div key={index} style={{ opacity: index === scrapingLog.length - 1 ? 1 : 0.6 }}>
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                        <span>{formatPivotSalary(p.salaryJump)} jump • {p.percentPivot}% transitioned</span>
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
                          <strong style={{ color: '#16a34a' }}>{formatPivotSalary(selectedPivot.salaryJump)}</strong>
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

        {/* ── REAL-TIME WEB-SCRAPED MARKET INSIGHTS ── */}
        {selectedRoadmap && (
          <section style={{ marginTop: '40px' }}>
            <h2 className="rm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} style={{ color: '#0A6E6E' }} />
              🌐 Real-Time Web-Scraped Market Intelligence
            </h2>
            <p style={{ margin: '-10px 0 20px', fontSize: '13px', color: '#64748b' }}>
              Fresh salary bounds, hiring densities, and live listings aggregated from LinkedIn, Indeed, levels.fyi, and Glassdoor.
            </p>

            <div className="rm-snapshot-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* 1. Global Salary Benchmarks */}
              <div className="rm-snapshot-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="rm-card-badge">Salary Benchmark comparisons</span>
                  <Award size={14} style={{ color: '#0A6E6E' }} />
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#0A6E6E', fontWeight: 800 }}>Global Base Salary Range</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { locale: 'United States', amount: selectedRoadmap.id.includes('ai') ? 145000 : selectedRoadmap.id.includes('ib') ? 118000 : selectedRoadmap.id.includes('scraped') ? 125000 : 88000, barWidth: '95%', rateName: 'Glassdoor' },
                    { locale: 'India Hubs', amount: selectedRoadmap.id.includes('ai') ? 35000 : selectedRoadmap.id.includes('ib') ? 22000 : selectedRoadmap.id.includes('scraped') ? 28000 : 18000, barWidth: '55%', rateName: 'Indeed' },
                    { locale: 'United Kingdom', amount: selectedRoadmap.id.includes('ai') ? 110000 : selectedRoadmap.id.includes('ib') ? 95000 : selectedRoadmap.id.includes('scraped') ? 100000 : 75000, barWidth: '80%', rateName: 'LinkedIn' },
                    { locale: 'European Union', amount: selectedRoadmap.id.includes('ai') ? 115000 : selectedRoadmap.id.includes('ib') ? 100000 : selectedRoadmap.id.includes('scraped') ? 105000 : 80000, barWidth: '85%', rateName: 'levels.fyi' }
                  ].map(item => (
                    <div key={item.locale} style={{ fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1e293b', marginBottom: '2px', fontWeight: 600 }}>
                        <span>{item.locale} <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 400 }}>({item.rateName})</span></span>
                        <span>{formatCurrency(item.amount, true)}</span>
                      </div>
                      <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: item.barWidth, height: '100%', background: '#0A6E6E', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Top Location Density */}
              <div className="rm-snapshot-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="rm-card-badge">Location Hiring Index</span>
                  <MapPin size={14} style={{ color: '#0A6E6E' }} />
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#0A6E6E', fontWeight: 800 }}>Geographical Hotspots</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { city: 'San Francisco, US', index: '9.8/10', mode: 'Remote/Hybrid', trend: 'Growing' },
                    { city: 'Bangalore, IN', index: '9.6/10', mode: 'Remote Friendly', trend: 'High Density' },
                    { city: 'London, UK', index: '8.9/10', mode: 'Hybrid Preferred', trend: 'Steady' },
                    { city: 'Berlin, DE', index: '8.5/10', mode: 'Full Remote Option', trend: 'Expanding' }
                  ].map(c => (
                    <div key={c.city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <strong style={{ color: '#1e293b' }}>{c.city}</strong>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{c.mode}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#0A6E6E' }}>{c.index}</span>
                        <div style={{ fontSize: '9px', color: '#10b981', fontWeight: 600 }}>{c.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Company Comparisons & Salaries */}
              <div className="rm-snapshot-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="rm-card-badge">Top Hiring Ecosystems</span>
                  <Building2 size={14} style={{ color: '#0A6E6E' }} />
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#0A6E6E', fontWeight: 800 }}>Leading Hiring Entities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { company: 'Google Inc.', avgPay: selectedRoadmap.id.includes('ai') ? 165000 : selectedRoadmap.id.includes('ib') ? 135000 : 110000, speed: 'Fast (Anti-Ghosting)' },
                    { company: 'Stripe, Corp.', avgPay: selectedRoadmap.id.includes('ai') ? 155000 : selectedRoadmap.id.includes('ib') ? 128000 : 102000, speed: 'Medium' },
                    { company: 'Swiggy / local growth-stage startups', avgPay: selectedRoadmap.id.includes('ai') ? 130000 : selectedRoadmap.id.includes('ib') ? 110000 : 90000, speed: 'Rapid hiring cycles' }
                  ].map(comp => (
                    <div key={comp.company} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <strong style={{ color: '#1e293b' }}>{comp.company}</strong>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{comp.speed}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#FF6B6B' }}>{formatCurrency(comp.avgPay, true)} avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Live Scraped Feed */}
            <div className="rm-snapshot-card" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(10, 110, 110, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="rm-card-badge" style={{ background: '#FF6B6B', color: 'white' }}>Live Real-Time Openings</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Scraped 45 minutes ago</span>
              </div>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#0A6E6E', fontWeight: 800 }}>Currently Hiring Positions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'job-scr-1', title: `Lead ${selectedRoadmap.title}`, company: 'Google Inc.', loc: 'San Francisco, CA (Hybrid)', pay: selectedRoadmap.id.includes('ai') ? 175000 : 125000 },
                  { id: 'job-scr-2', title: `Staff ${selectedRoadmap.title}`, company: 'Stripe, Corp.', loc: 'Remote, US/EU', pay: selectedRoadmap.id.includes('ai') ? 160000 : 110000 },
                  { id: 'job-scr-3', title: `Senior Associate - ${selectedRoadmap.title}`, company: 'Swiggy / Tech Startups', loc: 'Bangalore, KA (On-site)', pay: selectedRoadmap.id.includes('ai') ? 135000 : 95000 }
                ].map(job => {
                  const hasApplied = appliedJobs.includes(job.id);
                  return (
                    <div key={job.id} style={{ background: 'white', border: '1px solid rgba(10, 110, 110, 0.1)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b' }}>{job.title}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>{job.company}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                          <MapPin size={10} />
                          <span>{job.loc}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0A6E6E' }}>{formatCurrency(job.pay, true)}/yr</span>
                        <button
                          onClick={() => {
                            if (!hasApplied) {
                              setAppliedJobs(prev => [...prev, job.id]);
                            }
                          }}
                          className={`rm-toggle-btn`}
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            background: hasApplied ? '#dcfce7' : '#0A6E6E',
                            color: hasApplied ? '#166534' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {hasApplied ? (
                            <>
                              <CheckCircle size={10} />
                              <span>Applied</span>
                            </>
                          ) : (
                            <>
                              <span>Apply Direct</span>
                              <ExternalLink size={10} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── SUGGESTED DOMAIN EXPERTS & CONNECTIONS ── */}
        {selectedRoadmap && (
          <section style={{ marginTop: '40px' }}>
            <h2 className="rm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: '#0A6E6E' }} />
              👥 Recommended Domain Experts & VIJ Connections
            </h2>
            <p style={{ margin: '-10px 0 20px', fontSize: '13px', color: '#64748b' }}>
              Connect with these VIJ users who have completed this roadmap or work in the same domain. Reach out for 1:1 project support.
            </p>

            <div className="rm-snapshot-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { id: 'exp-1', name: 'Devendra V.', company: 'Google Inc.', role: `Lead ${selectedRoadmap.title}`, match: '98% match', tags: ['System Scale', 'Mentoring'] },
                { id: 'exp-2', name: 'Priya Nair', company: 'Stripe, Corp.', role: `VP of Engineering`, match: '95% match', tags: ['Cloud Strategy', 'FTE'] },
                { id: 'exp-3', name: 'Amit Sen', company: 'Swiggy / Tech Startups', role: `Senior Architect`, match: '92% match', tags: ['Backend Systems', 'Caching'] }
              ].map(mentor => {
                const requestSent = sentMentorshipRequests.includes(mentor.id);
                return (
                  <div key={mentor.id} className="rm-snapshot-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0A6E6E, #FF6B6B)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: '18px',
                        textTransform: 'uppercase'
                      }}>
                        {mentor.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: 800 }}>{mentor.name}</h4>
                          <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '99px', fontWeight: 700 }}>{mentor.match}</span>
                        </div>
                        <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{mentor.role} at {mentor.company}</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                          {mentor.tags.map(t => (
                            <span key={t} style={{ fontSize: '9px', background: '#eff6ff', color: '#1e40af', padding: '1px 6px', borderRadius: '4px' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!requestSent) {
                          setSentMentorshipRequests(prev => [...prev, mentor.id]);
                        }
                      }}
                      className="rm-hub-btn primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '8px',
                        fontSize: '12px',
                        background: requestSent ? '#dcfce7' : '#0A6E6E',
                        color: requestSent ? '#166534' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {requestSent ? 'Request Sent ✓' : 'Request Mentorship Support'}
                    </button>
                  </div>
                );
              })}
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

            {/* Horizontal Timeline Scroller with Timer Sidebar in Split Layout */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '20px' }}>
              <div style={{ flex: '1 1 65%', minWidth: '320px' }}>
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
                                <span>Checkpoint: +{pacing === 'aggressive' ? formatCurrency(12000, true) : formatCurrency(8000, true)}/yr boost</span>
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
              </div>

              {/* Pomodoro Timer and Productivity Sidebar */}
              <div style={{ flex: '1 1 30%', minWidth: '280px' }}>
                <div className="rm-snapshot-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(10, 110, 110, 0.2)', position: 'sticky', top: '100px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="rm-card-badge" style={{ background: '#FF6B6B', color: 'white' }}>⏱️ Focus Pomodoro</span>
                    <Clock size={16} style={{ color: '#0A6E6E' }} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#0A6E6E', fontWeight: 800 }}>Learning Session Tracker</h4>

                  <div style={{ textAlign: 'center', margin: '10px 0' }}>
                    <div style={{ fontSize: '36px', fontWeight: 900, color: '#1e293b', fontFamily: 'monospace' }}>
                      {formatTime(timerSeconds)}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {isBreak ? '☕ Break Time' : '📚 Study Focus Session'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: '#0A6E6E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {timerRunning ? <Pause size={12} /> : <Play size={12} />}
                      <span>{timerRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(isBreak ? 300 : 1500);
                      }}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: '#e2e8f0',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setIsBreak(false);
                        setTimerSeconds(1500);
                      }}
                      style={{ fontSize: '10px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                    >
                      25m Focus
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setIsBreak(true);
                        setTimerSeconds(300);
                      }}
                      style={{ fontSize: '10px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                    >
                      5m Break
                    </button>
                  </div>

                  <div style={{ height: '1px', background: '#cbd5e1', margin: '5px 0' }} />

                  {/* Skills Gained list */}
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#1e293b', marginBottom: '8px' }}>
                      Gained Skills ({completedCount} / {combinedNodes.length} done):
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {combinedNodes.filter(n => isNodeCompleted(n.id)).flatMap(n => n.skills).map(s => (
                        <span key={s} style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                          {s} ✓
                        </span>
                      ))}
                      {completedCount === 0 && (
                        <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                          Mark milestones as done to gain skills.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Celebration overlay */}
            {roadmapProgress === 100 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.9), rgba(219, 234, 254, 0.9))',
                border: '2px dashed #10b981',
                borderRadius: '16px',
                padding: '24px',
                marginTop: '24px',
                textAlign: 'center',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.1)'
              }}>
                <span style={{ fontSize: '40px' }}>🎉</span>
                <h3 style={{ margin: '8px 0', fontSize: '18px', color: '#065f46', fontWeight: 900 }}>Roadmap Completed!</h3>
                <p style={{ fontSize: '13px', color: '#047857', maxWidth: '500px', margin: '0 auto 16px' }}>
                  You have successfully achieved all milestones and mastered all skills in this career roadmap!
                </p>

                {isJourneyShared ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}>
                    <CheckCircle size={16} />
                    <span>Your learning experience has been shared to the VIJ Community Feed!</span>
                  </div>
                ) : (
                  <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      placeholder="Write about your learning experience, hurdles you crossed, and how this roadmap helped you..."
                      value={experienceText}
                      onChange={e => setExperienceText(e.target.value)}
                      style={{
                        width: '100%',
                        height: '70px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '12px',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                    <button
                      onClick={() => setIsJourneyShared(true)}
                      className="rm-hub-btn primary"
                      style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px' }}
                    >
                      <Share2 size={14} />
                      <span>Share My Journey & Experience</span>
                    </button>
                  </div>
                )}
              </div>
            )}
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
                        {formatCurrency(simulatedSalary, true)}
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


