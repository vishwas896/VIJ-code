'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, ExternalLink, Info, Loader2, Share2,
  MapPin, Users, Globe, Lock, Briefcase, DollarSign, TrendingUp,
  ShieldCheck, Sparkles, Clock, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { getCompanyBySlug, getJobsByCompany, type Company, type JobPost } from '../data/recruiterData';
import { calculateMatchScore, type UserProfile } from '../services/matchingEngine';
import './CompanyPage.css';

interface WikiCompanyData {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
}

interface DeepAnalytics {
  employees: string;
  headquarters: string;
  industry: string;
}

interface RelatedCompany {
  title: string;
  pageid: number;
  snippet: string;
}

const mockSalaries = [
  { role: 'Software Engineer', range: '$110k - $160k', confidence: 94 },
  { role: 'Product Manager', range: '$130k - $180k', confidence: 88 },
  { role: 'Data Scientist', range: '$125k - $170k', confidence: 91 },
  { role: 'Sales Executive', range: '$90k - $140k', confidence: 85 }
];

export const CompanyPage: React.FC = () => {
  const params = useParams();
  const companyId = (Array.isArray(params?.companyId) ? params.companyId[0] : params?.companyId) || '';
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [localCompany, setLocalCompany] = useState<Company | null>(null);
  const [localJobs, setLocalJobs] = useState<JobPost[]>([]);
  const [wikiData, setWikiData] = useState<WikiCompanyData | null>(null);
  const [deepAnalytics, setDeepAnalytics] = useState<DeepAnalytics | null>(null);
  const [relatedCompanies, setRelatedCompanies] = useState<RelatedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatingSalary, setIsSimulatingSalary] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserProfile = (): UserProfile | null => {
    if (!isAuthenticated || !user || user.role === 'recruiter') return null;
    return {
      skills: user.skills || [],
      experience: user.experience || 0,
      education: user.education || '',
      certifications: user.certifications || [],
      hasPortfolio: user.hasPortfolio || false,
    };
  };

  const userProfile = getUserProfile();

  useEffect(() => {
    const checkAndFetchData = async () => {
      if (!companyId) return;
      
      setIsLoading(true);
      setError(null);

      // Check if this is a locally registered company
      const local = getCompanyBySlug(companyId);
      if (local) {
        setLocalCompany(local);
        setLocalJobs(getJobsByCompany(companyId));
        setIsLoading(false);
        return;
      }
      
      // Wikipedia fallback
      try {
        const resQuery = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&titles=${encodeURIComponent(companyId)}&format=json&origin=*&pithumbsize=400`);
        const jsonQuery = await resQuery.json();
        
        let title = '';
        if (jsonQuery.query && jsonQuery.query.pages) {
          const pages = jsonQuery.query.pages;
          const pageId = Object.keys(pages)[0];
          
          if (pageId === '-1') {
            setError("Company intelligence profile not found in global web registry.");
            setIsLoading(false);
            return;
          } else {
            setWikiData(pages[pageId]);
            title = pages[pageId].title;
          }
        }

        if (isAuthenticated) {
          try {
            const resParse = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`);
            const jsonParse = await resParse.json();
            
            if (jsonParse.parse && jsonParse.parse.text) {
              const htmlStr = jsonParse.parse.text['*'];
              const parser = new DOMParser();
              const doc = parser.parseFromString(htmlStr, 'text/html');
              
              const infobox = doc.querySelector('.infobox');
              let employees = 'Undisclosed';
              let headquarters = 'Global';
              let industry = 'Technology';

              if (infobox) {
                const rows = infobox.querySelectorAll('tr');
                rows.forEach(row => {
                  const th = row.querySelector('th');
                  const td = row.querySelector('td');
                  if (th && td) {
                    const headerText = th.textContent?.toLowerCase() || '';
                    const cleanText = td.textContent?.replace(/\[\d+\]/g, '').trim() || '';
                    
                    if (headerText.includes('employees')) employees = cleanText;
                    if (headerText.includes('headquarters')) headquarters = cleanText.split(',')[0];
                    if (headerText.includes('industry')) industry = cleanText.split(',')[0].split('\n')[0];
                  }
                });
              }
              
              setDeepAnalytics({ employees, headquarters, industry });

              const searchKeyword = industry !== 'Technology' ? industry : title;
              const resSearch = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchKeyword + ' company')}&utf8=&format=json&origin=*&srlimit=4`);
              const jsonSearch = await resSearch.json();
              
              if (jsonSearch.query && jsonSearch.query.search) {
                const filtered = jsonSearch.query.search.filter((s: any) => s.title !== title);
                setRelatedCompanies(filtered.slice(0, 3));
              }
              
              setTimeout(() => {
                setIsSimulatingSalary(false);
              }, 1800);
            }
          } catch (e) {
            console.error("Deep analytics parsing failed", e);
          }
        }
      } catch (err) {
        console.error("Failed to fetch company data", err);
        setError("Connection to web intelligence engine failed.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAndFetchData();
  }, [companyId, isAuthenticated]);

  return (
    <PageTransition>
      <div className="company-page">
        <div className="company-nav-bar">
          <GlassButton variant="secondary" href="/companies" icon={<ArrowLeft size={16} />}>
            Back to Search
          </GlassButton>
        </div>

        {isLoading ? (
          <div className="company-loading-state">
            <Loader2 className="animate-spin" size={48} style={{ color: '#0ea5e9' }} />
            <p>Scraping web intelligence for {companyId}...</p>
          </div>
        ) : error ? (
          <div className="company-error-state">
            <Info size={48} style={{ color: '#94a3b8' }} />
            <h2>No Data Found</h2>
            <p>{error}</p>
            <GlassButton href="/companies">Return to Search</GlassButton>
          </div>
        ) : localCompany ? (
          /* ═══════════════════════════════════════════════════════════
             LOCALLY REGISTERED COMPANY PROFILE
             ═══════════════════════════════════════════════════════════ */
          <>
            <div className="company-banner" style={{
              height: '180px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(14,165,233,0.15) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '-60px',
              position: 'relative',
              zIndex: 0
            }} />
            
            <header className="company-header" style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}>
              <div className="company-logo-wrapper">
                <div className="company-logo-large" style={{ 
                  background: 'white', 
                  color: '#0ea5e9', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 12px 32px rgba(14, 165, 233, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '56px',
                  fontWeight: 900
                }}>
                  {localCompany.logo}
                </div>
              </div>
              <div className="company-intro" style={{ marginTop: '50px' }}>
                <div className="company-title-row">
                  <h1 className="text-gradient">{localCompany.name}</h1>
                  {localCompany.verificationStatus === 'verified' && (
                    <div className="verified-badge"><ShieldCheck size={14} /> Verified Employer</div>
                  )}
                  {localCompany.hiringStatus === 'actively-hiring' && (
                    <span className="actively-hiring-badge" style={{
                      padding: '4px 12px',
                      background: 'rgba(16,185,129,0.1)',
                      color: '#10b981',
                      border: '1px solid rgba(16,185,129,0.2)',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>Actively Hiring</span>
                  )}
                </div>
                <p>{localCompany.industry} • {localCompany.headquarters}</p>
                <div className="company-actions">
                  <GlassButton variant="primary" icon={<Briefcase size={16} />} href={`/company/${companyId}/careers`}>
                    View Careers Portal
                  </GlassButton>
                  {localCompany.website && (
                    <GlassButton variant="secondary" icon={<ExternalLink size={16} />} onClick={() => window.open(localCompany.website, '_blank')}>
                      Visit Website
                    </GlassButton>
                  )}
                </div>
              </div>
            </header>

            <div className="company-grid" style={{ marginTop: '32px' }}>
              <div className="company-main-col">
                <GlassCard className="about-section">
                  <h3>About the Company</h3>
                  <p className="company-extract" style={{ whiteSpace: 'pre-line' }}>{localCompany.description}</p>
                </GlassCard>

                {localCompany.mission && (
                  <GlassCard className="about-section">
                    <h3>Mission & Vision</h3>
                    <p className="company-extract">{localCompany.mission}</p>
                  </GlassCard>
                )}

                {localCompany.culture && (
                  <GlassCard className="about-section">
                    <h3>Work Culture</h3>
                    <p className="company-extract">{localCompany.culture}</p>
                  </GlassCard>
                )}

                {localCompany.techStack && localCompany.techStack.length > 0 && (
                  <GlassCard className="about-section">
                    <h3>Technology Stack</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                      {localCompany.techStack.map(tech => (
                        <span key={tech} className="career-skill" style={{
                          padding: '6px 12px',
                          background: 'rgba(14,165,233,0.06)',
                          border: '1px solid rgba(14,165,233,0.15)',
                          borderRadius: '8px',
                          color: '#0284c7',
                          fontSize: '13px',
                          fontWeight: 600
                        }}>{tech}</span>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {localCompany.benefits && localCompany.benefits.length > 0 && (
                  <GlassCard className="about-section">
                    <h3>Perks & Benefits</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                      {localCompany.benefits.map(benefit => (
                        <span key={benefit} style={{
                          padding: '6px 12px',
                          background: 'rgba(16,185,129,0.06)',
                          border: '1px solid rgba(16,185,129,0.15)',
                          borderRadius: '8px',
                          color: '#059669',
                          fontSize: '13px',
                          fontWeight: 600
                        }}>{benefit}</span>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Open Jobs List */}
                <div className="open-roles-section" style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Open Roles</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {localJobs.map((job) => {
                      const match = userProfile ? calculateMatchScore(userProfile, job) : null;
                      return (
                        <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                        <GlassCard className="local-job-row" style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '20px', 
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}>
                          <div>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>{job.title}</h4>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#64748b', alignItems: 'center' }}>
                              <span>{job.location}</span>
                              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                              <span style={{ textTransform: 'capitalize' }}>{job.workType}</span>
                              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                              <span>{formatCurrency(job.salaryMin, true)} - {formatCurrency(job.salaryMax, true)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {match && (
                              <span className={`career-match-badge ${match.isEligible ? 'eligible' : 'not-eligible'}`} style={{ 
                                padding: '4px 10px', 
                                borderRadius: '6px', 
                                fontSize: '12px', 
                                fontWeight: 700 
                              }}>
                                {match.score}% Match
                              </span>
                            )}
                            <span style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '14px' }}>View Role →</span>
                          </div>
                        </GlassCard>
                        </Link>
                      );
                    })}
                    {localJobs.length === 0 && (
                      <GlassCard style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                        <Briefcase size={28} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                        <p style={{ margin: 0 }}>No active job openings at this time.</p>
                      </GlassCard>
                    )}
                  </div>
                </div>
              </div>

              <div className="company-side-col">
                <GlassCard className="employee-stats">
                  <h3>Intelligence Pulse</h3>
                  <p className="pulse-desc">Employer profile insights</p>
                  
                  <div className="pulse-deep-stats">
                    <div className="pulse-stat-row">
                      <Users size={18} className="pulse-icon" />
                      <div className="pulse-text">
                        <span className="pulse-label">Employees</span>
                        <span className="pulse-val">{localCompany.employeeCount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="pulse-stat-row">
                      <MapPin size={18} className="pulse-icon" />
                      <div className="pulse-text">
                        <span className="pulse-label">Headquarters</span>
                        <span className="pulse-val">{localCompany.headquarters}</span>
                      </div>
                    </div>
                    <div className="pulse-stat-row">
                      <Calendar size={18} className="pulse-icon" />
                      <div className="pulse-text">
                        <span className="pulse-label">Founded Year</span>
                        <span className="pulse-val">{localCompany.foundedYear}</span>
                      </div>
                    </div>
                    <div className="pulse-stat-row">
                      <Clock size={18} className="pulse-icon" />
                      <div className="pulse-text">
                        <span className="pulse-label">Avg Hiring Process</span>
                        <span className="pulse-val">{localCompany.avgHiringDays} Days</span>
                      </div>
                    </div>
                    <div className="pulse-stat-row">
                      <Sparkles size={18} className="pulse-icon" />
                      <div className="pulse-text">
                        <span className="pulse-label">Recruiter Response</span>
                        <span className="pulse-val">{localCompany.responseRate}% Rate</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="company-meta-card">
                  <h3>Quick Facts</h3>
                  <ul className="meta-list">
                    <li><Building2 size={16} /> <span>{localCompany.industry} Sector</span></li>
                    <li><Globe size={16} /> <span>Verified Platform Profile</span></li>
                    {localCompany.website && (
                      <li><ExternalLink size={16} /> <a href={localCompany.website} target="_blank" rel="noreferrer">Official Website</a></li>
                    )}
                  </ul>
                </GlassCard>
              </div>
            </div>
          </>
        ) : wikiData ? (
          /* ═══════════════════════════════════════════════════════════
             WIKIPEDIA FALLBACK COMPONENT
             ═══════════════════════════════════════════════════════════ */
          <>
            <header className="company-header">
              <div className="company-logo-wrapper">
                {wikiData.thumbnail ? (
                  <img src={wikiData.thumbnail.source} alt={`${wikiData.title} logo`} className="company-logo-img" />
                ) : (
                  <div className="company-logo-large">
                    {wikiData.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="company-intro">
                <div className="company-title-row">
                  <h1 className="text-gradient">{wikiData.title}</h1>
                  {wikiData.thumbnail && <div className="verified-badge"><Building2 size={14} /> Web Verified</div>}
                </div>
                <p>Global entity profile generated via live web intelligence.</p>
                <div className="company-actions">
                  <GlassButton variant="primary" icon={<ExternalLink size={16} />} href={`/companies`}>
                    Search Open Jobs
                  </GlassButton>
                  <GlassButton variant="secondary" icon={<Share2 size={16} />}>Share Profile</GlassButton>
                </div>
              </div>
            </header>

            <div className="company-grid">
              <div className="company-main-col">
                <GlassCard className="about-section">
                  <h3>About the Company</h3>
                  <div className="company-extract" dangerouslySetInnerHTML={{ __html: wikiData.extract || '<p>No detailed summary available.</p>' }} />
                </GlassCard>

                {isAuthenticated ? (
                  <GlassCard className="salary-section">
                    <div className="section-title-with-icon">
                      <DollarSign size={24} style={{ color: '#10b981' }} />
                      <h3>Compensation Aggregator</h3>
                    </div>
                    <p className="section-subtitle">Simulated live aggregation from global tech hubs.</p>
                    
                    <AnimatePresence mode="wait">
                      {isSimulatingSalary ? (
                        <motion.div 
                          className="salary-loading"
                          key="loading"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                          <Loader2 className="animate-spin" size={24} />
                          <span>Aggregating verified compensation data...</span>
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="salary-list"
                          key="results"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        >
                          {mockSalaries.map((s, i) => (
                            <div key={i} className="salary-row">
                              <div className="salary-role">
                                <Briefcase size={16} />
                                <span>{s.role}</span>
                              </div>
                              <div className="salary-range">{s.range}</div>
                              <div className="salary-confidence">
                                <span className="conf-bar" style={{ width: `${s.confidence}%` }}></span>
                                <span>{s.confidence}% match</span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                ) : (
                  <GlassCard className="locked-section">
                    <div className="locked-content">
                      <Lock size={40} style={{ color: '#94a3b8' }} />
                      <h3>Unlock Deep Analytics</h3>
                      <p>Register to view verified employee counts, global branches, and aggregated salary data for {wikiData.title}.</p>
                      <GlassButton variant="primary" href="/register">Create Free Account</GlassButton>
                    </div>
                  </GlassCard>
                )}
                
                {isAuthenticated && relatedCompanies.length > 0 && (
                  <div className="similar-companies-section">
                    <h3>Similar Companies in {deepAnalytics?.industry || 'this sector'}</h3>
                    <div className="similar-grid">
                      {relatedCompanies.map((comp) => (
                        <Link key={comp.pageid} href={`/company/${encodeURIComponent(comp.title)}`} style={{ textDecoration: 'none' }}>
                        <GlassCard 
                          className="similar-card"
                        >
                          <div className="similar-avatar">{comp.title.charAt(0)}</div>
                          <h4>{comp.title}</h4>
                          <p dangerouslySetInnerHTML={{ __html: comp.snippet.substring(0, 60) + '...' }}></p>
                        </GlassCard>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="company-side-col">
                <GlassCard className="employee-stats">
                  <h3>Intelligence Pulse</h3>
                  <p className="pulse-desc">Estimated metrics based on global web presence.</p>
                  
                  {isAuthenticated ? (
                    <div className="pulse-deep-stats">
                      <div className="pulse-stat-row">
                        <Users size={18} className="pulse-icon" />
                        <div className="pulse-text">
                          <span className="pulse-label">Employees</span>
                          <span className="pulse-val">{deepAnalytics?.employees || 'Aggregating...'}</span>
                        </div>
                      </div>
                      <div className="pulse-stat-row">
                        <MapPin size={18} className="pulse-icon" />
                        <div className="pulse-text">
                          <span className="pulse-label">Primary HQ / Branches</span>
                          <span className="pulse-val">{deepAnalytics?.headquarters || 'Aggregating...'}</span>
                        </div>
                      </div>
                      <div className="pulse-stat-row">
                        <TrendingUp size={18} className="pulse-icon" />
                        <div className="pulse-text">
                          <span className="pulse-label">Industry</span>
                          <span className="pulse-val">{deepAnalytics?.industry || 'Aggregating...'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="stats-mini-grid">
                      <div className="stat-item blur-locked">
                        <Users size={20} className="stat-icon" />
                        <span className="stat-value">Hidden</span>
                        <span className="stat-label">Employees</span>
                      </div>
                      <div className="stat-item blur-locked">
                        <MapPin size={20} className="stat-icon" />
                        <span className="stat-value">Hidden</span>
                        <span className="stat-label">Locations</span>
                      </div>
                    </div>
                  )}
                </GlassCard>
                
                <GlassCard className="company-meta-card">
                  <h3>Quick Facts</h3>
                  <ul className="meta-list">
                    <li><Building2 size={16} /> <span>Industry Leader</span></li>
                    <li><Globe size={16} /> <span>Global Web Presence</span></li>
                    <li><ExternalLink size={16} /> <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(wikiData.title)}`} target="_blank" rel="noreferrer">View Web Source</a></li>
                  </ul>
                </GlassCard>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </PageTransition>
  );
};
