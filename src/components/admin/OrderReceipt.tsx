import React from 'react';
import Image from 'next/image';

export interface OrderReceiptItem {
  id: number;
  item_name: string;
  quantity: number;
  price_at_time: string;
  add_ons: { name: string; price: string }[];
  special_instructions: string | null;
  size: string | null;
}

export interface OrderReceiptData {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: string;
  order_info: string | null;
  special_notes: string | null;
  total_amount: string;
  subtotal: string;
  tax_amount: string;
  tip_amount: string;
  status: string;
  created_at: string;
  items: OrderReceiptItem[];
}

interface OrderReceiptProps {
  order: OrderReceiptData;
}

export default function OrderReceipt({ order }: OrderReceiptProps) {
  return (
    <div className="w-full max-w-[400px] mx-auto bg-white p-6 font-brandon text-zinc-900 border border-zinc-200">
      {/* Logo & Header */}
      <div className="flex flex-col items-center justify-center text-center pb-6 border-b-2 border-dashed border-zinc-300">
        <div className="w-24 h-24 mb-4">
          <img 
            src="https://i.postimg.cc/yYLDhDS6/queen-been-logo.png" 
            alt="Queen Bean Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="font-anton text-2xl uppercase tracking-widest text-[#86603A] print:text-black">Queen Bean</h1>
        <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mt-1">246 South 11th Street</p>
        <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Philadelphia, PA 19107</p>
        <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mt-1">(267) 761-4910</p>
      </div>

      {/* Order Info */}
      <div className="py-4 border-b-2 border-dashed border-zinc-300 space-y-2">
        <div className="flex justify-between">
          <span className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Order ID</span>
          <span className="font-anton text-lg">{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Date</span>
          <span className="font-bold text-sm">
            {new Date(order.created_at).toLocaleString([], {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Type</span>
          <span className="font-bold text-sm bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-widest">{order.order_type}</span>
        </div>
        
        {/* Customer Details */}
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <p className="font-bold text-sm uppercase tracking-widest text-zinc-500 mb-1 text-[10px]">Customer Details</p>
          <p className="font-bold text-sm">{order.customer_name}</p>
          <p className="font-bold text-sm text-zinc-600">{order.customer_phone}</p>
          {order.order_info && (
            <p className="font-bold text-sm text-[#86603A] print:text-black mt-1 break-words">{order.order_info}</p>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="py-4 border-b-2 border-dashed border-zinc-300">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
          <span>Qty / Item</span>
          <span>Price</span>
        </div>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="text-sm">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="font-anton text-base min-w-[20px]">{item.quantity}x</span>
                  <div>
                    <p className="font-bold leading-tight">
                      {item.item_name} {item.size && <span className="text-[#86603A] print:text-black">({item.size})</span>}
                    </p>
                    {item.add_ons && item.add_ons.length > 0 && (
                      <div className="mt-1 text-xs text-zinc-500 font-bold space-y-0.5">
                        {item.add_ons.map((a, i) => (
                          <p key={i}>+ {a.name}</p>
                        ))}
                      </div>
                    )}
                    {item.special_instructions && (
                      <p className="mt-1.5 text-xs font-bold text-amber-700 print:text-black print:border-dashed bg-amber-50 print:bg-transparent p-1.5 rounded border border-amber-100 print:border-black">
                        Note: {item.special_instructions}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-bold">${parseFloat(item.price_at_time || '0').toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="py-4 border-b-2 border-dashed border-zinc-300 space-y-2">
        <div className="flex justify-between text-sm font-bold text-zinc-600">
          <span>Subtotal</span>
          <span>${parseFloat(order.subtotal || '0').toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-zinc-600">
          <span>Tax</span>
          <span>${parseFloat(order.tax_amount || '0').toFixed(2)}</span>
        </div>
        {parseFloat(order.tip_amount || '0') > 0 && (
          <div className="flex justify-between text-sm font-bold text-zinc-600">
            <span>Tip</span>
            <span>${parseFloat(order.tip_amount || '0').toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-zinc-200">
          <span className="font-bold uppercase tracking-widest text-sm">Total</span>
          <span className="font-anton text-2xl">${parseFloat(order.total_amount || '0').toFixed(2)}</span>
        </div>
      </div>

      {/* Order Notes */}
      {order.special_notes && (
        <div className="py-4 border-b-2 border-dashed border-zinc-300">
          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Order Notes</p>
          <p className="text-sm font-bold bg-zinc-50 print:bg-transparent print:border-dashed p-3 rounded border border-zinc-200 print:border-black italic">
            {order.special_notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="pt-6 text-center space-y-2">
        <p className="font-anton text-xl tracking-wide uppercase text-[#86603A] print:text-black">Thank You!</p>
        <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Please visit us again</p>
      </div>
    </div>
  );
}
