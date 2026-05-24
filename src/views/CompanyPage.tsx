'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, ExternalLink, Info, Loader2, Share2, MapPin, Users, Globe, Lock, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { useAuth } from '../context/AuthContext';
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
  const { isAuthenticated } = useAuth();
  
  const [data, setData] = useState<WikiCompanyData | null>(null);
  const [deepAnalytics, setDeepAnalytics] = useState<DeepAnalytics | null>(null);
  const [relatedCompanies, setRelatedCompanies] = useState<RelatedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatingSalary, setIsSimulatingSalary] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Fetch Basic Extract and Logo
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
            setData(pages[pageId]);
            title = pages[pageId].title;
          }
        }

        // 2. Fetch Full HTML for Deep Analytics (Only if Authenticated)
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
                    // Clean references like [1]
                    const cleanText = td.textContent?.replace(/\[\d+\]/g, '').trim() || '';
                    
                    if (headerText.includes('employees')) employees = cleanText;
                    if (headerText.includes('headquarters')) headquarters = cleanText.split(',')[0];
                    if (headerText.includes('industry')) industry = cleanText.split(',')[0].split('\n')[0];
                  }
                });
              }
              
              setDeepAnalytics({ employees, headquarters, industry });

              // 3. Fetch Related Companies based on Industry
              const searchKeyword = industry !== 'Technology' ? industry : title;
              const resSearch = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchKeyword + ' company')}&utf8=&format=json&origin=*&srlimit=4`);
              const jsonSearch = await resSearch.json();
              
              if (jsonSearch.query && jsonSearch.query.search) {
                const filtered = jsonSearch.query.search.filter((s: any) => s.title !== title);
                setRelatedCompanies(filtered.slice(0, 3));
              }
              
              // Simulate salary fetching delay
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

    fetchCompanyData();
  }, [companyId, isAuthenticated]);

  return (
    <PageTransition>
      <div className="company-page">
        <div className="company-nav-bar">
          <GlassButton variant="secondary" onClick={() => router.push('/companies')} icon={<ArrowLeft size={16} />}>
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
            <GlassButton onClick={() => router.push('/companies')}>Return to Search</GlassButton>
          </div>
        ) : data ? (
          <>
            <header className="company-header">
              <div className="company-logo-wrapper">
                {data.thumbnail ? (
                  <img src={data.thumbnail.source} alt={`${data.title} logo`} className="company-logo-img" />
                ) : (
                  <div className="company-logo-large">
                    {data.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="company-intro">
                <div className="company-title-row">
                  <h1 className="text-gradient">{data.title}</h1>
                  {data.thumbnail && <div className="verified-badge"><Building2 size={14} /> Web Verified</div>}
                </div>
                <p>Global entity profile generated via live web intelligence.</p>
                <div className="company-actions">
                  <GlassButton variant="primary" icon={<ExternalLink size={16} />}>View Open Jobs</GlassButton>
                  <GlassButton variant="secondary" icon={<Share2 size={16} />}>Share Profile</GlassButton>
                </div>
              </div>
            </header>

            <div className="company-grid">
              <div className="company-main-col">
                <GlassCard className="about-section">
                  <h3>About the Company</h3>
                  <div className="company-extract" dangerouslySetInnerHTML={{ __html: data.extract || '<p>No detailed summary available.</p>' }} />
                </GlassCard>

                {/* --- REGISTERED USERS: SALARY AGGREGATOR --- */}
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
                      <p>Register to view verified employee counts, global branches, and aggregated salary data for {data.title}.</p>
                      <GlassButton variant="primary" onClick={() => router.push('/register')}>Create Free Account</GlassButton>
                    </div>
                  </GlassCard>
                )}
                
                {/* --- REGISTERED USERS: SIMILAR COMPANIES --- */}
                {isAuthenticated && relatedCompanies.length > 0 && (
                  <div className="similar-companies-section">
                    <h3>Similar Companies in {deepAnalytics?.industry || 'this sector'}</h3>
                    <div className="similar-grid">
                      {relatedCompanies.map((comp) => (
                        <GlassCard 
                          key={comp.pageid} 
                          className="similar-card"
                          onClick={() => router.push(`/company/${encodeURIComponent(comp.title)}`)}
                        >
                          <div className="similar-avatar">{comp.title.charAt(0)}</div>
                          <h4>{comp.title}</h4>
                          <p dangerouslySetInnerHTML={{ __html: comp.snippet.substring(0, 60) + '...' }}></p>
                        </GlassCard>
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
                    <li><ExternalLink size={16} /> <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`} target="_blank" rel="noreferrer">View Web Source</a></li>
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

