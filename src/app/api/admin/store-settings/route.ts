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

// GET store settings
export async function GET(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await query<any[]>(
      'SELECT content FROM frontend_content WHERE section_id = ?',
      ['store_settings']
    );

    if (rows.length === 0) {
      return NextResponse.json({ content: null });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to fetch store settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update store settings
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

    await query(
      `INSERT INTO frontend_content (section_id, content) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      ['store_settings', JSON.stringify(content)]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update store settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
