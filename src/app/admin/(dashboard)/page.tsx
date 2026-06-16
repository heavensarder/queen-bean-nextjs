import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const categories = await query<any[]>(
    'SELECT c.*, (SELECT COUNT(*) FROM items i WHERE i.category_id = c.id) as item_count FROM categories c ORDER BY c.order_index ASC'
  );
  const [itemCountResult] = await query<any[]>(
    'SELECT COUNT(*) as total FROM items'
  );

  const totalCategories = categories.length;
  const totalItems = itemCountResult?.total || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">Dashboard Overview</h1>
        <p className="font-signature text-2xl text-[#86603A] mt-1">Welcome back to Queen Bean Admin</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <p className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Total Categories</p>
          <p className="font-anton text-5xl text-zinc-900">{totalCategories}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <p className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Total Menu Items</p>
          <p className="font-anton text-5xl text-zinc-900">{totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-brandon text-xs uppercase tracking-widest text-[#86603A] font-bold mb-2">System Status</p>
            <p className="font-anton text-3xl text-[#86603A] mt-2">Online</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#86603A]/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* Recent Categories */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="font-anton text-2xl uppercase tracking-wider text-zinc-900">All Categories</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {categories.map((cat: any) => (
            <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div>
                <p className="font-brandon font-bold text-lg text-zinc-900">{cat.name}</p>
                <p className="font-brandon text-sm text-zinc-500">{cat.item_count} items</p>
              </div>
              <a
                href="/admin/items"
                className="text-xs font-brandon uppercase tracking-widest font-bold text-[#86603A] border border-[#86603A]/30 px-4 py-2 rounded-lg hover:bg-[#86603A] hover:text-white transition-colors"
              >
                View Items
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
