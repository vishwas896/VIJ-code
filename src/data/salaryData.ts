export interface LocationInfo {
  city: string;
  state?: string;
  country: string;
  multiplier: number; // Salary multiplier relative to US average (1.0)
}

export interface SalaryBreakdown {
  base: number;   // base pay %
  bonus: number;  // bonus %
  equity: number; // equity/stock %
}

export interface ExperienceLevelData {
  entry: number;  // 0-2 yrs (USD)
  mid: number;    // 3-5 yrs (USD)
  senior: number; // 6-9 yrs (USD)
  lead: number;   // 10+ yrs (USD)
}

export interface IndustrySalary {
  industry: string;
  avgSalary: number; // (USD)
}

export interface RelatedRole {
  title: string;
  avgSalary: number; // (USD)
}

export interface SkillPremium {
  skill: string;
  premiumPct: number; // percentage bump (e.g. 18 for +18%)
}

export interface CompanyInsight {
  company: string;
  avgSalary: number; // (USD)
  rating: number;     // 1-5 rating
}

export interface CareerPivot {
  title: string;
  avgSalary: number; // (USD)
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  salaryBumpPct: number;
  skillsRequired: string[];
}

export interface SalaryProfile {
  title: string;
  aliases: string[];
  baseMin: number; // (USD)
  baseMid: number; // (USD)
  baseMax: number; // (USD)
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  breakdown: SalaryBreakdown;
  experience: ExperienceLevelData;
  industries: IndustrySalary[];
  trends: number[]; // 6-month historical averages
  related: RelatedRole[];
  skills: SkillPremium[];
  companies: CompanyInsight[];
  pivots: CareerPivot[];
}

// Cascading Locations Dataset
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' },
  { code: 'AE', name: 'United Arab Emirates' }
];

export const STATES: Record<string, string[]> = {
  US: ['California', 'Texas', 'New York', 'Washington', 'Massachusetts', 'Remote'],
  IN: ['Karnataka', 'Maharashtra', 'Delhi NCR', 'Telangana', 'Remote'],
  GB: ['England', 'Scotland', 'Remote'],
  DE: ['Berlin', 'Bavaria', 'Remote'],
  FR: ['Île-de-France', 'Remote'],
  CA: ['Ontario', 'British Columbia', 'Quebec', 'Remote'],
  AU: ['New South Wales', 'Victoria', 'Remote'],
  SG: ['Central Region', 'Remote'],
  JP: ['Tokyo', 'Remote'],
  AE: ['Dubai', 'Abu Dhabi', 'Remote']
};

export const CITIES: Record<string, Record<string, LocationInfo[]>> = {
  US: {
    California: [
      { city: 'San Francisco', country: 'US', state: 'California', multiplier: 1.45 },
      { city: 'Los Angeles', country: 'US', state: 'California', multiplier: 1.25 },
      { city: 'San Jose', country: 'US', state: 'California', multiplier: 1.42 },
      { city: 'San Diego', country: 'US', state: 'California', multiplier: 1.18 }
    ],
    Texas: [
      { city: 'Austin', country: 'US', state: 'Texas', multiplier: 1.15 },
      { city: 'Dallas', country: 'US', state: 'Texas', multiplier: 1.08 },
      { city: 'Houston', country: 'US', state: 'Texas', multiplier: 1.05 }
    ],
    'New York': [
      { city: 'New York City', country: 'US', state: 'New York', multiplier: 1.40 },
      { city: 'Buffalo', country: 'US', state: 'New York', multiplier: 0.90 }
    ],
    Washington: [
      { city: 'Seattle', country: 'US', state: 'Washington', multiplier: 1.30 },
      { city: 'Bellevue', country: 'US', state: 'Washington', multiplier: 1.28 }
    ],
    Massachusetts: [
      { city: 'Boston', country: 'US', state: 'Massachusetts', multiplier: 1.22 }
    ],
    Remote: [
      { city: 'US Remote', country: 'US', state: 'Remote', multiplier: 1.00 }
    ]
  },
  IN: {
    Karnataka: [
      { city: 'Bangalore', country: 'IN', state: 'Karnataka', multiplier: 0.38 }
    ],
    Maharashtra: [
      { city: 'Mumbai', country: 'IN', state: 'Maharashtra', multiplier: 0.35 },
      { city: 'Pune', country: 'IN', state: 'Maharashtra', multiplier: 0.30 }
    ],
    'Delhi NCR': [
      { city: 'New Delhi', country: 'IN', state: 'Delhi NCR', multiplier: 0.32 },
      { city: 'Gurgaon', country: 'IN', state: 'Delhi NCR', multiplier: 0.34 },
      { city: 'Noida', country: 'IN', state: 'Delhi NCR', multiplier: 0.28 }
    ],
    Telangana: [
      { city: 'Hyderabad', country: 'IN', state: 'Telangana', multiplier: 0.31 }
    ],
    Remote: [
      { city: 'India Remote', country: 'IN', state: 'Remote', multiplier: 0.25 }
    ]
  },
  GB: {
    England: [
      { city: 'London', country: 'GB', state: 'England', multiplier: 1.02 },
      { city: 'Manchester', country: 'GB', state: 'England', multiplier: 0.78 },
      { city: 'Birmingham', country: 'GB', state: 'England', multiplier: 0.75 }
    ],
    Scotland: [
      { city: 'Edinburgh', country: 'GB', state: 'Scotland', multiplier: 0.80 },
      { city: 'Glasgow', country: 'GB', state: 'Scotland', multiplier: 0.76 }
    ],
    Remote: [
      { city: 'UK Remote', country: 'GB', state: 'Remote', multiplier: 0.72 }
    ]
  },
  DE: {
    Berlin: [
      { city: 'Berlin', country: 'DE', state: 'Berlin', multiplier: 0.95 }
    ],
    Bavaria: [
      { city: 'Munich', country: 'DE', state: 'Bavaria', multiplier: 1.05 },
      { city: 'Nuremberg', country: 'DE', state: 'Bavaria', multiplier: 0.85 }
    ],
    Remote: [
      { city: 'Germany Remote', country: 'DE', state: 'Remote', multiplier: 0.82 }
    ]
  },
  FR: {
    'Île-de-France': [
      { city: 'Paris', country: 'FR', state: 'Île-de-France', multiplier: 0.92 }
    ],
    Remote: [
      { city: 'France Remote', country: 'FR', state: 'Remote', multiplier: 0.78 }
    ]
  },
  CA: {
    Ontario: [
      { city: 'Toronto', country: 'CA', state: 'Ontario', multiplier: 0.94 },
      { city: 'Ottawa', country: 'CA', state: 'Ontario', multiplier: 0.86 }
    ],
    'British Columbia': [
      { city: 'Vancouver', country: 'CA', state: 'British Columbia', multiplier: 0.92 }
    ],
    Quebec: [
      { city: 'Montreal', country: 'CA', state: 'Quebec', multiplier: 0.82 }
    ],
    Remote: [
      { city: 'Canada Remote', country: 'CA', state: 'Remote', multiplier: 0.78 }
    ]
  },
  AU: {
    'New South Wales': [
      { city: 'Sydney', country: 'AU', state: 'New South Wales', multiplier: 1.04 }
    ],
    Victoria: [
      { city: 'Melbourne', country: 'AU', state: 'Victoria', multiplier: 0.96 }
    ],
    Remote: [
      { city: 'Australia Remote', country: 'AU', state: 'Remote', multiplier: 0.85 }
    ]
  },
  SG: {
    'Central Region': [
      { city: 'Singapore', country: 'SG', state: 'Central Region', multiplier: 1.10 }
    ],
    Remote: [
      { city: 'Singapore Remote', country: 'SG', state: 'Remote', multiplier: 0.95 }
    ]
  },
  JP: {
    Tokyo: [
      { city: 'Tokyo', country: 'JP', state: 'Tokyo', multiplier: 0.85 },
      { city: 'Yokohama', country: 'JP', state: 'Tokyo', multiplier: 0.78 }
    ],
    Remote: [
      { city: 'Japan Remote', country: 'JP', state: 'Remote', multiplier: 0.68 }
    ]
  },
  AE: {
    Dubai: [
      { city: 'Dubai', country: 'AE', state: 'Dubai', multiplier: 1.05 }
    ],
    'Abu Dhabi': [
      { city: 'Abu Dhabi', country: 'AE', state: 'Abu Dhabi', multiplier: 1.02 }
    ],
    Remote: [
      { city: 'UAE Remote', country: 'AE', state: 'Remote', multiplier: 0.90 }
    ]
  }
};

// Global Job Title Seed Database
export const SALARY_PROFILES: SalaryProfile[] = [
  {
    title: 'Frontend Developer',
    aliases: ['React Developer', 'Angular Developer', 'Vue Developer', 'Frontend Engineer', 'Web Developer', 'Senior React Developer'],
    baseMin: 95000,
    baseMid: 135000,
    baseMax: 175000,
    percentiles: {
      p10: 98000,
      p25: 115000,
      p50: 135000,
      p75: 158000,
      p90: 180000
    },
    breakdown: { base: 75, bonus: 10, equity: 15 },
    experience: {
      entry: 85000,
      mid: 120000,
      senior: 155000,
      lead: 185000
    },
    industries: [
      { industry: 'Technology', avgSalary: 145000 },
      { industry: 'Financial Services', avgSalary: 138000 },
      { industry: 'Healthcare', avgSalary: 122000 },
      { industry: 'E-commerce', avgSalary: 130000 },
      { industry: 'Media & Entertainment', avgSalary: 128000 }
    ],
    trends: [128000, 130000, 131500, 133000, 134000, 135000],
    related: [
      { title: 'Full Stack Developer', avgSalary: 142000 },
      { title: 'UI/UX Designer', avgSalary: 115000 },
      { title: 'Solutions Architect', avgSalary: 168000 }
    ],
    skills: [
      { skill: 'React / Next.js', premiumPct: 12 },
      { skill: 'Framer Motion', premiumPct: 8 },
      { skill: 'TypeScript', premiumPct: 10 },
      { skill: 'Web3 / TailwindCSS', premiumPct: 14 },
      { skill: 'State Management (Redux/Zustand)', premiumPct: 7 }
    ],
    companies: [
      { company: 'Google', avgSalary: 178000, rating: 4.5 },
      { company: 'Meta', avgSalary: 182000, rating: 4.3 },
      { company: 'Stripe', avgSalary: 175000, rating: 4.6 },
      { company: 'Netflix', avgSalary: 210000, rating: 4.4 },
      { company: 'Amazon', avgSalary: 155000, rating: 3.9 }
    ],
    pivots: [
      {
        title: 'Full Stack Developer',
        avgSalary: 142000,
        difficulty: 'Easy',
        salaryBumpPct: 8,
        skillsRequired: ['Node.js', 'PostgreSQL', 'REST API Architecture']
      },
      {
        title: 'Solutions Architect',
        avgSalary: 168000,
        difficulty: 'Moderate',
        salaryBumpPct: 24,
        skillsRequired: ['System Design', 'Cloud Computing (AWS/GCP)', 'Security Standards']
      },
      {
        title: 'Engineering Manager',
        avgSalary: 185000,
        difficulty: 'Hard',
        salaryBumpPct: 37,
        skillsRequired: ['Agile Leadership', 'Technical Mentorship', 'Budget Management']
      }
    ]
  },
  {
    title: 'Backend Developer',
    aliases: ['Java Developer', 'Python Developer', 'Go Developer', 'Node.js Developer', 'Backend Engineer', 'Database Developer'],
    baseMin: 105000,
    baseMid: 145000,
    baseMax: 190000,
    percentiles: {
      p10: 108000,
      p25: 128000,
      p50: 145000,
      p75: 172000,
      p90: 195000
    },
    breakdown: { base: 70, bonus: 12, equity: 18 },
    experience: {
      entry: 92000,
      mid: 130000,
      senior: 165000,
      lead: 200000
    },
    industries: [
      { industry: 'Technology', avgSalary: 155000 },
      { industry: 'Financial Services', avgSalary: 152000 },
      { industry: 'Healthcare', avgSalary: 132000 },
      { industry: 'E-commerce', avgSalary: 140000 },
      { industry: 'Telecommunications', avgSalary: 138000 }
    ],
    trends: [139000, 140500, 142000, 143500, 144000, 145000],
    related: [
      { title: 'DevOps Engineer', avgSalary: 148000 },
      { title: 'Full Stack Developer', avgSalary: 142000 },
      { title: 'Cloud Architect', avgSalary: 175000 }
    ],
    skills: [
      { skill: 'Go / Rust', premiumPct: 18 },
      { skill: 'Kubernetes', premiumPct: 15 },
      { skill: 'GraphQL / gRPC', premiumPct: 9 },
      { skill: 'PostgreSQL Optimization', premiumPct: 11 },
      { skill: 'Kafka / Event Streaming', premiumPct: 14 }
    ],
    companies: [
      { company: 'Netflix', avgSalary: 235000, rating: 4.4 },
      { company: 'Google', avgSalary: 188000, rating: 4.5 },
      { company: 'Meta', avgSalary: 192000, rating: 4.3 },
      { company: 'Stripe', avgSalary: 185000, rating: 4.6 },
      { company: 'Microsoft', avgSalary: 165000, rating: 4.2 }
    ],
    pivots: [
      {
        title: 'DevOps Engineer',
        avgSalary: 148000,
        difficulty: 'Easy',
        salaryBumpPct: 5,
        skillsRequired: ['Docker', 'Terraform', 'CI/CD Pipelines']
      },
      {
        title: 'Cloud Architect',
        avgSalary: 175000,
        difficulty: 'Moderate',
        salaryBumpPct: 20,
        skillsRequired: ['AWS Systems', 'Enterprise Security', 'Cost Optimization']
      },
      {
        title: 'Blockchain Developer',
        avgSalary: 165000,
        difficulty: 'Hard',
        salaryBumpPct: 15,
        skillsRequired: ['Solidity', 'Smart Contracts', 'Cryptography']
      }
    ]
  },
  {
    title: 'Full Stack Developer',
    aliases: ['MERN Developer', 'Web Engineer', 'Full Stack Engineer', 'Software Engineer', 'Senior Full Stack Developer'],
    baseMin: 100000,
    baseMid: 142000,
    baseMax: 185000,
    percentiles: {
      p10: 102000,
      p25: 122000,
      p50: 142000,
      p75: 168000,
      p90: 190000
    },
    breakdown: { base: 72, bonus: 11, equity: 17 },
    experience: {
      entry: 88000,
      mid: 125000,
      senior: 160000,
      lead: 195000
    },
    industries: [
      { industry: 'Technology', avgSalary: 150000 },
      { industry: 'Financial Services', avgSalary: 144000 },
      { industry: 'Healthcare', avgSalary: 128000 },
      { industry: 'E-commerce', avgSalary: 138000 },
      { industry: 'Real Estate', avgSalary: 125000 }
    ],
    trends: [136000, 137800, 139000, 140200, 141000, 142000],
    related: [
      { title: 'Frontend Developer', avgSalary: 135000 },
      { title: 'Backend Developer', avgSalary: 145000 },
      { title: 'Solutions Architect', avgSalary: 168000 }
    ],
    skills: [
      { skill: 'React + Node.js', premiumPct: 10 },
      { skill: 'Next.js 15 App Router', premiumPct: 13 },
      { skill: 'PostgreSQL + Prisma', premiumPct: 8 },
      { skill: 'AWS Deployment', premiumPct: 11 },
      { skill: 'Docker Containers', premiumPct: 9 }
    ],
    companies: [
      { company: 'Meta', avgSalary: 188000, rating: 4.3 },
      { company: 'Stripe', avgSalary: 182000, rating: 4.6 },
      { company: 'Google', avgSalary: 184000, rating: 4.5 },
      { company: 'Vercel', avgSalary: 190000, rating: 4.8 },
      { company: 'Airbnb', avgSalary: 178000, rating: 4.2 }
    ],
    pivots: [
      {
        title: 'Solutions Architect',
        avgSalary: 168000,
        difficulty: 'Moderate',
        salaryBumpPct: 18,
        skillsRequired: ['System Design Patterns', 'Enterprise Integration', 'Security Audits']
      },
      {
        title: 'Product Manager',
        avgSalary: 140000,
        difficulty: 'Moderate',
        salaryBumpPct: -1,
        skillsRequired: ['Product Strategy', 'Customer Research', 'Market Analysis']
      }
    ]
  },
  {
    title: 'Product Manager',
    aliases: ['Technical Product Manager', 'Product Owner', 'PM', 'Senior PM', 'Director of Product'],
    baseMin: 98000,
    baseMid: 140000,
    baseMax: 185000,
    percentiles: {
      p10: 100000,
      p25: 120000,
      p50: 140000,
      p75: 165000,
      p90: 192000
    },
    breakdown: { base: 70, bonus: 15, equity: 15 },
    experience: {
      entry: 88000,
      mid: 122000,
      senior: 158000,
      lead: 195000
    },
    industries: [
      { industry: 'Technology', avgSalary: 152000 },
      { industry: 'Financial Services', avgSalary: 146000 },
      { industry: 'Healthcare', avgSalary: 126000 },
      { industry: 'Retail', avgSalary: 118000 },
      { industry: 'E-commerce', avgSalary: 135000 }
    ],
    trends: [134000, 136000, 137500, 138800, 139500, 140000],
    related: [
      { title: 'Project Manager', avgSalary: 105000 },
      { title: 'UI/UX Designer', avgSalary: 115000 },
      { title: 'Data Analyst', avgSalary: 95000 }
    ],
    skills: [
      { skill: 'A/B Testing', premiumPct: 8 },
      { skill: 'SQL & Data Analysis', premiumPct: 12 },
      { skill: 'Scrum/Agile Certification', premiumPct: 6 },
      { skill: 'Product Strategy & Roadmap Builder', premiumPct: 14 },
      { skill: 'User Experience (UX) Principles', premiumPct: 7 }
    ],
    companies: [
      { company: 'Google', avgSalary: 190000, rating: 4.5 },
      { company: 'Meta', avgSalary: 198000, rating: 4.3 },
      { company: 'Microsoft', avgSalary: 162000, rating: 4.2 },
      { company: 'Amazon', avgSalary: 165000, rating: 3.9 },
      { company: 'Zillow', avgSalary: 138000, rating: 4.0 }
    ],
    pivots: [
      {
        title: 'Director of Product',
        avgSalary: 210000,
        difficulty: 'Hard',
        salaryBumpPct: 50,
        skillsRequired: ['Executive Leadership', 'Organizational Scaling', 'Portfolio Strategy']
      },
      {
        title: 'Engineering Manager',
        avgSalary: 185000,
        difficulty: 'Hard',
        salaryBumpPct: 32,
        skillsRequired: ['Software Engineering Background', 'System Design', 'Team Management']
      }
    ]
  },
  {
    title: 'Data Scientist',
    aliases: ['Data Analyst', 'Senior Data Scientist', 'AI Scientist', 'Quantitative Analyst'],
    baseMin: 100000,
    baseMid: 145000,
    baseMax: 190000,
    percentiles: {
      p10: 105000,
      p25: 125000,
      p50: 145000,
      p75: 172000,
      p90: 198000
    },
    breakdown: { base: 73, bonus: 12, equity: 15 },
    experience: {
      entry: 90000,
      mid: 128000,
      senior: 165000,
      lead: 205000
    },
    industries: [
      { industry: 'Technology', avgSalary: 156000 },
      { industry: 'Financial Services', avgSalary: 158000 },
      { industry: 'Healthcare', avgSalary: 138000 },
      { industry: 'E-commerce', avgSalary: 142000 },
      { industry: 'Energy', avgSalary: 130000 }
    ],
    trends: [140000, 141200, 142500, 143800, 144500, 145000],
    related: [
      { title: 'Machine Learning Engineer', avgSalary: 158000 },
      { title: 'Data Engineer', avgSalary: 140000 },
      { title: 'Business Intelligence Developer', avgSalary: 108000 }
    ],
    skills: [
      { skill: 'Python / R', premiumPct: 6 },
      { skill: 'PyTorch / TensorFlow', premiumPct: 15 },
      { skill: 'SQL & BigQuery', premiumPct: 8 },
      { skill: 'Spark / Hadoop', premiumPct: 12 },
      { skill: 'Data Visualization (Tableau/D3)', premiumPct: 7 }
    ],
    companies: [
      { company: 'Meta', avgSalary: 198000, rating: 4.3 },
      { company: 'Google', avgSalary: 185000, rating: 4.5 },
      { company: 'Stripe', avgSalary: 178000, rating: 4.6 },
      { company: 'Netflix', avgSalary: 220000, rating: 4.4 },
      { company: 'Apple', avgSalary: 182000, rating: 4.4 }
    ],
    pivots: [
      {
        title: 'Machine Learning Engineer',
        avgSalary: 158000,
        difficulty: 'Easy',
        salaryBumpPct: 9,
        skillsRequired: ['Deep Learning', 'MLOps', 'C++ or Python Optimization']
      },
      {
        title: 'Engineering Manager',
        avgSalary: 185000,
        difficulty: 'Hard',
        salaryBumpPct: 27,
        skillsRequired: ['Leadership', 'Cross-functional Collaboration', 'Project Management']
      }
    ]
  },
  {
    title: 'Machine Learning Engineer',
    aliases: ['ML Engineer', 'AI Engineer', 'Deep Learning Engineer', 'Computer Vision Engineer', 'NLP Specialist'],
    baseMin: 115000,
    baseMid: 158000,
    baseMax: 210000,
    percentiles: {
      p10: 120000,
      p25: 140000,
      p50: 158000,
      p75: 188000,
      p90: 215000
    },
    breakdown: { base: 65, bonus: 13, equity: 22 },
    experience: {
      entry: 105000,
      mid: 142000,
      senior: 178000,
      lead: 220000
    },
    industries: [
      { industry: 'Technology', avgSalary: 170000 },
      { industry: 'Financial Services', avgSalary: 162000 },
      { industry: 'Healthcare', avgSalary: 148000 },
      { industry: 'Automotive', avgSalary: 155000 },
      { industry: 'Telecommunications', avgSalary: 140000 }
    ],
    trends: [150000, 152000, 154500, 156000, 157200, 158000],
    related: [
      { title: 'Data Scientist', avgSalary: 145000 },
      { title: 'Data Engineer', avgSalary: 140000 },
      { title: 'Cloud Architect', avgSalary: 175000 }
    ],
    skills: [
      { skill: 'PyTorch / TensorFlow', premiumPct: 12 },
      { skill: 'Large Language Models (LLMs)', premiumPct: 22 },
      { skill: 'CUDA Programming', premiumPct: 20 },
      { skill: 'Kubeflow / MLOps Pipelines', premiumPct: 15 },
      { skill: 'C++', premiumPct: 14 }
    ],
    companies: [
      { company: 'OpenAI', avgSalary: 310000, rating: 4.7 },
      { company: 'Google', avgSalary: 210000, rating: 4.5 },
      { company: 'Meta', avgSalary: 205000, rating: 4.3 },
      { company: 'Tesla', avgSalary: 178000, rating: 3.8 },
      { company: 'Nvidia', avgSalary: 230000, rating: 4.6 }
    ],
    pivots: [
      {
        title: 'AI Architect',
        avgSalary: 198000,
        difficulty: 'Moderate',
        salaryBumpPct: 25,
        skillsRequired: ['System Design', 'Enterprise AI Strategy', 'Infrastructure Planning']
      },
      {
        title: 'Research Scientist',
        avgSalary: 180000,
        difficulty: 'Hard',
        salaryBumpPct: 13,
        skillsRequired: ['Academic Publications', 'Advanced Mathematics', 'Algorithm Invention']
      }
    ]
  },
  {
    title: 'DevOps Engineer',
    aliases: ['Site Reliability Engineer', 'SRE', 'Infrastructure Engineer', 'Platform Engineer', 'Systems Engineer'],
    baseMin: 100000,
    baseMid: 148000,
    baseMax: 190000,
    percentiles: {
      p10: 105000,
      p25: 125000,
      p50: 148000,
      p75: 175000,
      p90: 200000
    },
    breakdown: { base: 74, bonus: 10, equity: 16 },
    experience: {
      entry: 90000,
      mid: 130000,
      senior: 165000,
      lead: 205000
    },
    industries: [
      { industry: 'Technology', avgSalary: 155000 },
      { industry: 'Financial Services', avgSalary: 150000 },
      { industry: 'Healthcare', avgSalary: 134000 },
      { industry: 'E-commerce', avgSalary: 142000 },
      { industry: 'Telecommunications', avgSalary: 136000 }
    ],
    trends: [142000, 143500, 145000, 146200, 147500, 148000],
    related: [
      { title: 'Backend Developer', avgSalary: 145000 },
      { title: 'Cloud Architect', avgSalary: 175000 },
      { title: 'Security Analyst', avgSalary: 110000 }
    ],
    skills: [
      { skill: 'Kubernetes', premiumPct: 18 },
      { skill: 'Terraform / IaC', premiumPct: 15 },
      { skill: 'AWS / GCP / Azure', premiumPct: 12 },
      { skill: 'CI/CD Pipelines (GitHub Actions/GitLab)', premiumPct: 10 },
      { skill: 'Prometheus / Grafana Monitoring', premiumPct: 8 }
    ],
    companies: [
      { company: 'Google', avgSalary: 192000, rating: 4.5 },
      { company: 'Meta', avgSalary: 195000, rating: 4.3 },
      { company: 'Stripe', avgSalary: 180000, rating: 4.6 },
      { company: 'Microsoft', avgSalary: 168000, rating: 4.2 },
      { company: 'HashiCorp', avgSalary: 185000, rating: 4.4 }
    ],
    pivots: [
      {
        title: 'Cloud Architect',
        avgSalary: 175000,
        difficulty: 'Easy',
        salaryBumpPct: 18,
        skillsRequired: ['Enterprise Governance', 'Multi-cloud Architecture', 'Disaster Recovery']
      },
      {
        title: 'Platform Engineering Lead',
        avgSalary: 190000,
        difficulty: 'Moderate',
        salaryBumpPct: 28,
        skillsRequired: ['Developer Tooling Design', 'Internal Developer Portals', 'Team Leadership']
      }
    ]
  },
  {
    title: 'UI/UX Designer',
    aliases: ['Product Designer', 'Interaction Designer', 'Visual Designer', 'UX Researcher', 'UX Architect'],
    baseMin: 80000,
    baseMid: 115000,
    baseMax: 150000,
    percentiles: {
      p10: 82000,
      p25: 98000,
      p50: 115000,
      p75: 135000,
      p90: 155000
    },
    breakdown: { base: 78, bonus: 8, equity: 14 },
    experience: {
      entry: 72000,
      mid: 105000,
      senior: 132000,
      lead: 160000
    },
    industries: [
      { industry: 'Technology', avgSalary: 125000 },
      { industry: 'Media & Entertainment', avgSalary: 112000 },
      { industry: 'E-commerce', avgSalary: 114000 },
      { industry: 'Financial Services', avgSalary: 118000 },
      { industry: 'Advertising & Marketing', avgSalary: 96000 }
    ],
    trends: [110000, 111500, 112800, 113800, 114500, 115000],
    related: [
      { title: 'Frontend Developer', avgSalary: 135000 },
      { title: 'Product Manager', avgSalary: 140000 },
      { title: 'UX Researcher', avgSalary: 108000 }
    ],
    skills: [
      { skill: 'Figma', premiumPct: 5 },
      { skill: 'Prototyping / Wireframing', premiumPct: 8 },
      { skill: 'Design Systems Architecture', premiumPct: 12 },
      { skill: 'HTML & CSS basics', premiumPct: 7 },
      { skill: 'User Testing & Interviewing', premiumPct: 10 }
    ],
    companies: [
      { company: 'Apple', avgSalary: 145000, rating: 4.4 },
      { company: 'Airbnb', avgSalary: 142000, rating: 4.2 },
      { company: 'Google', avgSalary: 138000, rating: 4.5 },
      { company: 'Figma', avgSalary: 150000, rating: 4.7 },
      { company: 'Microsoft', avgSalary: 122000, rating: 4.2 }
    ],
    pivots: [
      {
        title: 'Product Manager',
        avgSalary: 140000,
        difficulty: 'Moderate',
        salaryBumpPct: 21,
        skillsRequired: ['Business Metrics', 'Agile Methodologies', 'Strategic Roadmapping']
      },
      {
        title: 'Frontend Developer',
        avgSalary: 135000,
        difficulty: 'Hard',
        salaryBumpPct: 17,
        skillsRequired: ['JavaScript / React', 'Git version control', 'API Integration']
      }
    ]
  },
  {
    title: 'Blockchain Developer',
    aliases: ['Smart Contract Developer', 'Web3 Developer', 'Solidity Developer', 'Ethereum Engineer', 'Cryptography Engineer'],
    baseMin: 110000,
    baseMid: 165000,
    baseMax: 220000,
    percentiles: {
      p10: 115000,
      p25: 140000,
      p50: 165000,
      p75: 195000,
      p90: 225000
    },
    breakdown: { base: 60, bonus: 10, equity: 30 },
    experience: {
      entry: 100000,
      mid: 145000,
      senior: 185000,
      lead: 230000
    },
    industries: [
      { industry: 'Technology', avgSalary: 172000 },
      { industry: 'Financial Services', avgSalary: 180000 },
      { industry: 'Energy', avgSalary: 145000 },
      { industry: 'Media & Entertainment', avgSalary: 152000 },
      { industry: 'Telecommunications', avgSalary: 148000 }
    ],
    trends: [158000, 160000, 162200, 163800, 164500, 165000],
    related: [
      { title: 'Security Analyst', avgSalary: 110000 },
      { title: 'Backend Developer', avgSalary: 145000 },
      { title: 'Solutions Architect', avgSalary: 168000 }
    ],
    skills: [
      { skill: 'Solidity', premiumPct: 20 },
      { skill: 'Rust', premiumPct: 18 },
      { skill: 'Smart Contract Auditing', premiumPct: 25 },
      { skill: 'Zero-Knowledge Proofs (ZKP)', premiumPct: 30 },
      { skill: 'Web3.js / Ethers.js', premiumPct: 8 }
    ],
    companies: [
      { company: 'Coinbase', avgSalary: 195000, rating: 4.1 },
      { company: 'ConsenSys', avgSalary: 178000, rating: 4.2 },
      { company: 'Stripe', avgSalary: 188000, rating: 4.6 },
      { company: 'Chainlink', avgSalary: 190000, rating: 4.5 },
      { company: 'Ripple', avgSalary: 175000, rating: 3.9 }
    ],
    pivots: [
      {
        title: 'Smart Contract Auditor',
        avgSalary: 195000,
        difficulty: 'Moderate',
        salaryBumpPct: 18,
        skillsRequired: ['Vulnerability Assessment', 'Assembly Code', 'Advanced Security Testing']
      },
      {
        title: 'Solutions Architect',
        avgSalary: 168000,
        difficulty: 'Easy',
        salaryBumpPct: 2,
        skillsRequired: ['Cloud Infrastructure', 'Enterprise Integrations', 'Client Consultations']
      }
    ]
  }
];

export const ALL_JOB_TITLES = Array.from(
  new Set(
    SALARY_PROFILES.flatMap(p => [p.title, ...p.aliases])
  )
);

// Function to resolve job alias/title to the matching main profile
export function findProfileByQuery(query: string): SalaryProfile | undefined {
  if (!query) return undefined;
  const lowerQuery = query.toLowerCase().trim();
  
  // 1. Direct match with standard title
  let profile = SALARY_PROFILES.find(p => p.title.toLowerCase() === lowerQuery);
  if (profile) return profile;

  // 2. Direct match with an alias
  profile = SALARY_PROFILES.find(p => 
    p.aliases.some(alias => alias.toLowerCase() === lowerQuery)
  );
  if (profile) return profile;

  // 3. Partial match with title
  profile = SALARY_PROFILES.find(p => p.title.toLowerCase().includes(lowerQuery));
  if (profile) return profile;

  // 4. Partial match with an alias
  profile = SALARY_PROFILES.find(p => 
    p.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
  );
  
  return profile;
}

// Function to get location multiplier
export function getLocationMultiplier(countryCode?: string, stateName?: string, cityName?: string): number {
  if (!countryCode) return 1.0;
  
  // Default values
  let multiplier = 1.0;

  if (cityName && stateName && CITIES[countryCode] && CITIES[countryCode][stateName]) {
    const matchedCity = CITIES[countryCode][stateName].find(
      c => c.city.toLowerCase() === cityName.toLowerCase()
    );
    if (matchedCity) return matchedCity.multiplier;
  }

  // Fallbacks if only state or country is matching
  // Average of cities in state
  if (stateName && CITIES[countryCode] && CITIES[countryCode][stateName]) {
    const list = CITIES[countryCode][stateName];
    if (list.length > 0) {
      const sum = list.reduce((acc, c) => acc + c.multiplier, 0);
      return sum / list.length;
    }
  }

  // Average of state averages in country
  if (CITIES[countryCode]) {
    const states = Object.keys(CITIES[countryCode]);
    let totalMultiplier = 0;
    let cityCount = 0;
    for (const st of states) {
      for (const city of CITIES[countryCode][st]) {
        totalMultiplier += city.multiplier;
        cityCount++;
      }
    }
    if (cityCount > 0) return totalMultiplier / cityCount;
  }

  // General Country mapping overrides
  const countryMultipliers: Record<string, number> = {
    US: 1.0,
    IN: 0.32,
    GB: 0.85,
    DE: 0.92,
    FR: 0.85,
    CA: 0.88,
    AU: 0.95,
    SG: 1.05,
    JP: 0.78,
    AE: 0.98
  };

  return countryMultipliers[countryCode] || multiplier;
}
