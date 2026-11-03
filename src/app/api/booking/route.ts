import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';
import { escapeHtml } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`booking_${ip}`, 5, 2 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        error: `Too many booking submissions. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.` 
      }, { status: 429 });
    }

    const { 
      bookingId,
      seekerName, 
      mobileNum, 
      gender, 
      dob, 
      tob, 
      pob, 
      planTitle, 
      planPrice,
      selectedDate, 
      selectedSlot,
      bookingFor,
      relationship,
      bookedBy
    } = await request.json();

    if (!seekerName || !bookingId || !selectedDate || !selectedSlot) {
      return NextResponse.json({ success: false, error: 'Required booking parameters are missing.' }, { status: 400 });
    }

    if (
      typeof seekerName !== 'string' || seekerName.length > 100 ||
      typeof bookingId !== 'string' || bookingId.length > 50 ||
      (mobileNum && (typeof mobileNum !== 'string' || mobileNum.length > 30)) ||
      (pob && (typeof pob !== 'string' || pob.length > 150)) ||
      typeof selectedDate !== 'string' || selectedDate.length > 50 ||
      typeof selectedSlot !== 'string' || selectedSlot.length > 50
    ) {
      return NextResponse.json({ success: false, error: 'Booking parameter format or length invalid.' }, { status: 400 });
    }

    let formattedDob = dob;
    if (dob && typeof dob === 'string' && dob.includes('-')) {
      const parts = dob.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    let formattedTob = tob;
    if (tob && typeof tob === 'string' && tob.includes(':')) {
      const parts = tob.split(':');
      if (parts.length >= 2) {
        let hour = parseInt(parts[0], 10);
        if (!isNaN(hour)) {
          const ampm = hour >= 12 ? 'pm' : 'am';
          hour = hour % 12;
          hour = hour ? hour : 12;
          const minute = parts[1].substring(0, 2); // Ensure we just take minutes
          formattedTob = `${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
        }
      }
    }

    const isFamily = bookingFor === 'family';
    const safeRelationship = escapeHtml(relationship || (isFamily ? 'Family Member' : 'Self'));
    const safeBookedBy = escapeHtml(bookedBy || seekerName);

    // Save booking to Supabase (ignore 42P01 if table doesn't exist yet)
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([
        {
          booking_id: bookingId,
          seeker_name: isFamily ? `${seekerName} (${relationship || 'Family'})` : seekerName,
          mobile: mobileNum,
          plan_title: planTitle,
          selected_date: selectedDate,
          selected_slot: selectedSlot
        }
      ]);

    if (dbError && dbError.code !== '42P01') {
      console.error('Failed to save booking to database:', dbError);
    }

    // Escape all user-supplied content for safe email rendering
    const safeSeekerName = escapeHtml(seekerName);
    const safeMobileNum = escapeHtml(mobileNum);
    const safeGender = escapeHtml(gender || 'N/A');
    const safeFormattedDob = escapeHtml(formattedDob);
    const safeFormattedTob = escapeHtml(formattedTob);
    const safePob = escapeHtml(pob);
    const safePlanTitle = escapeHtml(planTitle);
    const safePlanPrice = escapeHtml(planPrice);
    const safeSelectedDate = escapeHtml(selectedDate);
    const safeSelectedSlot = escapeHtml(selectedSlot);
    const safeBookingId = escapeHtml(bookingId);

    // Prepare Email notification
    const emailPromise = resend.emails.send({
      from: 'Astrology Booking <onboarding@resend.dev>',
      to: 'kkarthikeyaastro@gmail.com',
      subject: `[Astro Booking] ${safeBookingId} - ${safeSeekerName}${isFamily ? ` (${safeRelationship})` : ''} (${safePlanTitle})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 5px;">New Booking Scheduled</h2>
          <span style="font-size: 11px; color: #666; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Booking Reference: ${safeBookingId}</span>
          
          <h3 style="color: #3730a3; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">1. Client Profile</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Consultation For:</td>
              <td style="padding: 6px 0; color: #333; font-weight: bold;">${safeSeekerName} ${isFamily ? `<span style="color: #4f46e5; font-size: 11px; background: #e0e7ff; padding: 2px 8px; border-radius: 10px;">${safeRelationship}</span>` : ''}</td>
            </tr>
            ${isFamily ? `
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Booked By Account:</td>
              <td style="padding: 6px 0; color: #555;">${safeBookedBy}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Mobile:</td>
              <td style="padding: 6px 0; color: #333;">${safeMobileNum}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Gender:</td>
              <td style="padding: 6px 0; color: #333;">${safeGender}</td>
            </tr>
          </table>

          <h3 style="color: #3730a3; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">2. Birth Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Date of Birth:</td>
              <td style="padding: 6px 0; color: #333;">${safeFormattedDob}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Time of Birth:</td>
              <td style="padding: 6px 0; color: #333;">${safeFormattedTob}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Place of Birth:</td>
              <td style="padding: 6px 0; color: #333;">${safePob}</td>
            </tr>
          </table>

          <h3 style="color: #3730a3; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">3. Consultation Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Service Plan:</td>
              <td style="padding: 6px 0; color: #333; font-weight: bold;">${safePlanTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Service Price:</td>
              <td style="padding: 6px 0; color: #b45309; font-weight: bold;">₹${safePlanPrice}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Appointment Date:</td>
              <td style="padding: 6px 0; color: #333;">${safeSelectedDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Time Slot:</td>
              <td style="padding: 6px 0; color: #333;">${safeSelectedSlot}</td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
          <p style="font-size: 10px; color: #888; text-align: center;">Sent via Kkarthikeya Astrological Centre Booking Portal</p>
        </div>
      `,
    });

    // Prepare Telegram Bot notification
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const cleanDigits = mobileNum ? mobileNum.replace(/[^\d]/g, '') : '';
    const waLink = cleanDigits ? `https://wa.me/${cleanDigits}` : '';

    const telegramPromise = (telegramToken && telegramChatId) ? (async () => {
      const recipientLine = isFamily
        ? `👤 *Recipient:* ${seekerName} (${relationship || 'Family'})\n🤝 *Booked By Account:* ${bookedBy}`
        : `👤 *Member:* ${seekerName}`;

      const tgMessage = 
        `🚨 *NEW ASTROLOGY BOOKING SCHEDULED!* 🚨\n\n` +
        `🆔 *Booking Ref:* \`${bookingId}\`\n` +
        `${recipientLine}\n` +
        `📞 *Mobile:* ${mobileNum}${waLink ? `\n💬 [Chat on WhatsApp](${waLink})` : ''}\n\n` +
        `🔮 *Plan:* ${planTitle} (₹${planPrice})\n` +
        `🗓️ *Date:* ${selectedDate}\n` +
        `⏰ *Slot:* ${selectedSlot}\n\n` +
        `📜 *Birth Details:*\n` +
        `• *Gender:* ${gender || 'N/A'}\n` +
        `• *DOB:* ${formattedDob}\n` +
        `• *TOB:* ${formattedTob}\n` +
        `• *POB:* ${pob}\n\n` +
        `✨ _Please verify birth details before consultation._`;

      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: tgMessage,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
          disable_notification: false // Explicitly play sound & trigger alert notification
        })
      });

      const resData = await response.json();
      if (!resData.ok) {
        console.error('Telegram API error:', resData);
      }
      return resData;
    })() : (async () => {
      console.warn('Telegram alert skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in .env.local');
      return null;
    })();

    // Fire both Email and Telegram at the exact same time
    const [emailResult, telegramResult] = await Promise.allSettled([emailPromise, telegramPromise]);

    if (emailResult.status === 'rejected') {
      console.error('Resend email failed:', emailResult.reason);
    }
    if (telegramResult.status === 'rejected') {
      console.error('Telegram dispatch failed:', telegramResult.reason);
    }

    return NextResponse.json({ success: true, bookingId });
  } catch (err: any) {
    console.error('Booking API internal error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
