'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import Image from 'next/image';

export default function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1); // 1: Cart, 2: Checkout Details, 3: Success

  // Checkout form state
  const [orderType, setOrderType] = useState<'Delivery' | 'Pickup' | 'Dine-In'>('Pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderInfo, setOrderInfo] = useState(''); // Address, Time, or generic note
  const [specialNotes, setSpecialNotes] = useState('');
  const [tipOption, setTipOption] = useState<'18' | '20' | '22' | 'Custom' | 'None'>('None');
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartTotal;
  const taxAmount = subtotal * 0.06;
  
  let tipAmount = 0;
  if (tipOption === '18') tipAmount = subtotal * 0.18;
  else if (tipOption === '20') tipAmount = subtotal * 0.20;
  else if (tipOption === '22') tipAmount = subtotal * 0.22;
  else if (tipOption === 'Custom') tipAmount = parseFloat(customTipAmount) || 0;

  const grandTotal = subtotal + taxAmount + tipAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setError('Please provide your name and phone number.');
      return;
    }
    if (orderType === 'Delivery' && !orderInfo) {
      setError('Please provide a delivery address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          orderType,
          orderInfo,
          specialNotes,
          totalAmount: grandTotal,
          subtotal,
          taxAmount,
          tipAmount,
          items: cartItems,
        }),
      });

      if (!res.ok) throw new Error('Failed to place order');

      setCheckoutStep(3); // Success page
      clearCart();
    } catch (err) {
      setError('An error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      if (checkoutStep === 3) setCheckoutStep(1);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-[100dvh] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-[#F2EFEB]">
              <h2 className="font-anton text-2xl uppercase tracking-wider text-zinc-900">
                {checkoutStep === 1 ? 'Your Cart' : checkoutStep === 2 ? 'Checkout' : 'Order Placed'}
              </h2>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-zinc-900 hover:bg-[#86603A] hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 1 && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent="true">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 text-zinc-300">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      <p className="font-brandon text-lg">Your cart is empty.</p>
                      <button onClick={handleClose} className="mt-6 font-brandon font-bold text-[#86603A] underline underline-offset-4">
                        Continue Browsing
                      </button>
                    </div>
                  ) : (
                    cartItems.map((item) => {
                      const itemTotal = (item.price + item.addOns.reduce((sum, a) => sum + parseFloat(a.price.replace(/[^0-9.]/g, '') || '0'), 0)) * item.quantity;
                      return (
                        <div key={item.id} className="flex gap-4 border-b border-zinc-100 pb-6 last:border-0">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-brandon font-bold text-zinc-900 leading-tight">
                                {item.name} {item.size && <span className="text-zinc-500 font-normal">({item.size})</span>}
                              </h3>
                              <div className="text-right">
                                {item.quantity > 1 || item.addOns.length > 0 ? (
                                  <div className="flex flex-col items-end">
                                    <span className="text-xs text-zinc-400 mb-0.5 whitespace-nowrap">
                                      {item.addOns.length > 0 
                                        ? `(${item.quantity} × $${item.price.toFixed(2)}) + $${(item.addOns.reduce((sum, a) => sum + parseFloat(a.price.replace(/[^0-9.]/g, '') || '0'), 0) * item.quantity).toFixed(2)} =` 
                                        : `${item.quantity} × $${item.price.toFixed(2)} =`}
                                    </span>
                                    <span className="font-anton text-lg text-zinc-900">${itemTotal.toFixed(2)}</span>
                                  </div>
                                ) : (
                                  <span className="font-anton text-lg text-zinc-900">${itemTotal.toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                            
                            {item.addOns.length > 0 && (
                              <p className="text-xs font-brandon text-zinc-500 mt-1">
                                {item.addOns.map(a => `${a.name} (+$${parseFloat(a.price.replace(/[^0-9.]/g, '') || '0').toFixed(2)})`).join(', ')}
                              </p>
                            )}
                            
                            {item.specialInstructions && (
                              <p className="text-xs font-brandon text-zinc-400 italic mt-1 line-clamp-1">
                                &quot;{item.specialInstructions}&quot;
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center bg-zinc-100 rounded-lg p-0.5">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-white rounded transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                                <span className="w-6 text-center font-anton text-sm">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-white rounded transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-xs font-brandon font-bold text-red-500/70 hover:text-red-500 transition-colors uppercase tracking-wider">Remove</button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="p-6 bg-zinc-50 border-t border-zinc-200">
                    <div className="space-y-2 mb-6 font-brandon text-sm">
                      <div className="flex justify-between text-zinc-900 font-bold text-lg pt-2">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full bg-black text-white py-4 rounded-xl font-brandon uppercase tracking-widest text-sm font-bold hover:bg-[#86603A] transition-colors shadow-lg"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {checkoutStep === 2 && (
              <div className="flex-1 overflow-y-auto flex flex-col min-h-0 overscroll-contain" data-lenis-prevent="true">
                <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 flex-1">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl font-brandon text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-brandon font-bold text-zinc-500 mb-2">Order Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Pickup', 'Delivery', 'Dine-In'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOrderType(type as any)}
                          className={`py-3 px-2 text-center rounded-xl font-brandon text-sm font-bold transition-colors ${
                            orderType === type 
                              ? 'bg-[#86603A] text-white' 
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-brandon font-bold text-zinc-500 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-brandon font-bold text-zinc-500 mb-2">Phone</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-brandon font-bold text-zinc-500 mb-2">
                        {orderType === 'Delivery' ? 'Delivery Address' : orderType === 'Pickup' ? 'Pickup Time' : 'Special Notes'}
                      </label>

                      {orderType === 'Pickup' ? (
                        <div className="space-y-3">
                          {/* ASAP toggle */}
                          <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer hover:border-[#86603A]/50 transition-colors">
                            <input
                              type="checkbox"
                              checked={orderInfo === 'ASAP'}
                              onChange={(e) => setOrderInfo(e.target.checked ? 'ASAP' : '')}
                              className="w-5 h-5 rounded border-zinc-300 text-[#86603A] focus:ring-[#86603A]"
                            />
                            <span className="font-brandon text-sm font-bold text-zinc-900">ASAP (As soon as possible)</span>
                          </label>

                          {/* Time picker (disabled when ASAP) */}
                          {orderInfo !== 'ASAP' && (
                            <input
                              type="time"
                              value={orderInfo}
                              onChange={(e) => setOrderInfo(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50"
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          required={orderType === 'Delivery'}
                          value={orderInfo}
                          onChange={(e) => setOrderInfo(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50"
                          placeholder={orderType === 'Delivery' ? '123 Main St, Apt 4B' : 'Any instructions...'}
                        />
                      )}
                    </div>

                    {/* Special Notes - always visible */}
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-brandon font-bold text-zinc-500 mb-2">
                        Special Notes
                      </label>
                      <textarea
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="Any special requests, allergies, or notes for us..."
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 resize-none h-20"
                      />
                    </div>

                    {/* Tip Section */}
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-brandon font-bold text-zinc-500 mb-2">Tip</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { label: '18%', value: '18' },
                          { label: '20%', value: '20' },
                          { label: '22%', value: '22' },
                          { label: 'Custom', value: 'Custom' },
                          { label: 'None', value: 'None' },
                        ].map((tip) => (
                          <button
                            key={tip.value}
                            type="button"
                            onClick={() => setTipOption(tip.value as any)}
                            className={`py-3 px-1 text-center rounded-xl font-brandon text-xs font-bold transition-colors ${
                              tipOption === tip.value 
                                ? 'bg-[#86603A] text-white' 
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                          >
                            {tip.label}
                          </button>
                        ))}
                      </div>
                      {tipOption === 'Custom' && (
                        <div className="mt-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={customTipAmount}
                            onChange={(e) => setCustomTipAmount(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50"
                            placeholder="Enter custom tip amount ($)"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </form>

                <div className="p-6 bg-zinc-50 border-t border-zinc-200 mt-auto">
                  {/* Order Summary in Checkout */}
                  <div className="mb-4 pb-4 border-b border-zinc-200 border-dashed">
                    <h4 className="font-brandon font-bold text-xs uppercase tracking-widest text-zinc-500 mb-3">Order Summary</h4>
                    <div className="space-y-2.5">
                      {cartItems.map((item) => {
                        const itemTotal = (item.price + item.addOns.reduce((sum, a) => sum + parseFloat(a.price.replace(/[^0-9.]/g, '') || '0'), 0)) * item.quantity;
                        return (
                          <div key={item.id} className="flex justify-between items-start text-sm font-brandon">
                            <div className="flex-1 pr-4">
                              <span className="font-bold text-zinc-900">{item.quantity}× {item.name}</span>
                              {item.size && <span className="text-zinc-500"> ({item.size})</span>}
                              {item.addOns.length > 0 && (
                                <div className="text-xs text-zinc-500 mt-0.5">
                                  + {item.addOns.map(a => a.name).join(', ')}
                                </div>
                              )}
                            </div>
                            <div className="text-right flex flex-col items-end justify-start">
                              {item.quantity > 1 || item.addOns.length > 0 ? (
                                <span className="text-[10px] text-zinc-400 font-normal mb-0.5 whitespace-nowrap">
                                  {item.addOns.length > 0 
                                    ? `(${item.quantity} × $${item.price.toFixed(2)}) + $${(item.addOns.reduce((sum, a) => sum + parseFloat(a.price.replace(/[^0-9.]/g, '') || '0'), 0) * item.quantity).toFixed(2)} =` 
                                    : `${item.quantity} × $${item.price.toFixed(2)} =`}
                                </span>
                              ) : null}
                              <span className="text-zinc-900 font-bold whitespace-nowrap">
                                ${itemTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 font-brandon text-sm text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (6%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tip</span>
                      <span>${tipAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-zinc-900 font-bold text-xl mb-6 pt-4 border-t border-zinc-200">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col-reverse md:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="w-full md:w-auto px-6 py-4 rounded-xl font-brandon uppercase tracking-widest text-sm font-bold bg-zinc-200 text-zinc-600 hover:bg-zinc-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="flex-1 w-full bg-black text-white py-4 rounded-xl font-brandon uppercase tracking-widest text-sm font-bold hover:bg-[#86603A] transition-colors shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Place Order (Pay Later)'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {checkoutStep === 3 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F2EFEB]">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="font-anton text-4xl uppercase tracking-widest text-zinc-900 mb-2">Order Received!</h3>
                <p className="font-brandon text-lg text-zinc-600 mb-8">
                  Thank you for your order. We are preparing it right now!
                </p>
                <button
                  onClick={handleClose}
                  className="w-full bg-black text-white py-4 rounded-xl font-brandon uppercase tracking-widest text-sm font-bold hover:bg-[#86603A] transition-colors shadow-lg"
                >
                  Close & Return
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
