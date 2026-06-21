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

  try {
    // 1. Alter items table to add sizes
    await connection.execute(`
      ALTER TABLE items
      ADD COLUMN sizes JSON DEFAULT NULL
    `);
    console.log('✓ Added "sizes" column to items table');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠ "sizes" column already exists in items table');
    } else {
      console.error('Error modifying items table:', error);
    }
  }

  try {
    // 2. Alter orders table to add financial breakdown
    await connection.execute(`
      ALTER TABLE orders
      ADD COLUMN subtotal DECIMAL(10, 2) DEFAULT 0,
      ADD COLUMN tax_amount DECIMAL(10, 2) DEFAULT 0,
      ADD COLUMN tip_amount DECIMAL(10, 2) DEFAULT 0
    `);
    console.log('✓ Added financial columns to orders table');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠ Financial columns already exist in orders table');
    } else {
      console.error('Error modifying orders table:', error);
    }
  }

  try {
    // 3. Alter order_items table to add size
    await connection.execute(`
      ALTER TABLE order_items
      ADD COLUMN size VARCHAR(50) DEFAULT NULL
    `);
    console.log('✓ Added "size" column to order_items table');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠ "size" column already exists in order_items table');
    } else {
      console.error('Error modifying order_items table:', error);
    }
  }

  console.log('\n✅ Schema migration completed!');
  await connection.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
