'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { ShieldCheck, Globe, Lock } from 'lucide-react';
import './StaticPages.css';

const POLICY_CONTENT = {
  global: {
    title: "Global Privacy Policy",
    sections: [
      { id: 'g1', title: 'Data Masking', text: 'We prioritize user privacy by masking contact details until a mutual match is established between recruiter and job seeker.' },
      { id: 'g2', title: 'Data Usage', text: 'Personal information is used solely to facilitate the hiring process and improve the user experience within the VIJ platform.' },
      { id: 'g3', title: 'Data Retention', text: 'Data is retained only as long as your account is active. Upon account deletion, all personal data is purged from our primary systems within 30 days.' }
    ]
  },
  eu: {
    title: "EU GDPR Compliance Policy",
    sections: [
      { id: 'e1', title: 'Right to Access & Erasure', text: 'Under GDPR Article 17, you have the right to request a complete export of your personal data or demand its immediate erasure (Right to be Forgotten).' },
      { id: 'e2', title: 'Consent Management', text: 'Explicit, affirmative consent is required before we process any personally identifiable information (PII). Pre-ticked boxes are strictly prohibited.' },
      { id: 'e3', title: 'Data Portability', text: 'You may export your complete candidate profile and wallet transaction history in a machine-readable format (CSV/JSON) at any time.' }
    ]
  },
  us: {
    title: "US CCPA Compliance Policy",
    sections: [
      { id: 'u1', title: 'Do Not Sell My Personal Information', text: 'VIJ explicitly does not sell your personal data to third parties. Your data is only shared with recruiters when a mutual match is confirmed.' },
      { id: 'u2', title: 'Right to Know', text: 'You have the right to request disclosure of the specific pieces of personal information we have collected about you over the past 12 months.' },
      { id: 'u3', title: 'Non-Discrimination', text: 'We will not discriminate against you for exercising any of your CCPA rights.' }
    ]
  },
  india: {
    title: "India DPDP Act Policy",
    sections: [
      { id: 'i1', title: 'Notice & Consent', text: 'Under the Digital Personal Data Protection Act, we provide clear notice of data collection purposes. Processing relies strictly on your verifiable consent.' },
      { id: 'i2', title: 'Data Principal Rights', text: 'You have the right to grievance redressal, right to correct, and right to erase your personal data.' },
      { id: 'i3', title: 'Data Fiduciary Obligations', text: 'VIJ implements reasonable security safeguards to prevent personal data breach and ensures data minimization.' }
    ]
  }
};

type RegionKey = keyof typeof POLICY_CONTENT;

export const Policy: React.FC = () => {
  const [region, setRegion] = useState<RegionKey>('global');

  const content = POLICY_CONTENT[region];

  return (
    <PageTransition>
      <div className="static-page-root">
        <div className="static-page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="static-hero centered-hero"
          >
            <h1 className="text-gradient">Privacy Policy</h1>
            <p className="static-subtitle">Select your region to view tailored privacy and data compliance policies.</p>
          </motion.div>

          <div className="region-selector-container">
            <label htmlFor="region-select"><Globe size={16} style={{verticalAlign: 'middle'}}/> Region:</label>
            <select 
              id="region-select"
              className="region-selector" 
              value={region} 
              onChange={(e) => setRegion(e.target.value as RegionKey)}
            >
              <option value="global">Global (Default)</option>
              <option value="eu">European Union (GDPR)</option>
              <option value="us">United States (CCPA)</option>
              <option value="india">India (DPDP)</option>
            </select>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={region}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="static-card policy-card">
                <div className="card-icon-header">
                  <ShieldCheck size={28} className="icon-azure" />
                  <h2>{content.title}</h2>
                </div>
                
                {content.sections.map((sec) => (
                  <div key={sec.id} className="policy-section">
                    <h3>{sec.title}</h3>
                    <p>{sec.text}</p>
                  </div>
                ))}
                
                <div className="policy-section" style={{ marginTop: '32px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={16} className="icon-azure"/> End-to-End Encryption</h3>
                  <p>Regardless of region, all messages and wallet transactions on the VIJ platform are secured using industry-standard AES-256 encryption.</p>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  );
};

