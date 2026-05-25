import { NextRequest, NextResponse } from 'next/server';
import { findProfileByQuery, getLocationMultiplier, SalaryProfile } from '../../../../data/salaryData';

interface ScaleRequest {
  type: 'roles' | 'locations';
  queries?: string[];
  query?: string;
  locations?: Array<{ country: string; state: string; city: string }>;
  location?: { country: string; state: string; city: string };
}

function scaleProfile(profile: SalaryProfile, multiplier: number): SalaryProfile {
  return {
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
}

export async function POST(request: NextRequest) {
  try {
    const body: ScaleRequest = await request.json();

    if (body.type === 'roles') {
      const queries = body.queries || [];
      const loc = body.location || { country: '', state: '', city: '' };
      const multiplier = getLocationMultiplier(loc.country, loc.state, loc.city);

      const results = queries.map(q => {
        const profile = findProfileByQuery(q);
        if (!profile) return { query: q, error: 'Not found' };
        return {
          query: q,
          profile: scaleProfile(profile, multiplier)
        };
      });

      return NextResponse.json({ type: 'roles', results });
    } else if (body.type === 'locations') {
      const query = body.query || '';
      const locations = body.locations || [];
      const profile = findProfileByQuery(query);

      if (!profile) {
        return NextResponse.json({ error: `Role "${query}" not found.` }, { status: 404 });
      }

      const results = locations.map(loc => {
        const multiplier = getLocationMultiplier(loc.country, loc.state, loc.city);
        return {
          location: loc,
          multiplier,
          profile: scaleProfile(profile, multiplier)
        };
      });

      return NextResponse.json({ type: 'locations', query, results });
    }

    return NextResponse.json({ error: 'Invalid comparison type' }, { status: 400 });
  } catch (error) {
    console.error('Error comparing salaries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
