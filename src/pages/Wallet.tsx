import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import './WalletMarketplace.css';

export const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(450);

  // 3D Card Hover Logic
  const x = useMotionValue(200);
  const y = useMotionValue(100);

  const rotateX = useTransform(y, [0, 200], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(200);
    y.set(100);
  }

  return (
    <div className="wallet-page">
      <div className="alert-zone">
        <GlassCard className="alert-box danger-alert">
          <AlertCircle size={20} />
          <span>Candidate Selected: Payment Required to Unlock Profile.</span>
        </GlassCard>
      </div>

      <div className="wallet-header">
        <div className="card-container" onMouseMove={handleMouse} onMouseLeave={handleMouseLeave}>
          <motion.div 
            className="digital-card"
            style={{ rotateX, rotateY, z: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="hologram-mesh"></div>
            <div className="card-top">
              <span>VIJ Virtual Wallet</span>
              <div className="card-chip"></div>
            </div>
            <div className="card-balance">
              <span className="currency">$</span>
              <motion.div className="rolling-balance" key={balance} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {balance}.00
              </motion.div>
            </div>
            <div className="card-bottom">
              <span>Verified Recruiter</span>
              <span className="card-id">**** **** 1024</span>
            </div>
          </motion.div>
        </div>
        
        <div className="wallet-actions">
          <h2>Fund Your Wallet</h2>
          <p>Add funds to unlock PII and schedule interviews seamlessly via the mediate engine.</p>
          <div className="action-buttons">
            <GlassButton onClick={() => setBalance(b => b + 100)}>+ Add $100</GlassButton>
            <GlassButton onClick={() => setBalance(b => b + 500)}>+ Add $500</GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};
