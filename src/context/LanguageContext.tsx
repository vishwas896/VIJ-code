'use client';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useCurrency } from './CurrencyContext';

export type LanguageCode = string;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simplified Translation Dictionary
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.jobs': 'Jobs',
    'nav.news': 'News',
    'nav.roadmaps': 'Roadmaps',
    'nav.network': 'Network',
    'nav.services': 'Services',
    'nav.login': 'Log In',
    'nav.join': 'Join Junction',
    'currency.select': 'Select Currency',
    'language.select': 'Language',
    'news.global': 'Global',
    'news.national': 'National',
    'news.business': 'Business',
    'news.trending': 'Trending',
    'news.topstory': '🔥 Top Story',
  },
  hi: {
    'nav.home': 'होम',
    'nav.jobs': 'नौकरियां',
    'nav.news': 'समाचार',
    'nav.roadmaps': 'रोडमैप',
    'nav.network': 'नेटवर्क',
    'nav.services': 'सेवाएं',
    'nav.login': 'लॉग इन करें',
    'nav.join': 'जंक्शन से जुड़ें',
    'currency.select': 'मुद्रा चुनें',
    'language.select': 'भाषा',
    'news.global': 'वैश्विक',
    'news.national': 'राष्ट्रीय',
    'news.business': 'व्यापार',
    'news.trending': 'रुझान',
    'news.topstory': '🔥 शीर्ष समाचार',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.jobs': 'Emplois',
    'nav.news': 'Actualités',
    'nav.roadmaps': 'Feuilles de route',
    'nav.network': 'Réseau',
    'nav.services': 'Services',
    'nav.login': 'Connexion',
    'nav.join': 'Rejoindre Junction',
    'currency.select': 'Devise',
    'language.select': 'Langue',
    'news.global': 'Mondial',
    'news.national': 'National',
    'news.business': 'Affaires',
    'news.trending': 'Tendances',
    'news.topstory': '🔥 À la une',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.jobs': 'Trabajos',
    'nav.news': 'Noticias',
    'nav.roadmaps': 'Mapas viales',
    'nav.network': 'Red',
    'nav.services': 'Servicios',
    'nav.login': 'Iniciar sesión',
    'nav.join': 'Únete a Junction',
    'currency.select': 'Moneda',
    'language.select': 'Idioma',
    'news.global': 'Global',
    'news.national': 'Nacional',
    'news.business': 'Negocios',
    'news.trending': 'Tendencias',
    'news.topstory': '🔥 Destacado',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { detectedCountry } = useCurrency();
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    // 1. Check local storage
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('vij-lang-pref') as LanguageCode;
      if (saved && ['en', 'hi', 'fr', 'es'].includes(saved)) {
        setLanguageState(saved);
        return;
      }
    }

    // 2. Use country code from IP (CurrencyContext detected)
    if (detectedCountry) {
      if (detectedCountry === 'IN') {
        setLanguageState('hi');
        return;
      }
      if (['FR', 'BE', 'CH', 'CA'].includes(detectedCountry)) {
        setLanguageState('fr');
        return;
      }
      if (['ES', 'MX', 'AR', 'CO', 'PE'].includes(detectedCountry)) {
        setLanguageState('es');
        return;
      }
    }

    // 3. Fallback to browser language
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'hi', 'fr', 'es'].includes(browserLang)) {
        setLanguageState(browserLang as LanguageCode);
        return;
      }
    }

    setLanguageState('en');
  }, [detectedCountry]);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem('vij-lang-pref', code);

    // Apply RTL/LTR direction globally
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const isRtl = rtlLanguages.includes(code);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';

    // Trigger Google Translate combo box programmatically
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectField) {
      selectField.value = code;
      selectField.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    // Inject Google Translate script globally for full-page translation
    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) return;

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false
        }, 'google_translate_element');
      };
    };

    addGoogleTranslateScript();
  }, []);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {/* Hidden google translate container */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      {/* Dynamic font injection for optimal internationalization support */}
      <div className={`lang-wrapper lang-${language}`} style={{ 
        fontFamily: language === 'hi' ? '"Noto Sans Devanagari", sans-serif' : 'inherit'
      }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
