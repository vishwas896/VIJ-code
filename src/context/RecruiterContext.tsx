'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  Company,
  JobPost,
  Application,
  getAllCompanies,
  getAllJobPosts,
  getApplicationsForJob,
  saveCompany,
  saveJobPost
} from '../data/recruiterData';
import { validateBusinessEmail } from '../services/emailValidator';

export interface RecruiterProfile {
  companySlug: string | null;
  verifiedEmail: string | null;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

interface RecruiterContextType {
  company: Company | null;
  recruiterProfile: RecruiterProfile | null;
  isLoading: boolean;
  verifyEmail: (email: string) => Promise<{ isValid: boolean; domain: string; companyName: string }>;
  createCompany: (companyData: Company) => void;
  createJob: (jobData: Omit<JobPost, 'id' | 'companySlug' | 'recruiterId' | 'postedAt' | 'status' | 'analytics'>) => JobPost;
  getJobsForRecruiter: () => JobPost[];
  getApplicationsForJob: (jobId: number) => Application[];
  updateApplicationStatus: (jobId: number, applicantId: string, newStatus: Application['status']) => void;
}

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export const RecruiterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load recruiter profile and company from localStorage based on user
  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      setCompany(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const storedProfile = localStorage.getItem(`vij_recruiter_profile_${user.id}`);
    if (storedProfile) {
      try {
        const parsedProfile: RecruiterProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);

        if (parsedProfile.companySlug) {
          const companies = getAllCompanies();
          const matchedCompany = companies.find(c => c.slug === parsedProfile.companySlug);
          if (matchedCompany) {
            setCompany(matchedCompany);
          }
        }
      } catch (e) {
        console.error('Failed to parse recruiter profile', e);
      }
    } else {
      // Default initial profile
      const initial: RecruiterProfile = {
        companySlug: null,
        verifiedEmail: null,
        verificationStatus: 'unverified',
      };
      setProfile(initial);
    }
    setIsLoading(false);
  }, [user]);

  const verifyEmail = async (email: string) => {
    const result = validateBusinessEmail(email);
    if (!result.isValid) {
      throw new Error(result.errorMessage || 'Invalid business email');
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (user) {
      const updatedProfile: RecruiterProfile = {
        companySlug: result.companyNameGuess.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        verifiedEmail: email,
        verificationStatus: 'verified',
      };
      setProfile(updatedProfile);
      localStorage.setItem(`vij_recruiter_profile_${user.id}`, JSON.stringify(updatedProfile));
    }

    return {
      isValid: true,
      domain: result.domain,
      companyName: result.companyNameGuess,
    };
  };

  const createCompany = (companyData: Company) => {
    saveCompany(companyData);
    setCompany(companyData);

    if (user && profile) {
      const updatedProfile: RecruiterProfile = {
        ...profile,
        companySlug: companyData.slug,
        verificationStatus: 'verified',
      };
      setProfile(updatedProfile);
      localStorage.setItem(`vij_recruiter_profile_${user.id}`, JSON.stringify(updatedProfile));
    }
  };

  const createJob = (jobData: Omit<JobPost, 'id' | 'companySlug' | 'recruiterId' | 'postedAt' | 'status' | 'analytics'>) => {
    const companySlug = company?.slug || 'generic-company';
    const recruiterId = user?.id || 'anonymous-recruiter';
    const nextId = Math.max(...getAllJobPosts().map(j => j.id), 100) + 1;

    const newJob: JobPost = {
      ...jobData,
      id: nextId,
      companySlug,
      recruiterId,
      postedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      analytics: {
        viewed: 0,
        applied: 0,
        shortlisted: 0,
        interviewed: 0,
        rejected: 0,
        ineligible: 0,
      },
    };

    saveJobPost(newJob);
    return newJob;
  };

  const getJobsForRecruiter = () => {
    if (!company) return [];
    return getAllJobPosts().filter(job => job.companySlug === company.slug);
  };

  const getApplications = (jobId: number) => {
    // Check localStorage for customized/submitted applications first
    const storedApps = localStorage.getItem('vij_applications');
    let apps: Application[] = [];
    if (storedApps) {
      try {
        apps = JSON.parse(storedApps);
      } catch {
        apps = [];
      }
    }
    
    // Combine mock applications with stored ones
    const allApps = [...getApplicationsForJob(jobId)];
    apps.forEach(app => {
      if (app.jobId === jobId) {
        const idx = allApps.findIndex(a => a.id === app.id || (a.seekerId === app.seekerId && a.jobId === app.jobId));
        if (idx >= 0) allApps[idx] = app;
        else allApps.push(app);
      }
    });

    return allApps;
  };

  const updateApplicationStatus = (jobId: number, applicantId: string, newStatus: Application['status']) => {
    const storedApps = localStorage.getItem('vij_applications');
    let apps: Application[] = [];
    if (storedApps) {
      try {
        apps = JSON.parse(storedApps);
      } catch {
        apps = [];
      }
    }

    // Find in stored apps or mock apps
    const allJobApps = getApplications(jobId);
    const targetApp = allJobApps.find(a => a.seekerId === applicantId);
    
    if (targetApp) {
      const updatedApp: Application = {
        ...targetApp,
        status: newStatus,
      };

      const storedIdx = apps.findIndex(a => a.seekerId === applicantId && a.jobId === jobId);
      if (storedIdx >= 0) {
        apps[storedIdx] = updatedApp;
      } else {
        apps.push(updatedApp);
      }
      localStorage.setItem('vij_applications', JSON.stringify(apps));

      // Also trigger updating the job analytics counts
      const allJobs = getAllJobPosts();
      const jobIdx = allJobs.findIndex(j => j.id === jobId);
      if (jobIdx >= 0) {
        const job = allJobs[jobIdx];
        const oldStatus = targetApp.status;
        const newAnalytics = { ...job.analytics };
        
        // Decrement old status count (if it matches an analytics key)
        if (oldStatus in newAnalytics) {
          newAnalytics[oldStatus as keyof typeof newAnalytics] = Math.max(0, newAnalytics[oldStatus as keyof typeof newAnalytics] - 1);
        }
        
        // Increment new status count (if it matches an analytics key)
        if (newStatus in newAnalytics) {
          newAnalytics[newStatus as keyof typeof newAnalytics] = (newAnalytics[newStatus as keyof typeof newAnalytics] || 0) + 1;
        }

        const updatedJob = { ...job, analytics: newAnalytics };
        saveJobPost(updatedJob);
      }
    }
  };

  return (
    <RecruiterContext.Provider
      value={{
        company,
        recruiterProfile: profile,
        isLoading,
        verifyEmail,
        createCompany,
        createJob,
        getJobsForRecruiter,
        getApplicationsForJob: getApplications,
        updateApplicationStatus,
      }}
    >
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = () => {
  const context = useContext(RecruiterContext);
  if (context === undefined) {
    throw new Error('useRecruiter must be used within a RecruiterProvider');
  }
  return context;
};
