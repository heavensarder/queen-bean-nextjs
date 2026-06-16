import { query } from './src/lib/db';

async function test() {
  const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
  const orderItems = await query('SELECT * FROM order_items');
  
  const itemsMap = {};
  for (const item of orderItems) {
    if (!itemsMap[item.order_id]) {
      itemsMap[item.order_id] = [];
    }
    itemsMap[item.order_id].push({
      ...item,
      add_ons: item.add_ons ? item.add_ons : [],
    });
  }

  const fullOrders = orders.map(order => ({
    ...order,
    items: itemsMap[order.id] || [],
  }));

  console.log(JSON.stringify(fullOrders, null, 2));
}

test();
