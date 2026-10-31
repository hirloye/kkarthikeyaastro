import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`inquiry_${ip}`, 5, 2 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        error: `Too many inquiries submitted. Please wait ${rateCheck.retryAfterSeconds} seconds before sending another.` 
      }, { status: 429 });
    }

    const { name, email, phone, subject, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'Name and message are required fields.' }, { status: 400 });
    }

    if (typeof name !== 'string' || name.length > 100 || typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json({ success: false, error: 'Input exceeds maximum allowed length.' }, { status: 400 });
    }

    if (phone && (typeof phone !== 'string' || phone.length > 30)) {
      return NextResponse.json({ success: false, error: 'Invalid phone number format.' }, { status: 400 });
    }

    if (email && (typeof email !== 'string' || email.length > 150)) {
      return NextResponse.json({ success: false, error: 'Invalid email format.' }, { status: 400 });
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email ? email.trim() : 'Not provided');
    const safePhone = escapeHtml(phone ? phone.trim() : 'Not provided');
    const safeSubject = escapeHtml(subject ? subject.trim() : 'New Consultation Inquiry');
    const safeMessage = escapeHtml(message.trim());

    const emailResponse = await resend.emails.send({
      from: 'Astrology Inquiry <onboarding@resend.dev>',
      to: 'kkarthikeyaastro@gmail.com',
      subject: `[Astro Inquiry] ${safeSubject} - ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px;">New User Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 6px 0; color: #333;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Mobile:</td>
              <td style="padding: 6px 0; color: #333;">${safePhone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0; color: #333;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 6px 0; color: #333; font-style: italic;">${safeSubject}</td>
            </tr>
          </table>
          <h3 style="color: #3730a3; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 12px;">Message</h3>
          <p style="color: #444; line-height: 1.6; white-space: pre-wrap; background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #eee;">${safeMessage}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 10px; color: #888; text-align: center;">Channeled via Kkarthikeya Astrological Centre Inquiry Portal</p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      return NextResponse.json({ success: false, error: emailResponse.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: emailResponse.data });
  } catch (err: any) {
    console.error('Inquiry API internal error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
