'use client';
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amountInUSD: number, isCompact?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
};

const LOCALES: Record<CurrencyCode, string> = {
  USD: 'en-US',
  INR: 'en-IN',
  EUR: 'de-DE',
  GBP: 'en-GB',
};

const getInitialCurrency = (): CurrencyCode => {
  const isRegistered = typeof localStorage !== 'undefined' && localStorage.getItem('vij_auth') === 'true';
  if (!isRegistered) {
    return 'INR';
  }

  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('vij-currency-pref');
    if (saved && Object.keys(RATES).includes(saved)) {
      return saved as CurrencyCode;
    }
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes('Calcutta') || tz.includes('Kolkata')) return 'INR';
  if (tz.includes('Europe/London')) return 'GBP';
  if (tz.includes('Europe')) return 'EUR';
  return 'USD';
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR');

  React.useEffect(() => {
    if (!isAuthenticated) {
      setCurrencyState('INR');
      return;
    }

    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('vij-currency-pref');
      if (saved && Object.keys(RATES).includes(saved)) {
        setCurrencyState(saved as CurrencyCode);
        return;
      }
    }

    fetch('https://ipapi.co/json/')
      .then(res => {
        if (!res.ok) throw new Error('IP geolocation error');
        return res.json();
      })
      .then(data => {
        if (data && data.currency) {
          const code = data.currency.toUpperCase();
          if (['USD', 'INR', 'EUR', 'GBP'].includes(code)) {
            setCurrencyState(code as CurrencyCode);
          }
        }
      })
      .catch(err => {
        console.warn('IP currency detection failed, using timezone default:', err);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.includes('Calcutta') || tz.includes('Kolkata')) {
          setCurrencyState('INR');
        } else if (tz.includes('Europe/London')) {
          setCurrencyState('GBP');
        } else if (tz.includes('Europe')) {
          setCurrencyState('EUR');
        } else {
          setCurrencyState('USD');
        }
      });
  }, [isAuthenticated]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('vij-currency-pref', code);
  };

  const formatCurrency = (amountInUSD: number, isCompact = false) => {
    const rate = RATES[currency];
    const converted = amountInUSD * rate;
    
    // Use Intl.NumberFormat for proper local formatting
    const formatter = new Intl.NumberFormat(LOCALES[currency], {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: isCompact ? 0 : 2,
      notation: isCompact ? 'compact' : 'standard',
    });

    return formatter.format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
