'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartAddOn {
  name: string;
  price: string;
}

export interface CartItem {
  id: string; // unique ID for the cart item (since same item can be added twice with diff add-ons)
  menuItemId: string;
  name: string;
  price: number; // base price
  quantity: number;
  addOns: CartAddOn[];
  specialInstructions: string;
  image: string;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isTakingOrders: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTakingOrders, setIsTakingOrders] = useState(true);

  // Fetch store settings on mount
  useEffect(() => {
    async function fetchStoreSettings() {
      try {
        const res = await fetch('/api/store-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.content && data.content.isTakingOrders !== undefined) {
            setIsTakingOrders(data.content.isTakingOrders);
          }
        }
      } catch (e) {
        console.error('Failed to fetch store settings');
      }
    }
    fetchStoreSettings();
  }, []);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('qb_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('qb_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    // Generate a unique ID so we can have multiple of the same item with different instructions
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const addOnsTotal = item.addOns.reduce(
      (sum, addon) => sum + parseFloat(addon.price.replace(/[^0-9.]/g, '') || '0'),
      0
    );
    return total + (item.price * item.quantity) + addOnsTotal;
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        isTakingOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
