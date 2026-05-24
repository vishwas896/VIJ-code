'use client';
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type UserDomain =
  | 'engineering'
  | 'design'
  | 'marketing'
  | 'finance'
  | 'healthcare'
  | 'sales'
  | 'data-science'
  | 'operations';

interface User {
  id: string;
  name: string;
  role: 'seeker' | 'recruiter';
  domain?: UserDomain;
  currentCompany?: string;
  industry?: string;
  onboardingCompleted?: boolean;
  purchasedItems?: string[]; // IDs of courses, skills, or services
  appliedJobs?: number[];   // IDs of jobs the user has applied to
  email?: string;
  bio?: string;
  roleTitle?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  walletBalance: number;
  login: (role: 'seeker' | 'recruiter', domain?: UserDomain) => void;
  logout: () => void;
  completeOnboarding: () => void;
  purchaseItem: (id: string) => void;
  addFunds: (amount: number) => void;
  applyToJob: (jobId: number) => void;
  hasApplied: (jobId: number) => boolean;
  updateProfile: (data: { 
    name?: string;
    email?: string;
    bio?: string;
    roleTitle?: string;
    currentCompany?: string;
    industry?: string;
  }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createUserId = () => {
  const buffer = new Uint32Array(1);
  globalThis.crypto?.getRandomValues(buffer);
  const suffix = (buffer[0] % 9000) + 1000;
  return `USR-${suffix}`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // For demo purposes, we'll initialize from localStorage to persist across refreshes
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState(450);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('vij_auth') === 'true';
      const savedUser = localStorage.getItem('vij_user');
      const savedWallet = Number(localStorage.getItem('vij_wallet')) || 450;

      setIsAuthenticated(savedAuth);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
      setWalletBalance(savedWallet);
    }
  }, []);

  const login = (role: 'seeker' | 'recruiter', domain?: UserDomain) => {
    setIsAuthenticated(true);
    const mockUser: User = { 
      id: createUserId(),
      name: 'Verified User', 
      role,
      domain: domain || 'engineering',
      onboardingCompleted: false,
      appliedJobs: [],
    };
    setUser(mockUser);
    localStorage.setItem('vij_auth', 'true');
    localStorage.setItem('vij_user', JSON.stringify(mockUser));
  };

  const addFunds = (amount: number) => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    localStorage.setItem('vij_wallet', newBalance.toString());
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, onboardingCompleted: true };
      setUser(updatedUser);
      localStorage.setItem('vij_user', JSON.stringify(updatedUser));
    }
  };

  const purchaseItem = (id: string) => {
    if (user) {
      const currentPurchased = user.purchasedItems || [];
      if (!currentPurchased.includes(id)) {
        const updatedUser = { ...user, purchasedItems: [...currentPurchased, id] };
        setUser(updatedUser);
        localStorage.setItem('vij_user', JSON.stringify(updatedUser));
      }
    }
  };

  const applyToJob = (jobId: number) => {
    if (user) {
      const currentApplied = user.appliedJobs || [];
      if (!currentApplied.includes(jobId)) {
        const updatedUser = { ...user, appliedJobs: [...currentApplied, jobId] };
        setUser(updatedUser);
        localStorage.setItem('vij_user', JSON.stringify(updatedUser));
      }
    }
  };

  const hasApplied = (jobId: number): boolean => {
    return user?.appliedJobs?.includes(jobId) ?? false;
  };

  const updateProfile = (data: { 
    name?: string;
    email?: string;
    bio?: string;
    roleTitle?: string;
    currentCompany?: string;
    industry?: string;
  }) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('vij_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.setItem('vij_auth', 'false');
    localStorage.removeItem('vij_user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      walletBalance,
      login, 
      logout, 
      completeOnboarding, 
      purchaseItem,
      addFunds,
      applyToJob,
      hasApplied,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
