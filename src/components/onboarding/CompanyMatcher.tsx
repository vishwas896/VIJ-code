'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building, CheckCircle } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface Company {
  id: string;
  name: string;
  location: string;
  industry: string;
  logo?: string;
}

const MOCK_COMPANIES: Company[] = [
  { id: 'google', name: 'Google', location: 'Mountain View, CA', industry: 'Technology' },
  { id: 'infosys', name: 'Infosys', location: 'Bangalore, India', industry: 'IT Services' },
  { id: 'tcs', name: 'TCS', location: 'Mumbai, India', industry: 'IT Services' },
  { id: 'wipro', name: 'Wipro', location: 'Bangalore, India', industry: 'IT Consulting' },
  { id: 'meta', name: 'Meta', location: 'Menlo Park, CA', industry: 'Social Media' },
  { id: 'vij', name: 'Virtual Intelligent Junction', location: 'Global', industry: 'Networking' },
];

export const CompanyMatcher: React.FC<{ onSelect: (company: Company) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<Company[]>([]);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length > 1) {
      const filtered = MOCK_COMPANIES.filter(c => 
        c.name.toLowerCase().includes(val.toLowerCase())
      );
      setMatches(filtered);
    } else {
      setMatches([]);
    }
  };

  return (
    <div className="company-matcher">
      <div className="search-field-glass">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Enter company name..." 
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {matches.length > 0 && (
          <motion.div 
            className="match-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="match-hint">We found existing records for this company:</p>
            {matches.map(company => (
              <GlassCard 
                key={company.id} 
                className="company-match-card"
                onClick={() => {
                  onSelect(company);
                  setQuery(company.name);
                  setMatches([]);
                }}
              >
                <div className="c-logo">
                  <Building size={20} />
                </div>
                <div className="c-info">
                  <h4>{company.name}</h4>
                  <span>{company.industry} • {company.location}</span>
                </div>
                <div className="c-action">
                  <CheckCircle size={16} />
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {query && matches.length === 0 && (
        <p className="no-match-info">No match found. We'll create a new profile for "{query}".</p>
      )}
    </div>
  );
};

