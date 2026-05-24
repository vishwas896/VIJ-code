import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import { useServices } from '../../context/ServicesContext';
import servicesData from '../../data/servicesData.json';

export const PricingPlans: React.FC = () => {
  const { activePersona } = useServices();
  const { title, subtitle, plans } = servicesData.pricing;

  return (
    <section className="pricing-section">
      <div className="pricing-header text-center">
        <span className="services-badge">PRICING PLANS</span>
        <h2>{title}</h2>
        <p className="section-desc mx-auto">{subtitle}</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => {
          // Dynamic highlighting based on selected persona:
          // If persona is Recruiter, highlight Enterprise. Otherwise, highlight Pro.
          const isHighlighted = 
            (activePersona === 'recruiter' && plan.id === 'enterprise') ||
            (activePersona !== 'recruiter' && plan.id === 'pro');

          return (
            <GlassCard
              key={plan.id}
              className={`pricing-card ${isHighlighted ? 'highlighted-plan' : ''}`}
              glowingEdge={isHighlighted ? 'azure' : 'none'}
              tilt={true}
              layout
            >
              {isHighlighted && (
                <div className="plan-badge">
                  <Sparkles size={12} style={{ marginRight: '4px' }} />
                  {plan.id === 'enterprise' ? 'Recruiter Focus' : 'Most Popular'}
                </div>
              )}

              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price-row">
                  <span className="price-symbol">$</span>
                  <span className="price-amount">{plan.price}</span>
                  {plan.period !== 'forever' && (
                    <span className="price-period">/{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="plan-features-list">
                {plan.features.map((feature, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="feature-check-icon">
                      <Check size={14} />
                    </span>
                    <span className="feature-text">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="plan-cta-wrapper">
                <GlassButton 
                  variant={isHighlighted ? 'primary' : 'secondary'}
                  className="w-full plan-btn"
                >
                  {plan.cta}
                </GlassButton>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};
