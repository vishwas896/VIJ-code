/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';

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
  const [currency, setCurrencyState] = useState<CurrencyCode>(getInitialCurrency);

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
