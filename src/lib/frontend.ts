import { query } from '@/lib/db';

export async function getFrontendContent(sectionId: string) {
  try {
    const rows = await query<any[]>('SELECT content FROM frontend_content WHERE section_id = ?', [sectionId]);
    if (rows.length > 0) {
      return rows[0].content; // mysql2 automatically parses JSON fields
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch frontend content for ${sectionId}:`, error);
    return null;
  }
}
