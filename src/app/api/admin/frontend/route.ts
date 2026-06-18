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

// GET frontend config
export async function GET(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section_id');

    if (!sectionId) {
      return NextResponse.json({ error: 'Missing section_id' }, { status: 400 });
    }

    const rows = await query<any[]>('SELECT * FROM frontend_content WHERE section_id = ?', [sectionId]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to fetch frontend content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update frontend config
export async function PUT(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section_id, content } = body;

    if (!section_id || !content) {
      return NextResponse.json({ error: 'Missing section_id or content' }, { status: 400 });
    }

    await query(
      `INSERT INTO frontend_content (section_id, content) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      [section_id, JSON.stringify(content)]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update frontend content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
