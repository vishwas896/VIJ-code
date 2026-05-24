'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import { Mail, MapPin } from 'lucide-react';
import './StaticPages.css';

export const Contact: React.FC = () => {
  return (
    <PageTransition>
      <div className="static-page-root centered">
        <div className="static-page-container narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="static-hero centered-hero"
          >
            <h1 className="text-gradient">Contact Us</h1>
            <p className="static-subtitle">
              "Whether you are looking for your next career move or the perfect candidate, our team is here to help you navigate the junction."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="static-card contact-card">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Mail size={24} className="icon-azure" />
                </div>
                <div className="contact-info">
                  <h3>Support Email</h3>
                  <a href="mailto:support@vij.life">support@vij.life</a>
                </div>
              </div>

              <div className="contact-divider" />

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <MapPin size={24} className="icon-azure" />
                </div>
                <div className="contact-info">
                  <h3>Headquarters</h3>
                  <p>Registered under Udyam in Haryana, India.</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

