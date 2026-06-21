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

  // Find all items that have a slash in their price
  const [rows] = await connection.execute('SELECT id, name, price FROM items WHERE price LIKE "%/%"');
  
  let updatedCount = 0;

  for (const row of rows) {
    const parts = row.price.split('/');
    if (parts.length === 2) {
      // Clean up the string (e.g. replacing accidental commas with periods)
      let price1 = parts[0].trim().replace(',', '.').replace(/[^0-9.]/g, '');
      let price2 = parts[1].trim().replace(',', '.').replace(/[^0-9.]/g, '');
      
      const sizes = [
        { name: 'Small', price: price1 },
        { name: 'Large', price: price2 }
      ];
      
      await connection.execute(
        'UPDATE items SET sizes = ? WHERE id = ?',
        [JSON.stringify(sizes), row.id]
      );
      
      console.log(`✓ Updated "${row.name}" (${row.price}) -> Small: $${price1}, Large: $${price2}`);
      updatedCount++;
    }
  }

  console.log(`\n✅ Migration complete. Updated ${updatedCount} items to use "Small" and "Large" sizes!`);
  await connection.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
