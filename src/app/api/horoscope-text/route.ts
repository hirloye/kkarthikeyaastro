import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get('sign') || 'aries';
    const day = searchParams.get('day') || 'today';

    const res = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=${day}`, {
      method: 'GET',
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`External Horoscope API returned status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
