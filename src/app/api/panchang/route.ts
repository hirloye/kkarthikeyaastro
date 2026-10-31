import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.HORO_API;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'HORO_API key is not configured.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const targetDate = new Date();

    const numYear = Number(body.year);
    const numMonth = Number(body.month);
    const numDate = Number(body.date);
    const numLat = Number(body.latitude);
    const numLng = Number(body.longitude);
    const numTz = Number(body.timezone);

    const y = (!isNaN(numYear) && numYear >= 1900 && numYear <= 2100) ? numYear : targetDate.getFullYear();
    const m = (!isNaN(numMonth) && numMonth >= 1 && numMonth <= 12) ? numMonth : (targetDate.getMonth() + 1);
    const d = (!isNaN(numDate) && numDate >= 1 && numDate <= 31) ? numDate : targetDate.getDate();
    const latitude = (!isNaN(numLat) && numLat >= -90 && numLat <= 90) ? numLat : 13.0827;
    const longitude = (!isNaN(numLng) && numLng >= -180 && numLng <= 180) ? numLng : 80.2707;
    const timezone = (!isNaN(numTz) && numTz >= -12 && numTz <= 14) ? numTz : 5.5;

    const apiResponse = await fetch('https://json.freeastrologyapi.com/getsunriseandset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        year: y,
        month: m,
        date: d,
        latitude,
        longitude,
        timezone
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
