import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/session';

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

// GET mail config
export async function GET(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await query<any[]>(
      'SELECT * FROM frontend_content WHERE section_id = ?',
      ['mail_config']
    );

    if (rows.length === 0) {
      return NextResponse.json({ content: null });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to fetch mail config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update mail config
export async function PUT(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    // Validate required fields
    const required = ['senderEmail', 'receiverEmail', 'smtpHost', 'smtpPort', 'smtpUsername', 'smtpPassword'];
    for (const field of required) {
      if (!content[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    await query(
      `INSERT INTO frontend_content (section_id, content) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      ['mail_config', JSON.stringify(content)]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update mail config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
