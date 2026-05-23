export interface RoadmapNode {
  id: string;
  title: string;
  desc: string;
  skills: string[];
  certs?: string[];
  milestone: string;
  duration: string;
}

export interface Roadmap {
  id: string;
  sector: 'IT' | 'Finance' | 'Marketing' | 'HR' | 'Healthcare';
  domain: string;
  level: 'Entry' | 'Mid' | 'Senior';
  title: string;
  description: string;
  iconId: string;
  likes: number;
  saves: number;
  learners: number;
  nodes: RoadmapNode[];
}

export const ROADMAP_DATABASE: Roadmap[] = [
  // --- IT SECTOR ---
  {
    id: 'it-frontend-entry',
    sector: 'IT',
    domain: 'Frontend',
    level: 'Entry',
    title: 'Frontend Developer (Entry)',
    description: 'Master the visual layer of the web and build interactive user interfaces.',
    iconId: 'Globe',
    likes: 1240,
    saves: 850,
    learners: 3200,
    nodes: [
      {
        id: 'fe-e-1',
        title: 'The Web Foundation',
        desc: 'Learn how browsers work, HTTP basics, and semantic HTML.',
        skills: ['HTML5', 'Semantic Tags', 'Accessibility (A11y)'],
        milestone: 'Build a multi-page semantic website.',
        duration: '2-4 Weeks'
      },
      {
        id: 'fe-e-2',
        title: 'Styling & Layout',
        desc: 'Master CSS architecture, Flexbox, and Grid systems.',
        skills: ['CSS3', 'Flexbox', 'Grid', 'Responsive Design'],
        certs: ['FreeCodeCamp Responsive Web Design'],
        milestone: 'Clone a landing page exactly.',
        duration: '4-6 Weeks'
      },
      {
        id: 'fe-e-3',
        title: 'Modern JavaScript',
        desc: 'Logic, DOM manipulation, and asynchronous programming.',
        skills: ['ES6+', 'Fetch API', 'Promises', 'JSON'],
        milestone: 'Build a weather app using a public API.',
        duration: '6-8 Weeks'
      }
    ]
  },
  {
    id: 'it-ai-mid',
    sector: 'IT',
    domain: 'AI/ML',
    level: 'Mid',
    title: 'AI/ML Engineer (Mid)',
    description: 'Transition from model training to production-grade AI systems.',
    iconId: 'Cpu',
    likes: 2100,
    saves: 1400,
    learners: 1100,
    nodes: [
      {
        id: 'ai-m-1',
        title: 'Deep Learning Mastery',
        desc: 'Neural networks, CNNs, and RNNs using PyTorch or TensorFlow.',
        skills: ['PyTorch', 'TensorFlow', 'Deep Learning'],
        certs: ['Google Professional ML Engineer'],
        milestone: 'Implement a custom image classification model.',
        duration: '3 Months'
      },
      {
        id: 'ai-m-2',
        title: 'MLOps & Deployment',
        desc: 'Scaling models and monitoring performance in production.',
        skills: ['MLflow', 'Docker', 'Bentoml', 'Monitoring'],
        milestone: 'Deploy a model with real-time inference API.',
        duration: '2 Months'
      }
    ]
  },
  // --- FINANCE SECTOR ---
  {
    id: 'fin-ib-entry',
    sector: 'Finance',
    domain: 'Investment Banking',
    level: 'Entry',
    title: 'Investment Banking Analyst',
    description: 'Start your journey in high-stakes financial advisory and deal structuring.',
    iconId: 'DollarSign',
    likes: 890,
    saves: 620,
    learners: 450,
    nodes: [
      {
        id: 'fin-e-1',
        title: 'Financial Foundations',
        desc: 'Accounting principles and financial statement analysis.',
        skills: ['Accounting', 'Excel Mastery', 'Financial Statements'],
        milestone: 'Analyze 3 years of 10-K filings.',
        duration: '1 Month'
      }
    ]
  },
  // --- MARKETING SECTOR ---
  {
    id: 'mkt-dm-entry',
    sector: 'Marketing',
    domain: 'Digital Marketing',
    level: 'Entry',
    title: 'Digital Marketing Specialist',
    description: 'Master the art of online presence and growth strategies.',
    iconId: 'Target',
    likes: 1560,
    saves: 980,
    learners: 2800,
    nodes: [
      {
        id: 'mkt-e-1',
        title: 'SEO & Content',
        desc: 'Organic search optimization and content strategy.',
        skills: ['Keyword Research', 'On-page SEO', 'Copywriting'],
        certs: ['HubSpot Content Marketing'],
        milestone: 'Rank a test blog post on Page 1.',
        duration: '2 Months'
      }
    ]
  },
  // --- HR SECTOR ---
  {
    id: 'hr-rec-mid',
    sector: 'HR',
    domain: 'Recruitment',
    level: 'Mid',
    title: 'Talent Acquisition Lead',
    description: 'Scale teams and build robust hiring frameworks.',
    iconId: 'Users',
    likes: 670,
    saves: 430,
    learners: 890,
    nodes: [
      {
        id: 'hr-m-1',
        title: 'Strategy & Sourcing',
        desc: 'Advanced sourcing techniques and hiring branding.',
        skills: ['Boolean Search', 'ATS Optimization', 'Employer Branding'],
        certs: ['SHRM-CP'],
        milestone: 'Hire 10 senior engineers in one quarter.',
        duration: '3 Months'
      }
    ]
  },
  // --- HEALTHCARE SECTOR ---
  {
    id: 'hc-da-entry',
    sector: 'Healthcare',
    domain: 'Data Analytics',
    level: 'Entry',
    title: 'Healthcare Data Analyst',
    description: 'Improve patient outcomes through data-driven insights.',
    iconId: 'Activity',
    likes: 540,
    saves: 310,
    learners: 620,
    nodes: [
      {
        id: 'hc-e-1',
        title: 'Compliance & Standards',
        desc: 'HIPAA regulations and healthcare coding systems.',
        skills: ['HIPAA', 'ICD-10', 'Data Security'],
        milestone: 'Create a HIPAA-compliant data dashboard.',
        duration: '2 Months'
      }
    ]
  }
];
