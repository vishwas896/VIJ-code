'use client';
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Search, Sparkles, Building2, ShieldCheck, Users, Clock } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { getCompanyBySlug, getJobsByCompany } from '../data/recruiterData';
import { calculateMatchScore, type UserProfile } from '../services/matchingEngine';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './CareerPage.css';

export const CareerPage: React.FC = () => {
  const params = useParams();
  const companyId = (Array.isArray(params?.companyId) ? params.companyId[0] : params?.companyId) || '';
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { formatCurrency } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');

  const company = getCompanyBySlug(companyId);
  const jobs = getJobsByCompany(companyId);

  const departments = useMemo(() => {
    const depts = new Set(jobs.map(j => j.department));
    return ['all', ...Array.from(depts)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      if (filterDept !== 'all' && j.department !== filterDept) return false;
      if (filterWorkType !== 'all' && j.workType !== filterWorkType) return false;
      if (searchQuery && !j.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [jobs, filterDept, filterWorkType, searchQuery]);

  const getUserProfile = (): UserProfile | null => {
    if (!isAuthenticated || !user || user.role !== 'seeker') return null;
    return {
      skills: user.skills || [],
      experience: user.experience || 0,
      education: user.education || '',
      certifications: user.certifications || [],
      hasPortfolio: user.hasPortfolio || false,
    };
  };

  if (!company) {
    return (
      <PageTransition>
        <div className="career-empty">
          <Building2 size={48} />
          <h2>Company not found</h2>
          <GlassButton onClick={() => router.push('/companies')}>Browse Companies</GlassButton>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="career-root">
        <GlassButton variant="secondary" onClick={() => router.push(`/company/${companyId}`)} icon={<ArrowLeft size={16} />} className="career-back">
          Back to Company
        </GlassButton>

        {/* Hero */}
        <motion.div className="career-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="career-hero-inner">
            <div className="career-hero-logo">{company.logo}</div>
            <div>
              <h1>{company.name} Careers</h1>
              <p>Join {company.employeeCount.toLocaleString()}+ people building the future of {company.industry.toLowerCase()}.</p>
            </div>
            {company.verificationStatus === 'verified' && (
              <span className="career-verified"><ShieldCheck size={14} /> Verified Employer</span>
            )}
          </div>
          <div className="career-hero-stats">
            <div><Briefcase size={16} /><span>{jobs.length} Open Roles</span></div>
            <div><Users size={16} /><span>{company.employeeCount.toLocaleString()} Employees</span></div>
            <div><Clock size={16} /><span>Avg. {company.avgHiringDays} days to hire</span></div>
            <div><Sparkles size={16} /><span>{company.responseRate}% Response Rate</span></div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div className="career-filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="career-search">
            <Search size={16} />
            <input placeholder="Search roles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="career-filter-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
          </select>
          <select className="career-filter-select" value={filterWorkType} onChange={e => setFilterWorkType(e.target.value)}>
            <option value="all">All Work Types</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </motion.div>

        {/* Job Listings */}
        <div className="career-jobs-grid">
          {filteredJobs.map((job, i) => {
            const userProfile = getUserProfile();
            const match = userProfile ? calculateMatchScore(userProfile, job) : null;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <GlassCard className="career-job-card" onClick={() => router.push(`/jobs/${job.id}`)}>
                  <div className="career-job-top">
                    <h3>{job.title}</h3>
                    {match && (
                      <span className={`career-match-badge ${match.isEligible ? 'eligible' : 'not-eligible'}`}>
                        {match.score}% Match
                      </span>
                    )}
                  </div>
                  <div className="career-job-meta">
                    <span><MapPin size={14} /> {job.location}</span>
                    <span><DollarSign size={14} /> {formatCurrency(job.salaryMin, true)} - {formatCurrency(job.salaryMax, true)}</span>
                    <span className={`career-work-type ${job.workType}`}>{job.workType}</span>
                  </div>
                  <div className="career-job-skills">
                    {job.eligibility.hard.skills.slice(0, 4).map(s => (
                      <span key={s} className={`career-skill ${match && match.matchedHardSkills.includes(s) ? 'matched' : ''}`}>{s}</span>
                    ))}
                  </div>
                  <div className="career-job-footer">
                    <span>{job.analytics.applied} applicants</span>
                    <span className="career-view-link">View Role →</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="career-empty-jobs">
            <Briefcase size={40} />
            <h3>No roles match your filters</h3>
            <p>Try adjusting your search or department filter.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
