import { NextRequest, NextResponse } from 'next/server';
import { getMailConfig, createTransporter } from '@/lib/mail';

export const runtime = 'nodejs';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 emails per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

// POST — handle contact form submission
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Email format basic check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Get mail config
    const config = await getMailConfig();
    if (!config) {
      return NextResponse.json(
        { error: 'Contact form is currently unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const transporter = createTransporter(config);

    // Send the contact email to the receiver
    await transporter.sendMail({
      from: `"${config.forceSenderName || 'Queen Bean Website'}" <${config.senderEmail}>`,
      to: config.receiverEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; color: #1a1a1a; margin: 0; letter-spacing: 3px; text-transform: uppercase;">Queen Bean</h1>
            <p style="color: #86603A; font-size: 15px; margin-top: 4px; font-style: italic;">New Contact Form Submission</p>
          </div>
          
          <div style="background: #fdfbf7; border: 1px solid #e4e0d9; border-radius: 12px; padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e4e0d9; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; width: 100px; vertical-align: top;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e4e0d9; color: #1a1a1a; font-size: 15px;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e4e0d9; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; vertical-align: top;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e4e0d9; color: #1a1a1a; font-size: 15px;">
                  <a href="mailto:${escapeHtml(email)}" style="color: #86603A; text-decoration: none;">${escapeHtml(email)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e4e0d9; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; vertical-align: top;">Subject</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e4e0d9; color: #1a1a1a; font-size: 15px;">${escapeHtml(subject)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; vertical-align: top;">Message</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #999; font-size: 12px;">
              You can reply directly to this email to respond to <strong>${escapeHtml(name)}</strong>.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
