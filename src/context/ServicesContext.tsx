import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type PersonaType = 'all' | 'seeker' | 'switcher' | 'student' | 'mentor' | 'recruiter';

interface ServicesContextType {
  activePersona: PersonaType;
  setActivePersona: (persona: PersonaType) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<PersonaType>('all');

  return (
    <ServicesContext.Provider value={{ activePersona, setActivePersona }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
