'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Briefcase, Building2, DollarSign, Lightbulb,
  HelpCircle, ShieldCheck, ArrowRight, Bookmark, Lock,
  Eye, Zap, Code2, Palette, Megaphone, Landmark,
  HeartPulse, TrendingUp, BarChart3, Settings2,
  CheckCircle2, X, Send, Users, Clock, MapPin, Sparkles,
  Link as LinkIcon, User, Mail, Award, Check
} from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';
import { useAuth, type UserDomain } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getAllJobPosts, getCompanyBySlug, Company } from '../data/recruiterData';
import './Jobs.css';

/* ─── sidebar links ─── */
const sideLinks = [
  { icon: <Briefcase size={20} />, label: 'Jobs', active: true, to: '/jobs' },
  { icon: <Building2 size={20} />, label: 'Companies', active: false, to: '/companies' },
  { icon: <DollarSign size={20} />, label: 'Salaries', active: false, to: '/salary-insights' },
  { icon: <Lightbulb size={20} />, label: 'Career Advice', active: false, to: '/roadmaps' },
];

/* ─── marquee items ─── */
const marqueeItems = [
  { tag: 'Alert', tagColor: '#dd3a22', text: 'New public jobs available: 120+ open roles in Engineering and Design.' },
  { tag: 'News', tagColor: '#3b82f6', text: 'The 2026 AI Shift: How platform engineers are adapting to enterprise LLMs.' },
  { tag: 'Community', tagColor: '#16a34a', text: 'Join 2,400+ innovators worldwide collaborating on VIJ.' },
];

/* ─── domain filter config ─── */
const domainFilters: { value: UserDomain | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Domains', icon: <Sparkles size={14} /> },
  { value: 'engineering', label: 'Engineering', icon: <Code2 size={14} /> },
  { value: 'design', label: 'Design', icon: <Palette size={14} /> },
  { value: 'marketing', label: 'Marketing', icon: <Megaphone size={14} /> },
  { value: 'finance', label: 'Finance', icon: <Landmark size={14} /> },
  { value: 'healthcare', label: 'Healthcare', icon: <HeartPulse size={14} /> },
  { value: 'sales', label: 'Sales', icon: <TrendingUp size={14} /> },
  { value: 'data-science', label: 'Data Science', icon: <BarChart3 size={14} /> },
  { value: 'operations', label: 'Operations', icon: <Settings2 size={14} /> },
];

/* ─── static base job cards ─── */
interface JobData {
  id: number;
  domain: UserDomain;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  isHourly?: boolean;
  mode: string;
  modeColor: string;
  skills: string[];
  postedAgo: string;
  applicants: number;
}

const allJobs: JobData[] = [
  { id: 1, domain: 'engineering', title: 'Senior Software Engineer (Platform)', company: 'Nexus Core Technologies', location: 'San Francisco, CA', type: 'Full-time', salaryMin: 180000, salaryMax: 240000, mode: 'Hybrid', modeColor: 'blue', skills: ['React', 'TypeScript', 'Go'], postedAgo: '2h ago', applicants: 142 },
  { id: 2, domain: 'design', title: 'Lead Product Designer', company: 'Synthetix Labs', location: 'Remote', type: 'Contract', salaryMin: 150, salaryMax: 210, isHourly: true, mode: 'Remote', modeColor: 'green', skills: ['Figma', 'Design Systems', 'Prototyping'], postedAgo: '5h ago', applicants: 89 },
  { id: 3, domain: 'engineering', title: 'Backend Engineer — Rust', company: 'QuantumGrid Inc.', location: 'Austin, TX', type: 'Full-time', salaryMin: 160000, salaryMax: 220000, mode: 'On-site', modeColor: 'blue', skills: ['Rust', 'Postgres', 'gRPC'], postedAgo: '1d ago', applicants: 67 },
  { id: 4, domain: 'marketing', title: 'Growth Marketing Manager', company: 'Bloom Digital', location: 'New York, NY', type: 'Full-time', salaryMin: 120000, salaryMax: 160000, mode: 'Hybrid', modeColor: 'blue', skills: ['SEO', 'Google Ads', 'Analytics'], postedAgo: '3h ago', applicants: 203 },
  { id: 5, domain: 'finance', title: 'Senior Financial Analyst', company: 'Apex Capital Group', location: 'Chicago, IL', type: 'Full-time', salaryMin: 130000, salaryMax: 175000, mode: 'On-site', modeColor: 'blue', skills: ['Financial Modeling', 'Excel', 'SQL'], postedAgo: '6h ago', applicants: 118 },
  { id: 6, domain: 'healthcare', title: 'Clinical Data Scientist', company: 'MedVantage AI', location: 'Boston, MA', type: 'Full-time', salaryMin: 145000, salaryMax: 195000, mode: 'Hybrid', modeColor: 'blue', skills: ['Python', 'Clinical Trials', 'NLP'], postedAgo: '1d ago', applicants: 54 },
  { id: 7, domain: 'sales', title: 'Enterprise Account Executive', company: 'CloudScale Solutions', location: 'Remote', type: 'Full-time', salaryMin: 110000, salaryMax: 180000, mode: 'Remote', modeColor: 'green', skills: ['Salesforce', 'SaaS', 'Negotiation'], postedAgo: '4h ago', applicants: 176 },
  { id: 8, domain: 'data-science', title: 'ML Engineer — LLM Infra', company: 'DeepForge Labs', location: 'San Jose, CA', type: 'Full-time', salaryMin: 200000, salaryMax: 280000, mode: 'Hybrid', modeColor: 'blue', skills: ['PyTorch', 'CUDA', 'Transformers'], postedAgo: '8h ago', applicants: 231 },
  { id: 9, domain: 'operations', title: 'Supply Chain Ops Manager', company: 'GlobalLink Logistics', location: 'Dallas, TX', type: 'Full-time', salaryMin: 95000, salaryMax: 135000, mode: 'On-site', modeColor: 'blue', skills: ['SAP', 'Lean Six Sigma', 'Forecasting'], postedAgo: '2d ago', applicants: 45 },
  { id: 10, domain: 'engineering', title: 'iOS Engineer (SwiftUI)', company: 'AppVerse Studios', location: 'Remote', type: 'Full-time', salaryMin: 155000, salaryMax: 200000, mode: 'Remote', modeColor: 'green', skills: ['Swift', 'SwiftUI', 'CoreData'], postedAgo: '12h ago', applicants: 98 },
  { id: 11, domain: 'design', title: 'UX Research Lead', company: 'UserPulse Co.', location: 'Seattle, WA', type: 'Full-time', salaryMin: 140000, salaryMax: 185000, mode: 'Hybrid', modeColor: 'blue', skills: ['User Interviews', 'Analytics', 'Figma'], postedAgo: '1d ago', applicants: 72 },
  { id: 12, domain: 'marketing', title: 'Content Strategy Director', company: 'NarrativeWorks', location: 'Remote', type: 'Full-time', salaryMin: 135000, salaryMax: 170000, mode: 'Remote', modeColor: 'green', skills: ['Content Strategy', 'SEO', 'Copywriting'], postedAgo: '3d ago', applicants: 158 },
  { id: 13, domain: 'finance', title: 'VP of FP&A', company: 'Horizon Ventures', location: 'New York, NY', type: 'Full-time', salaryMin: 200000, salaryMax: 280000, mode: 'On-site', modeColor: 'blue', skills: ['FP&A', 'Board Reporting', 'M&A'], postedAgo: '5h ago', applicants: 34 },
  { id: 14, domain: 'data-science', title: 'Data Analyst — Product', company: 'InsightGrid', location: 'Denver, CO', type: 'Full-time', salaryMin: 95000, salaryMax: 130000, mode: 'Hybrid', modeColor: 'blue', skills: ['SQL', 'Tableau', 'Python'], postedAgo: '2d ago', applicants: 189 },
  { id: 15, domain: 'healthcare', title: 'Health Informatics Engineer', company: 'CareSync Health', location: 'Remote', type: 'Contract', salaryMin: 130, salaryMax: 180, isHourly: true, mode: 'Remote', modeColor: 'green', skills: ['HL7 FHIR', 'AWS', 'Python'], postedAgo: '1d ago', applicants: 41 },
  { id: 16, domain: 'sales', title: 'SDR Team Lead', company: 'PipelineForce', location: 'Miami, FL', type: 'Full-time', salaryMin: 85000, salaryMax: 120000, mode: 'Hybrid', modeColor: 'blue', skills: ['Outreach', 'HubSpot', 'Cold Calling'], postedAgo: '6h ago', applicants: 92 },
];

/* ─── Recruiter Contact Lookup ─── */
interface RecruiterDetails {
  name: string;
  title: string;
  email: string;
  avatar: string;
}

const mockRecruiters: Record<string, RecruiterDetails> = {
  'REC-001': { name: 'Alice Johnson', title: 'Talent Acquisition Lead at Google', email: 'alice.j@google.com', avatar: '/profile_avatar.png' },
  'REC-002': { name: 'Sarah Miller', title: 'Senior Tech Recruiter at Stripe', email: 's.miller@stripe.com', avatar: '/profile_avatar.png' },
  'REC-003': { name: 'David Carter', title: 'Director of Talent at Notion', email: 'd.carter@notion.so', avatar: '/profile_avatar.png' },
  'REC-004': { name: 'Emily White', title: 'Design & Eng Recruiter at Figma', email: 'emily@figma.com', avatar: '/profile_avatar.png' },
  'REC-005': { name: 'Sophia Lane', title: 'Technical Recruiter at Vercel', email: 'sophia@vercel.com', avatar: '/profile_avatar.png' },
};

const getRecruiterDetails = (recruiterId?: string): RecruiterDetails => {
  if (recruiterId && mockRecruiters[recruiterId]) {
    return mockRecruiters[recruiterId];
  }
  return {
    name: 'Alex Thompson',
    title: 'Senior Technical Recruiter',
    email: 'alex.t@vij.co',
    avatar: '/profile_avatar.png',
  };
};

/* ─── Quiz Assessment Structure ─── */
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const quizQuestionsByDomain: Record<string, QuizQuestion[]> = {
  engineering: [
    {
      question: 'What is the main benefit of Next.js App Router layout nesting?',
      options: [
        'It forces client-side rendering for all pages.',
        'It preserves state across route segments and prevents full-page re-renders.',
        'It increases bundle size for security.'
      ],
      correct: 1
    },
    {
      question: 'Which of the following is true about TypeScript\'s \'unknown\' type?',
      options: [
        'It is identical to the \'any\' type.',
        'It forces type checking or assertion before performing operations on the value.',
        'It can only be assigned to string values.'
      ],
      correct: 1
    },
    {
      question: 'What does the \'use client\' directive declare in Next.js?',
      options: [
        'That the file runs purely in the browser.',
        'That the component represents a client boundary in the React Server Component tree.',
        'That the component code is public and unprotected.'
      ],
      correct: 1
    }
  ],
  design: [
    {
      question: 'What is the recommended color contrast ratio for normal body text under WCAG 2.1 AA guidelines?',
      options: ['3.0:1', '4.5:1', '7.0:1'],
      correct: 1
    },
    {
      question: 'In Figma, what is the main advantage of using Auto Layout?',
      options: [
        'It automates vector drawing.',
        'It creates responsive containers that adapt size automatically to their contents and spacing.',
        'It automatically exports images to SVG.'
      ],
      correct: 1
    },
    {
      question: 'Which of the following is a key phase in user-centered design?',
      options: [
        'Compiling database queries.',
        'User testing and continuous prototyping.',
        'Minimizing CSS classes.'
      ],
      correct: 1
    }
  ],
  default: [
    {
      question: 'What is a primary metric to evaluate customer acquisition cost (CAC) efficiency?',
      options: ['LTV:CAC Ratio', 'Total page view count', 'Number of email templates'],
      correct: 0
    },
    {
      question: 'What is the main objective of financial forecasting?',
      options: [
        'To record past historical tax data.',
        'To project future revenue, expenses, and capital requirements.',
        'To minimize server hosting charges.'
      ],
      correct: 1
    },
    {
      question: 'Which of the following represents high-signal market-fit alignment?',
      options: [
        'High visitor bounce rate.',
        'High customer retention rate and organic referrals.',
        'Large CSS stylesheet files.'
      ],
      correct: 1
    }
  ]
};

const mockAds = [
  {
    id: 'ad-stripe',
    company: 'Stripe',
    logo: 'S',
    title: 'Scale the Internet GDP',
    description: 'Synthesizing global financial paths. Stripe is actively hiring platform engineers and design leads across India and remote offices.',
    cta: 'Explore Stripe Roles',
    link: '/company/stripe/careers',
    background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
    border: 'rgba(99, 102, 241, 0.2)'
  },
  {
    id: 'ad-vercel',
    company: 'Vercel',
    logo: 'V',
    title: 'Deploy at the Speed of Light',
    description: 'Join the team building Next.js and frontend clouds. Discover open infrastructure and developer experience roles.',
    cta: 'Explore Vercel Roles',
    link: '/company/vercel/careers',
    background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
    border: 'rgba(14, 165, 233, 0.2)'
  }
];

interface ExpandedJobData extends JobData {
  description: string;
  screeningQuestions?: string[];
  companySlug?: string;
  recruiterId?: string;
  perks?: string[];
  eligibility?: {
    hard: {
      skills: string[];
      experienceYears: number;
      education: string;
      certifications: string[];
    };
    preferred: {
      skills: string[];
      certifications: string[];
    };
  };
}

const trendingSkills = [
  { name: 'Generative AI', pct: '+42%', color: '#dd3a22', bright: true },
  { name: 'Quantum Engineering', pct: '+18%', color: '#3b82f6', bright: true },
  { name: 'Next.js 15 Expert', pct: '+12%', color: '#d4d4d8', bright: false },
];

const barHeights = [40, 60, 45, 75, 100, 55];

const domainIcons: Record<string, React.ReactNode> = {
  engineering: <Code2 size={24} />,
  design: <Palette size={24} />,
  marketing: <Megaphone size={24} />,
  finance: <Landmark size={24} />,
  healthcare: <HeartPulse size={24} />,
  sales: <TrendingUp size={24} />,
  'data-science': <BarChart3 size={24} />,
  operations: <Settings2 size={24} />,
};

export const Jobs: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, applyToJob, hasApplied } = useAuth();
  const { formatCurrency } = useCurrency();
  const { t } = useLanguage();

  // Saved bookmark map state
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  
  // Tab category filter state
  const [activeDomain, setActiveDomain] = useState<UserDomain | 'all'>(
    isAuthenticated && user?.domain ? user.domain : 'all'
  );

  // Personalized Match filter state (default true for logged in)
  const [relevantOnly, setRelevantOnly] = useState(isAuthenticated);

  // Load-more visible jobs count
  const [visibleCount, setVisibleCount] = useState(8);

  // Popover detailed drawer state
  const [selectedJob, setSelectedJob] = useState<ExpandedJobData | null>(null);

  // Direct Apply modal state
  const [applyModalJob, setApplyModalJob] = useState<ExpandedJobData | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [justApplied, setJustApplied] = useState<number | null>(null);

  // Quiz active taking state
  const [takingQuizId, setTakingQuizId] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizError, setQuizError] = useState('');
  const [completedTests, setCompletedTests] = useState<Record<number, number>>({}); // jobId -> score %

  // Sync state with login status
  useEffect(() => {
    if (isAuthenticated) {
      setRelevantOnly(true);
    }
  }, [isAuthenticated]);

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSaved(p => ({ ...p, [id]: !p[id] }));
  };

  // Enhance custom job metadata and return full structures
  const getExpandedJob = (job: JobData): ExpandedJobData => {
    if ('description' in job && (job as any).description) return job as ExpandedJobData;

    const companySlug = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const recruiterId = `REC-00${(job.id % 5) + 1}`;
    
    // Screening test is active on even job IDs
    const screeningQuestions = job.id % 2 === 0
      ? ['Question 1', 'Question 2', 'Question 3']
      : [];

    return {
      ...job,
      description: `We are seeking a high-caliber ${job.title} to integrate scalable workflows, optimize core features, and work directly under parameter-aligned structures at ${job.company}. Ideal candidates demonstrate strong capability in: ${job.skills.join(', ')}.`,
      screeningQuestions,
      companySlug,
      recruiterId,
      perks: ['Flexible Work Hours', 'Premium Workspace Hardware', 'Performance Bonus', 'Learning Budget'],
      eligibility: {
        hard: {
          skills: job.skills,
          experienceYears: (job.id % 3) + 2,
          education: 'Bachelor\'s Degree',
          certifications: [],
        },
        preferred: {
          skills: [...job.skills, 'System Design'],
          certifications: [],
        }
      }
    };
  };

  // Merge static list with database (recruiter local storage)
  const allUnifiedJobs = useMemo(() => {
    const customPosts = getAllJobPosts();
    const formattedCustom: JobData[] = customPosts
      .filter((post) => post.status === 'active')
      .map((post) => {
        const companyObj = getCompanyBySlug(post.companySlug);
        const domain = post.department.toLowerCase() as UserDomain;
        const mode = post.workType === 'remote' ? 'Remote' : post.workType === 'hybrid' ? 'Hybrid' : 'On-site';
        const modeColor = post.workType === 'remote' ? 'green' : 'blue';
        return {
          id: post.id,
          domain,
          title: post.title,
          company: companyObj?.name || post.companySlug.toUpperCase(),
          location: post.location,
          type: 'Full-time',
          salaryMin: post.salaryMin,
          salaryMax: post.salaryMax,
          mode,
          modeColor,
          skills: post.eligibility.hard.skills,
          postedAgo: 'Just posted',
          applicants: post.analytics?.applied || 0,
          // Expanded fields:
          description: post.description,
          screeningQuestions: post.screeningQuestions,
          companySlug: post.companySlug,
          recruiterId: post.recruiterId,
          perks: post.perks,
          eligibility: post.eligibility,
        };
      });

    const merged = [...allJobs];
    formattedCustom.forEach((customJob) => {
      if (!merged.some((j) => j.id === customJob.id)) {
        merged.push(customJob);
      }
    });

    return merged;
  }, []);

  // Compute seeker alignment matching scores
  const getMatchScore = (job: JobData) => {
    if (!isAuthenticated || !user) return 0;
    let score = 0;
    
    // Domain match: 50%
    if (user.domain && job.domain === user.domain) {
      score += 50;
    }
    
    // Skill match: 50%
    const userSkills = user.skills || [];
    if (job.skills && job.skills.length > 0) {
      const matched = job.skills.filter(s =>
        userSkills.some(us => us.toLowerCase() === s.toLowerCase())
      );
      score += Math.round(50 * (matched.length / job.skills.length));
    } else {
      score += 50;
    }

    return score;
  };

  // Filter & Sort list
  const filteredJobs = useMemo(() => {
    let list = [...allUnifiedJobs];
    
    // Category filter
    if (activeDomain !== 'all') {
      list = list.filter(j => j.domain === activeDomain);
    }
    
    // Seeker relevance parameter matrix
    if (relevantOnly && isAuthenticated && user) {
      list = list.filter(j => getMatchScore(j) >= 50);
    }

    // Sort by match score descending if logged in
    if (isAuthenticated) {
      list.sort((a, b) => getMatchScore(b) - getMatchScore(a));
    }

    return list;
  }, [allUnifiedJobs, activeDomain, relevantOnly, isAuthenticated, user]);

  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  const gridItems = useMemo(() => {
    const items: Array<
      | { type: 'job'; data: JobData; originalIndex: number }
      | { type: 'ad'; data: typeof mockAds[number]; key: string }
    > = [];
    visibleJobs.forEach((job, idx) => {
      items.push({ type: 'job', data: job, originalIndex: idx });
      // Insert an ad card after every 4th job card (index 3, 7, etc.)
      if (idx > 0 && idx % 4 === 3) {
        const adIndex = Math.floor(idx / 4) % mockAds.length;
        const ad = mockAds[adIndex];
        items.push({ type: 'ad', data: ad, key: `ad-${ad.id}-${job.id}` });
      }
    });
    return items;
  }, [visibleJobs]);

  const handleApplyClick = (e: React.MouseEvent, job: JobData) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    const expanded = getExpandedJob(job);
    
    // If the job requires a screening quiz, we open the detail drawer directly to initiate the test
    if (expanded.screeningQuestions && expanded.screeningQuestions.length > 0 && !completedTests[job.id]) {
      setSelectedJob(expanded);
      setTakingQuizId(job.id);
      setQuizAnswers({});
      setQuizScore(null);
      setQuizError('');
    } else {
      setApplyModalJob(expanded);
    }
  };

  const confirmApply = () => {
    if (applyModalJob) {
      applyToJob(applyModalJob.id);
      setJustApplied(applyModalJob.id);
      setTimeout(() => setJustApplied(null), 2000);
      setApplyModalJob(null);
    }
  };

  // Submit screening test answers
  const handleQuizSubmit = (jobId: number, questions: QuizQuestion[]) => {
    const totalCount = questions.length;
    let correctCount = 0;
    
    for (let i = 0; i < totalCount; i++) {
      if (quizAnswers[i] === undefined) {
        setQuizError('Please answer all questions before submitting.');
        return;
      }
      if (quizAnswers[i] === questions[i].correct) {
        correctCount++;
      }
    }

    const pct = Math.round((correctCount / totalCount) * 100);
    setQuizScore(pct);
    setQuizError('');
    setCompletedTests(prev => ({ ...prev, [jobId]: pct }));

    // Auto-apply on test completion
    applyToJob(jobId);
    setJustApplied(jobId);
    setTimeout(() => setJustApplied(null), 2500);
  };

  // Get active quiz questions by domain
  const getQuizQuestions = (domain: string) => {
    return quizQuestionsByDomain[domain] || quizQuestionsByDomain.default;
  };

  return (
    <PageTransition>
      <div className="exp-root">

        {/* ══════ 3-COLUMN LAYOUT ══════ */}
        <div className="exp-columns">



          {/* ── MAIN FEED ── */}
          <main className="exp-feed">
            <div className="exp-feed-inner">

              {/* Hero Banner */}
              <motion.section
                className="exp-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <div className="exp-hero-overlay">
                  {isAuthenticated ? (
                    <>
                      <span className="exp-hero-badge success-badge">Welcome back, {user?.name.split(' ')[0]}</span>
                      <h1 className="exp-hero-title">Your next milestone awaits.</h1>
                      <p className="exp-hero-sub">We've found {filteredJobs.length} matching roles for your credentials.</p>
                    </>
                  ) : (
                    <>
                      <span className="exp-hero-badge">Guest View Active</span>
                      <h1 className="exp-hero-title">Discover your next evolution.</h1>
                      <p className="exp-hero-sub">Join 2M+ professionals finding their peak potential on VIJ.</p>
                    </>
                  )}
                </div>
              </motion.section>

              {/* ── Domain Filter Chips & Personalized Alignment Toggle ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="exp-domain-filters">
                  {domainFilters.map(df => (
                    <button
                      key={df.value}
                      className={`exp-domain-chip ${activeDomain === df.value ? 'active' : ''}`}
                      onClick={() => setActiveDomain(df.value)}
                    >
                      {df.icon}
                      <span>{df.label}</span>
                      {activeDomain === df.value && isAuthenticated && df.value === user?.domain && (
                        <span className="exp-domain-yours">Your Domain</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Seeker parameters alignment toggle */}
                {isAuthenticated && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px' }}>
                    <label 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: 'var(--vij-text-muted)',
                        cursor: 'pointer',
                        background: 'rgba(0,0,0,0.03)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={relevantOnly}
                        onChange={() => setRelevantOnly(!relevantOnly)}
                        style={{ accentColor: '#dd3a22', cursor: 'pointer' }}
                      />
                      <span>🎯 Relevant Match Parameters Only (Score &ge; 50%)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* ── 4-COLUMN JOBS GRID ── */}
              <div className="jobs-grid-container">
                <AnimatePresence mode="popLayout">
                  {gridItems.map((item, i) => {
                    if (item.type === 'job') {
                      const job = item.data;
                      const applied = hasApplied(job.id);
                      const wasJustApplied = justApplied === job.id;
                      const matchScore = getMatchScore(job);
                      
                      // Upgraded status criteria
                      const isUpgraded = job.salaryMax >= 180000 || matchScore >= 80;

                      return (
                        <motion.div
                          key={`job-${job.id}`}
                          className={`exp-job-card ${isUpgraded && isAuthenticated ? 'upgraded-glow' : ''}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: 0.02 + i * 0.02 }}
                          onClick={() => setSelectedJob(getExpandedJob(job))}
                          layout
                        >
                          <div className="exp-job-left">
                            <div className="exp-job-icon">
                              {domainIcons[job.domain] || <Zap size={20} />}
                            </div>
                            <div style={{ width: '100%' }}>
                              <h3 className="exp-job-title" title={job.title}>
                                {job.title}
                              </h3>
                              <p className="exp-job-company">
                                {job.company}
                              </p>
                              <span style={{ fontSize: '10px', color: 'var(--vij-text-muted)', display: 'block', margin: '2px 0 6px' }}>
                                📍 {job.location}
                              </span>
                              
                              {/* Match Score Badge */}
                              {isAuthenticated && (
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                  <span 
                                    className="match-score-badge"
                                    style={{
                                      fontSize: '9px',
                                      fontWeight: 800,
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      background: matchScore >= 75 ? 'rgba(5, 150, 105, 0.12)' : 'rgba(0,0,0,0.05)',
                                      color: matchScore >= 75 ? '#059669' : 'var(--vij-text-muted)',
                                      border: matchScore >= 75 ? '1px solid rgba(5, 150, 105, 0.3)' : '1px solid rgba(0,0,0,0.05)',
                                    }}
                                  >
                                    🎯 {matchScore}% Match
                                  </span>
                                  {isUpgraded && (
                                    <span 
                                      style={{
                                        fontSize: '9px',
                                        fontWeight: 800,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: 'rgba(245, 158, 11, 0.12)',
                                        color: '#d97706',
                                        border: '1px solid rgba(245, 158, 11, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2px'
                                      }}
                                    >
                                      <Sparkles size={8} /> Upgraded
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="exp-job-chips">
                                <span className="exp-chip">{job.type}</span>
                                <span className="exp-chip">
                                  {formatCurrency(job.salaryMin, true)} - {formatCurrency(job.salaryMax, true)}{job.isHourly ? '/hr' : ''}
                                </span>
                                <span className={`exp-chip mode-${job.modeColor}`}>{job.mode}</span>
                              </div>
                              
                              <div className="exp-job-skills">
                                {job.skills.slice(0, 3).map(s => (
                                  <span key={s} className="exp-skill-chip">{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="exp-job-meta-row">
                            <span className="exp-meta-item"><Clock size={10} /> {job.postedAgo}</span>
                            <span className="exp-meta-item"><Users size={10} /> {job.applicants} applied</span>
                          </div>

                          <div className="exp-job-actions">
                            <button
                              className={`exp-bookmark ${saved[job.id] ? 'saved' : ''}`}
                              onClick={(e) => toggleSave(e, job.id)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                              <Bookmark size={16} fill={saved[job.id] ? '#dd3a22' : 'none'} />
                            </button>

                            {applied || wasJustApplied || completedTests[job.id] ? (
                              <button
                                className="exp-apply-btn applied"
                                onClick={(e) => e.stopPropagation()}
                                style={{ width: 'auto', flex: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <CheckCircle2 size={12} />
                                <span>Applied</span>
                              </button>
                            ) : (
                              <button
                                className="exp-apply-btn"
                                onClick={(e) => handleApplyClick(e, job)}
                              >
                                <Send size={12} />
                                <span>Apply</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    } else {
                      const ad = item.data;
                      return (
                        <motion.div
                          key={item.key}
                          className="exp-job-card ad-card"
                          style={{
                            background: ad.background,
                            borderColor: ad.border,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'stretch',
                            padding: '16px',
                            borderRadius: '12px',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            minHeight: '330px',
                            cursor: 'default'
                          }}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          layout
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.06)', color: 'var(--vij-text-muted)', textTransform: 'uppercase' }}>
                                Sponsored Ad
                              </span>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--vij-text-main)' }}>{ad.company}</span>
                            </div>
                            <h3 style={{ fontSize: '14px', fontWeight: 800, margin: '8px 0 4px 0', color: 'var(--vij-text-main)', lineHeight: 1.3 }}>{ad.title}</h3>
                            <p style={{ fontSize: '11px', color: 'var(--vij-text-muted)', margin: 0, lineHeight: 1.4 }}>{ad.description}</p>
                          </div>
                          <button
                            className="exp-apply-btn"
                            style={{ width: '100%', background: 'linear-gradient(90deg, #dd3a22, #b45309)', border: 'none', marginTop: '12px', cursor: 'pointer' }}
                            onClick={() => router.push(ad.link)}
                          >
                            {ad.cta}
                          </button>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>
              </div>

              {filteredJobs.length === 0 && (
                <div className="exp-empty-state">
                  <Eye size={40} />
                  <h3>No relevant jobs match your parameters</h3>
                  <p>Try toggling off 'Relevant Match Parameters Only' to discover all listings.</p>
                </div>
              )}

              {/* Load More Roles Button */}
              {filteredJobs.length > visibleCount && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', marginBottom: '16px' }}>
                  <button 
                    className="load-more-roles-btn"
                    onClick={() => setVisibleCount(prev => prev + 8)}
                  >
                    Load More Roles
                  </button>
                </div>
              )}

              {/* News Card */}
              <motion.div
                className="exp-news-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => router.push('/news')}
              >
                <div className="exp-news-img">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" 
                    alt="The 2026 AI Shift" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </div>
                <div className="exp-news-body">
                  <span className="exp-news-label">Industry Insights</span>
                  <h3 className="exp-news-title">The 2026 AI Shift</h3>
                  <p className="exp-news-desc">How platform engineers are adapting to the explosion of LLM deployments in enterprise architecture.</p>
                  <span className="exp-news-link">
                    Read full article <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>

              {/* Locked Premium Card - Hide if authenticated */}
              {!isAuthenticated && (
                <motion.div
                  className="exp-locked-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <div className="exp-locked-glow" />
                  <div className="exp-locked-inner">
                    <div className="exp-locked-badge">
                      <Lock size={18} />
                      <span>Restricted Data</span>
                    </div>
                    <h3 className="exp-locked-title">Premium Market Intelligence</h3>
                    <p className="exp-locked-desc">Access salary benchmarks, competitor headcount trends, and hiring velocity reports powered by VIJ Data.</p>
                    <button className="exp-locked-btn" onClick={() => router.push('/register')}>
                      Unlock with a free account
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </main>

          {/* ── RIGHT INSIGHTS PANEL ── */}
          <aside className="exp-insights">
            {!isAuthenticated && (
              <div className="exp-insight-cta">
                <h4>Elevate your career</h4>
                <p>Create a profile to get personalized job recommendations and salary insights.</p>
                <button className="exp-insight-cta-primary" onClick={() => router.push('/register')}>Create Account</button>
                <button className="exp-insight-cta-secondary">Browse Limited Access</button>
              </div>
            )}

            <div className="exp-insight-section">
              <h5 className="exp-insight-label">Global Trending Skills</h5>
              <div className="exp-skills-list">
                {trendingSkills.map(skill => (
                  <div key={skill.name} className={`exp-skill-row ${!skill.bright ? 'dim' : ''}`}>
                    <div className="exp-skill-name">
                      <span className="exp-skill-dot" style={{ background: skill.color }} />
                      <span>{skill.name}</span>
                    </div>
                    <span className={`exp-skill-pct ${skill.bright ? 'green' : ''}`}>{skill.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="exp-insight-section exp-pulse-card">
              <h5 className="exp-insight-label">Market Match Pulse</h5>
              <div className="exp-pulse-bars">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`exp-pulse-bar ${i === 4 ? 'pulse' : ''}`}
                    style={{ height: `${h}%`, opacity: 0.2 + (h / 100) * 0.8 }}
                  />
                ))}
              </div>
              <div className="exp-pulse-footer">
                <span className="exp-pulse-label">Hiring Velocity</span>
                <span className="exp-pulse-value">Accelerating</span>
              </div>
            </div>

            <div className="exp-insight-footer">
              <div className="exp-insight-footer-links">
                <a>Privacy Policy</a>
                <a>Cookie Policy</a>
                <a>User Agreement</a>
              </div>
              <p>© 2026 Virtual Intelligent Junction</p>
            </div>
          </aside>
        </div>
      </div>

      {/* ══════ JOB DETAIL SLIDE-OVER DRAWER ══════ */}
      <AnimatePresence>
        {selectedJob && (
          <div
            className="drawer-overlay"
            onClick={() => {
              setSelectedJob(null);
              setTakingQuizId(null);
            }}
          >
            <motion.div
              className="drawer-container vij-glass"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                className="drawer-close-btn"
                onClick={() => {
                  setSelectedJob(null);
                  setTakingQuizId(null);
                }}
              >
                <X size={20} />
              </button>

              <div className="drawer-scroll-content">
                {/* Header */}
                <div className="drawer-section-header">
                  <div className="drawer-icon-box">
                    {domainIcons[selectedJob.domain] || <Zap size={22} />}
                  </div>
                  <div>
                    <span className="drawer-company-label">{selectedJob.company}</span>
                    <h2 className="drawer-job-title">{selectedJob.title}</h2>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--vij-text-muted)', marginTop: '4px' }}>
                      <span>📍 {selectedJob.location}</span>
                      <span>•</span>
                      <span>💼 {selectedJob.type} ({selectedJob.mode})</span>
                    </div>
                  </div>
                </div>

                {/* Salary Match ribbon */}
                <div className="drawer-match-ribbon">
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--vij-text-muted)', fontWeight: 700 }}>
                      Salary Range
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--vij-text-main)' }}>
                      {formatCurrency(selectedJob.salaryMin, true)} - {formatCurrency(selectedJob.salaryMax, true)}{selectedJob.isHourly ? '/hr' : ''}
                    </div>
                  </div>
                  {isAuthenticated && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--vij-text-muted)', fontWeight: 700 }}>
                        Match Rating
                      </span>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669' }}>
                        🎯 {getMatchScore(selectedJob)}% Match
                      </div>
                    </div>
                  )}
                </div>

                {/* Tab selector inline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                  {/* Job Description */}
                  <div className="drawer-card-box">
                    <h4 className="drawer-card-title">Job Description</h4>
                    <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.5, color: 'var(--vij-text-main)' }}>
                      {selectedJob.description}
                    </p>
                    
                    {selectedJob.perks && selectedJob.perks.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--vij-text-muted)' }}>Perks & Benefits:</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                          {selectedJob.perks.map(p => (
                            <span key={p} style={{ fontSize: '10px', background: 'rgba(0,0,0,0.03)', padding: '3px 8px', borderRadius: '4px' }}>
                              🎁 {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Company Profile Details */}
                  {(() => {
                    const companyObj = getCompanyBySlug(selectedJob.companySlug || '') || {
                      slug: 'custom',
                      name: selectedJob.company,
                      industry: selectedJob.domain,
                      size: '100 - 500',
                      headquarters: selectedJob.location,
                      website: `https://www.${selectedJob.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                      logo: selectedJob.company[0],
                      description: 'Innovative company building high-signal solutions.',
                      mission: 'Deliver exceptional value to global parameters.',
                      culture: 'Collaborative, remote-first, and craft-obsessed.',
                      benefits: ['Comprehensive Medical', 'Learning Stipends', 'Workstation Budgets'],
                      techStack: selectedJob.skills,
                      foundedYear: 2018,
                      employeeCount: 300,
                    };

                    return (
                      <div className="drawer-card-box">
                        <h4 className="drawer-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={16} />
                          Company Profile: {companyObj.name}
                        </h4>
                        <p style={{ fontSize: '12px', margin: '0 0 12px 0', lineHeight: 1.4, color: 'var(--vij-text-muted)' }}>
                          {companyObj.description}
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginBottom: '12px' }}>
                          <div>🏢 <strong>HQ:</strong> {companyObj.headquarters}</div>
                          <div>📅 <strong>Founded:</strong> {companyObj.foundedYear}</div>
                          <div>👥 <strong>Size:</strong> {companyObj.size} ({companyObj.employeeCount} employees)</div>
                          <div>
                            🌐 <strong>Website:</strong>{' '}
                            <a href={companyObj.website} target="_blank" rel="noopener noreferrer" style={{ color: '#dd3a22', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              Visit <LinkIcon size={8} />
                            </a>
                          </div>
                        </div>

                        {companyObj.techStack && companyObj.techStack.length > 0 && (
                          <div>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--vij-text-muted)', textTransform: 'uppercase' }}>
                              Core Tech Stack
                            </span>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                              {companyObj.techStack.map(t => (
                                <span key={t} style={{ fontSize: '10px', background: 'rgba(0,0,0,0.04)', color: 'var(--vij-text-main)', padding: '2px 6px', borderRadius: '4px' }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Recruiter Details */}
                  {(() => {
                    const recruiter = getRecruiterDetails(selectedJob.recruiterId);
                    return (
                      <div className="drawer-card-box">
                        <h4 className="drawer-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={16} />
                          Hiring Manager & Coordinator
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <img src={recruiter.avatar} alt={recruiter.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span className="online-indicator-dot" style={{ right: '2px', bottom: '2px', width: '8px', height: '8px', border: '1px solid white' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px' }}>{recruiter.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--vij-text-muted)' }}>{recruiter.title}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--vij-text-muted)', marginTop: '2px' }}>
                              <Mail size={10} />
                              <span>{recruiter.email}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button 
                            className="interaction-btn" 
                            style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '6px 12px', fontSize: '11px', flex: 1 }}
                            onClick={() => alert(`Direct connection request transmitted to ${recruiter.name}`)}
                          >
                            Connect
                          </button>
                          <button 
                            className="interaction-btn" 
                            style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '6px 12px', fontSize: '11px', flex: 1 }}
                            onClick={() => router.push('/network/messages')}
                          >
                            Message
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── SCREENING QUIZ WIDGET ── */}
                  {selectedJob.screeningQuestions && selectedJob.screeningQuestions.length > 0 && (
                    <div className="drawer-card-box screening-box">
                      <h4 className="drawer-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309' }}>
                        <Award size={16} />
                        Required Parameter Validation Assessment
                      </h4>
                      <p style={{ fontSize: '11px', margin: '0 0 12px 0', color: 'var(--vij-text-muted)', lineHeight: 1.4 }}>
                        This recruiter requires a screening quiz to evaluate domain parameter eligibility and automatically unlock priority shortlisting.
                      </p>

                      {completedTests[selectedJob.id] !== undefined ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>
                          <CheckCircle2 size={16} />
                          <span>Screening Quiz Completed! Score: {completedTests[selectedJob.id]}%</span>
                        </div>
                      ) : takingQuizId === selectedJob.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                          {getQuizQuestions(selectedJob.domain).map((q, idx) => (
                            <div key={idx} style={{ borderBottom: '1px dashed rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                                {idx + 1}. {q.question}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {q.options.map((opt, optIdx) => (
                                  <label 
                                    key={optIdx} 
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '8px', 
                                      fontSize: '11px', 
                                      padding: '6px 10px', 
                                      borderRadius: '6px', 
                                      background: quizAnswers[idx] === optIdx ? 'rgba(221,38,34,0.05)' : 'transparent',
                                      border: quizAnswers[idx] === optIdx ? '1px solid rgba(221,38,34,0.3)' : '1px solid transparent',
                                      cursor: 'pointer' 
                                    }}
                                  >
                                    <input 
                                      type="radio" 
                                      name={`question-${idx}`}
                                      checked={quizAnswers[idx] === optIdx}
                                      onChange={() => setQuizAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                      style={{ accentColor: '#dd3a22' }}
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}

                          {quizError && (
                            <div style={{ color: '#dc2626', fontSize: '11px', fontWeight: 600 }}>
                              ⚠️ {quizError}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <button 
                              className="load-more-roles-btn" 
                              style={{ padding: '6px 16px', fontSize: '11px', flex: 1 }}
                              onClick={() => handleQuizSubmit(selectedJob.id, getQuizQuestions(selectedJob.domain))}
                            >
                              Submit Assessment Answers
                            </button>
                            <button 
                              className="interaction-btn" 
                              style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '6px 16px', fontSize: '11px' }}
                              onClick={() => setTakingQuizId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="exp-apply-btn"
                          style={{ width: '100%', background: '#b45309', border: '1px solid #d97706' }}
                          onClick={() => {
                            if (!isAuthenticated) {
                              setShowLoginPrompt(true);
                              return;
                            }
                            setTakingQuizId(selectedJob.id);
                          }}
                        >
                          ✍️ Start Seeker Screening Quiz
                        </button>
                      )}
                    </div>
                  )}

                  {/* Drawer Footer Actions */}
                  <div style={{ marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
                    <button
                      className={`exp-bookmark ${saved[selectedJob.id] ? 'saved' : ''}`}
                      onClick={(e) => toggleSave(e, selectedJob.id)}
                      style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      <Bookmark size={20} fill={saved[selectedJob.id] ? '#dd3a22' : 'none'} />
                    </button>

                    {hasApplied(selectedJob.id) || completedTests[selectedJob.id] !== undefined ? (
                      <button
                        className="exp-apply-btn applied"
                        style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        disabled
                      >
                        <CheckCircle2 size={16} />
                        <span>Applied Successfully</span>
                      </button>
                    ) : (
                      <button
                        className="exp-apply-btn"
                        style={{ flex: 1, height: '48px' }}
                        onClick={(e) => handleApplyClick(e, selectedJob)}
                      >
                        <Send size={16} />
                        <span>Apply For Position</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════ APPLY CONFIRMATION MODAL ══════ */}
      <AnimatePresence>
        {applyModalJob && (
          <motion.div
            className="exp-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setApplyModalJob(null)}
          >
            <motion.div
              className="exp-modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="exp-modal-close" onClick={() => setApplyModalJob(null)}><X size={20} /></button>
              <div className="exp-modal-icon">{domainIcons[applyModalJob.domain]}</div>
              <h2 className="exp-modal-title">Apply to this role?</h2>
              <h3 className="exp-modal-job-title">{applyModalJob.title}</h3>
              <p className="exp-modal-company">{applyModalJob.company} • {applyModalJob.location}</p>
              <div className="exp-modal-details">
                <span><MapPin size={14} /> {applyModalJob.mode}</span>
                <span><DollarSign size={14} /> {formatCurrency(applyModalJob.salaryMin, true)} - {formatCurrency(applyModalJob.salaryMax, true)}</span>
                <span><Users size={14} /> {applyModalJob.applicants} applied</span>
              </div>
              <div className="exp-modal-resume-hint">
                <Sparkles size={16} />
                <span>Your VIJ profile will be shared with the recruiter</span>
              </div>
              <div className="exp-modal-actions">
                <button className="exp-modal-cancel" onClick={() => setApplyModalJob(null)}>Cancel</button>
                <button className="exp-modal-confirm" onClick={confirmApply}>
                  <Send size={16} /> Confirm Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ LOGIN PROMPT MODAL ══════ */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="exp-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              className="exp-modal exp-modal-login"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="exp-modal-close" onClick={() => setShowLoginPrompt(false)}><X size={20} /></button>
              <div className="exp-modal-lock-icon"><Lock size={32} /></div>
              <h2 className="exp-modal-title">Sign in to Apply</h2>
              <p className="exp-modal-desc">Create a free account to apply for jobs, save listings, and get matched with top companies.</p>
              <div className="exp-modal-actions">
                <button className="exp-modal-confirm" onClick={() => router.push('/register')}>
                  Create Free Account <ArrowRight size={16} />
                </button>
                <button className="exp-modal-cancel" onClick={() => router.push('/login')}>
                  Already have an account? Log in
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PageTransition>
  );
};
