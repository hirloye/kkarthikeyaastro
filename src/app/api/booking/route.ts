import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { 
      bookingId,
      seekerName, 
      mobileNum, 
      dob, 
      tob, 
      pob, 
      planTitle, 
      planPrice,
      selectedDate, 
      selectedSlot 
    } = await request.json();

    if (!seekerName || !bookingId || !selectedDate || !selectedSlot) {
      return NextResponse.json({ success: false, error: 'Required booking parameters are missing.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Astrology Booking <onboarding@resend.dev>',
      to: 'kkarthikeyaastro@gmail.com',
      subject: `[Astro Booking] ${bookingId} - ${seekerName} (${planTitle})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 5px;">New Booking Scheduled</h2>
          <span style="font-size: 11px; color: #666; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Booking Reference: ${bookingId}</span>
          
          <h3 style="color: #3730a3; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">1. User Profile</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 6px 0; color: #333;">${seekerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Mobile:</td>
              <td style="padding: 6px 0; color: #333;">${mobileNum}</td>
            </tr>
          </table>

          <h3 style="color: #3730a3; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">2. Birth Specifications (Natal Chart)</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Date of Birth:</td>
              <td style="padding: 6px 0; color: #333;">${dob}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Time of Birth:</td>
              <td style="padding: 6px 0; color: #333;">${tob}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Place of Birth:</td>
              <td style="padding: 6px 0; color: #333;">${pob}</td>
            </tr>
          </table>

          <h3 style="color: #3730a3; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">3. Consultation Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Service Plan:</td>
              <td style="padding: 6px 0; color: #333; font-weight: bold;">${planTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Service Price:</td>
              <td style="padding: 6px 0; color: #b45309; font-weight: bold;">₹${planPrice}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Appointment Date:</td>
              <td style="padding: 6px 0; color: #333;">${selectedDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Time Slot:</td>
              <td style="padding: 6px 0; color: #333;">${selectedSlot}</td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
          <p style="font-size: 10px; color: #888; text-align: center;">Channeled via Kkarthikeya Astrological Centre Booking Portal</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Booking API error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Booking API internal error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
