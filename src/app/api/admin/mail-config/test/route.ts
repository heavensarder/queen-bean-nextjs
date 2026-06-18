import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { getMailConfig, createTransporter } from '@/lib/mail';

export const runtime = 'nodejs';

async function verifyAuth(request: NextRequest) {
  const cookie = request.cookies.get('session')?.value;
  if (!cookie) return false;
  try {
    await decrypt(cookie);
    return true;
  } catch {
    return false;
  }
}

// POST — send a test email
export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await getMailConfig();
    if (!config) {
      return NextResponse.json(
        { error: 'Mail configuration not found. Please save your config first.' },
        { status: 400 }
      );
    }

    const transporter = createTransporter(config);

    // Verify the connection first
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: `"${config.forceSenderName || 'Queen Bean'}" <${config.senderEmail}>`,
      to: config.receiverEmail,
      subject: '✅ Queen Bean — Test Email Successful',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #1a1a1a; margin: 0; letter-spacing: 2px;">QUEEN BEAN</h1>
            <p style="color: #86603A; font-size: 16px; margin-top: 4px; font-style: italic;">Mail Configuration Test</p>
          </div>
          <div style="background: #fdfbf7; border: 1px solid #e4e0d9; border-radius: 12px; padding: 32px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">✉️</div>
            <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 12px 0;">It Works!</h2>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
              Your Gmail SMTP configuration is working perfectly. Contact form submissions from your website will now be delivered to this email address.
            </p>
            <hr style="border: none; border-top: 1px solid #e4e0d9; margin: 24px 0;" />
            <p style="color: #999; font-size: 12px; margin: 0;">
              Sent from <strong>${config.forceSenderName || 'Queen Bean'}</strong> via ${config.smtpHost}:${config.smtpPort}
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Test email sent successfully!' });
  } catch (error: any) {
    console.error('Test email failed:', error);

    // Provide user-friendly error messages
    let userMessage = 'Failed to send test email.';
    if (error.code === 'EAUTH') {
      userMessage = 'Authentication failed. Check your Gmail username and App Password.';
    } else if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      userMessage = 'Could not connect to SMTP server. Check host and port settings.';
    } else if (error.code === 'EENVELOPE') {
      userMessage = 'Invalid sender or receiver email address.';
    } else if (error.message) {
      userMessage = error.message;
    }

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
