'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { jobTitlesDataset, industriesDataset, sectorsDataset, domainsDataset, responsibilitiesDataset } from '../../data/mockDatasets';
import './ExperienceForm.css';

interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  industry: string;
  sector: string;
  domain: string;
  responsibilities: string[];
}

export const ExperienceForm: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // New Entry State
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [sector, setSector] = useState('');
  const [domain, setDomain] = useState('');
  const [selectedResponsibilities, setSelectedResponsibilities] = useState<string[]>([]);
  const [currentResp, setCurrentResp] = useState('');

  const handleAddResponsibility = (resp: string) => {
    if (resp && !selectedResponsibilities.includes(resp)) {
      setSelectedResponsibilities([...selectedResponsibilities, resp]);
    }
    setCurrentResp('');
  };

  const removeResponsibility = (respToRemove: string) => {
    setSelectedResponsibilities(selectedResponsibilities.filter(r => r !== respToRemove));
  };

  const handleSaveExperience = () => {
    if (!jobTitle || !company) return; // Basic validation
    
    const newEntry: ExperienceEntry = {
      id: Date.now().toString(),
      jobTitle,
      company,
      industry,
      sector,
      domain,
      responsibilities: selectedResponsibilities
    };

    setExperiences([newEntry, ...experiences]);
    
    // Reset form
    setJobTitle('');
    setCompany('');
    setIndustry('');
    setSector('');
    setDomain('');
    setSelectedResponsibilities([]);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
    <div className="experience-manager">
      <div className="experience-header">
        <h3>Professional Experience</h3>
        {!isAdding && (
          <GlassButton variant="secondary" onClick={() => setIsAdding(true)}>
            <Plus size={16} /> Add Experience
          </GlassButton>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="add-experience-form"
          >
            <GlassCard className="experience-form-card">
              <h4>New Role Details</h4>
              
              <div className="form-grid">
                <AutocompleteDropdown 
                  label="Job Title"
                  placeholder="e.g. Software Engineer"
                  options={jobTitlesDataset}
                  value={jobTitle}
                  onChange={setJobTitle}
                />
                
                <div className="standard-input-group">
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Where did you work?"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="standard-input"
                  />
                </div>

                <AutocompleteDropdown 
                  label="Industry"
                  placeholder="Select Industry"
                  options={industriesDataset}
                  value={industry}
                  onChange={setIndustry}
                />

                <AutocompleteDropdown 
                  label="Sector"
                  placeholder="Select Sector"
                  options={sectorsDataset}
                  value={sector}
                  onChange={setSector}
                />
                
                <AutocompleteDropdown 
                  label="Domain"
                  placeholder="Select Domain"
                  options={domainsDataset}
                  value={domain}
                  onChange={setDomain}
                />
              </div>

              <div className="responsibilities-section">
                <label className="section-label">Key Responsibilities</label>
                <AutocompleteDropdown 
                  placeholder="Search or type responsibilities..."
                  options={responsibilitiesDataset}
                  value={currentResp}
                  onChange={handleAddResponsibility}
                />
                
                <div className="selected-responsibilities">
                  <AnimatePresence>
                    {selectedResponsibilities.map((resp, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="resp-chip"
                      >
                        <span>{resp}</span>
                        <button onClick={() => removeResponsibility(resp)}><X size={12} /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="form-actions">
                <GlassButton variant="secondary" onClick={() => setIsAdding(false)}>Cancel</GlassButton>
                <GlassButton onClick={handleSaveExperience}>Save Experience</GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="experiences-list">
        {experiences.length === 0 && !isAdding ? (
          <div className="empty-state">
            <Briefcase size={32} className="empty-icon" />
            <p>No experiences added yet. Add your professional history to improve matchmaking.</p>
          </div>
        ) : (
          experiences.map(exp => (
            <GlassCard key={exp.id} className="experience-item-card">
              <div className="exp-top">
                <div className="exp-titles">
                  <h4>{exp.jobTitle}</h4>
                  <span className="exp-company">{exp.company}</span>
                </div>
                <button className="del-btn" onClick={() => handleDelete(exp.id)}><Trash2 size={16} /></button>
              </div>
              
              <div className="exp-tags">
                {exp.industry && <span className="exp-tag">{exp.industry}</span>}
                {exp.sector && <span className="exp-tag">{exp.sector}</span>}
                {exp.domain && <span className="exp-tag">{exp.domain}</span>}
              </div>

              {exp.responsibilities.length > 0 && (
                <ul className="exp-resp-list">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

