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

// GET all orders
export async function GET(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await query<any[]>('SELECT * FROM orders ORDER BY created_at DESC');
    
    // Fetch all order items and group by order_id
    const orderItems = await query<any[]>('SELECT * FROM order_items');
    
    const itemsMap: Record<string, any[]> = {};
    for (const item of orderItems) {
      if (!itemsMap[item.order_id]) {
        itemsMap[item.order_id] = [];
      }
      itemsMap[item.order_id].push({
        ...item,
        add_ons: item.add_ons ? item.add_ons : [], // mysql2 parses JSON automatically
      });
    }

    const fullOrders = orders.map(order => ({
      ...order,
      items: itemsMap[order.id] || [],
    }));

    return NextResponse.json(fullOrders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update order status
export async function PUT(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an order
export async function DELETE(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    // Delete order items first (foreign key), then the order
    await query('DELETE FROM order_items WHERE order_id = ?', [id]);
    await query('DELETE FROM orders WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
