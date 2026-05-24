import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import { useAuth } from '../../context/AuthContext';

export const ServicesCTA: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePrimaryClick = () => {
    if (isAuthenticated) {
      navigate('/seeker/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleSecondaryClick = () => {
    navigate('/contact');
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
