import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const clientId = process.env.PROKERALA_CLIENT_ID;
    const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: 'Prokerala credentials missing' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const sign = searchParams.get('sign') || 'aries';
    const day = searchParams.get('day') || 'today';

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
      return NextResponse.json({ success: false, error: `Auth error: ${errText}` }, { status: tokenRes.status });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Resolve Datetime based on day param
    const targetDate = new Date();
    if (day === 'yesterday') {
      targetDate.setDate(targetDate.getDate() - 1);
    } else if (day === 'tomorrow') {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
    const fetchPrediction = async (dateObj: Date) => {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      const datetime = `${y}-${m}-${d}T12:00:00+05:30`;
      
      const url = `https://api.prokerala.com/v2/horoscope/daily?sign=${encodeURIComponent(sign)}&datetime=${encodeURIComponent(datetime)}`;
      
      return await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
    };

    let predictionRes = await fetchPrediction(targetDate);

    // 3. Handle Sandbox Mode limits
    if (!predictionRes.ok) {
      const errData = await predictionRes.json();
      const isSandboxError = errData.errors && errData.errors.some((e: any) => e.code === '1004');
      
      if (isSandboxError) {
        console.warn("Prokerala Sandbox limit reached for text API. Falling back to Jan 1.");
        const fallbackDate = new Date(targetDate.getFullYear(), 0, 1);
        predictionRes = await fetchPrediction(fallbackDate);
      } else {
        return NextResponse.json({ success: false, error: 'Prokerala API Error', details: errData }, { status: predictionRes.status });
      }
    }

    if (!predictionRes.ok) {
      return NextResponse.json({ success: false, error: 'Prokerala API Error after fallback' }, { status: predictionRes.status });
    }

    const predictionData = await predictionRes.json();
    const predictionText = predictionData?.data?.daily_prediction?.prediction || 'Horoscope reading unavailable.';

    return NextResponse.json({
      success: true,
      data: { horoscope: predictionText }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
