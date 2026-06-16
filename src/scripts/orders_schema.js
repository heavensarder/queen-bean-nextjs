// Seed script to create ordering tables — run with: node src/scripts/orders_schema.js
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'queen-bean',
  });

  console.log('Connected to database.');

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(100) PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      order_type VARCHAR(50) NOT NULL, -- 'Delivery', 'Pickup', 'Dine-in'
      order_info TEXT, -- Address, Pickup Time, or Table Number
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ orders table ready');

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(100) NOT NULL,
      item_id VARCHAR(100) NOT NULL,
      item_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price_at_time DECIMAL(10, 2) NOT NULL,
      add_ons JSON DEFAULT NULL,
      special_instructions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
  console.log('✓ order_items table ready');

  console.log('\n✅ Orders tables created successfully!');
  await connection.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
