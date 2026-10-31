import { NextResponse } from 'next/server';
import { createAdminToken, verifyAdminToken, EXPECTED_ADMIN_USER, EXPECTED_ADMIN_PASS } from '@/lib/adminAuth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// POST: Verify login credentials and issue token
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`admin_auth_${ip}`, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        error: `Too many login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.` 
      }, { status: 429 });
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const userMatches = username.trim() === EXPECTED_ADMIN_USER;
    const passMatches = password.trim() === EXPECTED_ADMIN_PASS;

    if (userMatches && passMatches) {
      const token = createAdminToken(EXPECTED_ADMIN_USER);
      const response = NextResponse.json({ success: true, token });
      
      // Set secure HTTP-only cookie
      response.cookies.set('astro_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials. Access denied.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server authentication error' }, { status: 500 });
  }
}

// GET: Check if current request has a valid admin session
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  // Also check cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/astro_admin_token=([^;]+)/);
  const cookieToken = match ? match[1] : null;

  const token = bearerToken || cookieToken;

  if (verifyAdminToken(token)) {
    return NextResponse.json({ success: true, user: EXPECTED_ADMIN_USER });
  }

  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
