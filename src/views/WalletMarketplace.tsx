'use client';
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { PageTransition } from '../components/common/PageTransition';
import { useCurrency } from '../context/CurrencyContext';
import './WalletMarketplace.css';

export const WalletMarketplace: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [balance, setBalance] = useState(450);
  const [floaters, setFloaters] = useState<{ id: number; text: string }[]>([]);
  const [processing, setProcessing] = useState<number | null>(null);

  const handleAddFunds = (amount: number) => {
    setBalance(b => b + amount);
    const newFloat = { id: Date.now(), text: `+${formatCurrency(amount)}` };
    setFloaters(prev => [...prev, newFloat]);
    setTimeout(() => {
      setFloaters(prev => prev.filter(f => f.id !== newFloat.id));
    }, 1000);
  };

  const handlePurchase = (id: number, price: number) => {
    setProcessing(id);
    setTimeout(() => {
      setBalance(b => Math.max(0, b - price));
      setProcessing(null);
    }, 1500);
  };

  // 3D Card Hover Logic
  const x = useMotionValue(200);
  const y = useMotionValue(100);

  const rotateX = useTransform(y, [0, 200], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    x.set(cx);
    y.set(cy);
    event.currentTarget.style.setProperty('--mouse-x', `${(cx / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--mouse-y', `${(cy / rect.height) * 100}%`);
  }

  function handleMouseLeave() {
    x.set(200);
    y.set(100);
  }

  return (
    <PageTransition>
      <div className="wallet-page">
      
      {/* Alerts */}
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
            <div className="glint"></div>
            <div className="card-top">
              <span>VIJ Virtual Wallet</span>
              <div className="card-chip"></div>
            </div>
            <div className="card-balance">
              {/* rolling number simulation via framer motion */}
              <motion.div className="rolling-balance" key={balance} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {formatCurrency(balance)}
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
          <div className="action-buttons" style={{ position: 'relative' }}>
            <GlassButton onClick={() => handleAddFunds(100)}>+ Add {formatCurrency(100, true)}</GlassButton>
            <GlassButton onClick={() => handleAddFunds(500)}>+ Add {formatCurrency(500, true)}</GlassButton>
            
            {floaters.map(f => (
              <motion.div
                key={f.id}
                initial={{ opacity: 1, y: 0, x: 20 }}
                animate={{ opacity: 0, y: -40, x: 20 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ position: 'absolute', top: '-10px', left: '0', color: 'var(--accent-emerald)', fontWeight: 'bold' }}
              >
                {f.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="marketplace-section">
        <h2>Skill Development Marketplace</h2>
        <div className="course-grid">
          {[
            { id: 1, title: 'Advanced React Architecture', duration: '4.5h', rating: 4.8, price: 50 },
            { id: 2, title: 'Framer Motion Masterclass', duration: '2h', rating: 4.9, price: 30 },
            { id: 3, title: 'WebRTC Fundamentals', duration: '3.2h', rating: 4.7, price: 45 },
            { id: 4, title: 'UI/UX with Glassmorphism', duration: '1h', rating: 4.9, price: 15 },
          ].map(course => (
            <GlassCard key={course.id} className="course-card">
              <div className="course-thumb"></div>
              <h3>{course.title}</h3>
              <div className="course-meta">
                <span>⏱ {course.duration}</span>
                <span>★ {course.rating}</span>
              </div>
              <GlassButton 
                variant="primary" 
                className="full-width mt-author"
                onClick={() => handlePurchase(course.id, course.price)}
                disabled={processing === course.id}
              >
                {processing === course.id ? (
                   <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <motion.div
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                       style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
                     />
                     Processing...
                   </span>
                ) : (
                  `Purchase with Wallet (${formatCurrency(course.price, true)})`
                )}
              </GlassButton>
            </GlassCard>
          ))}
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

