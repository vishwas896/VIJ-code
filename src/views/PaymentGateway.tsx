'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Shield, CreditCard, Wallet, CheckCircle, ArrowLeft, Lock, Zap } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import { useCurrency } from '../context/CurrencyContext';
import './PaymentGateway.css';

export const PaymentGateway: React.FC = () => {
  useParams<{ candidateId: string }>();
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  const handlePayment = () => {
    setIsProcessing(true);
    setProgressWidth(0);
    
    // Animate progress
    const steps = [20, 45, 70, 90, 100];
    steps.forEach((width, i) => {
      setTimeout(() => setProgressWidth(width), (i + 1) * 400);
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 2200);
  };

  return (
    <PageTransition>
      <div className="payment-gateway-root">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <GlassButton 
            variant="secondary" 
            onClick={() => router.back()} 
            className="payment-back-btn"
            icon={<ArrowLeft size={16} />}
          >
            Back
          </GlassButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <GlassCard className="payment-card">
            
            {/* Processing Overlay */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="payment-processing-overlay"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="payment-spinner"
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="payment-processing-title"
                  >
                    Processing Transaction...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="payment-processing-subtitle"
                  >
                    Executing smart contract on VIJ network
                  </motion.p>
                  
                  {/* Progress bar */}
                  <div className="payment-progress-bg">
                    <motion.div
                      animate={{ width: `${progressWidth}%` }}
                      transition={{ duration: 0.4 }}
                      className="payment-progress-fill"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Success State */}
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="payment-success-container"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
                  >
                    <CheckCircle size={72} className="payment-success-icon" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="payment-success-title"
                  >
                    Payment Successful
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="payment-success-text"
                  >
                    Smart contract executed successfully. Items have been added to your library and wallet updated.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="payment-success-actions"
                  >
                    <GlassButton variant="primary" onClick={() => router.push('/wallet')} icon={<Wallet size={16} />}>
                      Return to Wallet
                    </GlassButton>
                    <GlassButton variant="secondary" onClick={() => router.push('/marketplace')}>
                      Continue Shopping
                    </GlassButton>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key="checkout">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="payment-checkout-header"
                  >
                    <motion.div
                      className="payment-checkout-icon-container"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <CreditCard size={28} color="white" />
                    </motion.div>
                    <h1 className="payment-checkout-title">Checkout Gateway</h1>
                    <p className="payment-checkout-subtitle">Securely purchase via VIJ Vault</p>
                  </motion.div>
                  
                  {/* Order Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="payment-order-summary"
                  >
                    <div className="payment-order-item">
                      <div>
                        <div className="payment-order-item-title">Advanced React Architecture</div>
                        <div className="payment-order-item-desc">Premium Course • 4.5h content</div>
                      </div>
                      <span className="payment-order-item-price">{formatCurrency(50)}</span>
                    </div>
                    <div className="payment-order-fee">
                      <span className="payment-fee-label">Network Fee</span>
                      <span className="payment-fee-amount">{formatCurrency(0.01)}</span>
                    </div>
                  </motion.div>

                  {/* Total */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="payment-total"
                  >
                    <span>Total</span>
                    <span className="payment-total-amount">{formatCurrency(50.01)}</span>
                  </motion.div>

                  {/* Wallet Connection */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="payment-wallet-connection"
                  >
                    <div className="payment-wallet-icon">
                      <Wallet size={20} color="white" />
                    </div>
                    <div className="payment-wallet-info">
                      <div className="payment-wallet-name">VIJ Native Wallet</div>
                      <div className="payment-wallet-address">
                        <Lock size={10} /> 0x71C...9A4 • Connected
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="payment-wallet-status-dot"
                    />
                  </motion.div>

                  {/* Security Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="payment-security-badge"
                  >
                    <Shield size={14} />
                    <span>Protected by VIJ Smart Contract Security</span>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="payment-checkout-actions"
                  >
                    <GlassButton variant="secondary" onClick={() => router.back()} className="payment-action-cancel">Cancel</GlassButton>
                    <GlassButton variant="primary" onClick={handlePayment} className="payment-action-confirm" icon={<Zap size={16} />}>
                      Confirm Payment
                    </GlassButton>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};


