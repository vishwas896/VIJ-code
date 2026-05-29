'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { useAuth } from '../../context/AuthContext';

export const ServicesCTA: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handlePrimaryClick = () => {
    if (isAuthenticated) {
      router.push('/seeker/dashboard');
    } else {
      router.push('/register');
    }
  };

  const handleSecondaryClick = () => {
    router.push('/contact');
  };

  return (
    <section className="services-cta-section">
      <GlassCard className="services-cta-card" glowingEdge="azure" tilt={false}>
        <div className="cta-content text-center">
          <h2 className="cta-headline">Ready to Take Control of Your Career?</h2>
          <p className="cta-subtext">
            Join 50,000+ professionals using VIJ to plan smarter, earn more, and grow faster.
          </p>
          <div className="cta-actions-row">
            <GlassButton 
              variant="primary" 
              className="cta-primary-btn" 
              onClick={handlePrimaryClick}
              icon={<ArrowRight size={16} />}
            >
              Get Started Free
            </GlassButton>
            <GlassButton 
              variant="secondary" 
              className="cta-secondary-btn" 
              onClick={handleSecondaryClick}
              icon={<MessageSquare size={15} />}
            >
              Talk to Our Team
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </section>
  );
};

