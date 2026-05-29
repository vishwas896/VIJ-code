'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PageTransition } from '../../components/common/PageTransition';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { Building2, CreditCard, ShieldCheck } from 'lucide-react';
import './Recruiter.css';

export const RecruiterOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (step === 1) setStep(2);
    else router.push('/recruiter/dashboard');
  };

  return (
    <PageTransition>
      <div className="recruiter-page-root recruiter-centered-page">
        <div style={{ maxWidth: '500px', width: '100%' }}>
          
          <div className="wizard-steps">
            <div className={`wizard-dot ${step === 1 ? 'active' : ''}`} />
            <div className={`wizard-dot ${step === 2 ? 'active' : ''}`} />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="recruiter-card" style={{ padding: '40px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div className="metric-icon-wrapper" style={{ margin: '0 auto 16px' }}>
                      <Building2 size={24} />
                    </div>
                    <h1 className="recruiter-title">Company KYC</h1>
                    <p className="recruiter-subtitle">Verify your company to access the 100% Match Engine.</p>
                  </div>

                  <div className="recruiter-form-group">
                    <label className="recruiter-label">Company Name</label>
                    <input type="text" className="recruiter-input" placeholder="e.g. Acme Corp" />
                  </div>
                  <div className="recruiter-form-group">
                    <label className="recruiter-label">Industry</label>
                    <input type="text" className="recruiter-input" placeholder="e.g. SaaS, Fintech" />
                  </div>
                  <div className="recruiter-form-group">
                    <label className="recruiter-label">Registration ID (EIN/CIN)</label>
                    <input type="text" className="recruiter-input" placeholder="Enter Registration ID" />
                  </div>

                  <GlassButton variant="primary" className="full-width" onClick={handleNext}>
                    Next Step
                  </GlassButton>
                </GlassCard>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="recruiter-card" style={{ padding: '40px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div className="metric-icon-wrapper" style={{ margin: '0 auto 16px' }}>
                      <CreditCard size={24} />
                    </div>
                    <h1 className="recruiter-title">Wallet Activation</h1>
                    <p className="recruiter-subtitle">Establish your "Pay-on-Hire" guarantee.</p>
                  </div>

                  <div className="recruiter-form-group">
                    <label className="recruiter-label">Card Number</label>
                    <input type="text" className="recruiter-input" placeholder="•••• •••• •••• ••••" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="recruiter-form-group">
                      <label className="recruiter-label">Expiry</label>
                      <input type="text" className="recruiter-input" placeholder="MM/YY" />
                    </div>
                    <div className="recruiter-form-group">
                      <label className="recruiter-label">CVC</label>
                      <input type="text" className="recruiter-input" placeholder="123" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                    <ShieldCheck size={20} color="#10b981" />
                    <span style={{ fontSize: '13px', color: 'var(--vij-text-main)', fontWeight: 600 }}>Your card is only charged upon successful candidate unlock.</span>
                  </div>

                  <GlassButton variant="primary" className="full-width" onClick={handleNext}>
                    Complete Setup & Enter Junction
                  </GlassButton>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  );
};

