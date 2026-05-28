'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../components/PageTransition';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { Shield, Search, Calendar, Unlock, AlertCircle, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useRecruiter } from '../../context/RecruiterContext';
import { useAuth } from '../../context/AuthContext';
import { getJobById } from '../../data/recruiterData';
import './Recruiter.css';

export const RecruiterJobPipeline: React.FC = () => {
  const params = useParams();
  const jobId = Number(params?.jobId);
  const router = useRouter();
  
  const { formatCurrency } = useCurrency();
  const { getApplicationsForJob, updateApplicationStatus } = useRecruiter();
  const { walletBalance, addFunds } = useAuth();
  
  const job = getJobById(jobId);
  const candidates = getApplicationsForJob(jobId);

  const [unlockedContacts, setUnlockedContacts] = useState<string[]>([]);
  const [scheduledInterviews, setScheduledInterviews] = useState<string[]>([]);

  const handleUnlockContact = (seekerId: string) => {
    if (walletBalance < 500) {
      alert('Insufficient credits. Please add funds to your wallet.');
      return;
    }
    // Simulate deducting credits
    setUnlockedContacts([...unlockedContacts, seekerId]);
  };

  const handleScheduleInterview = (seekerId: string) => {
    setScheduledInterviews([...scheduledInterviews, seekerId]);
    updateApplicationStatus(jobId, seekerId, 'interview');
  };

  if (!job) {
    return (
      <PageTransition>
        <div className="recruiter-page-root jd-empty" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <h2>Job listing not found</h2>
          <GlassButton onClick={() => router.push('/recruiter/dashboard')}>Back to Dashboard</GlassButton>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="recruiter-page-root" style={{ padding: '40px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <GlassButton 
              variant="secondary" 
              onClick={() => router.push('/recruiter/dashboard')} 
              icon={<ArrowLeft size={16} />} 
              style={{ marginBottom: '16px' }}
            >
              Back to Command Center
            </GlassButton>
            <h1 className="recruiter-title">Pipeline: {job.title}</h1>
            <p className="recruiter-subtitle" style={{ margin: 0 }}>
              {job.location} • {job.workType} • showing {candidates.length} qualified matches
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
              VIJ Credit Balance: <span style={{ color: '#f59e0b', fontSize: '15px', fontWeight: 800 }}>{formatCurrency(walletBalance, true)}</span>
            </div>
            <GlassButton variant="primary" className="btn-sm" onClick={() => router.push('/recruiter/jobs/create')}>
              Post Another Job
            </GlassButton>
          </div>
        </div>

        {candidates.length === 0 ? (
          <GlassCard className="recruiter-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div className="metric-icon-wrapper" style={{ margin: '0 auto 24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <AlertCircle size={32} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>0 Candidates Found</h2>
            <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              No candidates currently match all hard requirements for this position. Lower the experience years or remove some mandatory skills in the match configurator to reach more candidates.
            </p>
            <GlassButton variant="primary" onClick={() => router.push('/recruiter/jobs/create')}>
              Configure New Parameters
            </GlassButton>
          </GlassCard>
        ) : (
          <div className="candidate-grid">
            <AnimatePresence>
              {candidates.map((candidate) => {
                const isUnlocked = unlockedContacts.includes(candidate.seekerId);
                const isScheduled = scheduledInterviews.includes(candidate.seekerId);
                
                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <GlassCard className="candidate-card recruiter-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div className="candidate-privacy-shield" style={{ margin: 0 }}>
                          <Shield size={14} /> PII Masked
                        </div>
                        <span className={`career-match-badge ${candidate.matchScore >= 85 ? 'eligible' : 'not-eligible'}`} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                          {candidate.matchScore}% Match
                        </span>
                      </div>
                      
                      <h3 className="candidate-id" style={{ fontSize: '18px', margin: '8px 0 4px 0' }}>
                        {isUnlocked ? candidate.seekerName : `Candidate #${candidate.seekerId.split('-')[1] || candidate.id}`}
                      </h3>
                      
                      <div className="candidate-rank" style={{ fontSize: '13px', fontWeight: 600, color: '#0ea5e9', marginBottom: '16px' }}>
                        Stage: <span style={{ textTransform: 'uppercase', fontWeight: 800 }}>{candidate.status}</span>
                      </div>
                      
                      <div className="recruiter-form-group" style={{ marginBottom: '16px', flex: 1 }}>
                        <span className="recruiter-label" style={{ fontSize: '10px' }}>Matching Skills</span>
                        <div className="candidate-skills" style={{ marginTop: '6px' }}>
                          {candidate.skills.map(s => (
                            <span key={s} className="skill-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="candidate-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                        {/* Stage Progression Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Move Stage:</span>
                          <select 
                            className="stage-select"
                            value={candidate.status}
                            onChange={e => updateApplicationStatus(jobId, candidate.seekerId, e.target.value as any)}
                            style={{ flex: 1, padding: '6px' }}
                          >
                            <option value="new">Inbox</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {isScheduled ? (
                          <GlassButton variant="secondary" className="full-width" style={{ justifyContent: 'center', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)' }} disabled>
                            <CheckCircle size={16} style={{ marginRight: '8px' }} /> Interview Scheduled
                          </GlassButton>
                        ) : (
                          <GlassButton 
                            variant="primary" 
                            className="full-width" 
                            style={{ justifyContent: 'center' }}
                            onClick={() => handleScheduleInterview(candidate.seekerId)}
                          >
                            <Calendar size={16} style={{ marginRight: '8px' }} /> Schedule VIJ Interview
                          </GlassButton>
                        )}

                        {isUnlocked ? (
                          <div style={{ padding: '10px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px', fontSize: '12px', color: '#059669', textAlign: 'center', fontWeight: 600 }}>
                            Contact: {candidate.seekerName.toLowerCase().replace(' ', '.')}@email.com
                          </div>
                        ) : (
                          <GlassButton 
                            className="full-width" 
                            style={{ justifyContent: 'center', background: 'rgba(245, 158, 11, 0.08)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                            onClick={() => handleUnlockContact(candidate.seekerId)}
                          >
                            <Unlock size={16} style={{ marginRight: '8px' }} /> Unlock Contact ({formatCurrency(500, true)})
                          </GlassButton>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </PageTransition>
  );
};
