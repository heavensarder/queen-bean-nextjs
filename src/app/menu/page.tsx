import { menuCategories } from '@/lib/menuData';
import MenuClient from '@/components/MenuClient';

// This is a Server Component.
// In the future, you can replace the static import above with a database fetch:
// const categories = await db.collection('categories').find().toArray();

export default async function MenuPage() {
  // Simulating the future data fetch
  const categories = menuCategories;

  return <MenuClient initialCategories={categories} />;
}
