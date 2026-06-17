// Seed script — run with: node src/scripts/seed.js
// This creates the `categories` and `items` tables and populates them with existing menuData.

const mysql = require('mysql2/promise');

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'queen-bean',
  });

  console.log('Connected to database.');

  // ── Create Tables ──────────────────────────────────
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subtitle VARCHAR(500) DEFAULT NULL,
      notes JSON DEFAULT NULL,
      add_ons JSON DEFAULT NULL,
      order_index INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ categories table ready');

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id VARCHAR(100) PRIMARY KEY,
      category_id VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      price VARCHAR(50) NOT NULL,
      calories VARCHAR(50) DEFAULT NULL,
      sodium VARCHAR(50) DEFAULT NULL,
      image VARCHAR(500) NOT NULL,
      tags JSON DEFAULT NULL,
      is_available BOOLEAN DEFAULT TRUE,
      extra_ingredients JSON DEFAULT NULL,
      order_index INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);
  console.log('✓ items table ready');

  // ── Seed Data ──────────────────────────────────────
  const categories = [
    {
      id: 'crafted-hot-drinks',
      name: 'Crafted Hot Drinks',
      notes: [
        'Pick whole or non-fat dairy milk.',
        'Add dairy free milk (Oat, almond or soy milk +1)',
        'Crafted with your favorite flavor (vanilla, caramel, salted caramel, hazelnut, honey, maypole syrup +1)',
      ],
      items: [
        { id: 'coffee', name: 'Coffee', price: '4.50', sodium: '30mg', image: img('1509042239860-f550ce710b93') },
        { id: 'latte', name: 'Latte', price: '5.25 / 6.25', calories: '80–140 cal', sodium: '90–110mg', image: img('1461023058943-07fcbe16d735') },
        { id: 'cappuccino', name: 'Cappuccino', price: '5.25 / 6.25', calories: '80–130 cal', sodium: '90–100mg', image: img('1572442388796-11668a67e53d') },
        { id: 'americano', name: 'Americano', price: '4.25 / 5.25', calories: '0 cal', sodium: '10mg', image: img('1461023058943-07fcbe16d735') },
        { id: 'cafe-au-lait', name: 'Cafe Au Lait', price: '⅝', calories: '40–110 cal', sodium: '50–80mg', image: img('1495474472287-4d71bcdd2085') },
        { id: 'macchiato', name: 'Macchiato', price: '3.75 / 4.50', calories: '20–160 cal', sodium: '50–80mg', image: img('1485808191679-5f86510681a2') },
        { id: 'espresso', name: 'Espresso', price: '3.50 / 4.50', calories: '0 cal', sodium: '10mg', image: img('1534687941688-651ccaafbff8') },
      ],
    },
    {
      id: 'tea-salon',
      name: 'Tea Salon',
      items: [
        { id: 'house-reserve', name: 'House Reserve', price: '4.75', image: img('1556679343-c7306c1976bc') },
      ],
    },
    {
      id: 'queen-favorite',
      name: 'Queen Favorite',
      notes: ['Make it dirty +1.25'],
      items: [
        { id: 'mocha-latte', name: 'Mocha Latte', price: '5.50 / 6.50', calories: '170–300 cal', sodium: '110–210mg', image: img('1578314675249-a6910f80cc4e') },
        { id: 'hot-chocolate', name: 'Hot Chocolate', price: '5.25 / 6.50', calories: '180–320 cal', sodium: '130–160mg', image: img('1542990253-0d0f5be5f0ed') },
        { id: 'matcha-latte', name: 'Matcha Latte', price: '5.75 / 6.75', calories: '60–140 cal', sodium: '70–130mg', image: img('1556881286-fc6915169721') },
        { id: 'chai-latte', name: 'Chai Latte', price: '5.75 / 6.75', image: img('1557006021-b85faa2bc5e2') },
      ],
    },
    {
      id: 'the-ice-bar',
      name: 'The Ice Bar',
      items: [
        { id: 'cold-brews', name: 'Cold Brews', price: '5.00', calories: '0 cal', sodium: '30mg', image: img('1517701550927-30cf4ba1dba5') },
        { id: 'ice-latte', name: 'Ice Latte', price: '5.25 / 6.25', calories: '30–110 cal', sodium: '70–100mg', image: img('1517701604599-bb29b565090c') },
        { id: 'ice-matcha-latte', name: 'Ice Matcha Latte', price: '5.50 / 6.50', calories: '60–140 cal', sodium: '70–130mg', image: img('1525385133512-2f3bdd039054') },
        { id: 'iced-tea', name: 'Iced Tea', price: '4.75 / 5.75', calories: '0 cal', sodium: '10mg', image: img('1517701550927-30cf4ba1dba5') },
        { id: 'ice-green-tea', name: 'Ice Green Tea', price: '4.75 / 5.75', calories: '0 cal', sodium: '10mg', image: img('1556881286-fc6915169721') },
        { id: 'orange-juice', name: 'Orange Juice', description: 'Bottle 5.50', price: '5.00', calories: '120 cal', sodium: '10mg', image: img('1534353473418-4cfa6c56fd38') },
        { id: 'apple-juice', name: 'Apple Juice', description: 'Bottle 5.50', price: '5.00', calories: '150 cal', sodium: '10mg', image: img('1576673442511-7e39b6545c87') },
        { id: 'still-sparkling-water', name: 'Still & Sparkling Water, Spindrift', price: '3.50', calories: '0 cal', sodium: '0mg', image: img('1548839140-29a749e1cf4d') },
        { id: 'homemade-lemonade', name: 'Homemade Lemonade', price: '4.50', calories: '60 cal', sodium: '20mg', image: img('1621263764928-df1444c5e859') },
        { id: 'lemonade-iced-tea', name: 'Lemonade Iced Tea', price: '4.75', calories: '40 cal', sodium: '10mg', image: img('1556679343-c7306c1976bc') },
        { id: 'mint-lemonade', name: 'Mint Lemonade', price: '5.00', calories: '60 cal', sodium: '20mg', image: img('1621263764928-df1444c5e859') },
      ],
    },
    {
      id: 'the-brunch',
      name: 'The Brunch',
      items: [
        { id: 'breakfast-sandwich', name: 'Breakfast Sandwich', description: 'Egg, American cheese, avocado, mayo', price: '12.50', calories: '590 cal', sodium: '423mg', image: img('1528735602780-2552fd46c7af') },
        { id: 'mozzarella-sandwich', name: 'Mozzarella Sandwich', description: 'Organic tomato, fresh mozzarella, mix green, basil oil on French roll', price: '13.50', calories: '480 cal', sodium: '700mg', image: img('1554433607-66b5efe9d304') },
        { id: 'ham-and-cheese', name: 'Ham and Cheese', description: 'American, mustard, pickles onion, arugula', price: '13.50', calories: '430 cal', sodium: '1000mg', image: img('1509722747041-616f39b57569') },
        { id: 'heirloom-tomato-avocado', name: 'Heirloom Tomato & Avocado Breakfast Muffin', description: 'Organic tomato, avocado, sunny side egg on English muffin', price: '13.00', calories: '540 cal', sodium: '379mg', image: img('1525351484163-7529414344d8') },
        { id: 'morning-fuel-bowl', name: 'Morning Fuel Bowl', description: 'Avocado toast, hardboiled egg, banana, strawberry, blueberries', price: '13.75', calories: '511 cal', sodium: '222mg', image: img('1490645935967-10de6ba17061') },
        { id: 'dutch-pancakes', name: 'Dutch Pancakes', price: '12.75', calories: '540 cal', sodium: '10mg', image: img('1567620905732-2d1ec7ab7445') },
        { id: 'pearl-sugar-belgian-waffle', name: 'Pearl Sugar Belgian Waffle', price: '12.50', calories: '490 cal', sodium: '10mg', image: img('1562376552-0d160a2f238d') },
      ],
    },
    {
      id: 'organic-fruits-yogurt',
      name: 'Organic Fruits & Yogurt',
      items: [
        { id: 'blueberries-banana-oat', name: 'Organic Blueberries Banana Oat', description: 'Chia seed, with choice of your favorite milk', price: '9.50', calories: '370 cal', sodium: '180mg', image: img('1495521821757-a1efb6729352') },
        { id: 'apple-cinnamon-oat', name: 'Organic Apple Cinnamon Oat', description: 'Almond milk, cube apple, chia seed, cinnamon', price: '9.50', calories: '380 cal', sodium: '240mg', image: img('1495521821757-a1efb6729352') },
        { id: 'greek-yogurt-granola-parfait', name: 'Greek Yogurt with Granola Parfait', price: '10.00', calories: '300 cal', sodium: '120mg', image: img('1488477181946-6428a0291777') },
        { id: 'greek-yogurt-night-parfait', name: 'Greek Yogurt Night Parfait', description: 'Honey, chia seed, blueberries, granola', price: '11.00', calories: '490 cal', sodium: '160mg', image: img('1505252585461-04db1eb84625') },
        { id: 'organic-mix-fruits-salad', name: 'Organic Mix Fruits Salad', description: 'All seasonal fruits', price: '8.00', calories: '90 cal', sodium: '10mg', image: img('1490474418585-ba9bad8fd0ea') },
      ],
    },
    {
      id: 'salad',
      name: 'Salad',
      items: [
        { id: 'greek-olives-feta', name: 'Greek Olives Feta Salad', description: 'Chopped romaine, cucumber, tomato, cherry tomato, chickpeas, olives, feta, red onion, parsley, olive oil, lime juice', price: '15.50', calories: '420 cal', sodium: '1059mg', image: img('1512621776951-a57141f2eefd') },
        { id: 'chicken-cobb', name: 'Chicken Cobb Salad', description: 'Chicken, bacon, romaine, feta, hardboiled egg, avocado, cherry tomato, olive oil, cucumber, mix green', price: '16.50', calories: '615 cal', sodium: '900mg', image: img('1546069901-ba9599a7e63c') },
        { id: 'black-lentil-bowl', name: 'Black Lentil Bowl', description: 'Lentil, cherry tomato, hummus, mixed green, cucumber, balsamic beets, walnut dukkha, vinaigrette, tahini', price: '15.25', calories: '475 cal', sodium: '800mg', image: img('1505253716362-afaea1d3d1af') },
        { id: 'chicken-quinoa-salad', name: 'Chicken Quinoa Salad Bowl', description: 'Chicken, quinoa, avocado, cucumber, cherry tomato, mixed green, parsley, lime juice, bit of garlic powder', price: '16.25', calories: '450 cal', sodium: '260mg', image: img('1540420773420-3366772f4999') },
        { id: 'mediterranean-white-bean', name: 'Mediterranean White Bean Salad', description: 'Romaine, cooked white bean, hardboiled egg, cherry tomato, kalamata olives, red onion, feta, olive oil, red wine vinegar', price: '16.50', calories: '560 cal', sodium: '850mg', image: img('1607532941433-304659e8198a') },
      ],
    },
    {
      id: 'omelet',
      name: 'Omelet',
      subtitle: 'Comes with salad & baguette',
      items: [
        { id: 'veggie-omelet', name: 'Veggie Omelet with Avocado, Apple & Dried Fig', description: 'Green pepper, spinach, tomato, dried fig and apple, vinaigrette', price: '16.50', calories: '620 cal', sodium: '760mg', image: img('1510693206972-df098062cb71') },
        { id: 'scrambled-eggs', name: 'Scrambled Eggs, Avocado & Berries', price: '13.50', calories: '429 cal', sodium: '193mg', image: img('1525351484163-7529414344d8') },
        { id: 'rustic-mushroom-chevre', name: 'Rustic Mushroom and Chèvre Omelet', description: 'Goat cheese omelet', price: '15.50', calories: '400 cal', sodium: '710mg', image: img('1533089860892-a7c6f0a88666') },
        { id: 'paris-fold', name: 'The Paris Fold', description: 'Ham and cheese (American) omelet', price: '16.00', calories: '460 cal', sodium: '960mg', image: img('1510693206972-df098062cb71') },
        { id: 'hard-boiled-egg-avocado', name: 'Hard Boiled Egg and Avocado', description: '2 boiled egg, avocado, chili flakes', price: '9.00', calories: '317 cal', sodium: '131mg', image: img('1482049016688-2d3e1b311543') },
      ],
    },
    {
      id: 'crafted-toasts',
      name: 'Crafted Toasts',
      items: [
        { id: 'avocado-toast', name: 'Avocado Toast', description: 'Avocado mash, cumin salt, sunny side egg, marinated kale', price: '15.25', calories: '580 cal', sodium: '710mg', image: img('1541519227354-08fa5d50c44d') },
        { id: 'avo-toast-cottage-cheese', name: 'Avo Toast with Cottage Cheese & Tomato', description: 'Avocado mash, cottage cheese, cherry tomato, touch of balsamic glaze', price: '15.25', calories: '420 cal', sodium: '520mg', image: img('1484723091739-30a097e8f929') },
        { id: 'toasted-chicken-mozzarella', name: 'Toasted Chicken & Mozzarella Sandwich', description: 'Radish, cherry tomato, sliced pickles, mix green, organic tomato jam', price: '15.75', calories: '680 cal', sodium: '1050mg', image: img('1554433607-66b5efe9d304') },
        { id: 'roasted-turkey-bacon-avocado', name: 'Roasted Turkey, Bacon, Avocado', description: 'Modern club tartine — radish, cucumber, sliced pickles, mix green, Erb mayo', price: '16.00', calories: '610 cal', sodium: '1300mg', image: img('1509722747041-616f39b57569') },
        { id: 'smoked-salmon-goat-cheese', name: 'Smoked Salmon & Herbed Goat Cheese Tartine', price: '16.50', calories: '420 cal', sodium: '1100mg', image: img('1485963631004-f2f00b1d6606') },
      ],
    },
    {
      id: 'croissant-sandwich',
      name: 'Croissant Sandwich',
      addOns: [
        { name: 'Smoke Salmon', price: '+5' },
        { name: 'Chicken', price: '+4' },
        { name: 'Bacon', price: '+2.50' },
        { name: 'Avocado', price: '+2.50' },
      ],
      items: [
        { id: 'egg-spinach-feta-croissant', name: 'Egg Spinach & Feta Croissant', price: '12.50', calories: '350 cal', sodium: '650mg', image: img('1509722747041-616f39b57569') },
        { id: 'smoked-salmon-cream-cheese-croissant', name: 'Smoked Salmon Cream Cheese & Cucumber Croissant', price: '13.75', calories: '460 cal', sodium: '946mg', image: img('1485963631004-f2f00b1d6606') },
        { id: 'turkey-avocado-cheese-croissant', name: 'Turkey Avocado & Cheese on Croissant', price: '13.50', calories: '597 cal', sodium: '1160mg', image: img('1550507992-eb63ffee0847') },
        { id: 'parisian-ham-cheese-croissant', name: 'Parisian Ham & Cheese Croissant', price: '12.75', calories: '560 cal', sodium: '1200mg', image: img('1509365390695-33aee754301f') },
        { id: 'parisian-egg-gruyere-croissant', name: 'Parisian Egg & Gruyère Croissant', price: '11.75', calories: '450 cal', sodium: '750mg', image: img('1530610476181-d83430b64dcd') },
      ],
    },
    {
      id: 'soup',
      name: 'Soup',
      items: [
        { id: 'chickpea-lemon-orzo', name: 'Chickpea & Lemon Orzo', price: '7.50 / 9.50', tags: ['VN', 'DF'], image: img('1547592166-23ac45744acd') },
        { id: 'italian-minestrone', name: 'Italian Minestrone', price: '7.50 / 9.50', tags: ['VN', 'DF'], image: img('1547592166-23ac45744acd') },
        { id: 'chicken-noodle-soup', name: 'Chicken Noodle Soup', price: '7.50 / 9.50', tags: ['DF'], image: img('1604152135912-04a022e23696') },
        { id: 'three-lentil-chili', name: 'Three Lentil Chili', price: '7.50 / 9.50', tags: ['VN', 'GF', 'DF'], image: img('1455619452474-d2be8b1e70cd') },
      ],
    },
    {
      id: 'side',
      name: 'Side',
      items: [
        { id: 'bread', name: 'Bread', price: '3.00', image: img('1476224203421-9ac39bcb3327') },
        { id: 'avocado-side', name: 'Avocado', price: '3.00', image: img('1523049673857-eb18f1d7b578') },
        { id: 'hummus-side', name: 'Hummus', price: '3.50', image: img('1505253758473-96b7015fcd40') },
        { id: 'chicken-side', name: 'Chicken', price: '4.00', image: img('1532550907401-a500c9a57435') },
        { id: 'turkey-side', name: 'Turkey', price: '4.00', image: img('1574672280600-4accfa5b6f98') },
        { id: 'bacon-side', name: 'Bacon', price: '3.50', image: img('1528607929212-2636ec44253e') },
        { id: 'ham-side', name: 'Ham', price: '4.00', image: img('1529692236671-f1f6cf9683ba') },
        { id: 'goat-cheese-side', name: 'Goat Cheese', price: '3.50', image: img('1618164436241-4473940d1f5c') },
        { id: 'cheddar-side', name: 'Cheddar', price: '2.75', image: img('1618164436241-4473940d1f5c') },
        { id: 'feta-side', name: 'Feta', price: '3.50', image: img('1626957341926-98752fc2ba90') },
        { id: 'gruyere-side', name: 'Gruyère', price: '2.75', image: img('1452195100486-9cc805987862') },
        { id: 'organic-egg-side', name: 'Organic Egg', description: 'Sunny side, hard boiled, scramble, soft boiled', price: '3.00', image: img('1482049016688-2d3e1b311543') },
      ],
    },
    {
      id: 'pastry',
      name: 'Pastry',
      items: [
        { id: 'croissant-pastry', name: 'Croissant', price: '4.50', calories: '260 cal', sodium: '210mg', image: img('1555507036-ab1f4038024a') },
        { id: 'chocolate-croissant', name: 'Chocolate Croissant', price: '5.25', calories: '310 cal', sodium: '200mg', image: img('1530610476181-d83430b64dcd') },
        { id: 'apple-turn-over', name: 'Apple Turn Over', price: '5.00', calories: '250 cal', sodium: '220mg', image: img('1509365390695-33aee754301f') },
        { id: 'cheese-danish', name: 'Cheese Danish', price: '5.00', calories: '300 cal', sodium: '300mg', image: img('1509365390695-33aee754301f') },
        { id: 'pain-aux-raisins', name: 'Pain aux Raisins', price: '5.00', calories: '320 cal', sodium: '280mg', image: img('1558961363-fa8fdf82db35') },
        { id: 'chocolate-twist', name: 'Chocolate Twist', price: '5.25', image: img('1509365390695-33aee754301f') },
        { id: 'blueberry-muffin', name: 'Blueberry Muffin', price: '5.25', calories: '490 cal', sodium: '360mg', image: img('1607958996333-41aef7caefaa') },
        { id: 'chocolate-chip-cookie', name: 'Chocolate Chip Cookie', price: '—', image: img('1499636136210-6f4ee915583e') },
        { id: 'double-chocolate-chip-cookie', name: 'Double Chocolate Chip Cookie', price: '—', image: img('1548365328-8c6db3220e4c') },
        { id: 'chocolate-brownie', name: 'Chocolate Brownie', price: '—', image: img('1515037893149-de7f840978e2') },
      ],
    },
  ];

  // Clear existing data first
  await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
  await connection.execute('TRUNCATE TABLE items');
  await connection.execute('TRUNCATE TABLE categories');
  await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✓ Cleared existing data');

  for (let catIdx = 0; catIdx < categories.length; catIdx++) {
    const cat = categories[catIdx];
    await connection.execute(
      'INSERT INTO categories (id, name, subtitle, notes, add_ons, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [
        cat.id,
        cat.name,
        cat.subtitle || null,
        cat.notes ? JSON.stringify(cat.notes) : null,
        cat.addOns ? JSON.stringify(cat.addOns) : null,
        catIdx,
      ]
    );

    for (let itemIdx = 0; itemIdx < cat.items.length; itemIdx++) {
      const item = cat.items[itemIdx];
      await connection.execute(
        'INSERT INTO items (id, category_id, name, description, price, calories, sodium, image, tags, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          item.id,
          cat.id,
          item.name,
          item.description || null,
          item.price,
          item.calories || null,
          item.sodium || null,
          item.image,
          item.tags ? JSON.stringify(item.tags) : null,
          itemIdx,
        ]
      );
    }
    console.log(`  ✓ Seeded category: ${cat.name} (${cat.items.length} items)`);
  }

  console.log('\n✅ Database seeded successfully!');
  await connection.end();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
