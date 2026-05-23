import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import { FileText, Globe, Scale } from 'lucide-react';
import './StaticPages.css';

const TERMS_CONTENT = {
  global: {
    title: "Global Terms & Conditions",
    sections: [
      { id: 'g1', title: 'For Job Seekers', text: 'Users agree to provide accurate, up-to-date skill-based data. Falsifying qualifications or impersonating others will result in immediate account termination.' },
      { id: 'g2', title: 'For Recruiters', text: 'Recruiters must use the platform strictly for legitimate hiring purposes and respect the mediator role of VIJ. Scraping candidate data is prohibited.' },
      { id: 'g3', title: 'Wallet Transactions', text: 'Funds added to the VIJ wallet are non-refundable unless explicitly stated. Escrow payments for interviews are released upon mutual completion.' }
    ]
  },
  eu: {
    title: "EU Terms & Conditions",
    sections: [
      { id: 'e1', title: 'Consumer Rights Directive', text: 'European users have a 14-day right of withdrawal for digital wallet transactions, provided the funds have not yet been utilized for escrow or premium services.' },
      { id: 'e2', title: 'Dispute Resolution', text: 'In accordance with EU regulation, any disputes may be submitted to the Online Dispute Resolution (ODR) platform.' },
      { id: 'e3', title: 'Automated Profiling', text: 'You have the right to opt-out of automated algorithmic matching and request human intervention for profile visibility.' }
    ]
  },
  us: {
    title: "US Terms & Conditions",
    sections: [
      { id: 'u1', title: 'Binding Arbitration', text: 'By using VIJ, US residents agree to resolve any disputes through binding arbitration rather than in court, waiving the right to participate in a class-action lawsuit.' },
      { id: 'u2', title: 'FCRA Compliance', text: 'VIJ does not act as a Consumer Reporting Agency. Background checks are the sole responsibility of the hiring entity outside of this platform.' },
      { id: 'u3', title: 'Wallet Taxation', text: 'Users are responsible for reporting and paying any applicable state or federal taxes on earnings withdrawn from the VIJ wallet.' }
    ]
  },
  india: {
    title: "India Terms & Conditions",
    sections: [
      { id: 'i1', title: 'IT Act 2000 Compliance', text: 'Usage of the platform is governed by the Information Technology Act, 2000. Any cyber misconduct will be reported to the relevant authorities.' },
      { id: 'i2', title: 'KYC Requirements', text: 'To comply with RBI guidelines on digital wallets, Indian users must complete a basic KYC verification before withdrawing funds exceeding ₹10,000.' },
      { id: 'i3', title: 'Jurisdiction', text: 'These terms shall be governed by and constructed in accordance with the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in New Delhi.' }
    ]
  }
};

type RegionKey = keyof typeof TERMS_CONTENT;

export const Terms: React.FC = () => {
  const [region, setRegion] = useState<RegionKey>('global');

  const content = TERMS_CONTENT[region];

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
            <h1 className="text-gradient">Terms & Conditions</h1>
            <p className="static-subtitle">Select your region to view governing terms and platform usage agreements.</p>
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
              <option value="eu">European Union</option>
              <option value="us">United States</option>
              <option value="india">India</option>
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
                  <FileText size={28} className="icon-azure" />
                  <h2>{content.title}</h2>
                </div>
                
                {content.sections.map((sec) => (
                  <div key={sec.id} className="policy-section">
                    <h3>{sec.title}</h3>
                    <p>{sec.text}</p>
                  </div>
                ))}

                <div className="policy-section" style={{ marginTop: '32px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Scale size={16} className="icon-azure"/> Fair Usage Agreement</h3>
                  <p>By registering on VIJ, you agree to maintain professional decorum and acknowledge our right to suspend accounts violating these terms.</p>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  );
};
