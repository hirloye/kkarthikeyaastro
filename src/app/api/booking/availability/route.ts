import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ success: false, error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('selected_slot')
      .eq('selected_date', date);

    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist yet, return empty array to not block UI
        return NextResponse.json({ success: true, bookedSlots: [] });
      }
      throw error;
    }

    const bookedSlots = data ? data.map(b => b.selected_slot) : [];
    return NextResponse.json({ success: true, bookedSlots });
  } catch (err: any) {
    console.error('Availability API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
