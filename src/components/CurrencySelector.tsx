'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import type { CurrencyCode } from '../context/CurrencyContext';
import './CurrencySelector.css';

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
];

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCurrency = CURRENCIES.find(c => c.code === currency);

  return (
    <div className="currency-selector" ref={dropdownRef}>
      <button 
        className="currency-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Select Currency"
      >
        <Globe size={16} />
        <span>{activeCurrency?.code}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="currency-dropdown-menu"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="currency-dropdown-header">
              <h4>Display Currency</h4>
            </div>
            <div className="currency-options">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  className={`currency-option-btn ${currency === c.code ? 'active' : ''}`}
                  onClick={() => {
                    setCurrency(c.code);
                    setIsOpen(false);
                  }}
                >
                  <span className="currency-symbol">{c.symbol}</span>
                  <span className="currency-label">{c.label} ({c.code})</span>
                  {currency === c.code && <span className="currency-check">✓</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

