'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LiquidBackground } from '../components/common/LiquidBackground';
import { GuestBanner } from './GuestBanner';
import { useAuth } from '../context/AuthContext';
import { FloatingMessenger } from './FloatingMessenger';
import { RightSidebar } from './RightSidebar';
import { useTheme } from '../context/ThemeContext';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';
import './MainLayout.css';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { preferences } = useTheme();

  return (
    <LiquidBackground>
      {preferences.backgroundImage && (
        <div 
          className="personalization-bg-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${preferences.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8,
            filter: 'none',
            pointerEvents: 'none',
            zIndex: -1,
            transition: 'background-image 0.5s ease, filter 0.5s ease, opacity 0.5s ease',
          }}
        />
      )}
      
      <Header />

      <main className="main-content has-sidebar" style={{ position: 'relative', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={pathname} style={{ width: '100%' }}>
            {children}
          </motion.div>
        </AnimatePresence>
        
        {!isAuthenticated && <GuestBanner />}
      </main>

      <Footer />
      
      <FloatingMessenger />
      <RightSidebar />
    </LiquidBackground>
  );
};
