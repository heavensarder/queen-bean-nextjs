import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Query for orders in the last hour
  const [lastHourResult] = await query<any[]>(
    "SELECT COUNT(*) as count FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)"
  );
  
  // Query for orders today
  const [todayResult] = await query<any[]>(
    "SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()"
  );
  
  // Query for orders this week
  const [thisWeekResult] = await query<any[]>(
    "SELECT COUNT(*) as count FROM orders WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)"
  );

  // Get 5 most recent orders for a quick view
  const recentOrders = await query<any[]>(
    "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5"
  );

  const lastHourCount = lastHourResult?.count || 0;
  const todayCount = todayResult?.count || 0;
  const thisWeekCount = thisWeekResult?.count || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">Dashboard Overview</h1>
        <p className="font-signature text-2xl text-[#86603A] mt-1">Real-time order statistics</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 relative z-10">Orders Last Hour</p>
          <p className="font-anton text-5xl text-zinc-900 relative z-10">{lastHourCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 relative z-10">Orders Today</p>
          <p className="font-anton text-5xl text-zinc-900 relative z-10">{todayCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 relative z-10">Orders This Week</p>
          <p className="font-anton text-5xl text-zinc-900 relative z-10">{thisWeekCount}</p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="font-anton text-2xl uppercase tracking-wider text-zinc-900">Recent Orders</h2>
          <Link 
            href="/admin/orders" 
            className="text-xs font-brandon uppercase tracking-widest font-bold text-[#86603A] hover:text-[#5e4329] transition-colors"
          >
            View All Live Orders →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-brandon">
            No orders found yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-zinc-50 transition-colors gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-anton text-lg text-zinc-900">{order.id}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'Pending' ? 'bg-red-100 text-red-700' :
                      order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                      order.status === 'Completed' ? 'bg-zinc-100 text-zinc-700' :
                      'bg-zinc-100 text-zinc-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-brandon text-sm text-zinc-600">
                    {order.customer_name} • {order.order_type} • ${order.total_amount}
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="font-brandon text-xs text-zinc-400">
                    {new Date(order.created_at).toLocaleString('en-US', { 
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
