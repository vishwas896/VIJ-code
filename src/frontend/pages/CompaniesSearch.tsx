import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, ExternalLink, Loader2, Info, Sparkles, Lock } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import './CompaniesSearch.css';

interface WikiSearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

// Keywords that indicate a result is about a company/organization
const COMPANY_INDICATORS = [
  'company', 'corporation', 'inc.', 'ltd', 'llc', 'group', 'holdings', 'enterprises',
  'technologies', 'solutions', 'services', 'bank', 'insurance', 'industry', 'industries',
  'multinational', 'conglomerate', 'founded', 'headquartered', 'employees', 'revenue',
  'manufacturer', 'provider', 'startup', 'firm', 'consulting', 'software', 'systems',
  'global', 'international', 'partnership', 'plc', 'pvt', 'listed on', 'stock exchange'
];

// Curated suggestions per industry for personalized recommendations
const INDUSTRY_SUGGESTIONS: Record<string, string[]> = {
  'Technology': ['Microsoft', 'Alphabet Inc.', 'Apple Inc.', 'Meta Platforms', 'Amazon (company)', 'Nvidia', 'Salesforce', 'Adobe Inc.'],
  'Finance & Banking': ['JPMorgan Chase', 'Goldman Sachs', 'Morgan Stanley', 'Citigroup', 'Bank of America', 'HSBC', 'Barclays', 'Wells Fargo'],
  'Healthcare': ['Johnson & Johnson', 'Pfizer', 'UnitedHealth Group', 'Abbvie', 'Merck & Co.', 'Roche', 'Novartis', 'Abbott Laboratories'],
  'E-Commerce & Retail': ['Amazon (company)', 'Alibaba Group', 'Walmart', 'Shopify', 'eBay', 'JD.com', 'Flipkart', 'Rakuten'],
  'Consulting': ['McKinsey & Company', 'Bain & Company', 'Boston Consulting Group', 'Deloitte', 'Accenture', 'PricewaterhouseCoopers', 'KPMG', 'Ernst & Young'],
  'Media & Entertainment': ['Netflix', 'Walt Disney Company', 'Warner Bros.', 'Sony Pictures', 'Universal Music Group', 'Spotify', 'YouTube', 'Comcast'],
  'Education': ['Coursera', 'edX', 'Udemy', 'Pearson plc', 'Chegg', 'Duolingo', 'Khan Academy', '2U'],
  'Manufacturing': ['General Electric', 'Siemens', '3M', 'Honeywell', 'Caterpillar Inc.', 'ABB', 'Emerson Electric', 'Bosch'],
  'Government & Public Sector': ['Lockheed Martin', 'Raytheon Technologies', 'Boeing', 'General Dynamics', 'Northrop Grumman', 'Leidos', 'SAIC', 'Booz Allen Hamilton'],
  'Automotive': ['Tesla, Inc.', 'Toyota', 'Volkswagen Group', 'General Motors', 'Ford Motor Company', 'BMW', 'Mercedes-Benz', 'Stellantis'],
  'Pharmaceuticals': ['Pfizer', 'Merck & Co.', 'AstraZeneca', 'Bristol Myers Squibb', 'Eli Lilly', 'Gilead Sciences', 'Amgen', 'Biogen'],
  'Telecom': ['AT&T', 'Verizon', 'T-Mobile US', 'Comcast', 'Vodafone', 'Deutsche Telekom', 'SoftBank', 'China Mobile'],
};

// Domain → industry mapping for users without explicit industry set
const DOMAIN_TO_INDUSTRY: Record<string, string> = {
  engineering: 'Technology',
  design: 'Technology',
  'data-science': 'Technology',
  marketing: 'Media & Entertainment',
  finance: 'Finance & Banking',
  healthcare: 'Healthcare',
  sales: 'E-Commerce & Retail',
  operations: 'Manufacturing',
};

// Curated nickname/shortname alias dictionary
const companyAliases: Record<string, string> = {
  'fb': 'Meta Platforms', 'meta': 'Meta Platforms', 'google': 'Alphabet Inc.', 'alphabet': 'Alphabet Inc.',
  'apple': 'Apple Inc.', 'mac': 'Apple Inc.', 'msft': 'Microsoft', 'amazon': 'Amazon (company)',
  'aws': 'Amazon Web Services', 'vw': 'Volkswagen Group', 'tcs': 'Tata Consultancy Services',
  'infy': 'Infosys', 'wipro': 'Wipro', 'hcl': 'HCLTech', 'cognizant': 'Cognizant', 'cts': 'Cognizant',
  'ibm': 'IBM', 'hp': 'Hewlett-Packard', 'hpe': 'Hewlett Packard Enterprise', 'ge': 'General Electric',
  'jpm': 'JPMorgan Chase', 'jpmorgan': 'JPMorgan Chase', 'gs': 'Goldman Sachs', 'ms': 'Morgan Stanley',
  'bofa': 'Bank of America', 'citi': 'Citigroup', 'tsla': 'Tesla, Inc.', 'spacex': 'SpaceX',
  'twitter': 'X Corp.', 'nflx': 'Netflix', 'uber': 'Uber', 'lyft': 'Lyft', 'airbnb': 'Airbnb',
  'abnb': 'Airbnb', 'nvda': 'Nvidia', 'amd': 'Advanced Micro Devices', 'intel': 'Intel',
  'intc': 'Intel', 'tsmc': 'TSMC', 'samsung': 'Samsung Electronics', 'sony': 'Sony',
  'tata': 'Tata Group', 'reliance': 'Reliance Industries', 'ril': 'Reliance Industries',
};

function isCompanyResult(result: WikiSearchResult): boolean {
  const combined = (result.title + ' ' + result.snippet).toLowerCase();
  return COMPANY_INDICATORS.some(kw => combined.includes(kw));
}

export const CompaniesSearch: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<WikiSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Resolve personalized industry suggestions on mount for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const industry = user.industry || (user.domain ? DOMAIN_TO_INDUSTRY[user.domain] : null) || 'Technology';
    const list = INDUSTRY_SUGGESTIONS[industry] || INDUSTRY_SUGGESTIONS['Technology'];
    setSuggestions(list);
  }, [isAuthenticated, user]);

  // Debounce input
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timerId);
  }, [query]);

  // Search Wikipedia and filter to company-only results
  useEffect(() => {
    const searchWikipedia = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setIsLoading(true);
      setHasSearched(true);
      try {
        const normalizedInput = debouncedQuery.trim().toLowerCase();
        // Resolve alias or append "company" to bias results toward companies
        const resolvedQuery = companyAliases[normalizedInput] || `${debouncedQuery} company`;

        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(resolvedQuery)}&utf8=&format=json&origin=*&srlimit=15`
        );
        const data = await res.json();
        if (data.query?.search) {
          // Filter to only results that look like companies
          const filtered = data.query.search.filter(isCompanyResult);
          setResults(filtered);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Failed to search Wikipedia', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    searchWikipedia();
  }, [debouncedQuery]);

  const handleCompanyClick = (title: string) => {
    navigate(`/company/${encodeURIComponent(title)}`);
  };

  // Resolve effective industry label for display
  const effectiveIndustry = user?.industry || (user?.domain ? DOMAIN_TO_INDUSTRY[user.domain] : 'Technology');

  return (
    <PageTransition>
      <div className="comp-search-root">
        <div className="comp-search-container">

          <motion.div
            className="comp-search-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="comp-search-icon-bg">
              <Building2 size={32} />
            </div>
            <h1>Company Intelligence Search</h1>
            <p>Live web integration — search any global company to pull live scraped data.</p>

            <div className="comp-search-input-wrapper">
              <Search className="comp-search-icon" size={20} />
              <input
                type="text"
                placeholder='Try "Google", "TCS", "tsla", "msft"...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {isLoading && <Loader2 className="comp-search-spinner animate-spin" size={20} />}
            </div>
          </motion.div>

          <div className="comp-search-results">
            <AnimatePresence mode="popLayout">

              {/* ── Search results ── */}
              {hasSearched && results.map((result, i) => (
                <motion.div
                  key={result.pageid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleCompanyClick(result.title)}
                >
                  <GlassCard className="comp-result-card">
                    <div className="comp-result-left">
                      <div className="comp-result-avatar">
                        {result.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="comp-result-info">
                        <h3>{result.title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: result.snippet + '...' }}></p>
                      </div>
                    </div>
                    <button className="comp-result-btn">
                      View Profile <ExternalLink size={14} />
                    </button>
                  </GlassCard>
                </motion.div>
              ))}

              {/* ── Empty state after search ── */}
              {hasSearched && !isLoading && results.length === 0 && (
                <motion.div
                  className="comp-empty-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Info size={40} />
                  <h3>No company results found</h3>
                  <p>Try a more specific company name or check the spelling.</p>
                </motion.div>
              )}

            </AnimatePresence>

            {/* ── Initial state: show personalized suggestions ── */}
            {!hasSearched && (
              <motion.div
                className="comp-initial-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isAuthenticated && suggestions.length > 0 ? (
                  <div className="comp-suggestions-wrapper">
                    <div className="comp-suggestions-header">
                      <Sparkles size={18} style={{ color: '#0ea5e9' }} />
                      <span>Recommended for you — <strong>{effectiveIndustry}</strong></span>
                    </div>
                    <div className="comp-suggestions-grid">
                      {suggestions.map((name) => (
                        <motion.button
                          key={name}
                          className="comp-suggestion-chip"
                          onClick={() => handleCompanyClick(name)}
                        >
                          <div className="comp-chip-avatar">{name.charAt(0)}</div>
                          <span>{name}</span>
                          <ExternalLink size={12} style={{ color: '#94a3b8', marginLeft: 'auto' }} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="comp-guest-hint">
                    <GlassCard className="comp-hint-card">
                      <Building2 size={24} style={{ color: '#0ea5e9' }} />
                      <h3>Web Scraping Engine Active</h3>
                      <p>Start typing to search any company globally. Register to get personalized industry suggestions.</p>
                      <button className="comp-register-cta" onClick={() => navigate('/register')}>
                        <Lock size={14} /> Unlock Personalized Suggestions
                      </button>
                    </GlassCard>
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
