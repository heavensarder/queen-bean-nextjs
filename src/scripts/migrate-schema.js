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
    await connection.execute(`
      ALTER TABLE items 
      ADD COLUMN is_available BOOLEAN DEFAULT TRUE,
      ADD COLUMN extra_ingredients JSON DEFAULT NULL
    `);
    console.log('✓ Successfully added is_available and extra_ingredients to items table');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Fields already exist, skipping.');
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }

  await connection.end();
}

main().catch((err) => {
  console.error('Migration script failed:', err);
  process.exit(1);
});
