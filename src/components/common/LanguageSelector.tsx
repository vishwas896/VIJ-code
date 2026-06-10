'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { LanguageCode } from '../../context/LanguageContext';
import './CurrencySelector.css'; // Reusing the identical UI styles for consistency

const LANGUAGES: { code: LanguageCode; label: string; symbol: string }[] = [
  { code: 'en', label: 'English', symbol: 'EN' },
  { code: 'hi', label: 'हिंदी (Hindi)', symbol: 'HI' },
  { code: 'fr', label: 'Français', symbol: 'FR' },
  { code: 'es', label: 'Español', symbol: 'ES' },
  { code: 'zh-CN', label: '中文 (Chinese)', symbol: 'ZH' },
  { code: 'ar', label: 'العربية (Arabic)', symbol: 'AR' },
  { code: 'ru', label: 'Русский (Russian)', symbol: 'RU' },
  { code: 'pt', label: 'Português', symbol: 'PT' },
  { code: 'ja', label: '日本語 (Japanese)', symbol: 'JA' },
  { code: 'de', label: 'Deutsch', symbol: 'DE' },
  { code: 'ko', label: '한국어 (Korean)', symbol: 'KO' },
  { code: 'it', label: 'Italiano', symbol: 'IT' },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
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

  const activeLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="currency-selector" ref={dropdownRef}>
      <button 
        className="currency-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={t('language.select')}
      >
        <Languages size={16} />
        <span style={{ textTransform: 'uppercase' }}>{activeLanguage.code}</span>
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
              <h4>{t('language.select')}</h4>
            </div>
            <div className="currency-options">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  className={`currency-option-btn ${language === l.code ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsOpen(false);
                  }}
                >
                  <span className="currency-symbol">{l.symbol}</span>
                  <span className="currency-label">{l.label}</span>
                  {language === l.code && <span className="currency-check">✓</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
