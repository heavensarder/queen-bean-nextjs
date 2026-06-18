import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'queen-bean',
};

async function seed() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const defaultContent = {
      scriptTitle: "Better Choice",
      heading: "ENJOY THE TASTE<br />OF LIVING BETTER",
      paragraph: "Enjoy delicious and healthy meals with our Better Choices, created in collaboration with nutritionist Lut Van Lierde and inspired by the Planetary Health Diet. Each dish meets strict nutritional criteria, ensuring a perfect balance of flavor and well-being.",
      button1Text: "Learn more",
      button1Link: "#",
      button2Text: "View menu",
      button2Link: "/menu",
      image: "https://i.postimg.cc/pLTXCncL/customer-image-2nd-section.jpg"
    };

    await connection.query(
      `INSERT INTO frontend_content (section_id, content) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      ['home_second_section', JSON.stringify(defaultContent)]
    );
    console.log('Seeded home_second_section');
  } finally {
    await connection.end();
  }
}
seed();
