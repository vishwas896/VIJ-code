'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(
  () => import('../components/landing/HeroSection').then((mod) => mod.HeroSection),
  { ssr: false }
);

import { ProblemStatement } from '../components/landing/ProblemStatement';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { SocialProof } from '../components/landing/SocialProof';
import { IndustryGrid } from '../components/landing/IndustryGrid';
import { CallToAction } from '../components/landing/CallToAction';
import { PageTransition } from '../components/common/PageTransition';

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

