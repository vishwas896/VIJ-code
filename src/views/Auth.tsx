'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Mail, Lock, User, CheckCircle2,
  Code2, Palette, Megaphone, Landmark, HeartPulse, BarChart3,
  TrendingUp, Settings2, Building2, Phone, Globe, Briefcase,
  GraduationCap, Star, AlertCircle
} from 'lucide-react';
import { VijLogo } from '../components/VijLogo';
import { useAuth, type UserDomain } from '../context/AuthContext';
import './Auth.css';

/* ── Types ── */
type SeekerType = 'fresher' | 'student' | 'professional' | '';

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'rediffmail.com', 'ymail.com', 'aol.com', 'protonmail.com', 'live.com',
];

const domainOptions: { value: UserDomain; label: string; icon: React.ReactNode }[] = [
  { value: 'engineering',  label: 'Engineering',  icon: <Code2 size={15} /> },
  { value: 'design',       label: 'Design',        icon: <Palette size={15} /> },
  { value: 'marketing',    label: 'Marketing',     icon: <Megaphone size={15} /> },
  { value: 'finance',      label: 'Finance',       icon: <Landmark size={15} /> },
  { value: 'healthcare',   label: 'Healthcare',    icon: <HeartPulse size={15} /> },
  { value: 'sales',        label: 'Sales',         icon: <TrendingUp size={15} /> },
  { value: 'data-science', label: 'Data Science',  icon: <BarChart3 size={15} /> },
  { value: 'operations',   label: 'Operations',    icon: <Settings2 size={15} /> },
];

const industryOptions = [
  'Technology & Software', 'Finance & Banking', 'Healthcare & Pharma',
  'E-Commerce & Retail', 'Consulting & Advisory', 'Media & Entertainment',
  'Education & EdTech', 'Manufacturing & Industrial', 'Government & Public Sector',
  'Automotive', 'Telecom & Networking', 'Real Estate',
];

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/news', label: 'News' },
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/network', label: 'Network' },
  { to: '/services', label: 'Services' },
];

function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return PERSONAL_EMAIL_DOMAINS.includes(domain);
}

export const Auth: React.FC = () => {
  const pathname   = usePathname();
  const router    = useRouter();
  const { login, updateProfile } = useAuth();
  const isLogin   = pathname === '/login';

  /* ── Role ── */
  const [role, setRole] = useState<'seeker' | 'recruiter'>('seeker');

  /* ── Seeker state ── */
  const [seekerType, setSeekerType]  = useState<SeekerType>('');
  const [domain, setDomain]          = useState<UserDomain>('engineering');
  const [industry, setIndustry]      = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [college, setCollege]        = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [course, setCourse]          = useState('');

  /* ── Recruiter state ── */
  const [companyName, setCompanyName]     = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyPhone, setCompanyPhone]   = useState('');
  const [hiringDomain, setHiringDomain]   = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [emailError, setEmailError]       = useState('');

  /* ── Shared ── */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* validate recruiter email on change */
  useEffect(() => {
    if (role === 'recruiter' && !isLogin && recruiterEmail) {
      if (isPersonalEmail(recruiterEmail)) {
        setEmailError('Please use a business email address (e.g. name@company.com)');
      } else {
        setEmailError('');
      }
    }
  }, [recruiterEmail, role, isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'recruiter' && !isLogin && isPersonalEmail(recruiterEmail)) {
      setEmailError('Business email required for recruiter accounts.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      login(role, domain);
      if (!isLogin) {
        updateProfile({ currentCompany, industry });
      }
      router.push(role === 'recruiter' ? '/recruiter/dashboard' : '/onboarding/parameters');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="auth-root">

      {/* ══════ GLOBAL HEADER (same as MainLayout) ══════ */}
      <header className="global-header">
        <Link href="/" className="logo-container">
          <VijLogo size="sm" theme="light" showText />
        </Link>

        <nav className="global-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              href={link.to}
              className={`nav-link ${pathname === link.to ? 'nav-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-utilities">
          <Link href="/login"    className="login-trigger-btn">Log In</Link>
          <Link href="/register" className="join-nav-btn">Join Junction</Link>
        </div>
      </header>

      {/* ══════ BODY ══════ */}
      <div className="auth-body">

        {/* ── Left pane ── */}
        <div className="auth-left-pane">
          <div className="auth-left-photos">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop" alt="Team working" className="auth-bg-photo" />
            <div className="auth-left-photo-overlay" />
          </div>
          <div className="auth-left-content">
            <div className="auth-left-badge">🚀 Trusted by 50k+ Professionals</div>
            <h1 className="auth-left-title">
              The Smartest Way<br />to <span className="auth-left-accent">Find &amp; Hire</span>
            </h1>
            <p className="auth-left-sub">
              VIJ connects job seekers with top companies using intelligent matching.
              Join the platform and get discovered by the right people.
            </p>
            <div className="auth-left-photo-row">
              <div className="auth-mini-photo">
                <img src="https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=200&q=80&auto=format&fit=crop" alt="Work from home" />
                <span>WFH Ready</span>
              </div>
              <div className="auth-mini-photo">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop" alt="Professional" />
                <span>Top Talent</span>
              </div>
              <div className="auth-mini-photo">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&q=80&auto=format&fit=crop" alt="Office team" />
                <span>Great Teams</span>
              </div>
            </div>
            <div className="auth-left-stats">
              <div className="auth-stat-box">
                <div className="auth-stat-num">1,284</div>
                <div className="auth-stat-label">Live Matches Today</div>
              </div>
              <div className="auth-stat-box">
                <div className="auth-stat-num">450+</div>
                <div className="auth-stat-label">Active Companies</div>
              </div>
              <div className="auth-stat-box">
                <div className="auth-stat-num">98%</div>
                <div className="auth-stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right pane ── */}
        <div className="auth-right-pane">
          <div className="auth-form-card">

            {/* Tab bar */}
            <div className="auth-tab-bar">
              <Link href="/login"    className={`auth-tab ${isLogin  ? 'active' : ''}`}>Log In</Link>
              <Link href="/register" className={`auth-tab ${!isLogin ? 'active' : ''}`}>Sign Up</Link>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>

              {/* ── SIGN UP role toggle ── */}
              {!isLogin && (
                <div className="auth-role-toggle">
                  <button type="button" className={`auth-role-btn ${role==='seeker'?'active':''}`} onClick={()=>setRole('seeker')}>
                    <Briefcase size={15}/> Job Seeker
                  </button>
                  <button type="button" className={`auth-role-btn ${role==='recruiter'?'active':''}`} onClick={()=>setRole('recruiter')}>
                    <Building2 size={15}/> Recruiter
                  </button>
                </div>
              )}

              {/* ── Common name fields (signup only) ── */}
              {!isLogin && (
                <div className="auth-field-row">
                  <div className="auth-field">
                    <User size={15} className="auth-field-icon"/>
                    <input type="text" placeholder="First Name" required/>
                  </div>
                  <div className="auth-field">
                    <input type="text" placeholder="Last Name" required/>
                  </div>
                </div>
              )}

              {/* Email — recruiter gets separate controlled field */}
              {role === 'recruiter' && !isLogin ? (
                <div>
                  <div className={`auth-field ${emailError ? 'auth-field-error' : ''}`}>
                    <Mail size={15} className="auth-field-icon"/>
                    <input
                      type="email"
                      placeholder="Business Email (e.g. hr@company.com)"
                      value={recruiterEmail}
                      onChange={e => setRecruiterEmail(e.target.value)}
                      required
                    />
                  </div>
                  {emailError && (
                    <div className="auth-error-msg">
                      <AlertCircle size={13}/> {emailError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-field">
                  <Mail size={15} className="auth-field-icon"/>
                  <input type="email" placeholder="Email Address" required/>
                </div>
              )}

              <div className="auth-field">
                <Lock size={15} className="auth-field-icon"/>
                <input type="password" placeholder={isLogin ? 'Password' : 'Create Password'} required/>
              </div>

              {/* ════ JOB SEEKER FIELDS ════ */}
              {!isLogin && role === 'seeker' && (
                <>
                  {/* Step 1: Industry/Domain selector */}
                  <div className="auth-section-label">Your Industry / Domain</div>
                  <div className="auth-field">
                    <Briefcase size={15} className="auth-field-icon"/>
                    <select
                      className="auth-select"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      required
                    >
                      <option value="">Select your industry…</option>
                      {industryOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Domain chips */}
                  {industry && (
                    <>
                      <div className="auth-domain-grid">
                        {domainOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            className={`auth-domain-chip ${domain===opt.value?'active':''}`}
                            onClick={() => setDomain(opt.value)}
                          >
                            {opt.icon} {opt.label}
                            {domain===opt.value && <CheckCircle2 size={11} className="chip-check"/>}
                          </button>
                        ))}
                      </div>

                      {/* Step 2: Experience type */}
                      <div className="auth-section-label">I am a…</div>
                      <div className="auth-seeker-type-row">
                        {[
                          { id: 'fresher',      label: 'Fresh Graduate',      icon: <GraduationCap size={18}/> },
                          { id: 'student',      label: 'Student',             icon: <Star size={18}/> },
                          { id: 'professional', label: 'Working Professional', icon: <Briefcase size={18}/> },
                        ].map(t => (
                          <button
                            key={t.id}
                            type="button"
                            className={`auth-seeker-type-btn ${seekerType===t.id?'active':''}`}
                            onClick={() => setSeekerType(t.id as SeekerType)}
                          >
                            {t.icon}
                            <span>{t.label}</span>
                            {seekerType===t.id && <CheckCircle2 size={12} className="type-check"/>}
                          </button>
                        ))}
                      </div>

                      {/* Step 3: Contextual fields based on seeker type */}
                      {seekerType === 'fresher' && (
                        <>
                          <div className="auth-section-label">Education Details</div>
                          <div className="auth-field">
                            <GraduationCap size={15} className="auth-field-icon"/>
                            <input
                              type="text"
                              placeholder="College / University"
                              value={college}
                              onChange={e => setCollege(e.target.value)}
                            />
                          </div>
                          <div className="auth-field-row">
                            <div className="auth-field">
                              <input
                                type="text"
                                placeholder="Degree / Course (e.g. B.Tech CSE)"
                                value={course}
                                onChange={e => setCourse(e.target.value)}
                              />
                            </div>
                            <div className="auth-field">
                              <input
                                type="number"
                                placeholder="Graduation Year"
                                min="2020"
                                max="2030"
                                value={graduationYear}
                                onChange={e => setGraduationYear(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {seekerType === 'student' && (
                        <>
                          <div className="auth-section-label">Academic Details</div>
                          <div className="auth-field">
                            <GraduationCap size={15} className="auth-field-icon"/>
                            <input
                              type="text"
                              placeholder="College / University"
                              value={college}
                              onChange={e => setCollege(e.target.value)}
                            />
                          </div>
                          <div className="auth-field">
                            <input
                              type="text"
                              placeholder="Current Course / Year (e.g. 3rd Year B.Tech)"
                              value={course}
                              onChange={e => setCourse(e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      {seekerType === 'professional' && (
                        <>
                          <div className="auth-section-label">Employment Details <span className="auth-optional">(optional)</span></div>
                          <div className="auth-field">
                            <Building2 size={15} className="auth-field-icon"/>
                            <input
                              type="text"
                              placeholder="Current Company (e.g. Google, TCS)"
                              value={currentCompany}
                              onChange={e => setCurrentCompany(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {/* ════ RECRUITER FIELDS ════ */}
              {!isLogin && role === 'recruiter' && (
                <>
                  <div className="auth-section-label">Company Information</div>
                  <div className="auth-field">
                    <Building2 size={15} className="auth-field-icon"/>
                    <input
                      type="text"
                      placeholder="Company Name *"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="auth-field">
                    <Globe size={15} className="auth-field-icon"/>
                    <input
                      type="url"
                      placeholder="Company Website (e.g. https://company.com)"
                      value={companyWebsite}
                      onChange={e => setCompanyWebsite(e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <Phone size={15} className="auth-field-icon"/>
                    <input
                      type="tel"
                      placeholder="Contact Phone Number"
                      value={companyPhone}
                      onChange={e => setCompanyPhone(e.target.value)}
                    />
                  </div>

                  <div className="auth-section-label">Hiring Focus</div>
                  <div className="auth-field">
                    <Briefcase size={15} className="auth-field-icon"/>
                    <select
                      className="auth-select"
                      value={hiringDomain}
                      onChange={e => setHiringDomain(e.target.value)}
                    >
                      <option value="">Primary domain you hire for…</option>
                      {domainOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="auth-field">
                    <Building2 size={15} className="auth-field-icon"/>
                    <select
                      className="auth-select"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                    >
                      <option value="">Company industry…</option>
                      {industryOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-info-banner">
                    <AlertCircle size={14}/>
                    Only business email addresses are accepted for recruiter accounts (no Gmail/Yahoo etc.)
                  </div>
                </>
              )}

              {/* Forgot password */}
              {isLogin && (
                <div className="auth-forgot-row">
                  <button type="button" className="auth-forgot-link">Forgot Password?</button>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                {isSubmitting
                  ? <span className="auth-spinner"/>
                  : isLogin
                    ? 'Log In to VIJ'
                    : role === 'recruiter'
                      ? 'Create Recruiter Account'
                      : 'Join as Job Seeker'}
              </button>

              <p className="auth-switch-text">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link href={isLogin ? '/register' : '/login'} className="auth-switch-link">
                  {isLogin ? 'Sign up free' : 'Log in here'}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

