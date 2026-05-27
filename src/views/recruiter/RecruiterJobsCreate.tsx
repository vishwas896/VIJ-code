'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../components/PageTransition';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import {
  Plus, Trash2, ShieldAlert, Sparkles, MapPin, Briefcase,
  DollarSign, GraduationCap, Award, Info, Users, CheckCircle,
  FileText, ShieldCheck, X
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useRecruiter } from '../../context/RecruiterContext';
import { calculateMatchScore, type UserProfile } from '../../services/matchingEngine';
import { type JobPost } from '../../data/recruiterData';
import './Recruiter.css';

export const RecruiterJobsCreate: React.FC = () => {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { createJob, company } = useRecruiter();

  const [isScanning, setIsScanning] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState<'remote' | 'hybrid' | 'onsite'>('hybrid');
  const [salaryMin, setSalaryMin] = useState(80000);
  const [salaryMax, setSalaryMax] = useState(150000);

  // Hard Requirements State
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [hardExpYears, setHardExpYears] = useState(2);
  const [hardEdu, setHardEdu] = useState("Bachelor's");
  const [hardCerts, setHardCerts] = useState<string[]>([]);
  const [certInput, setCertInput] = useState('');
  const [portfolioRequired, setPortfolioRequired] = useState(false);

  // Preferred Requirements State
  const [prefSkills, setPrefSkills] = useState<string[]>([]);
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [prefCerts, setPrefCerts] = useState<string[]>([]);
  const [prefCertInput, setPrefCertInput] = useState('');

  // Screening questions state
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [questionInput, setQuestionInput] = useState('');

  const [aiAutoShortlist, setAiAutoShortlist] = useState(true);

  // Helper functions for tags
  const addTag = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue('');
    }
  };

  const removeTag = (tag: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter(item => item !== tag));
  };

  // Mock candidates for Live Eligibility preview
  const mockCandidates = useMemo(() => [
    { name: 'Alice Walker', skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'Git'], experience: 4, education: 'B.Tech', certifications: ['AWS Cloud Practitioner'], hasPortfolio: true },
    { name: 'David Chen', skills: ['React', 'TypeScript', 'Python', 'Node.js', 'Docker'], experience: 2, education: 'B.Tech', certifications: [], hasPortfolio: true },
    { name: 'Sarah Kim', skills: ['Go', 'Kubernetes', 'Docker', 'gRPC', 'Distributed Systems'], experience: 5, education: "Master's", certifications: ['Google Cloud Professional'], hasPortfolio: false },
    { name: 'James Rodriguez', skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'CSS'], experience: 4, education: "Bachelor's", certifications: [], hasPortfolio: true },
    { name: 'Emily Zhang', skills: ['Rust', 'C++', 'WebSocket', 'WebAssembly', 'Go'], experience: 6, education: 'B.Tech', certifications: [], hasPortfolio: false },
    { name: 'Priya Sharma', skills: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Performance Optimization'], experience: 3, education: "Bachelor's", certifications: [], hasPortfolio: true },
    { name: 'Michael Scott', skills: ['Sales', 'Marketing', 'Excel', 'Negotiation'], experience: 8, education: 'High School', certifications: [], hasPortfolio: false },
    { name: 'John Doe', skills: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL'], experience: 3, education: 'Diploma', certifications: ['AWS Cloud Practitioner'], hasPortfolio: true },
  ], []);

  // Compute live match metrics based on draft job specifications
  const eligibilityMetrics = useMemo(() => {
    const draftJob: JobPost = {
      id: 9999,
      companySlug: company?.slug || 'draft',
      recruiterId: 'draft',
      title: title || 'Draft Role',
      description: description || '',
      salaryMin,
      salaryMax,
      location: location || 'Anywhere',
      workType,
      department,
      eligibility: {
        hard: {
          skills: hardSkills,
          experienceYears: hardExpYears,
          education: hardEdu,
          certifications: hardCerts,
        },
        preferred: {
          skills: prefSkills,
          certifications: prefCerts,
        },
        portfolioRequired,
      },
      perks: [],
      screeningQuestions,
      aiAutoShortlist,
      postedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      analytics: { viewed: 0, applied: 0, shortlisted: 0, interviewed: 0, rejected: 0, ineligible: 0 }
    };

    const matches = mockCandidates.map(cand => {
      const profile: UserProfile = {
        skills: cand.skills,
        experience: cand.experience,
        education: cand.education,
        certifications: cand.certifications,
        hasPortfolio: cand.hasPortfolio
      };
      return {
        name: cand.name,
        res: calculateMatchScore(profile, draftJob)
      };
    });

    const eligible = matches.filter(m => m.res.isEligible);
    const highlyCompatible = matches.filter(m => !m.res.isEligible && m.res.score >= 70);

    return {
      eligibleCount: eligible.length,
      highlyCompatibleCount: highlyCompatible.length,
      sampleMatches: matches.slice(0, 4)
    };
  }, [
    company, title, description, department, location, workType,
    salaryMin, salaryMax, hardSkills, hardExpYears, hardEdu, hardCerts,
    prefSkills, prefCerts, portfolioRequired, screeningQuestions,
    aiAutoShortlist, mockCandidates
  ]);

  const handleLaunch = () => {
    if (!title) {
      alert('Please specify a Job Title.');
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      createJob({
        title,
        description,
        salaryMin,
        salaryMax,
        location: location || 'Remote',
        workType,
        department,
        eligibility: {
          hard: {
            skills: hardSkills,
            experienceYears: hardExpYears,
            education: hardEdu,
            certifications: hardCerts,
          },
          preferred: {
            skills: prefSkills,
            certifications: prefCerts,
          },
          portfolioRequired,
        },
        perks: ['Health Insurance', 'Learning Budget', 'Flexible Hours'],
        screeningQuestions,
        aiAutoShortlist,
      });
      setIsScanning(false);
      router.push('/recruiter/dashboard');
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="recruiter-hud-root" style={{ paddingTop: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="recruiter-title">Intelligent Job Matching Configurator</h1>
          <p className="recruiter-subtitle">Configure parameters and watch the AI pre-qualify Junction candidates in real-time.</p>
        </div>

        <div className="hud-content-layout">
          {/* Main Configurator Column */}
          <div className="hud-pipeline-feed">
            
            {/* Phase 1: Core Details */}
            <GlassCard className="parameter-card">
              <h2 className="dashboard-section-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                <Briefcase size={20} style={{ color: '#0ea5e9', marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
                1. Core Details
              </h2>
              
              <div className="recruiter-form-group">
                <label className="recruiter-label">Job Title</label>
                <input 
                  type="text" 
                  className="recruiter-input" 
                  placeholder="e.g. Senior Frontend Developer" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="recruiter-form-group">
                  <label className="recruiter-label">Department</label>
                  <select 
                    className="recruiter-input" 
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Product</option>
                    <option>Data Science</option>
                    <option>Marketing</option>
                    <option>DX</option>
                    <option>Infrastructure</option>
                  </select>
                </div>
                <div className="recruiter-form-group">
                  <label className="recruiter-label">Work Model</label>
                  <select 
                    className="recruiter-input" 
                    value={workType}
                    onChange={e => setWorkType(e.target.value as any)}
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
              </div>

              <div className="recruiter-form-group">
                <label className="recruiter-label">Office Location</label>
                <input 
                  type="text" 
                  className="recruiter-input" 
                  placeholder="e.g. San Francisco, CA or Remote" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <div className="recruiter-form-group">
                <label className="recruiter-label">Job Description</label>
                <textarea 
                  className="recruiter-input" 
                  rows={4}
                  placeholder="Summarize key duties, team dynamic, and daily objectives..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </GlassCard>

            {/* Phase 2: Salary Range */}
            <GlassCard className="parameter-card">
              <h2 className="dashboard-section-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                <DollarSign size={20} style={{ color: '#10b981', marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
                2. Compensation Range
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="recruiter-form-group">
                  <label className="recruiter-label">Minimum Salary ({formatCurrency(salaryMin, true)})</label>
                  <input 
                    type="range" 
                    min="30000" 
                    max="300000" 
                    step="5000"
                    value={salaryMin}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSalaryMin(val);
                      if (val > salaryMax) setSalaryMax(val);
                    }}
                    style={{ width: '100%', accentColor: '#10b981' }}
                  />
                </div>
                <div className="recruiter-form-group">
                  <label className="recruiter-label">Maximum Salary ({formatCurrency(salaryMax, true)})</label>
                  <input 
                    type="range" 
                    min="30000" 
                    max="300000" 
                    step="5000"
                    value={salaryMax}
                    onChange={e => setSalaryMax(Math.max(salaryMin, Number(e.target.value)))}
                    style={{ width: '100%', accentColor: '#10b981' }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Phase 3: Hard Requirements (Enforced Gates) */}
            <GlassCard className="parameter-card">
              <div className="dashboard-section-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                <div>
                  <ShieldAlert size={20} style={{ color: '#ef4444', marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
                  3. Hard Requirements (Instantly Gated)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '4px 10px', borderRadius: '12px' }}>
                  Enforced Gates
                </div>
              </div>
              <p className="recruiter-subtitle" style={{ marginBottom: '20px' }}>
                Candidates missing <strong>ANY</strong> of these parameters will be marked ineligible.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="recruiter-form-group">
                  <label className="recruiter-label">Minimum Experience (Years: {hardExpYears})</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="15" 
                    value={hardExpYears}
                    onChange={e => setHardExpYears(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ef4444' }}
                  />
                </div>
                <div className="recruiter-form-group">
                  <label className="recruiter-label">Required Education Level</label>
                  <select 
                    className="recruiter-input" 
                    value={hardEdu}
                    onChange={e => setHardEdu(e.target.value)}
                  >
                    <option>High School</option>
                    <option>Diploma</option>
                    <option>Associate</option>
                    <option>Bachelor's</option>
                    <option>Master's</option>
                    <option>PhD</option>
                  </select>
                </div>
              </div>

              {/* Skills Tag Input */}
              <div className="recruiter-form-group">
                <label className="recruiter-label">Mandatory Skills (Press Enter to add)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    className="recruiter-input" 
                    placeholder="e.g. React" 
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(skillInput, setSkillInput, hardSkills, setHardSkills))}
                  />
                  <button 
                    type="button" 
                    onClick={() => addTag(skillInput, setSkillInput, hardSkills, setHardSkills)}
                    style={{ padding: '0 16px', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {hardSkills.map(skill => (
                    <span key={skill} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.12)' }}>
                      {skill}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(skill, hardSkills, setHardSkills)} />
                    </span>
                  ))}
                  {hardSkills.length === 0 && <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No mandatory skills added yet.</span>}
                </div>
              </div>

              {/* Certifications Tag Input */}
              <div className="recruiter-form-group">
                <label className="recruiter-label">Mandatory Certifications</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    className="recruiter-input" 
                    placeholder="e.g. AWS Solutions Architect" 
                    value={certInput}
                    onChange={e => setCertInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(certInput, setCertInput, hardCerts, setHardCerts))}
                  />
                  <button 
                    type="button" 
                    onClick={() => addTag(certInput, setCertInput, hardCerts, setHardCerts)}
                    style={{ padding: '0 16px', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {hardCerts.map(cert => (
                    <span key={cert} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.12)' }}>
                      {cert}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(cert, hardCerts, setHardCerts)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Portfolio required toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <input 
                  type="checkbox" 
                  id="portfolioToggle" 
                  checked={portfolioRequired} 
                  onChange={e => setPortfolioRequired(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ef4444' }}
                />
                <label htmlFor="portfolioToggle" style={{ fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                  Require Portfolio / Work Samples for Seeker Eligibility
                </label>
              </div>
            </GlassCard>

            {/* Phase 4: Preferred Requirements (Bonus Match Points) */}
            <GlassCard className="parameter-card">
              <div className="dashboard-section-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                <div>
                  <Award size={20} style={{ color: '#f59e0b', marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
                  4. Preferred Qualifications (Bonus Score Points)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)', padding: '4px 10px', borderRadius: '12px' }}>
                  Nice to Have
                </div>
              </div>
              <p className="recruiter-subtitle" style={{ marginBottom: '20px' }}>
                These are not gates. Candidates receive additional matching score points if they possess them.
              </p>

              {/* Preferred Skills */}
              <div className="recruiter-form-group">
                <label className="recruiter-label">Nice-to-Have Skills</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    className="recruiter-input" 
                    placeholder="e.g. Next.js" 
                    value={prefSkillInput}
                    onChange={e => setPrefSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(prefSkillInput, setPrefSkillInput, prefSkills, setPrefSkills))}
                  />
                  <button 
                    type="button" 
                    onClick={() => addTag(prefSkillInput, setPrefSkillInput, prefSkills, setPrefSkills)}
                    style={{ padding: '0 16px', background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '12px', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {prefSkills.map(skill => (
                    <span key={skill} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.05)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.12)' }}>
                      {skill}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(skill, prefSkills, setPrefSkills)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Certs */}
              <div className="recruiter-form-group">
                <label className="recruiter-label">Nice-to-Have Certifications</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    className="recruiter-input" 
                    placeholder="e.g. Google Cloud Professional" 
                    value={prefCertInput}
                    onChange={e => setPrefCertInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(prefCertInput, setPrefCertInput, prefCerts, setPrefCerts))}
                  />
                  <button 
                    type="button" 
                    onClick={() => addTag(prefCertInput, setPrefCertInput, prefCerts, setPrefCerts)}
                    style={{ padding: '0 16px', background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '12px', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {prefCerts.map(cert => (
                    <span key={cert} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.05)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.12)' }}>
                      {cert}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(cert, prefCerts, setPrefCerts)} />
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Phase 5: Screening Questions & Automation */}
            <GlassCard className="parameter-card" style={{ marginBottom: '100px' }}>
              <h2 className="dashboard-section-title" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                <FileText size={20} style={{ color: '#6366f1', marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
                5. Applicant Screening & AI Auto-Shortlisting
              </h2>
              
              <div className="recruiter-form-group">
                <label className="recruiter-label">Screening Questions (Optional)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    className="recruiter-input" 
                    placeholder="Add a custom question candidates must answer (e.g. Describe an API you designed.)" 
                    value={questionInput}
                    onChange={e => setQuestionInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(questionInput, setQuestionInput, screeningQuestions, setScreeningQuestions))}
                  />
                  <button 
                    type="button" 
                    onClick={() => addTag(questionInput, setQuestionInput, screeningQuestions, setScreeningQuestions)}
                    style={{ padding: '0 16px', background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: '12px', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {screeningQuestions.map((q, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <span style={{ fontSize: '14px', color: '#334155' }}>{q}</span>
                      <Trash2 size={16} style={{ color: '#ef4444', cursor: 'pointer' }} onClick={() => setScreeningQuestions(screeningQuestions.filter(item => item !== q))} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px', marginTop: '24px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0f172a' }}>AI Automated Shortlisting</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Instantly advance seekers scoring above 85% match to Interview stage.</p>
                </div>
                <input 
                  type="checkbox" 
                  id="aiShortlistToggle"
                  checked={aiAutoShortlist} 
                  onChange={e => setAiAutoShortlist(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#6366f1' }}
                />
              </div>
            </GlassCard>
          </div>

          {/* Real-time Eligibility Sidebar */}
          <div className="hud-side-column" style={{ position: 'sticky', top: '24px' }}>
            <GlassCard className="hud-side-widget" style={{ border: '1px solid rgba(14,165,233,0.18)', boxShadow: '0 8px 32px rgba(14,165,233,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={18} style={{ color: '#0ea5e9' }} />
                <h3 style={{ margin: 0, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Talent Match Preview</h3>
              </div>

              {/* Stats Gauge */}
              <div style={{ background: 'rgba(14,165,233,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(14,165,233,0.08)', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', fontWeight: 900, color: '#0ea5e9', lineHeight: 1 }}>
                  {eligibilityMetrics.eligibleCount}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>
                  Qualified Seeker Matches
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                  Out of {mockCandidates.length} profiles in the local junction.
                </div>
              </div>

              {/* Compatibility Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Highly Compatible (&gt;=70%):</span>
                  <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{eligibilityMetrics.highlyCompatibleCount} candidates</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Screening Automations:</span>
                  <span style={{ fontWeight: 700, color: '#6366f1' }}>{aiAutoShortlist ? 'ON' : 'OFF'}</span>
                </div>
              </div>

              {/* Sample Matches list */}
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Candidate Sim Results</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {eligibilityMetrics.sampleMatches.map((cand, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '8px 12px', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{cand.name}</span>
                      <span className={`career-match-badge ${cand.res.isEligible ? 'eligible' : 'not-eligible'}`} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                        {cand.res.score}% {cand.res.isEligible ? 'Passed' : 'Gated'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Tips */}
              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(245,158,11,0.05)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.1)', display: 'flex', gap: '10px' }}>
                <Info size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '12px', color: '#b45309', lineHeight: 1.4 }}>
                  {hardSkills.length > 3 ? 'Tip: You have many mandatory skills. Consider moving some to preferred to increase applicant pool.' : 
                   hardExpYears > 4 ? 'Tip: Experience requirement is high. Consider lowering it to 2-3 years to match junior/mid candidates.' : 
                   'Tip: Ensure salary range matches local expectations for optimal applicant response rates.'}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom Actions Sticky Bar */}
        <div className="bottom-action-bar" style={{ zIndex: 10 }}>
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>Ready to Match Seeker Pool?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Publishing will update the Career Portal and activate eligibility filters instantly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <GlassButton variant="secondary" onClick={() => router.push('/recruiter/dashboard')}>
              Cancel
            </GlassButton>
            <GlassButton variant="primary" onClick={handleLaunch} disabled={isScanning} glowingEdge="azure">
              {isScanning ? 'Scouting Junction Talent...' : 'Publish to Careers Portal'}
            </GlassButton>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};
