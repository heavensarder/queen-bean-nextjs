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

// GET all items (optionally filtered by category_id)
export async function GET(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id');

  let items;
  if (categoryId) {
    items = await query<any[]>(
      'SELECT i.*, c.name as category_name FROM items i JOIN categories c ON i.category_id = c.id WHERE i.category_id = ? ORDER BY i.order_index ASC',
      [categoryId]
    );
  } else {
    items = await query<any[]>(
      'SELECT i.*, c.name as category_name FROM items i JOIN categories c ON i.category_id = c.id ORDER BY c.order_index ASC, i.order_index ASC'
    );
  }

  return NextResponse.json(items);
}

// POST create a new item
export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { category_id, name, description, price, calories, sodium, image, tags } = body;

  if (!category_id || !name || !price || !image) {
    return NextResponse.json(
      { error: 'category_id, name, price, and image are required' },
      { status: 400 }
    );
  }

  // Generate ID from name
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Get max order_index for this category
  const maxResult = await query<any[]>(
    'SELECT MAX(order_index) as max_order FROM items WHERE category_id = ?',
    [category_id]
  );
  const nextOrder = (maxResult[0]?.max_order ?? -1) + 1;

  await query(
    'INSERT INTO items (id, category_id, name, description, price, calories, sodium, image, tags, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      category_id,
      name,
      description || null,
      price,
      calories || null,
      sodium || null,
      image,
      tags && tags.length > 0 ? JSON.stringify(tags) : null,
      nextOrder,
    ]
  );

  revalidatePath('/menu');
  return NextResponse.json({ id, name, order_index: nextOrder }, { status: 201 });
}

// PUT update an item
export async function PUT(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, category_id, name, description, price, calories, sodium, image, tags } = body;

  if (!id || !name || !price || !image) {
    return NextResponse.json(
      { error: 'id, name, price, and image are required' },
      { status: 400 }
    );
  }

  await query(
    'UPDATE items SET category_id = ?, name = ?, description = ?, price = ?, calories = ?, sodium = ?, image = ?, tags = ? WHERE id = ?',
    [
      category_id,
      name,
      description || null,
      price,
      calories || null,
      sodium || null,
      image,
      tags && tags.length > 0 ? JSON.stringify(tags) : null,
      id,
    ]
  );

  revalidatePath('/menu');
  return NextResponse.json({ success: true });
}

// DELETE an item
export async function DELETE(request: NextRequest) {
  if (!(await verifyAuth(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await query('DELETE FROM items WHERE id = ?', [id]);
  revalidatePath('/menu');
  return NextResponse.json({ success: true });
}
