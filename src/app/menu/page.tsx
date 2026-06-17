import { query } from '@/lib/db';
import { type MenuCategory, type MenuItem } from '@/lib/menuData';
import MenuClient from '@/components/MenuClient';

interface DBCategory {
  id: string;
  name: string;
  subtitle: string | null;
  notes: string | null;
  add_ons: string | null;
  order_index: number;
}

interface DBItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string;
  calories: string | null;
  sodium: string | null;
  image: string;
  tags: string | null;
  is_available: number | null;
  extra_ingredients: string | null;
  order_index: number;
}

async function getMenuData(): Promise<MenuCategory[]> {
  const categories = await query<DBCategory[]>(
    'SELECT * FROM categories ORDER BY order_index ASC'
  );
  const items = await query<DBItem[]>(
    'SELECT * FROM items ORDER BY order_index ASC'
  );

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    subtitle: cat.subtitle || undefined,
    notes: cat.notes ? (cat.notes as any) : undefined,
    addOns: cat.add_ons ? (cat.add_ons as any) : undefined,
    items: items
      .filter((item) => item.category_id === cat.id && (item.is_available === 1 || item.is_available === null))
      .map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || undefined,
        price: item.price,
        calories: item.calories || undefined,
        sodium: item.sodium || undefined,
        image: item.image,
        tags: item.tags ? (item.tags as any) : undefined,
        isAvailable: item.is_available === 1 || item.is_available === null,
        extraIngredients: item.extra_ingredients ? (item.extra_ingredients as any) : undefined,
      })),
  }));
}

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const categories = await getMenuData();
  return <MenuClient initialCategories={categories} />;
}
