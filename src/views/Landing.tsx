'use client';
import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemStatement } from '../components/landing/ProblemStatement';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { SocialProof } from '../components/landing/SocialProof';
import { IndustryGrid } from '../components/landing/IndustryGrid';
import { CallToAction } from '../components/landing/CallToAction';
import { PageTransition } from '../components/PageTransition';

export const Landing: React.FC = () => {
  return (
    <PageTransition>
      <div className="landing-view" style={{ overflowX: 'hidden' }}>
        <HeroSection />
        <ProblemStatement />
        <HowItWorks />
        <FeatureGrid />
        <SocialProof />
        <IndustryGrid />
        <CallToAction />
      </div>
    </PageTransition>
  );
};

