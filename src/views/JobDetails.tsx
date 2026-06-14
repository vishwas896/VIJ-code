'use client';
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft, MapPin, DollarSign, Clock, Users, Bookmark, Share2,
  CheckCircle, AlertCircle, Building2, ExternalLink, ShieldCheck,
  Briefcase, Sparkles, X, ArrowRight, Eye, TrendingUp
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { PageTransition } from '../components/common/PageTransition';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { getJobById, getCompanyBySlug } from '../data/recruiterData';
import { calculateMatchScore, type UserProfile, type MatchResult } from '../services/matchingEngine';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './JobDetails.css';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, type: 'spring' as const, stiffness: 200, damping: 20 }
  })
};

export const JobDetails: React.FC = () => {
  const params = useParams<{ jobId: string }>();
  const jobId = Number(params?.jobId);
  const router = useRouter();
  const { isAuthenticated, user, applyToJob, hasApplied: checkHasApplied } = useAuth();
  const { formatCurrency } = useCurrency();

  const [saved, setSaved] = useState(false);
  const [showImprovementModal, setShowImprovementModal] = useState(false);

  const job = getJobById(jobId);
  const company = job ? getCompanyBySlug(job.companySlug) : null;

  const matchResult: MatchResult | null = useMemo(() => {
    if (!isAuthenticated || !user || user.role === 'recruiter' || !job) return null;
    const profile: UserProfile = {
      skills: user.skills || [],
      experience: user.experience || 0,
      education: user.education || '',
      certifications: user.certifications || [],
      hasPortfolio: user.hasPortfolio || false,
    };
    return calculateMatchScore(profile, job);
  }, [isAuthenticated, user, job]);

  const hasApplied = job ? checkHasApplied(job.id) : false;
  const [justApplied, setJustApplied] = useState(false);

  const handleApply = () => {
    if (!job || !isAuthenticated) return;
    applyToJob(job.id);
    setJustApplied(true);
  };

  if (!job) {
    return (
      <PageTransition>
        <div className="jd-empty"><Briefcase size={48} /><h2>Job not found</h2><GlassButton href="/jobs">Back to Jobs</GlassButton></div>
      </PageTransition>
    );
  }

  const allMissing = [
    ...(matchResult?.missingHardSkills || []),
    ...(matchResult?.missingCerts || []),
    ...(matchResult && !matchResult.experienceMatch ? [`${job.eligibility.hard.experienceYears}+ years experience`] : []),
    ...(matchResult && !matchResult.educationMatch ? [`${job.eligibility.hard.education} degree`] : []),
  ];

  return (
    <PageTransition>
      <div className="jd-root">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassButton variant="secondary" onClick={() => router.back()} className="jd-back" icon={<ArrowLeft size={16} />}>Back</GlassButton>
        </motion.div>

        <div className="jd-layout">
          {/* ═══ MAIN COLUMN ═══ */}
          <div className="jd-main">

            {/* Job Header */}
            <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard className="jd-header-card">
                <div className="jd-gradient-strip" />
                <div className="jd-header-top">
                  <div>
                    <h1 className="jd-title">{job.title}</h1>
                    <div className="jd-meta-info">
                      <Building2 size={16} />
                      <Link href={`/company/${job.companySlug}`} className="jd-company-link" style={{ textDecoration: 'none' }}>{company?.name || job.companySlug}</Link>
                      <span>•</span>
                      <MapPin size={14} /><span>{job.location}</span>
                    </div>
                  </div>
                  <Link href={`/company/${job.companySlug}`} className="jd-company-logo" style={{ textDecoration: 'none' }}>
                    {company?.logo || job.companySlug.charAt(0).toUpperCase()}
                  </Link>
                </div>

                <div className="jd-badges">
                  <span className="jd-badge"><DollarSign size={14} style={{ color: '#10b981' }} /> {formatCurrency(job.salaryMin, true)} - {formatCurrency(job.salaryMax, true)}</span>
                  <span className="jd-badge"><Clock size={14} style={{ color: 'var(--accent-azure)' }} /> {job.workType}</span>
                  <span className="jd-badge"><Briefcase size={14} /> {job.department}</span>
                  {matchResult && (
                    <span className={`jd-badge jd-match-badge ${matchResult.isEligible ? 'eligible' : 'not-eligible'}`}>
                      <Sparkles size={14} /> {matchResult.score}% Match
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Eligibility Banner */}
            {matchResult && (
              <motion.div custom={0.5} variants={sectionVariants} initial="hidden" animate="visible">
                {matchResult.isEligible ? (
                  <div className="jd-eligibility-banner eligible">
                    <CheckCircle size={20} />
                    <div>
                      <strong>You're eligible for this role!</strong>
                      <span>Your profile matches all hard requirements. Apply now to get ahead.</span>
                    </div>
                  </div>
                ) : (
                  <div className="jd-eligibility-banner not-eligible">
                    <AlertCircle size={20} />
                    <div>
                      <strong>You're not eligible for this role yet.</strong>
                      <span>You're missing {allMissing.length} requirement{allMissing.length > 1 ? 's' : ''}. <button className="jd-improve-link" onClick={() => setShowImprovementModal(true)}>See what's missing →</button></span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Description & Requirements */}
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard>
                <h3 className="jd-section-title">About the Role</h3>
                <p className="jd-description">{job.description}</p>

                <h3 className="jd-section-title mt">Hard Requirements</h3>
                <div className="jd-requirements">
                  {job.eligibility.hard.skills.map(s => (
                    <div key={s} className={`jd-req-item ${matchResult?.matchedHardSkills.includes(s) ? 'matched' : 'missing'}`}>
                      {matchResult?.matchedHardSkills.includes(s) ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      <span>{s}</span>
                    </div>
                  ))}
                  <div className={`jd-req-item ${matchResult?.experienceMatch ? 'matched' : 'missing'}`}>
                    {matchResult?.experienceMatch ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>{job.eligibility.hard.experienceYears}+ years experience</span>
                  </div>
                  <div className={`jd-req-item ${matchResult?.educationMatch ? 'matched' : 'missing'}`}>
                    {matchResult?.educationMatch ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>{job.eligibility.hard.education} degree</span>
                  </div>
                </div>

                {job.eligibility.preferred.skills.length > 0 && (
                  <>
                    <h3 className="jd-section-title mt">Preferred Skills</h3>
                    <div className="jd-requirements">
                      {job.eligibility.preferred.skills.map(s => (
                        <div key={s} className={`jd-req-item ${matchResult?.matchedPreferredSkills.includes(s) ? 'matched' : 'neutral'}`}>
                          {matchResult?.matchedPreferredSkills.includes(s) ? <CheckCircle size={16} /> : <span className="jd-req-dot" />}
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <h3 className="jd-section-title mt">Perks & Benefits</h3>
                <div className="jd-perks">{job.perks.map(p => <span key={p} className="jd-perk">{p}</span>)}</div>
              </GlassCard>
            </motion.div>

            {/* Company Preview */}
            {company && (
              <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
                <Link href={`/company/${company.slug}`} style={{ textDecoration: 'none' }}>
                  <GlassCard className="jd-company-preview">
                    <div className="jd-cp-header">
                    <div className="jd-cp-logo">{company.logo}</div>
                    <div>
                      <h3>{company.name}</h3>
                      <p>{company.industry} • {company.headquarters}</p>
                    </div>
                    {company.verificationStatus === 'verified' && <span className="jd-cp-verified"><ShieldCheck size={12} /> Verified</span>}
                  </div>
                  <p className="jd-cp-desc">{company.description.substring(0, 150)}...</p>
                  <span className="jd-cp-link">View full profile <ArrowRight size={12} /></span>
                  </GlassCard>
                </Link>
              </motion.div>
            )}
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <motion.div className="jd-sidebar" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>

            {/* Actions */}
            <GlassCard>
              <AnimatePresence mode="wait">
                {hasApplied || justApplied ? (
                  <motion.div key="applied" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="jd-applied-state">
                    <CheckCircle size={40} className="jd-applied-icon" />
                    <h3>Application Submitted!</h3>
                    <p>We'll notify you of any updates.</p>
                  </motion.div>
                ) : (
                  <motion.div key="actions">
                    {matchResult && !matchResult.isEligible ? (
                      <div className="jd-ineligible-actions">
                        <div className="jd-ineligible-notice"><AlertCircle size={16} /> You don't meet all requirements</div>
                        <GlassButton variant="secondary" onClick={() => setShowImprovementModal(true)} className="jd-action-full">
                          View Missing Skills
                        </GlassButton>
                        <GlassButton variant="secondary" href="/services" className="jd-action-full">
                          <Sparkles size={16} /> Improve Your Profile
                        </GlassButton>
                      </div>
                    ) : (
                      <>
                        <GlassButton variant="primary" onClick={handleApply} className="jd-action-full" disabled={!isAuthenticated}>
                          {isAuthenticated ? 'Apply Now' : 'Sign in to Apply'}
                        </GlassButton>
                      </>
                    )}
                    <GlassButton variant="secondary" onClick={() => setSaved(!saved)} className="jd-action-full" icon={<Bookmark size={16} fill={saved ? 'var(--accent-azure)' : 'none'} />}>
                      {saved ? 'Saved!' : 'Save Job'}
                    </GlassButton>
                    <GlassButton variant="secondary" className="jd-action-full" icon={<Share2 size={16} />}>Share</GlassButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* Competition Analytics */}
            <GlassCard>
              <h4 className="jd-sidebar-title"><TrendingUp size={16} /> Competition Analytics</h4>
              <div className="jd-analytics-grid">
                <div className="jd-analytics-item"><Eye size={16} /><span className="jd-an-val"><AnimatedCounter target={job.analytics.viewed} /></span><span className="jd-an-label">Viewed</span></div>
                <div className="jd-analytics-item"><Users size={16} /><span className="jd-an-val"><AnimatedCounter target={job.analytics.applied} /></span><span className="jd-an-label">Applied</span></div>
                <div className="jd-analytics-item"><CheckCircle size={16} style={{ color: '#10b981' }} /><span className="jd-an-val"><AnimatedCounter target={job.analytics.shortlisted} /></span><span className="jd-an-label">Shortlisted</span></div>
                <div className="jd-analytics-item"><Briefcase size={16} style={{ color: 'var(--accent-azure)' }} /><span className="jd-an-val"><AnimatedCounter target={job.analytics.interviewed} /></span><span className="jd-an-label">Interviewed</span></div>
              </div>
            </GlassCard>

            {/* Match Score Ring */}
            {matchResult && (
              <GlassCard>
                <h4 className="jd-sidebar-title">Your Match Score</h4>
                <div className="jd-match-ring-container">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="jd-match-ring">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                      <motion.circle cx="60" cy="60" r="52" fill="none" stroke={matchResult.isEligible ? '#10b981' : '#f59e0b'} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`} initial={{ strokeDashoffset: 2 * Math.PI * 52 }} animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - matchResult.score / 100) }}
                        transition={{ delay: 0.7, duration: 1 }} transform="rotate(-90 60 60)" />
                    </svg>
                    <div className="jd-ring-label">{matchResult.score}%</div>
                  </motion.div>
                </div>
                <div className="jd-match-breakdown">
                  <div className="jd-mb-row"><CheckCircle size={14} className="matched" /><span>{matchResult.matchedHardSkills.length} hard skills matched</span></div>
                  {matchResult.missingHardSkills.length > 0 && <div className="jd-mb-row"><AlertCircle size={14} className="missing" /><span>{matchResult.missingHardSkills.length} hard skills missing</span></div>}
                  <div className="jd-mb-row"><CheckCircle size={14} className="matched" /><span>{matchResult.matchedPreferredSkills.length} preferred skills matched</span></div>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>

      {/* ═══ IMPROVEMENT MODAL ═══ */}
      <AnimatePresence>
        {showImprovementModal && matchResult && (
          <motion.div className="jd-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowImprovementModal(false)}>
            <motion.div className="jd-modal" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={e => e.stopPropagation()}>
              <button className="jd-modal-close" onClick={() => setShowImprovementModal(false)}><X size={20} /></button>
              <div className="jd-modal-icon"><AlertCircle size={32} /></div>
              <h2>Profile Improvement Guide</h2>
              <p className="jd-modal-sub">Here's what you need to become eligible for this role:</p>

              <div className="jd-missing-list">
                {allMissing.map(item => (
                  <div key={item} className="jd-missing-item">
                    <AlertCircle size={16} />
                    <span>{item}</span>
                    <Link href="/services" className="jd-learn-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Learn <ExternalLink size={10} /></Link>
                  </div>
                ))}
              </div>

              <GlassButton variant="primary" className="jd-modal-cta" onClick={() => setShowImprovementModal(false)} href="/services">
                <Sparkles size={16} /> Go to Learning & Services
              </GlassButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};
