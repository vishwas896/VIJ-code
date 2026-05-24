'use client';
import React from 'react';
import { useServices } from '../../context/ServicesContext';
import { ServiceCategory } from './ServiceCategory';
import servicesData from '../../data/servicesData.json';

export const CareerIntelligence: React.FC = () => {
  const { activePersona } = useServices();
  const categoryData = servicesData.categories.find(c => c.id === 'career-intelligence');
  
  if (!categoryData) return null;

  const isRelevant = 
    activePersona === 'all' || 
    categoryData.personaIds.includes(activePersona);

  return (
    <ServiceCategory
      id={categoryData.id}
      title={categoryData.title}
      subtitle={categoryData.subtitle}
      icon={categoryData.icon}
      items={categoryData.items}
      isRelevant={isRelevant}
      activePersona={activePersona}
    />
  );
};

