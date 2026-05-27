import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'Name and message are required fields.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Astrology Inquiry <onboarding@resend.dev>',
      to: 'kkarthikeyaastro@gmail.com',
      subject: `[Astro Inquiry] ${subject || 'New Consultation Inquiry'} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px;">New User Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 6px 0; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Mobile:</td>
              <td style="padding: 6px 0; color: #333;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0; color: #333;"><a href="mailto:${email}">${email || 'Not provided'}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 6px 0; color: #333; font-style: italic;">${subject || 'General inquiry'}</td>
            </tr>
          </table>
          <h3 style="color: #3730a3; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 12px;">Message</h3>
          <p style="color: #444; line-height: 1.6; white-space: pre-wrap; background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #eee;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 10px; color: #888; text-align: center;">Channeled via Kkarthikeya Astrological Centre Inquiry Portal</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Inquiry API internal error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
