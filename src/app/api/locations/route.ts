import { NextResponse } from 'next/server';
import { COUNTRIES, STATES, CITIES } from '../../../data/salaryData';

export async function GET() {
  try {
    return NextResponse.json({
      countries: COUNTRIES,
      states: STATES,
      cities: CITIES
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
