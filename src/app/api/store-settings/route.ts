import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET store settings (Public)
export async function GET(request: NextRequest) {
  try {
    const rows = await query<any[]>(
      'SELECT content FROM frontend_content WHERE section_id = ?',
      ['store_settings']
    );

    if (rows.length === 0) {
      // Default fallback if no config exists
      return NextResponse.json({ content: { isTakingOrders: true } });
    }

    // Try parsing if it's stringified JSON, though depending on db it might already be an object
    const contentStr = rows[0].content;
    const content = typeof contentStr === 'string' ? JSON.parse(contentStr) : contentStr;
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Failed to fetch store settings:', error);
    // On failure, fail safe by assuming taking orders, or not taking orders?
    // Usually better to fail safely, but for now we'll just return true to not break the store.
    return NextResponse.json({ content: { isTakingOrders: true } });
  }
}
