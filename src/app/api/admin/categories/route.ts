import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/session';
import { revalidatePath } from 'next/cache';

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

// GET all categories
export async function GET(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const categories = await query<any[]>(
    'SELECT * FROM categories ORDER BY order_index ASC'
  );
  // Count items per category
  const counts = await query<any[]>(
    'SELECT category_id, COUNT(*) as count FROM items GROUP BY category_id'
  );
  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => {
    countMap[c.category_id] = c.count;
  });

  return NextResponse.json(
    categories.map((cat: any) => ({
      ...cat,
      item_count: countMap[cat.id] || 0,
    }))
  );
}

// POST create a new category
export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, subtitle, notes, addOns } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  // Generate ID from name
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Get max order_index
  const maxResult = await query<any[]>(
    'SELECT MAX(order_index) as max_order FROM categories'
  );
  const nextOrder = (maxResult[0]?.max_order ?? -1) + 1;

  await query(
    'INSERT INTO categories (id, name, subtitle, notes, add_ons, order_index) VALUES (?, ?, ?, ?, ?, ?)',
    [
      id,
      name,
      subtitle || null,
      notes ? JSON.stringify(notes) : null,
      addOns ? JSON.stringify(addOns) : null,
      nextOrder,
    ]
  );

  revalidatePath('/menu');
  return NextResponse.json({ id, name, order_index: nextOrder }, { status: 201 });
}

// PUT update a category
export async function PUT(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, name, subtitle, notes, addOns } = body;

  if (!id || !name) {
    return NextResponse.json(
      { error: 'ID and name are required' },
      { status: 400 }
    );
  }

  await query(
    'UPDATE categories SET name = ?, subtitle = ?, notes = ?, add_ons = ? WHERE id = ?',
    [
      name,
      subtitle || null,
      notes ? JSON.stringify(notes) : null,
      addOns ? JSON.stringify(addOns) : null,
      id,
    ]
  );

  revalidatePath('/menu');
  return NextResponse.json({ success: true });
}

// DELETE a category
export async function DELETE(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await query('DELETE FROM categories WHERE id = ?', [id]);
  revalidatePath('/menu');
  return NextResponse.json({ success: true });
}
