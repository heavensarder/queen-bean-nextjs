const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'queen-bean',
  });

  const [rows] = await connection.execute(
    'SELECT order_id, item_name, special_instructions, add_ons FROM order_items WHERE order_id = ?',
    ['QB-86286']
  );
  console.log('Order QB-86286 items:');
  console.log(JSON.stringify(rows, null, 2));
  await connection.end();
}

main();
