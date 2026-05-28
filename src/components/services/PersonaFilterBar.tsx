'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useServices, type PersonaType } from '../../context/ServicesContext';

export const PersonaFilterBar: React.FC = () => {
  const { activePersona, setActivePersona } = useServices();

  const options: Array<{ id: PersonaType; label: string }> = [
    { id: 'all', label: 'All Services' },
    { id: 'seeker', label: 'Job Seeker' },
    { id: 'switcher', label: 'Career Switcher' },
    { id: 'student', label: 'Student' },
    { id: 'mentor', label: 'Mentor' },
    { id: 'recruiter', label: 'Recruiter' }
  ];

  return (
    <div className="persona-sticky-filter-bar" id="services-catalog-start">
      <div className="filter-bar-inner">
        {options.map((opt) => {
          const isActive = activePersona === opt.id;
          return (
            <button
              key={opt.id}
              className={`filter-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActivePersona(opt.id)}
            >
              <span className="filter-tab-label">{opt.label}</span>
              {isActive && (
                <motion.div
                  className="filter-tab-active-bg"
                  layoutId="activeFilterBg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

