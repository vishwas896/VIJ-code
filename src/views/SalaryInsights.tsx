'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { useCurrency } from '../context/CurrencyContext';
import { AutocompleteDropdown } from '../components/common/AutocompleteDropdown';
import { SalaryRangeBar } from '../components/salary-insights/SalaryRangeBar';
import { CompDonutChart } from '../components/salary-insights/CompDonutChart';
import { TrendSparkline } from '../components/salary-insights/TrendSparkline';
import { CareerPivotExplorer } from '../components/salary-insights/CareerPivotExplorer';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { ALL_JOB_TITLES } from '../data/salaryData';
import { 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  Share2, 
  Download, 
  Bell, 
  Bookmark, 
  BookmarkCheck,
  RefreshCw,
  Building,
  ArrowRightLeft,
  X,
  Plus
} from 'lucide-react';
import './SalaryInsights.css';

interface LocationObj {
  country: string;
  state: string;
  city: string;
}

export const SalaryInsights: React.FC = () => {
  const { formatCurrency, currency } = useCurrency();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('Frontend Developer');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('California');
  const [selectedCity, setSelectedCity] = useState('San Francisco');
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior' | 'lead'>('senior');

  // Datasets loaded from API
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [statesMap, setStatesMap] = useState<Record<string, string[]>>({});
  const [citiesMap, setCitiesMap] = useState<Record<string, Record<string, any[]>>>({});

  // Active Profile & Loading State
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Saved Searches & Alerts
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('5');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Comparison State
  const [compareMode, setCompareMode] = useState<'none' | 'roles' | 'locations'>('none');
  const [compareRoles, setCompareRoles] = useState<string[]>(['Frontend Developer', 'Backend Developer']);
  const [newCompareRole, setNewCompareRole] = useState('');
  const [compareLocations, setCompareLocations] = useState<LocationObj[]>([
    { country: 'US', state: 'California', city: 'San Francisco' },
    { country: 'GB', state: 'England', city: 'London' }
  ]);
  const [compareResults, setCompareResults] = useState<any>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // 1. Initial Load: Locations list & URL search params
  useEffect(() => {
    // Load location hierarchy
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => {
        if (data.countries) setCountriesList(data.countries);
        if (data.states) setStatesMap(data.states);
        if (data.cities) setCitiesMap(data.cities);
      })
      .catch(err => console.error('Failed to load locations API:', err));

    // Load saved history
    const saved = localStorage.getItem('vij_saved_salaries');
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    const savedAlerts = localStorage.getItem('vij_salary_alerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (e) {
        console.error(e);
      }
    }

    // Read URL Search Parameters
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    const countryParam = params.get('country');
    const stateParam = params.get('state');
    const cityParam = params.get('city');
    const expParam = params.get('exp');

    if (qParam) setSearchQuery(qParam);
    if (countryParam) setSelectedCountry(countryParam);
    if (stateParam) setSelectedState(stateParam);
    if (cityParam) setSelectedCity(cityParam);
    if (expParam && ['entry', 'mid', 'senior', 'lead'].includes(expParam)) {
      setExperienceLevel(expParam as any);
    }
  }, []);

  // Helper to trigger transient toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 2. Fetch main profile details on filter change
  useEffect(() => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      q: searchQuery,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity
    });

    fetch(`/api/salary/search?${params.toString()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('No salary profile matches this search criteria.');
        }
        return res.json();
      })
      .then(data => {
        setProfile(data.profile);
        setLoading(false);

        // Sync URL query string
        const url = new URL(window.location.href);
        url.searchParams.set('q', searchQuery);
        url.searchParams.set('country', selectedCountry);
        url.searchParams.set('state', selectedState);
        url.searchParams.set('city', selectedCity);
        url.searchParams.set('exp', experienceLevel);
        window.history.replaceState({}, '', url.toString());
      })
      .catch(err => {
        setError(err.message);
        setProfile(null);
        setLoading(false);
      });
  }, [searchQuery, selectedCountry, selectedState, selectedCity, experienceLevel]);

  // 3. Run Comparisons when Compare Mode is active
  useEffect(() => {
    if (compareMode === 'none') {
      setCompareResults(null);
      return;
    }

    setCompareLoading(true);
    if (compareMode === 'roles') {
      fetch('/api/salary/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'roles',
          queries: compareRoles,
          location: { country: selectedCountry, state: selectedState, city: selectedCity }
        })
      })
        .then(res => res.json())
        .then(data => {
          setCompareResults(data.results);
          setCompareLoading(false);
        })
        .catch(err => {
          console.error(err);
          setCompareLoading(false);
        });
    } else if (compareMode === 'locations') {
      fetch('/api/salary/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'locations',
          query: searchQuery,
          locations: compareLocations
        })
      })
        .then(res => res.json())
        .then(data => {
          setCompareResults(data.results);
          setCompareLoading(false);
        })
        .catch(err => {
          console.error(err);
          setCompareLoading(false);
        });
    }
  }, [compareMode, compareRoles, compareLocations, searchQuery, selectedCountry, selectedState, selectedCity]);

  // Cascading handler: Country change
  const handleCountryChange = (cCode: string) => {
    setSelectedCountry(cCode);
    const states = statesMap[cCode] || [];
    const firstState = states[0] || '';
    setSelectedState(firstState);

    if (firstState && citiesMap[cCode] && citiesMap[cCode][firstState]) {
      const cities = citiesMap[cCode][firstState] || [];
      setSelectedCity(cities[0]?.city || '');
    } else {
      setSelectedCity('');
    }
  };

  // Cascading handler: State change
  const handleStateChange = (sName: string) => {
    setSelectedState(sName);
    if (citiesMap[selectedCountry] && citiesMap[selectedCountry][sName]) {
      const cities = citiesMap[selectedCountry][sName] || [];
      setSelectedCity(cities[0]?.city || '');
    } else {
      setSelectedCity('');
    }
  };

  // Save Search Toggle
  const isCurrentlySaved = savedSearches.some(
    s => s.q === searchQuery && s.country === selectedCountry && s.city === selectedCity
  );

  const toggleSaveSearch = () => {
    let updated;
    if (isCurrentlySaved) {
      updated = savedSearches.filter(
        s => !(s.q === searchQuery && s.country === selectedCountry && s.city === selectedCity)
      );
      triggerToast('Removed search from dashboard.');
    } else {
      updated = [{ q: searchQuery, country: selectedCountry, state: selectedState, city: selectedCity }, ...savedSearches];
      triggerToast('Saved search to dashboard.');
    }
    setSavedSearches(updated);
    localStorage.setItem('vij_saved_salaries', JSON.stringify(updated));
  };

  // Set Alerts
  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert = {
      id: Date.now().toString(),
      q: searchQuery,
      location: `${selectedCity || selectedState || selectedCountry}`,
      threshold: alertThreshold,
      currency: currency
    };
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    localStorage.setItem('vij_salary_alerts', JSON.stringify(updated));
    setIsAlertModalOpen(false);
    triggerToast(`Alert established: Notify when average changes by >${alertThreshold}%`);
  };

  const removeAlert = (id: string) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('vij_salary_alerts', JSON.stringify(updated));
    triggerToast('Alert deleted.');
  };

  // Share link
  const handleShare = () => {
    const params = new URLSearchParams({
      q: searchQuery,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      exp: experienceLevel
    });
    const shareUrl = `${window.location.origin}/salary-insights?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => triggerToast('Shareable link copied to clipboard!'))
      .catch(() => triggerToast('Failed to copy link.'));
  };

  // Export PDF
  const handleExportPDF = () => {
    window.print();
  };

  // Render values mapped to selected experience level
  const getExperienceCompensation = () => {
    if (!profile) return 0;
    return profile.experience[experienceLevel];
  };

  return (
    <PageTransition>
      <div className="salary-insights-page vij-page">
        {/* HEADER SECTION */}
        <header className="page-header" style={{ marginBottom: '24px' }}>
          <h1 className="text-gradient" style={{ fontSize: '40px', fontWeight: 800 }}>Salary Insights</h1>
          <p style={{ color: 'var(--vij-text-muted)', fontSize: '15px', marginTop: '4px' }}>
            Empower your path with hyper-local salary spreads, composition breakdowns, and AI pivot recommendations.
          </p>
        </header>

        {/* TOAST SYSTEM */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="toast-notification"
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                background: 'rgba(24, 24, 27, 0.95)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                zIndex: 9999,
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTROL DECK & FILTERS */}
        <GlassCard className="filters-card no-print" style={{ padding: '24px', marginBottom: '24px' }} tilt={false}>
          <div className="filters-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            {/* Search Job */}
            <div>
              <AutocompleteDropdown
                options={ALL_JOB_TITLES}
                value={searchQuery}
                onChange={(val) => {
                  if (val) setSearchQuery(val);
                }}
                placeholder="Search job title (e.g. Frontend Developer)"
                label="Job Profile"
              />
            </div>

            {/* Country Selector */}
            <div className="custom-select-wrapper">
              <label className="select-label">Country</label>
              <select 
                value={selectedCountry} 
                onChange={(e) => handleCountryChange(e.target.value)}
                className="glass-select"
              >
                {countriesList.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* State Selector */}
            <div className="custom-select-wrapper">
              <label className="select-label">State / Region</label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="glass-select"
                disabled={!selectedCountry || !statesMap[selectedCountry]}
              >
                {(statesMap[selectedCountry] || []).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div className="custom-select-wrapper">
              <label className="select-label">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="glass-select"
                disabled={!selectedState || !citiesMap[selectedCountry] || !citiesMap[selectedCountry][selectedState]}
              >
                {(citiesMap[selectedCountry]?.[selectedState] || []).map(c => (
                  <option key={c.city} value={c.city}>{c.city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={toggleSaveSearch} 
                className="action-btn flex-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: isCurrentlySaved ? 'rgba(10, 110, 110, 0.1)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
              >
                {isCurrentlySaved ? <BookmarkCheck size={16} style={{ color: '#0A6E6E' }} /> : <Bookmark size={16} />}
                {isCurrentlySaved ? 'Saved' : 'Save Search'}
              </button>

              <button 
                onClick={() => setIsAlertModalOpen(true)} 
                className="action-btn flex-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
              >
                <Bell size={16} />
                Set Alert
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Compare toggle buttons */}
              <button 
                onClick={() => setCompareMode(compareMode === 'roles' ? 'none' : 'roles')}
                className="action-btn flex-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: compareMode === 'roles' ? '1.5px solid var(--accent-azure)' : '1px solid var(--glass-border)',
                  background: compareMode === 'roles' ? 'var(--accent-azure-glow)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
              >
                <ArrowRightLeft size={16} />
                Compare Roles
              </button>

              <button 
                onClick={() => setCompareMode(compareMode === 'locations' ? 'none' : 'locations')}
                className="action-btn flex-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: compareMode === 'locations' ? '1.5px solid var(--accent-azure)' : '1px solid var(--glass-border)',
                  background: compareMode === 'locations' ? 'var(--accent-azure-glow)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
              >
                <MapPin size={16} />
                Compare Locations
              </button>

              <button 
                onClick={handleShare} 
                className="action-btn flex-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer'
                }}
                title="Copy share link"
              >
                <Share2 size={16} />
              </button>

              <button 
                onClick={handleExportPDF} 
                className="action-btn flex-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer'
                }}
                title="Print Report / Export PDF"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* LOADING INDICATOR */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
            <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--accent-azure)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--vij-text-muted)' }}>Refreshing market metrics...</span>
          </div>
        )}

        {/* ERROR SCREEN */}
        {!loading && error && (
          <GlassCard style={{ padding: '40px', textAlign: 'center', margin: '40px 0' }}>
            <h3 style={{ color: 'var(--accent-azure)', marginBottom: '8px' }}>Search Criteria Unmatched</h3>
            <p style={{ color: 'var(--vij-text-muted)', marginBottom: '24px' }}>
              We could not find active scrapers or public records matching "{searchQuery}" in {selectedCity || selectedState}.
            </p>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Try searching for standard profiles:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
              {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Product Manager', 'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer'].map(s => (
                <button
                  key={s}
                  onClick={() => setSearchQuery(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* DASHBOARD CONTENT */}
        {!loading && profile && compareMode === 'none' && (
          <div className="dashboard-grid">
            {/* LEFT COLUMN: Main Overview & Sparklines */}
            <div className="column-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* PRIMARY CARD: Salary Spread & Range Bar */}
              <GlassCard className="salary-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge-freshness" style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        UPDATED 2 HRS AGO
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--vij-text-muted)', fontWeight: 500 }}>
                        Public records: public job boards, Glassdoor, LinkedIn
                      </span>
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>
                      {profile.title}
                    </h2>
                    <span style={{ fontSize: '13px', color: 'var(--vij-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={14} />
                      {selectedCity}, {selectedState} ({selectedCountry})
                    </span>
                  </div>
                  
                  {/* Experience Toggles */}
                  <div className="experience-tabs" style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', padding: '3px', borderRadius: '8px' }}>
                    {(['entry', 'mid', 'senior', 'lead'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setExperienceLevel(level)}
                        className={`tab-btn ${experienceLevel === level ? 'active' : ''}`}
                        style={{
                          border: 'none',
                          background: experienceLevel === level ? '#fff' : 'transparent',
                          color: experienceLevel === level ? 'var(--vij-text-main)' : 'var(--vij-text-muted)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          boxShadow: experienceLevel === level ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'center' }}>
                  <div>
                    {/* Range Bar */}
                    <SalaryRangeBar 
                      min={profile.baseMin} 
                      mid={profile.baseMid} 
                      max={profile.baseMax} 
                      percentiles={profile.percentiles} 
                    />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--vij-text-muted)', textTransform: 'uppercase' }}>
                      Active level average ({experienceLevel})
                    </span>
                    <h3 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-azure)', margin: '6px 0 2px 0' }}>
                      <AnimatedCounter target={getExperienceCompensation()} prefix={currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'} suffix={currency === 'USD' ? '' : ''} />
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--vij-text-muted)', display: 'block' }}>
                      Base Pay (Excludes Bonus & Equity)
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* TWO COLUMN GRID FOR SUB-METRICS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                {/* Trend sparkline */}
                <GlassCard style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <TrendingUp size={16} className="text-blue-glow" />
                    <h4 style={{ fontSize: '14px', fontWeight: 700 }}>6-Month Salary Trend</h4>
                  </div>
                  <TrendSparkline data={profile.trends} />
                </GlassCard>

                {/* Industry breakdown */}
                <GlassCard style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <Building size={16} className="text-blue-glow" />
                    <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Industry Comparison</h4>
                  </div>
                  <div className="industry-table-wrapper" style={{ maxHeight: '140px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--vij-text-muted)' }}>
                          <th style={{ padding: '6px 0', fontWeight: 600 }}>Sector / Industry</th>
                          <th style={{ padding: '6px 0', fontWeight: 600, textAlign: 'right' }}>Avg Salary</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.industries.map((ind: any) => (
                          <tr key={ind.industry} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                            <td style={{ padding: '8px 0', fontWeight: 500 }}>{ind.industry}</td>
                            <td style={{ padding: '8px 0', fontWeight: 700, textAlign: 'right', color: 'var(--accent-emerald)' }}>
                              {formatCurrency(ind.avgSalary, true)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>

              {/* SUGGESTIONS PANEL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                {/* Career Pivot Paths */}
                <GlassCard style={{ padding: '20px' }}>
                  <CareerPivotExplorer 
                    currentTitle={profile.title} 
                    currentSalary={profile.baseMid} 
                    pivots={profile.pivots} 
                  />
                </GlassCard>

                {/* Related roles */}
                <GlassCard style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Related Profiles</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {profile.related.map((rel: any) => (
                      <div 
                        key={rel.title}
                        onClick={() => setSearchQuery(rel.title)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.4)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        className="related-item-card"
                      >
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{rel.title}</span>
                        <strong style={{ fontSize: '12px', color: 'var(--accent-azure)' }}>
                          {formatCurrency(rel.avgSalary, true)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* RIGHT COLUMN: Pie Charts, Skill tag premiums, Company comp lists, and Saved metrics */}
            <div className="column-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* COMP BREAKDOWN (DONUT) */}
              <GlassCard style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Compensation Splits</h4>
                <CompDonutChart 
                  base={profile.breakdown.base} 
                  bonus={profile.breakdown.bonus} 
                  equity={profile.breakdown.equity} 
                />
              </GlassCard>

              {/* SKILLS PREMIUM */}
              <GlassCard style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Skill Premiums</h4>
                <p style={{ fontSize: '11px', color: 'var(--vij-text-muted)', marginBottom: '12px' }}>
                  Job descriptions index: Acquiring these skills yields salary increases.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.skills.map((skill: any) => (
                    <div 
                      key={skill.skill}
                      style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#0e7d55',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{skill.skill}</span>
                      <strong style={{ color: '#10b981' }}>+{skill.premiumPct}%</strong>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* TOP PAYING COMPANIES */}
              <GlassCard style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Top Paying Companies</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {profile.companies.map((comp: any) => (
                    <div 
                      key={comp.company}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        borderBottom: '1px solid rgba(0,0,0,0.03)',
                        paddingBottom: '8px'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700 }}>{comp.company}</span>
                        <div style={{ fontSize: '10px', color: 'var(--vij-text-muted)' }}>
                          Rating: {'★'.repeat(Math.round(comp.rating))}{'☆'.repeat(5 - Math.round(comp.rating))} ({comp.rating})
                        </div>
                      </div>
                      <strong style={{ color: 'var(--accent-azure)', fontSize: '13px' }}>
                        {formatCurrency(comp.avgSalary, true)}
                      </strong>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* DASHBOARD SAVES & ALERTS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {/* Saved Searches */}
                {savedSearches.length > 0 && (
                  <GlassCard style={{ padding: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Saved Searches ({savedSearches.length})</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
                      {savedSearches.map((s, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearchQuery(s.q);
                            setSelectedCountry(s.country);
                            if (s.state) setSelectedState(s.state);
                            if (s.city) setSelectedCity(s.city);
                          }}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            background: 'rgba(255,255,255,0.5)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {s.q} ({s.city})
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Saved Alerts */}
                {alerts.length > 0 && (
                  <GlassCard style={{ padding: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Salary Alerts</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                      {alerts.map(a => (
                        <div
                          key={a.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '11px',
                            background: 'rgba(255,255,255,0.4)',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          <div>
                            <strong>{a.q}</strong> ({a.location}) - Trigger: &gt;{a.threshold}%
                          </div>
                          <button 
                            onClick={() => removeAlert(a.id)}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--accent-azure)' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        )}

        {/* COMPARISON MODULE */}
        {!loading && compareMode !== 'none' && (
          <GlassCard style={{ padding: '24px', minHeight: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
                  {compareMode === 'roles' ? 'Role Comparison Hub' : 'Location Comparison Hub'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--vij-text-muted)', marginTop: '2px' }}>
                  {compareMode === 'roles' 
                    ? `Comparing up to 3 roles in ${selectedCity}, ${selectedState}` 
                    : `Comparing "${searchQuery}" across multiple global markets`}
                </p>
              </div>
              <button 
                onClick={() => setCompareMode('none')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.5)',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '11px'
                }}
              >
                Close Comparison
              </button>
            </div>

            {/* Compare Controls */}
            {compareMode === 'roles' && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Comparing Roles:</span>
                {compareRoles.map(role => (
                  <div 
                    key={role}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(10, 110, 110, 0.1)',
                      color: '#0A6E6E',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    <span>{role}</span>
                    {compareRoles.length > 1 && (
                      <X 
                        size={12} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCompareRoles(compareRoles.filter(r => r !== role))}
                      />
                    )}
                  </div>
                ))}
                
                {compareRoles.length < 3 && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={newCompareRole}
                      onChange={(e) => {
                        if (e.target.value && !compareRoles.includes(e.target.value)) {
                          setCompareRoles([...compareRoles, e.target.value]);
                          setNewCompareRole('');
                        }
                      }}
                      className="glass-select"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      <option value="">+ Add Role</option>
                      {ALL_JOB_TITLES.filter(r => !compareRoles.includes(r)).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {compareMode === 'locations' && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Markets Compared:</span>
                {compareLocations.map((loc, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(220, 38, 38, 0.1)',
                      color: 'var(--accent-azure)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    <span>{loc.city} ({loc.country})</span>
                    {compareLocations.length > 1 && (
                      <X 
                        size={12} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCompareLocations(compareLocations.filter((_, i) => i !== idx))}
                      />
                    )}
                  </div>
                ))}
                
                {compareLocations.length < 3 && (
                  <button 
                    onClick={() => {
                      // Add current selection to compare list
                      const exists = compareLocations.some(
                        l => l.country === selectedCountry && l.state === selectedState && l.city === selectedCity
                      );
                      if (!exists) {
                        setCompareLocations([...compareLocations, { country: selectedCountry, state: selectedState, city: selectedCity }]);
                      } else {
                        triggerToast('Location already added to comparison.');
                      }
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid var(--glass-border)',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={12} /> Add Current ({selectedCity})
                  </button>
                )}
              </div>
            )}

            {/* Comparison results */}
            {compareLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '12px' }}>
                <RefreshCw className="animate-spin" size={24} style={{ color: 'var(--accent-azure)' }} />
                <span style={{ fontSize: '12px', color: 'var(--vij-text-muted)' }}>Calculating comparison indices...</span>
              </div>
            ) : compareResults ? (
              <div className="comparison-table-wrapper" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left', color: 'var(--vij-text-muted)', fontSize: '13px' }}>
                      <th style={{ padding: '12px 8px' }}>Compare Metrics</th>
                      {compareMode === 'roles' ? (
                        compareResults.map((res: any, idx: number) => (
                          <th key={idx} style={{ padding: '12px 8px', width: '30%' }}>
                            {res.query} {res.error && <span style={{ color: 'var(--accent-azure)', fontSize: '10px' }}>(Unavailable)</span>}
                          </th>
                        ))
                      ) : (
                        compareResults.map((res: any, idx: number) => (
                          <th key={idx} style={{ padding: '12px 8px', width: '30%' }}>
                            {res.location.city} ({res.location.country})
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Multipliers / Location */}
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>Location Factor</td>
                      {compareResults.map((res: any, idx: number) => (
                        <td key={idx} style={{ padding: '12px 8px' }}>
                          {compareMode === 'roles' 
                            ? `${selectedCity} (${selectedCountry}) - Factor: ${res.profile ? (res.profile.baseMid / 135000 * 100).toFixed(0) : 0}%` 
                            : `Factor: ${(res.multiplier * 100).toFixed(0)}%`
                          }
                        </td>
                      ))}
                    </tr>

                    {/* Median Base Pay */}
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>Median Base Pay</td>
                      {compareResults.map((res: any, idx: number) => {
                        const prof = res.profile;
                        return (
                          <td key={idx} style={{ padding: '12px 8px' }}>
                            {prof ? (
                              <strong style={{ color: 'var(--accent-azure)', fontSize: '16px' }}>
                                {formatCurrency(prof.baseMid, true)}
                              </strong>
                            ) : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Pay Range (Min-Max) */}
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>Total Base Pay Range</td>
                      {compareResults.map((res: any, idx: number) => {
                        const prof = res.profile;
                        return (
                          <td key={idx} style={{ padding: '12px 8px' }}>
                            {prof ? (
                              <span>{formatCurrency(prof.baseMin, true)} – {formatCurrency(prof.baseMax, true)}</span>
                            ) : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Comp splits */}
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>Package Splits</td>
                      {compareResults.map((res: any, idx: number) => {
                        const prof = res.profile;
                        return (
                          <td key={idx} style={{ padding: '12px 8px' }}>
                            {prof ? (
                              <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span>Base: <strong>{prof.breakdown.base}%</strong></span>
                                <span>Bonus: <strong>{prof.breakdown.bonus}%</strong></span>
                                <span>Equity: <strong>{prof.breakdown.equity}%</strong></span>
                              </div>
                            ) : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Skill Premiums */}
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>Top Premiums</td>
                      {compareResults.map((res: any, idx: number) => {
                        const prof = res.profile;
                        return (
                          <td key={idx} style={{ padding: '12px 8px' }}>
                            {prof ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {prof.skills.slice(0, 2).map((s: any) => (
                                  <span key={s.skill} style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#0e7d55', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
                                    {s.skill} (+{s.premiumPct}%)
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Top paying comp */}
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>Top Payer</td>
                      {compareResults.map((res: any, idx: number) => {
                        const prof = res.profile;
                        if (!prof || !prof.companies || prof.companies.length === 0) return <td key={idx}>-</td>;
                        const topComp = prof.companies.sort((a: any, b: any) => b.avgSalary - a.avgSalary)[0];
                        return (
                          <td key={idx} style={{ padding: '12px 8px' }}>
                            <span>{topComp.company} ({formatCurrency(topComp.avgSalary, true)})</span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--vij-text-muted)' }}>
                No comparison configurations established. Select items to compare above.
              </div>
            )}
          </GlassCard>
        )}

        {/* ALERT SETTINGS MODAL */}
        {isAlertModalOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.4)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <GlassCard style={{ padding: '24px', width: '90%', maxWidth: '400px' }} tilt={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Set Salary alert</h4>
                <button 
                  onClick={() => setIsAlertModalOpen(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAlert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--vij-text-muted)', display: 'block' }}>Job Profile</span>
                  <strong style={{ fontSize: '14px' }}>{searchQuery}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--vij-text-muted)', display: 'block' }}>Location Focus</span>
                  <strong style={{ fontSize: '14px' }}>{selectedCity}, {selectedState}</strong>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--vij-text-muted)', display: 'block', marginBottom: '6px' }}>
                    Notify me when average pay changes by more than:
                  </label>
                  <select 
                    value={alertThreshold} 
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="glass-select"
                    style={{ width: '100%' }}
                  >
                    <option value="2">2% fluctuation</option>
                    <option value="5">5% fluctuation</option>
                    <option value="10">10% fluctuation</option>
                    <option value="15">15% fluctuation</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'var(--accent-azure)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    marginTop: '10px'
                  }}
                >
                  Activate Alert
                </button>
              </form>
            </GlassCard>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
