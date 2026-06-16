import { query } from './src/lib/db';

async function test() {
  const cats = await query('SELECT * FROM categories LIMIT 1');
  console.log(cats);
  console.log('Type of notes:', typeof cats[0].notes);
  console.log('Is Array?', Array.isArray(cats[0].notes));
  process.exit(0);
}

test();
