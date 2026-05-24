'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../components/PageTransition';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { Shield, Search, Calendar, Unlock, AlertCircle } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import './Recruiter.css';

// Mock Candidates
const MOCK_CANDIDATES = [
  { id: '842', rank: 'Top 5%', skills: ['React.js', 'TypeScript', 'Node.js', 'GraphQL'], exp: '5 Years' },
  { id: '109', rank: 'Top 10%', skills: ['React.js', 'Next.js', 'Tailwind', 'Figma'], exp: '4 Years' },
  { id: '556', rank: 'Top 12%', skills: ['React.js', 'Redux', 'Jest', 'CI/CD'], exp: '6 Years' },
];

export const RecruiterJobPipeline: React.FC = () => {
  const { jobId } = useParams();
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [candidates] = useState(MOCK_CANDIDATES);

  // Simulate empty state if jobId is 'empty' or based on some strict criteria
  const isEmpty = jobId === 'empty';

  return (
    <PageTransition>
      <div className="recruiter-page-root">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 className="recruiter-title">Pipeline: Senior React Developer</h1>
            <p className="recruiter-subtitle" style={{ margin: 0 }}>Showing strictly 100% Parameter Matches</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <GlassButton variant="secondary" onClick={() => router.push('/recruiter/dashboard')}>Back to Dashboard</GlassButton>
          </div>
        </div>

        {isEmpty ? (
          <GlassCard className="recruiter-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div className="metric-icon-wrapper" style={{ margin: '0 auto 24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <AlertCircle size={32} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--vij-text-main)', marginBottom: '12px' }}>0 Candidates Found</h2>
            <p style={{ color: 'var(--vij-text-muted)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              The parameters you set might be too strict. The VIJ Match Engine requires a 100% match on all conditions. Try broadening your requirements to expand the pipeline.
            </p>
            <GlassButton variant="primary" onClick={() => router.push('/recruiter/jobs/create')}>
              Edit Parameters
            </GlassButton>
          </GlassCard>
        ) : (
          <div className="candidate-grid">
            <AnimatePresence>
              {candidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <GlassCard className="candidate-card recruiter-card">
                    <div className="candidate-privacy-shield">
                      <Shield size={14} /> PII Masked
                    </div>
                    
                    <h3 className="candidate-id">Candidate #{candidate.id}</h3>
                    <div className="candidate-rank">{candidate.rank} VIJ Match</div>
                    
                    <div className="recruiter-form-group" style={{ marginBottom: '12px' }}>
                      <span className="recruiter-label">Verified Experience</span>
                      <p style={{ margin: 0, color: 'var(--vij-text-main)', fontWeight: 600 }}>{candidate.exp}</p>
                    </div>

                    <div className="recruiter-form-group" style={{ marginBottom: '24px' }}>
                      <span className="recruiter-label">Matching Skills</span>
                      <div className="candidate-skills">
                        {candidate.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                      </div>
                    </div>

                    <div className="candidate-actions">
                      <GlassButton variant="secondary" className="full-width" style={{ justifyContent: 'center' }}>
                        <Search size={16} style={{ marginRight: '8px' }} /> View Verified Profile
                      </GlassButton>
                      <GlassButton 
                        variant="primary" 
                        className="full-width" 
                        style={{ justifyContent: 'center' }}
                        onClick={() => router.push('/interview/room-123')}
                      >
                        <Calendar size={16} style={{ marginRight: '8px' }} /> Schedule VIJ Interview
                      </GlassButton>
                      <GlassButton 
                        className="full-width" 
                        style={{ justifyContent: 'center', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                      >
                        <Unlock size={16} style={{ marginRight: '8px' }} /> Unlock Contact ({formatCurrency(500, true)})
                      </GlassButton>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

