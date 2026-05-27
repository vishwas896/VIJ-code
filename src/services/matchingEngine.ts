// ═══════════════════════════════════════════════════════════
// VIJ AI Matching Engine
// ═══════════════════════════════════════════════════════════
import type { JobPost } from '../data/recruiterData';

export interface UserProfile {
  skills: string[];
  experience: number; // years
  education: string;
  certifications: string[];
  hasPortfolio: boolean;
}

export interface MatchResult {
  score: number;
  isEligible: boolean;
  matchedHardSkills: string[];
  missingHardSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  matchedCerts: string[];
  missingCerts: string[];
  experienceMatch: boolean;
  educationMatch: boolean;
  portfolioMatch: boolean;
}

const EDUCATION_HIERARCHY: Record<string, number> = {
  'high school': 1,
  'diploma': 2,
  'associate': 3,
  "bachelor's": 4,
  'b.tech': 4,
  'b.sc': 4,
  'b.e': 4,
  "master's": 5,
  'm.tech': 5,
  'm.sc': 5,
  'mba': 5,
  'ph.d': 6,
  'phd': 6,
};

function getEducationLevel(edu: string): number {
  const lower = edu.toLowerCase().trim();
  for (const [key, level] of Object.entries(EDUCATION_HIERARCHY)) {
    if (lower.includes(key)) return level;
  }
  return 0;
}

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/[.\-_]/g, '');
}

function skillsMatch(userSkills: string[], requiredSkills: string[]): { matched: string[]; missing: string[] } {
  const normalizedUser = userSkills.map(normalizeSkill);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of requiredSkills) {
    const normalizedReq = normalizeSkill(req);
    if (normalizedUser.some(u => u.includes(normalizedReq) || normalizedReq.includes(u))) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  return { matched, missing };
}

export function calculateMatchScore(user: UserProfile, job: JobPost): MatchResult {
  const hard = job.eligibility.hard;
  const preferred = job.eligibility.preferred;

  // Hard skills
  const hardSkills = skillsMatch(user.skills, hard.skills);

  // Preferred skills
  const prefSkills = skillsMatch(user.skills, preferred.skills);

  // Certifications
  const hardCerts = skillsMatch(user.certifications, hard.certifications);
  const prefCerts = skillsMatch(user.certifications, preferred.certifications);

  // Experience
  const experienceMatch = user.experience >= hard.experienceYears;

  // Education
  const userEduLevel = getEducationLevel(user.education);
  const reqEduLevel = getEducationLevel(hard.education);
  const educationMatch = userEduLevel >= reqEduLevel;

  // Portfolio
  const portfolioMatch = !job.eligibility.portfolioRequired || user.hasPortfolio;

  // Eligibility: ALL hard requirements must pass
  const isEligible =
    hardSkills.missing.length === 0 &&
    hardCerts.missing.length === 0 &&
    experienceMatch &&
    educationMatch &&
    portfolioMatch;

  // Score calculation
  const hardTotal = hard.skills.length + hard.certifications.length + 2; // +2 for experience + education
  const hardMatched = hardSkills.matched.length + hardCerts.matched.length + (experienceMatch ? 1 : 0) + (educationMatch ? 1 : 0);

  const prefTotal = preferred.skills.length + preferred.certifications.length;
  const prefMatched = prefSkills.matched.length + prefCerts.matched.length;

  const hardScore = hardTotal > 0 ? (hardMatched / hardTotal) * 60 : 60;
  const prefScore = prefTotal > 0 ? (prefMatched / prefTotal) * 25 : 25;
  const portfolioScore = portfolioMatch ? 5 : 0;
  const activityBonus = 10; // baseline activity score

  const score = Math.min(100, Math.round(hardScore + prefScore + portfolioScore + activityBonus));

  return {
    score,
    isEligible,
    matchedHardSkills: hardSkills.matched,
    missingHardSkills: hardSkills.missing,
    matchedPreferredSkills: prefSkills.matched,
    missingPreferredSkills: prefSkills.missing,
    matchedCerts: [...hardCerts.matched, ...prefCerts.matched],
    missingCerts: [...hardCerts.missing, ...prefCerts.missing],
    experienceMatch,
    educationMatch,
    portfolioMatch,
  };
}
