import { NextRequest, NextResponse } from 'next/server';
import { findProfileByQuery, getLocationMultiplier, SalaryProfile } from '../../../../data/salaryData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const country = searchParams.get('country') || '';
    const state = searchParams.get('state') || '';
    const city = searchParams.get('city') || '';

    if (!q) {
      return NextResponse.json({ error: 'Search query "q" is required.' }, { status: 400 });
    }

    const profile = findProfileByQuery(q);
    if (!profile) {
      return NextResponse.json({ 
        error: 'Profile not found.', 
        suggestions: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Product Manager', 'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'UI/UX Designer', 'Blockchain Developer']
      }, { status: 404 });
    }

    const multiplier = getLocationMultiplier(country, state, city);

    // Deep copy profile and scale monetary values by location multiplier
    const scaledProfile: SalaryProfile = {
      ...profile,
      baseMin: Math.round(profile.baseMin * multiplier),
      baseMid: Math.round(profile.baseMid * multiplier),
      baseMax: Math.round(profile.baseMax * multiplier),
      percentiles: {
        p10: Math.round(profile.percentiles.p10 * multiplier),
        p25: Math.round(profile.percentiles.p25 * multiplier),
        p50: Math.round(profile.percentiles.p50 * multiplier),
        p75: Math.round(profile.percentiles.p75 * multiplier),
        p90: Math.round(profile.percentiles.p90 * multiplier),
      },
      experience: {
        entry: Math.round(profile.experience.entry * multiplier),
        mid: Math.round(profile.experience.mid * multiplier),
        senior: Math.round(profile.experience.senior * multiplier),
        lead: Math.round(profile.experience.lead * multiplier),
      },
      industries: profile.industries.map(ind => ({
        ...ind,
        avgSalary: Math.round(ind.avgSalary * multiplier)
      })),
      trends: profile.trends.map(val => Math.round(val * multiplier)),
      related: profile.related.map(rel => ({
        ...rel,
        avgSalary: Math.round(rel.avgSalary * multiplier)
      })),
      companies: profile.companies.map(comp => ({
        ...comp,
        avgSalary: Math.round(comp.avgSalary * multiplier)
      })),
      pivots: profile.pivots.map(piv => ({
        ...piv,
        avgSalary: Math.round(piv.avgSalary * multiplier)
      }))
    };

    return NextResponse.json({
      query: q,
      location: { country, state, city },
      multiplier,
      profile: scaledProfile
    });
  } catch (error) {
    console.error('Error fetching salary profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
