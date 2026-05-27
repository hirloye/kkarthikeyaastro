import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.HORO_API;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'HORO_API key is not configured.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { year, month, date, latitude = 13.0827, longitude = 80.2707, timezone = 5.5 } = body;

    // Use current date if not provided
    const targetDate = new Date();
    const y = year || targetDate.getFullYear();
    const m = month || (targetDate.getMonth() + 1);
    const d = date || targetDate.getDate();

    const apiResponse = await fetch('https://json.freeastrologyapi.com/planets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        year: y,
        month: m,
        date: d,
        hours: 12,
        minutes: 0,
        seconds: 0,
        latitude,
        longitude,
        timezone,
        config: {
          observation_point: 'topocentric',
          ayanamsha: 'lahiri'
        }
      })
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      return NextResponse.json({ 
        success: false, 
        error: `Free Astrology API error: ${errText}` 
      }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
