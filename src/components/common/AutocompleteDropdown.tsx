'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import './AutocompleteDropdown.css';

interface AutocompleteDropdownProps {
  options: string[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({ 
  options, 
  placeholder = "Search...", 
  value, 
  onChange,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!query) {
      return options.slice(0, 50);
    }
    const lowerQuery = query.toLowerCase();
    return options.filter(opt => opt.toLowerCase().includes(lowerQuery)).slice(0, 50);
  }, [query, options]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setQuery('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  return (
    <div className="autocomplete-wrapper" ref={dropdownRef}>
      {label && <label className="autocomplete-label">{label}</label>}
      
      <div 
        className={`autocomplete-input-box ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        {value && !isOpen ? (
          <div className="selected-value">
            <span>{value}</span>
            <button className="clear-btn" onClick={clearSelection}><X size={14} /></button>
          </div>
        ) : (
          <div className="search-mode">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={value || placeholder}
              className="autocomplete-input"
            />
          </div>
        )}
        <ChevronDown size={18} className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="autocomplete-dropdown-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredOptions.length > 0 ? (
              <ul className="options-list">
                {filteredOptions.map((opt, idx) => (
                  <li 
                    key={`${opt}-${idx}`} 
                    className="option-item"
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-options-found">
                No matches found in dataset.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

