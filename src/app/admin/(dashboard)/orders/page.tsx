'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  price_at_time: string;
  add_ons: { name: string; price: string }[];
  special_instructions: string | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'Pickup' | 'Delivery' | 'In-Restaurant';
  order_info: string | null;
  special_notes: string | null;
  total_amount: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

const ORDERS_PER_PAGE = 8;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Today's date string for highlight comparison
  const todayStr = new Date().toISOString().split('T')[0];

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) fetchOrders();
    } catch {
      fetchOrders();
    }
  };

  const deleteOrder = async (id: string) => {
    // Optimistic removal
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setDeleteConfirm(null);
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      if (!res.ok) fetchOrders();
    } catch {
      fetchOrders();
    }
  };

  // ── FILTERING & SEARCH ──
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Status filter
    if (filterStatus !== 'All') {
      result = result.filter((o) => o.status === filterStatus);
    }

    // Search filter (order ID, customer name, phone)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q) ||
          o.items.some((item) => item.item_name.toLowerCase().includes(q))
      );
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter((o) => new Date(o.created_at) >= new Date(dateFrom + 'T00:00:00'));
    }
    if (dateTo) {
      result = result.filter((o) => new Date(o.created_at) <= new Date(dateTo + 'T23:59:59'));
    }

    return result;
  }, [orders, filterStatus, searchQuery, dateFrom, dateTo]);

  // ── PAGINATION ──
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery, dateFrom, dateTo]);

  const isToday = (dateStr: string) => {
    return new Date(dateStr).toISOString().split('T')[0] === todayStr;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed': return 'bg-zinc-100 text-zinc-600 border-zinc-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-[#86603A] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">
            Live Orders
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-brandon font-bold bg-green-100 text-green-800 tracking-widest relative -top-2">
              <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </h1>
          <p className="font-signature text-2xl text-[#86603A] mt-1">
            Manage incoming orders in real-time
          </p>
        </div>

        <div className="text-right font-brandon text-sm text-zinc-500">
          <span className="font-bold text-zinc-900">{filteredOrders.length}</span> orders found
          {filteredOrders.length !== orders.length && (
            <span> (of {orders.length} total)</span>
          )}
        </div>
      </div>

      {/* ── SEARCH & FILTERS BAR ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-4 space-y-4">
        {/* Row 1: Search + Date Filters */}
        <div className="flex flex-col xl:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Phone, or Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Date From */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-brandon font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50"
            />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-brandon font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50"
            />
          </div>

          {/* Quick: Today button */}
          <button
            onClick={() => {
              setDateFrom(todayStr);
              setDateTo(todayStr);
            }}
            className="px-4 py-3 bg-[#86603A]/10 text-[#86603A] border border-[#86603A]/30 rounded-xl font-brandon text-sm font-bold hover:bg-[#86603A]/20 transition-colors whitespace-nowrap"
          >
            Today Only
          </button>

          {/* Clear Filters */}
          {(dateFrom || dateTo || searchQuery) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setSearchQuery(''); }}
              className="px-4 py-3 bg-zinc-100 text-zinc-500 rounded-xl font-brandon text-sm font-bold hover:bg-zinc-200 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Row 2: Status Tabs */}
        <div className="flex flex-wrap gap-1 bg-zinc-50 rounded-xl p-1">
          {['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((status) => {
            const count = status === 'All'
              ? orders.length
              : orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-lg font-brandon text-sm font-bold transition-colors flex items-center gap-2 ${
                  filterStatus === status ? 'bg-[#86603A] text-white shadow-md' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {status}
                <span className={`text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full ${
                  filterStatus === status ? 'bg-white/20' : 'bg-zinc-200'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ORDERS GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {paginatedOrders.map((order) => {
            const orderIsToday = isToday(order.created_at);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={order.id}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-colors ${
                  orderIsToday
                    ? 'border-[#86603A]/40 ring-2 ring-[#86603A]/10'
                    : 'border-zinc-200'
                }`}
              >
                {/* Today badge */}
                {orderIsToday && (
                  <div className="bg-[#86603A] text-white text-[10px] font-brandon font-bold uppercase tracking-[0.2em] text-center py-1">
                    Today&apos;s Order
                  </div>
                )}

                <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-anton text-xl tracking-wider">{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="font-brandon font-bold text-lg text-zinc-900 leading-tight">
                      {order.customer_name}
                    </h3>
                    <div className="flex flex-col lg:flex-row lg:gap-4 text-sm font-brandon text-zinc-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        {order.customer_phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-900 font-bold">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {new Date(order.created_at).toLocaleString([], {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="font-anton text-2xl text-[#86603A]">
                      ${order.total_amount}
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-lg text-xs font-brandon font-bold tracking-widest uppercase">
                      {order.order_type === 'Delivery' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      ) : order.order_type === 'In-Restaurant' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18h18M4 18v3m16-3v3M12 2v6m-4-2h8"></path></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                      )}
                      {order.order_type}
                    </div>
                  </div>
                </div>

                {/* Order Info (Address/Pickup Time) */}
                {order.order_info && (
                  <div className="px-6 py-3 bg-[#86603A]/5 border-b border-zinc-100 flex items-start gap-3 text-sm font-brandon text-[#86603A]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span className="font-semibold">{order.order_type === 'Delivery' ? 'Delivery to: ' : 'Info: '}</span>
                    {order.order_info}
                  </div>
                )}

                {/* Overall Order Notes */}
                {order.special_notes && (
                  <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3 text-sm font-brandon text-amber-900">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-amber-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div>
                      <span className="font-bold text-amber-700 uppercase tracking-widest text-[10px] block mb-0.5">Order Notes</span>
                      {order.special_notes}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-xs font-brandon font-bold tracking-widest uppercase text-zinc-400 mb-4 border-b border-zinc-100 pb-2">
                    Order Items
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <span className="font-anton text-lg text-zinc-900 bg-zinc-100 w-8 h-8 flex items-center justify-center rounded shrink-0">
                              {item.quantity}
                            </span>
                            <div>
                              <p className="font-brandon font-bold text-zinc-900 leading-tight">
                                {item.item_name}
                              </p>
                              {item.add_ons && item.add_ons.length > 0 && (
                                <p className="text-xs font-brandon text-zinc-500 mt-0.5">
                                  + {item.add_ons.map((a) => `${a.name} ($${a.price})`).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="font-brandon font-bold text-zinc-900">
                            ${item.price_at_time}
                          </span>
                        </div>
                        {item.special_instructions && (
                          <div className="ml-11 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5 text-amber-600">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <div>
                              <p className="text-[10px] font-brandon font-bold uppercase tracking-widest text-amber-700 mb-0.5">Special Instructions</p>
                              <p className="text-sm font-brandon font-bold text-amber-900">
                                {item.special_instructions}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex gap-3 flex-wrap">
                  {/* Status actions */}
                  {order.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(order.id, 'Preparing')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-brandon font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-blue-600/20">
                        Start Preparing
                      </button>
                      <button onClick={() => updateStatus(order.id, 'Cancelled')} className="px-4 text-red-500 font-brandon font-bold uppercase tracking-widest text-xs hover:bg-red-50 rounded-xl transition-colors">
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'Preparing' && (
                    <button onClick={() => updateStatus(order.id, 'Ready')} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-brandon font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-green-600/20">
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'Ready' && (
                    <button onClick={() => updateStatus(order.id, 'Completed')} className="flex-1 bg-black hover:bg-[#86603A] text-white py-3 rounded-xl font-brandon font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-black/20">
                      Complete Order
                    </button>
                  )}

                  {/* Delete button (always visible) */}
                  {deleteConfirm === order.id ? (
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs font-brandon font-bold text-red-600">Delete forever?</span>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="px-3 py-2 bg-red-600 text-white text-xs font-brandon font-bold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2 bg-zinc-200 text-zinc-600 text-xs font-brandon font-bold rounded-lg hover:bg-zinc-300 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(order.id)}
                      className="ml-auto px-3 py-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete order"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {paginatedOrders.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-zinc-200 border-dashed">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-zinc-300 mb-4">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <p className="font-brandon text-lg text-zinc-500">
              {searchQuery || dateFrom || dateTo
                ? 'No orders match your filters.'
                : `No ${filterStatus.toLowerCase()} orders right now.`}
            </p>
            {(searchQuery || dateFrom || dateTo) && (
              <button
                onClick={() => { setSearchQuery(''); setDateFrom(''); setDateTo(''); setFilterStatus('All'); }}
                className="mt-4 font-brandon text-sm font-bold text-[#86603A] underline underline-offset-4"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2.5 rounded-xl font-brandon text-sm font-bold bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, current, and neighbors
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-brandon text-sm font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#86603A] text-white shadow-md'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              // Show ellipsis
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="w-10 h-10 flex items-center justify-center text-zinc-400 font-brandon">
                    …
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2.5 rounded-xl font-brandon text-sm font-bold bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
