// ═══════════════════════════════════════════════════════════
// VIJ Recruiter Ecosystem — Central Data Store
// ═══════════════════════════════════════════════════════════

export interface Company {
  slug: string;
  name: string;
  industry: string;
  size: string;
  headquarters: string;
  website: string;
  logo: string;
  description: string;
  mission: string;
  culture: string;
  benefits: string[];
  techStack: string[];
  socialLinks: { linkedin?: string; twitter?: string; github?: string };
  verificationStatus: 'verified' | 'pending' | 'unverified';
  hiringStatus: 'actively-hiring' | 'paused' | 'closed';
  employeeCount: number;
  foundedYear: number;
  responseRate: number; // percentage
  avgHiringDays: number;
}

export interface JobEligibility {
  hard: {
    skills: string[];
    experienceYears: number;
    education: string;
    certifications: string[];
  };
  preferred: {
    skills: string[];
    certifications: string[];
  };
  portfolioRequired?: boolean;
}

export interface ApplicationAnalytics {
  viewed: number;
  applied: number;
  shortlisted: number;
  interviewed: number;
  rejected: number;
  ineligible: number;
}

export interface JobPost {
  id: number;
  companySlug: string;
  recruiterId: string;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  department: string;
  eligibility: JobEligibility;
  perks: string[];
  screeningQuestions: string[];
  aiAutoShortlist: boolean;
  postedAt: string;
  status: 'active' | 'paused' | 'closed';
  analytics: ApplicationAnalytics;
}

export interface Application {
  id: number;
  jobId: number;
  seekerId: string;
  seekerName: string;
  matchScore: number;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedAt: string;
  skills: string[];
}

// ═══════════════════════════════════════════════════════════
// MOCK COMPANIES
// ═══════════════════════════════════════════════════════════

export const mockCompanies: Company[] = [
  {
    slug: 'google',
    name: 'Google',
    industry: 'Technology',
    size: '10,000+',
    headquarters: 'Mountain View, CA',
    website: 'https://google.com',
    logo: 'G',
    description: 'Google LLC is a global technology leader specializing in internet-related services and products, including search, cloud computing, software, and hardware.',
    mission: 'To organize the world\'s information and make it universally accessible and useful.',
    culture: 'Innovation-driven, collaborative, and employee-first. Known for 20% time policy and open culture.',
    benefits: ['Health Insurance', 'Free Meals', '401(k) Matching', 'Parental Leave', 'Learning Budget', 'Gym Membership'],
    techStack: ['Go', 'Python', 'Java', 'Kubernetes', 'TensorFlow', 'Angular', 'gRPC'],
    socialLinks: { linkedin: 'google', twitter: 'Google', github: 'google' },
    verificationStatus: 'verified',
    hiringStatus: 'actively-hiring',
    employeeCount: 182000,
    foundedYear: 1998,
    responseRate: 92,
    avgHiringDays: 28,
  },
  {
    slug: 'stripe',
    name: 'Stripe',
    industry: 'Fintech',
    size: '5,000 - 10,000',
    headquarters: 'San Francisco, CA',
    website: 'https://stripe.com',
    logo: 'S',
    description: 'Stripe is a financial infrastructure platform for the internet. Millions of companies use Stripe to accept payments, grow revenue, and accelerate new business opportunities.',
    mission: 'Increase the GDP of the internet.',
    culture: 'Writing-heavy culture, rigorous engineering, meritocratic decision-making.',
    benefits: ['Equity Grants', 'Remote Flexibility', 'Health & Dental', 'Learning Stipend', 'Home Office Budget'],
    techStack: ['Ruby', 'Go', 'React', 'TypeScript', 'Scala', 'AWS', 'Terraform'],
    socialLinks: { linkedin: 'stripe', twitter: 'stripe', github: 'stripe' },
    verificationStatus: 'verified',
    hiringStatus: 'actively-hiring',
    employeeCount: 8000,
    foundedYear: 2010,
    responseRate: 88,
    avgHiringDays: 21,
  },
  {
    slug: 'notion',
    name: 'Notion',
    industry: 'Productivity SaaS',
    size: '1,000 - 5,000',
    headquarters: 'San Francisco, CA',
    website: 'https://notion.so',
    logo: 'N',
    description: 'Notion is an all-in-one workspace for notes, docs, wikis, and project management. Used by teams of all sizes to collaborate and stay organized.',
    mission: 'Make toolmaking ubiquitous.',
    culture: 'Craft-focused, design-driven, and deeply intentional about user experience.',
    benefits: ['Unlimited PTO', 'Health Coverage', 'Wellness Stipend', 'Team Retreats', 'Education Budget'],
    techStack: ['React', 'TypeScript', 'Kotlin', 'PostgreSQL', 'Redis', 'AWS'],
    socialLinks: { linkedin: 'notionhq', twitter: 'NotionHQ', github: 'notion' },
    verificationStatus: 'verified',
    hiringStatus: 'actively-hiring',
    employeeCount: 2800,
    foundedYear: 2013,
    responseRate: 95,
    avgHiringDays: 18,
  },
  {
    slug: 'figma',
    name: 'Figma',
    industry: 'Design Tools',
    size: '1,000 - 5,000',
    headquarters: 'San Francisco, CA',
    website: 'https://figma.com',
    logo: 'F',
    description: 'Figma is a collaborative interface design tool used by design teams around the world. It enables real-time collaboration for design and prototyping.',
    mission: 'Make design accessible to all.',
    culture: 'Community-driven, creative, and deeply collaborative. Strong design culture.',
    benefits: ['Flexible Work', 'Design Conferences', 'Stock Options', 'Health & Dental', 'Parental Leave'],
    techStack: ['TypeScript', 'C++', 'WebAssembly', 'React', 'Rust', 'WebGL'],
    socialLinks: { linkedin: 'figma', twitter: 'figma', github: 'figma' },
    verificationStatus: 'verified',
    hiringStatus: 'actively-hiring',
    employeeCount: 1500,
    foundedYear: 2012,
    responseRate: 91,
    avgHiringDays: 22,
  },
  {
    slug: 'vercel',
    name: 'Vercel',
    industry: 'Developer Tools',
    size: '500 - 1,000',
    headquarters: 'San Francisco, CA',
    website: 'https://vercel.com',
    logo: 'V',
    description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
    mission: 'Enable developers to build the web, faster.',
    culture: 'Open-source first, remote-friendly, obsessed with developer experience.',
    benefits: ['Fully Remote', 'Stock Options', 'Learning Budget', 'Equipment Stipend', 'Unlimited PTO'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Go', 'Rust', 'Turborepo', 'Edge Functions'],
    socialLinks: { linkedin: 'vercel', twitter: 'vercel', github: 'vercel' },
    verificationStatus: 'verified',
    hiringStatus: 'actively-hiring',
    employeeCount: 750,
    foundedYear: 2015,
    responseRate: 94,
    avgHiringDays: 16,
  },
];

// ═══════════════════════════════════════════════════════════
// MOCK JOB POSTS
// ═══════════════════════════════════════════════════════════

export const mockJobPosts: JobPost[] = [
  {
    id: 101, companySlug: 'google', recruiterId: 'REC-001',
    title: 'Senior Software Engineer (Platform)', description: 'Lead the architecture of Google Cloud\'s next-generation platform services. Build distributed systems at massive scale.',
    salaryMin: 180000, salaryMax: 260000, location: 'Mountain View, CA', workType: 'hybrid', department: 'Engineering',
    eligibility: {
      hard: { skills: ['Go', 'Kubernetes', 'Distributed Systems'], experienceYears: 5, education: 'B.Tech', certifications: [] },
      preferred: { skills: ['Python', 'TensorFlow', 'gRPC'], certifications: ['Google Cloud Professional'] },
    },
    perks: ['Health Insurance', 'Free Meals', 'Gym', '401k Match'], screeningQuestions: ['Describe a distributed system you built.'], aiAutoShortlist: true,
    postedAt: '2026-05-25', status: 'active',
    analytics: { viewed: 3240, applied: 412, shortlisted: 89, interviewed: 34, rejected: 120, ineligible: 203 },
  },
  {
    id: 102, companySlug: 'google', recruiterId: 'REC-001',
    title: 'UX Designer — Search', description: 'Reimagine the search experience for billions of users. Work with product, engineering, and research teams.',
    salaryMin: 140000, salaryMax: 200000, location: 'New York, NY', workType: 'hybrid', department: 'Design',
    eligibility: {
      hard: { skills: ['Figma', 'User Research', 'Design Systems'], experienceYears: 3, education: 'Bachelor\'s', certifications: [] },
      preferred: { skills: ['Prototyping', 'Motion Design', 'Accessibility'], certifications: [] },
    },
    perks: ['Health Insurance', 'Free Meals', 'Design Conferences'], screeningQuestions: [], aiAutoShortlist: false,
    postedAt: '2026-05-24', status: 'active',
    analytics: { viewed: 1890, applied: 278, shortlisted: 56, interviewed: 22, rejected: 98, ineligible: 124 },
  },
  {
    id: 103, companySlug: 'stripe', recruiterId: 'REC-002',
    title: 'Full Stack Engineer — Payments', description: 'Build and scale the world\'s most reliable payment infrastructure. Own end-to-end features from API design to deployment.',
    salaryMin: 170000, salaryMax: 240000, location: 'San Francisco, CA', workType: 'hybrid', department: 'Engineering',
    eligibility: {
      hard: { skills: ['React', 'TypeScript', 'Ruby'], experienceYears: 4, education: 'B.Tech', certifications: [] },
      preferred: { skills: ['Go', 'AWS', 'GraphQL'], certifications: ['AWS Solutions Architect'] },
    },
    perks: ['Equity', 'Remote Flex', 'Learning Stipend'], screeningQuestions: ['How would you design an idempotent payment API?'], aiAutoShortlist: true,
    postedAt: '2026-05-26', status: 'active',
    analytics: { viewed: 2418, applied: 348, shortlisted: 127, interviewed: 52, rejected: 89, ineligible: 132 },
  },
  {
    id: 104, companySlug: 'stripe', recruiterId: 'REC-002',
    title: 'Data Scientist — Fraud Detection', description: 'Build ML models to detect and prevent fraudulent transactions across Stripe\'s global network.',
    salaryMin: 160000, salaryMax: 230000, location: 'Remote', workType: 'remote', department: 'Data Science',
    eligibility: {
      hard: { skills: ['Python', 'Machine Learning', 'SQL'], experienceYears: 3, education: 'Master\'s', certifications: [] },
      preferred: { skills: ['PyTorch', 'Spark', 'Fraud Detection'], certifications: ['AWS ML Specialty'] },
    },
    perks: ['Equity', 'Fully Remote', 'Conference Budget'], screeningQuestions: [], aiAutoShortlist: true,
    postedAt: '2026-05-23', status: 'active',
    analytics: { viewed: 1560, applied: 198, shortlisted: 45, interviewed: 18, rejected: 67, ineligible: 86 },
  },
  {
    id: 105, companySlug: 'notion', recruiterId: 'REC-003',
    title: 'Senior Frontend Engineer', description: 'Craft pixel-perfect, performant interfaces for Notion\'s web and desktop applications.',
    salaryMin: 165000, salaryMax: 220000, location: 'San Francisco, CA', workType: 'hybrid', department: 'Engineering',
    eligibility: {
      hard: { skills: ['React', 'TypeScript', 'CSS'], experienceYears: 4, education: 'B.Tech', certifications: [] },
      preferred: { skills: ['Performance Optimization', 'Accessibility', 'Design Systems'], certifications: [] },
    },
    perks: ['Unlimited PTO', 'Health Coverage', 'Team Retreats'], screeningQuestions: ['What\'s your approach to component architecture?'], aiAutoShortlist: false,
    postedAt: '2026-05-25', status: 'active',
    analytics: { viewed: 2100, applied: 310, shortlisted: 78, interviewed: 30, rejected: 102, ineligible: 130 },
  },
  {
    id: 106, companySlug: 'notion', recruiterId: 'REC-003',
    title: 'Product Manager — AI Features', description: 'Define the roadmap for Notion AI. Work with engineering and design to ship intelligent productivity features.',
    salaryMin: 175000, salaryMax: 250000, location: 'San Francisco, CA', workType: 'hybrid', department: 'Product',
    eligibility: {
      hard: { skills: ['Product Strategy', 'Data Analysis', 'AI/ML Knowledge'], experienceYears: 5, education: 'Bachelor\'s', certifications: [] },
      preferred: { skills: ['SQL', 'User Research', 'Agile'], certifications: ['Certified Scrum Product Owner'] },
    },
    perks: ['Unlimited PTO', 'Wellness Stipend', 'Learning Budget'], screeningQuestions: [], aiAutoShortlist: false,
    postedAt: '2026-05-22', status: 'active',
    analytics: { viewed: 980, applied: 145, shortlisted: 32, interviewed: 14, rejected: 56, ineligible: 57 },
  },
  {
    id: 107, companySlug: 'figma', recruiterId: 'REC-004',
    title: 'Design Engineer', description: 'Bridge the gap between design and engineering. Build interactive prototypes and design system components.',
    salaryMin: 155000, salaryMax: 210000, location: 'Remote', workType: 'remote', department: 'Design Engineering',
    eligibility: {
      hard: { skills: ['React', 'CSS', 'Figma'], experienceYears: 3, education: 'Bachelor\'s', certifications: [] },
      preferred: { skills: ['WebGL', 'Animation', 'TypeScript'], certifications: [] },
    },
    perks: ['Flexible Work', 'Stock Options', 'Design Conferences'], screeningQuestions: ['Show us a design system you built.'], aiAutoShortlist: true,
    postedAt: '2026-05-26', status: 'active',
    analytics: { viewed: 1750, applied: 267, shortlisted: 62, interviewed: 25, rejected: 88, ineligible: 117 },
  },
  {
    id: 108, companySlug: 'figma', recruiterId: 'REC-004',
    title: 'Backend Engineer — Collaboration', description: 'Build the real-time collaboration engine powering Figma\'s multiplayer design experience.',
    salaryMin: 170000, salaryMax: 240000, location: 'San Francisco, CA', workType: 'hybrid', department: 'Engineering',
    eligibility: {
      hard: { skills: ['Rust', 'C++', 'WebSocket'], experienceYears: 4, education: 'B.Tech', certifications: [] },
      preferred: { skills: ['WebAssembly', 'CRDT', 'Distributed Systems'], certifications: [] },
    },
    perks: ['Health & Dental', 'Equity', 'Parental Leave'], screeningQuestions: [], aiAutoShortlist: false,
    postedAt: '2026-05-24', status: 'active',
    analytics: { viewed: 890, applied: 112, shortlisted: 28, interviewed: 12, rejected: 42, ineligible: 42 },
  },
  {
    id: 109, companySlug: 'vercel', recruiterId: 'REC-005',
    title: 'Developer Experience Engineer', description: 'Improve the developer experience of Next.js and the Vercel platform. Write docs, build examples, and shape APIs.',
    salaryMin: 150000, salaryMax: 200000, location: 'Remote', workType: 'remote', department: 'DX',
    eligibility: {
      hard: { skills: ['Next.js', 'React', 'TypeScript'], experienceYears: 3, education: 'Bachelor\'s', certifications: [] },
      preferred: { skills: ['Technical Writing', 'Open Source', 'Node.js'], certifications: [] },
    },
    perks: ['Fully Remote', 'Stock Options', 'Equipment Stipend'], screeningQuestions: ['Link to an open-source contribution you\'re proud of.'], aiAutoShortlist: true,
    postedAt: '2026-05-26', status: 'active',
    analytics: { viewed: 2890, applied: 456, shortlisted: 98, interviewed: 40, rejected: 156, ineligible: 202 },
  },
  {
    id: 110, companySlug: 'vercel', recruiterId: 'REC-005',
    title: 'Infrastructure Engineer — Edge Runtime', description: 'Build and scale Vercel\'s globally distributed edge runtime powering millions of deployments.',
    salaryMin: 180000, salaryMax: 260000, location: 'Remote', workType: 'remote', department: 'Infrastructure',
    eligibility: {
      hard: { skills: ['Rust', 'Go', 'Distributed Systems'], experienceYears: 5, education: 'B.Tech', certifications: [] },
      preferred: { skills: ['V8', 'Edge Computing', 'Terraform'], certifications: ['AWS Solutions Architect'] },
    },
    perks: ['Fully Remote', 'Unlimited PTO', 'Learning Budget'], screeningQuestions: [], aiAutoShortlist: true,
    postedAt: '2026-05-21', status: 'active',
    analytics: { viewed: 1240, applied: 167, shortlisted: 38, interviewed: 16, rejected: 58, ineligible: 71 },
  },
];

// ═══════════════════════════════════════════════════════════
// MOCK APPLICATIONS
// ═══════════════════════════════════════════════════════════

export const mockApplications: Application[] = [
  { id: 1, jobId: 103, seekerId: 'USR-1001', seekerName: 'Alice Walker', matchScore: 94, status: 'interview', appliedAt: '2026-05-26', skills: ['React', 'TypeScript', 'Ruby', 'Go'] },
  { id: 2, jobId: 103, seekerId: 'USR-1002', seekerName: 'David Chen', matchScore: 88, status: 'screening', appliedAt: '2026-05-26', skills: ['React', 'TypeScript', 'Python'] },
  { id: 3, jobId: 103, seekerId: 'USR-1003', seekerName: 'Sarah Kim', matchScore: 82, status: 'new', appliedAt: '2026-05-27', skills: ['React', 'JavaScript', 'Ruby'] },
  { id: 4, jobId: 103, seekerId: 'USR-1004', seekerName: 'James Rodriguez', matchScore: 76, status: 'new', appliedAt: '2026-05-27', skills: ['Vue', 'TypeScript', 'Ruby'] },
  { id: 5, jobId: 105, seekerId: 'USR-1001', seekerName: 'Alice Walker', matchScore: 97, status: 'offer', appliedAt: '2026-05-25', skills: ['React', 'TypeScript', 'CSS', 'Performance Optimization'] },
  { id: 6, jobId: 109, seekerId: 'USR-1005', seekerName: 'Emily Zhang', matchScore: 91, status: 'interview', appliedAt: '2026-05-26', skills: ['Next.js', 'React', 'TypeScript', 'Technical Writing'] },
  { id: 7, jobId: 101, seekerId: 'USR-1006', seekerName: 'Michael Scott', matchScore: 72, status: 'rejected', appliedAt: '2026-05-24', skills: ['Python', 'Java'] },
  { id: 8, jobId: 107, seekerId: 'USR-1007', seekerName: 'Priya Sharma', matchScore: 85, status: 'screening', appliedAt: '2026-05-26', skills: ['React', 'CSS', 'Figma', 'Animation'] },
];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getCompanyBySlug(slug: string): Company | undefined {
  // Check localStorage for recruiter-created companies first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('vij_companies');
    if (stored) {
      try {
        const custom: Company[] = JSON.parse(stored);
        const found = custom.find(c => c.slug === slug);
        if (found) return found;
      } catch { /* ignore */ }
    }
  }
  return mockCompanies.find(c => c.slug === slug);
}

export function getAllCompanies(): Company[] {
  const base = [...mockCompanies];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('vij_companies');
    if (stored) {
      try {
        const custom: Company[] = JSON.parse(stored);
        base.push(...custom);
      } catch { /* ignore */ }
    }
  }
  return base;
}

export function getJobsByCompany(companySlug: string): JobPost[] {
  return getAllJobPosts().filter(j => j.companySlug === companySlug && j.status === 'active');
}

export function getJobById(id: number): JobPost | undefined {
  return getAllJobPosts().find(j => j.id === id);
}

export function getAllJobPosts(): JobPost[] {
  const base = [...mockJobPosts];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('vij_jobs');
    if (stored) {
      try {
        const custom: JobPost[] = JSON.parse(stored);
        base.push(...custom);
      } catch { /* ignore */ }
    }
  }
  return base;
}

export function getApplicationsForJob(jobId: number): Application[] {
  return mockApplications.filter(a => a.jobId === jobId);
}

export function saveCompany(company: Company): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('vij_companies');
  const list: Company[] = stored ? JSON.parse(stored) : [];
  const existing = list.findIndex(c => c.slug === company.slug);
  if (existing >= 0) list[existing] = company;
  else list.push(company);
  localStorage.setItem('vij_companies', JSON.stringify(list));
}

export function saveJobPost(job: JobPost): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('vij_jobs');
  const list: JobPost[] = stored ? JSON.parse(stored) : [];
  const existing = list.findIndex(j => j.id === job.id);
  if (existing >= 0) list[existing] = job;
  else list.push(job);
  localStorage.setItem('vij_jobs', JSON.stringify(list));
}
