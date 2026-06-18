import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'queen-bean',
};

async function seedFrontend() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    console.log('Creating frontend_content table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS frontend_content (
        section_id VARCHAR(100) PRIMARY KEY,
        content JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    console.log('Seeding home_hero content...');
    const defaultContent = {
      backgroundImage: "https://i.postimg.cc/J0HXDkNG/hero-background.jpg",
      foodImage: "https://i.postimg.cc/gct4xyWZ/omelete-heroimage.png",
      texts: [
        "THIS IS NOT<br />JUST FOOD.",
        "THIS IS OUR<br />PHILOSOPHY.",
        "IT'S ABOUT<br />TIME.",
        "TIME FOR SLOWING<br />DOWN.",
        "TIME FOR<br />CONNECTION."
      ]
    };

    // Insert or update (if already exists)
    await connection.query(
      `INSERT INTO frontend_content (section_id, content) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      ['home_hero', JSON.stringify(defaultContent)]
    );

    console.log('Frontend seed completed successfully.');
  } catch (error) {
    console.error('Error seeding frontend content:', error);
  } finally {
    await connection.end();
  }
}

seedFrontend();
