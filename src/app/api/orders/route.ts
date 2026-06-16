import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, orderType, orderInfo, specialNotes, totalAmount, items } = body;

    if (!customerName || !customerPhone || !orderType || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique order ID (e.g. QB-12345)
    const orderId = 'QB-' + Math.floor(10000 + Math.random() * 90000);

    // Insert order into database
    await query(
      `INSERT INTO orders (id, customer_name, customer_phone, order_type, order_info, special_notes, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [orderId, customerName, customerPhone, orderType, orderInfo || null, specialNotes || null, totalAmount]
    );

    // Insert order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items (order_id, item_id, item_name, quantity, price_at_time, add_ons, special_instructions)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.menuItemId,
          item.name,
          item.quantity,
          item.price,
          JSON.stringify(item.addOns),
          item.specialInstructions || null,
        ]
      );
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
