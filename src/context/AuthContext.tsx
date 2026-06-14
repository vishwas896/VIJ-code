'use client';
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

/* ═══════════════════════════════════════════════
   VIJ IDENTITY TYPES
   ═══════════════════════════════════════════════ */

export type UserRole = 'student' | 'job_seeker' | 'recruiter';

export type UserDomain =
  | 'engineering'
  | 'design'
  | 'marketing'
  | 'finance'
  | 'healthcare'
  | 'sales'
  | 'data-science'
  | 'operations';

export type VerificationLevel = 0 | 1 | 2 | 3 | 4;

export interface PersonalProfile {
  photo?: string;
  fullName: string;
  username?: string;
  bio?: string;
  dob?: string;
  address?: string;
  phone?: string;
  email?: string;
  signature?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  dependency?: string;
  loanEmi?: string;
  familyConnections?: string[];
}

export interface User {
  id: string;
  vijId: string;                     // VIJ-STU-2026-000145 format
  name: string;
  role: UserRole;
  domain?: UserDomain;
  personalProfile?: PersonalProfile;
  
  // Legacy compat fields (used across existing views)
  currentCompany?: string;
  industry?: string;
  onboardingCompleted?: boolean;
  purchasedItems?: string[];
  appliedJobs?: number[];
  email?: string;
  bio?: string;
  roleTitle?: string;
  isVerified?: boolean;
  verificationLevel?: VerificationLevel;
  
  // Professional profile fields
  skills?: string[];
  experience?: number;
  education?: string;
  certifications?: string[];
  hasPortfolio?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  walletBalance: number;
  loading: boolean;
  login: (role: UserRole, domain?: UserDomain) => void;
  logout: () => void;
  completeOnboarding: () => void;
  purchaseItem: (id: string) => void;
  addFunds: (amount: number) => void;
  applyToJob: (jobId: number) => void;
  hasApplied: (jobId: number) => boolean;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ═══════════════════════════════════════════════
   VIJ ID GENERATOR
   Format: VIJ-{ROLE}-{YEAR}-{6-DIGIT}
   ═══════════════════════════════════════════════ */
const ROLE_PREFIX_MAP: Record<UserRole, string> = {
  student: 'STU',
  job_seeker: 'JOB',
  recruiter: 'REC',
};

const generateVijId = (role: UserRole): string => {
  const prefix = ROLE_PREFIX_MAP[role];
  const year = new Date().getFullYear();
  
  // Read counter from localStorage for sequential IDs
  const counterKey = `vij_id_counter_${role}`;
  let counter = 1;
  if (typeof window !== 'undefined') {
    counter = parseInt(localStorage.getItem(counterKey) || '0', 10) + 1;
    localStorage.setItem(counterKey, counter.toString());
  }
  
  const padded = counter.toString().padStart(6, '0');
  return `VIJ-${prefix}-${year}-${padded}`;
};

/* ═══════════════════════════════════════════════
   AUTH PROVIDER
   ═══════════════════════════════════════════════ */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState(450);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage
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
      setLoading(false);
    }
  }, []);

  const login = (role: UserRole, domain?: UserDomain) => {
    setIsAuthenticated(true);
    const vijId = generateVijId(role);
    const mockUser: User = { 
      id: vijId,
      vijId,
      name: 'Verified User', 
      role,
      domain: domain || 'engineering',
      onboardingCompleted: false,
      appliedJobs: [],
      skills: role === 'job_seeker' ? ['React', 'TypeScript', 'CSS', 'Next.js', 'Git'] : [],
      experience: role === 'job_seeker' ? 4 : 0,
      education: 'B.Tech',
      certifications: role === 'job_seeker' ? ['AWS Cloud Practitioner'] : [],
      hasPortfolio: true,
      verificationLevel: 0,
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
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, onboardingCompleted: true };
      localStorage.setItem('vij_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const purchaseItem = (id: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const currentPurchased = prev.purchasedItems || [];
      if (!currentPurchased.includes(id)) {
        const updatedUser = { ...prev, purchasedItems: [...currentPurchased, id] };
        localStorage.setItem('vij_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prev;
    });
  };

  const applyToJob = (jobId: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const currentApplied = prev.appliedJobs || [];
      if (!currentApplied.includes(jobId)) {
        const updatedUser = { ...prev, appliedJobs: [...currentApplied, jobId] };
        localStorage.setItem('vij_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prev;
    });
  };

  const hasApplied = (jobId: number): boolean => {
    return user?.appliedJobs?.includes(jobId) ?? false;
  };

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...data };
      localStorage.setItem('vij_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
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
      loading,
      login, 
      logout, 
      completeOnboarding, 
      purchaseItem,
      addFunds,
      applyToJob,
      hasApplied,
      updateProfile,
    }}>
      <MotionConfig>
        {children}
      </MotionConfig>
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
