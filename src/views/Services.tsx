'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Shield, Heart, Lock, CheckCircle
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { ServicesProvider } from '../context/ServicesContext';
import { ServicesHero } from '../components/services/ServicesHero';
import { PersonaFilterBar } from '../components/services/PersonaFilterBar';
import { CareerIntelligence } from '../components/services/CareerIntelligence';
import { JobDiscovery } from '../components/services/JobDiscovery';
import { CommunityMentorship } from '../components/services/CommunityMentorship';
import { NetworkingVisibility } from '../components/services/NetworkingVisibility';
import { AdvancedTools } from '../components/services/AdvancedTools';
import { EcosystemDiagram } from '../components/services/EcosystemDiagram';
import { PricingPlans } from '../components/services/PricingPlans';
import { ServicesFAQ } from '../components/services/ServicesFAQ';
import { ServicesCTA } from '../components/services/ServicesCTA';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { GlassCard } from '../components/GlassCard';
import servicesData from '../data/servicesData.json';
import './Services.css';

// Stats, Testimonials & Trust Badges Section
const StatsAndTestimonials: React.FC = () => {
  const stats = servicesData.stats;
  const testimonials = servicesData.testimonials;
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="stats-testimonials-section">
      {/* Stats Bar */}
      <div className="stats-bar-grid">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="stats-card text-center" tilt={true}>
            <div className="stats-value-row">
              <AnimatedCounter 
                target={stat.value} 
                suffix={stat.suffix} 
                className="stats-number" 
              />
            </div>
            <p className="stats-label">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Testimonials & Trust */}
      <div className="testimonials-row-grid">
        {/* Testimonials Carousel */}
        <div className="testimonials-carousel-wrapper">
          <GlassCard className="testimonials-card" glowingEdge="none" tilt={false}>
            <span className="services-badge">TESTIMONIALS</span>
            <div className="carousel-view-area">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="testimonial-slide"
                >
                  <blockquote className="testimonial-quote">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="testimonial-meta">
                    <strong className="testimonial-author">
                      {testimonials[currentTestimonial].author}
                    </strong>
                    <span className="testimonial-details">
                      {testimonials[currentTestimonial].details}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="carousel-nav-controls">
              <button className="carousel-arrow-btn" onClick={handlePrev} aria-label="Previous testimonial">
                <ChevronLeft size={16} />
              </button>
              <div className="carousel-dots">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot-btn ${currentTestimonial === idx ? 'active' : ''}`}
                    onClick={() => setCurrentTestimonial(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <button className="carousel-arrow-btn" onClick={handleNext} aria-label="Next testimonial">
                <ChevronRight size={16} />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges-wrapper">
          <GlassCard className="trust-card" glowingEdge="azure" tilt={false}>
            <span className="services-badge">OUR COMMITMENT</span>
            <h3>Platform Safety & Integrity</h3>
            <p className="trust-card-intro">
              We design every feature around privacy, accessibility, and quality, ensuring a fair space for career building.
            </p>
            <div className="badges-list-grid">
              <div className="badge-item">
                <Shield size={18} className="badge-icon icon-azure" />
                <div>
                  <h5>Data Privacy Certified</h5>
                  <span>You control who views your active roadmaps.</span>
                </div>
              </div>
              <div className="badge-item">
                <Heart size={18} className="badge-icon icon-gold" />
                <div>
                  <h5>Community-Driven</h5>
                  <span>Built for seekers, powered by real mentors.</span>
                </div>
              </div>
              <div className="badge-item">
                <Lock size={18} className="badge-icon icon-emerald" />
                <div>
                  <h5>GDPR Compliant</h5>
                  <span>Strict controls over personal credentials.</span>
                </div>
              </div>
              <div className="badge-item">
                <CheckCircle size={18} className="badge-icon icon-azure" />
                <div>
                  <h5>No Ads, No Paywalls</h5>
                  <span>Core features are free and direct.</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export const Services: React.FC = () => {
  return (
    <PageTransition>
      <ServicesProvider>
        <div className="services-page">
          {/* A. Navbar - Handled in MainLayout */}

          {/* B. Hero Section */}
          <ServicesHero />

          {/* C. Persistent Filter Bar */}
          <PersonaFilterBar />

          {/* D. Main Catalog Content */}
          <div className="services-catalog-container">
            <CareerIntelligence />
            <JobDiscovery />
            <CommunityMentorship />
            <NetworkingVisibility />
            <AdvancedTools />
          </div>

          {/* E. Ecosystem Diagram */}
          <EcosystemDiagram />

          {/* F. Plans & Pricing */}
          <PricingPlans />

          {/* G. Social Proof & Trust */}
          <StatsAndTestimonials />

          {/* H. FAQ Section */}
          <ServicesFAQ />

          {/* I. Final CTA Section */}
          <ServicesCTA />

          {/* J. Footer - Handled in MainLayout */}
        </div>
      </ServicesProvider>
    </PageTransition>
  );
};

export default Services;

