import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const clientId = process.env.PROKERALA_CLIENT_ID;
    const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: 'Prokerala credentials are not configured in .env.local' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { year, month, date, hours = 12, minutes = 0, latitude = 13.0827, longitude = 80.2707 } = body;

    const targetDate = new Date();
    let y = year || targetDate.getFullYear();
    let m = month || (targetDate.getMonth() + 1);
    let d = date || targetDate.getDate();

    // 1. Get OAuth Token from Prokerala
    const tokenRes = await fetch('https://api.prokerala.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      }).toString()
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return NextResponse.json({ success: false, error: `Prokerala Auth error: ${errText}` }, { status: tokenRes.status });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch Planet Positions
    const fetchPlanets = async (fetchYear: number, fetchMonth: number, fetchDate: number) => {
      // Format datetime to standard ISO format with timezone offset
      // e.g. 2004-02-12T15:19:21+05:30
      const formattedMonth = String(fetchMonth).padStart(2, '0');
      const formattedDate = String(fetchDate).padStart(2, '0');
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      
      const datetime = `${fetchYear}-${formattedMonth}-${formattedDate}T${formattedHours}:${formattedMinutes}:00+05:30`;
      const coordinates = `${latitude},${longitude}`;

      const url = `https://api.prokerala.com/v2/astrology/planet-position?datetime=${encodeURIComponent(datetime)}&coordinates=${encodeURIComponent(coordinates)}&ayanamsa=1&la=en`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response;
    };

    let planetRes = await fetchPlanets(y, m, d);

    // 3. Handle Sandbox Mode (Fallback to January 1st if Sandbox error 1004 is returned)
    if (!planetRes.ok) {
      const errData = await planetRes.json();
      const isSandboxError = errData.errors && errData.errors.some((e: any) => e.code === '1004');
      
      if (isSandboxError) {
        console.warn("Prokerala Sandbox limit reached. Falling back to January 1st of the requested year.");
        planetRes = await fetchPlanets(y, 1, 1);
      } else {
        return NextResponse.json({ success: false, error: 'Prokerala API Error', details: errData }, { status: planetRes.status });
      }
    }

    if (!planetRes.ok) {
      return NextResponse.json({ success: false, error: 'Prokerala API Error after fallback' }, { status: planetRes.status });
    }

    const planetData = await planetRes.json();

    // 4. Normalize the data format to match what our frontend SouthIndianChart component expects
    // The component expects an array of { name: string, sign: string }
    const normalizedData = planetData.data.planet_position.map((planet: any) => ({
      name: planet.name, // e.g. "Sun"
      sign: planet.rasi.name // e.g. "Dhanu", wait - Prokerala uses Vedic names for Rasi: "Dhanu", "Mesha"
    }));

    // Wait, we need to map Vedic Rasi names (Dhanu) to Western names (Sagittarius) so our existing TAMIL_SIGNS logic works!
    const rasiToWesternMap: Record<string, string> = {
      "Mesha": "Aries",
      "Vrishabha": "Taurus",
      "Mithuna": "Gemini",
      "Karka": "Cancer",
      "Simha": "Leo",
      "Kanya": "Virgo",
      "Tula": "Libra",
      "Vrischika": "Scorpio",
      "Dhanu": "Sagittarius",
      "Makara": "Capricorn",
      "Kumbha": "Aquarius",
      "Meena": "Pisces"
    };

    const finalData = normalizedData.map((p: any) => ({
      name: p.name,
      sign: rasiToWesternMap[p.sign] || p.sign
    }));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
