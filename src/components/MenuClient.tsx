'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { type MenuItem, type MenuCategory } from '@/lib/menuData';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useCart, type CartAddOn } from '@/components/CartContext';

export default function MenuClient({ initialCategories }: { initialCategories: MenuCategory[] }) {
  const [activeCategory, setActiveCategory] = useState(initialCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ item: MenuItem; category: MenuCategory } | null>(null);
  const [isMobileCategoryMenuOpen, setIsMobileCategoryMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingToCategory = useRef(false);

  const displayCategories = useMemo(() => {
    if (searchQuery.trim() === '') return initialCategories;
    const query = searchQuery.toLowerCase();
    return initialCategories.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    })).filter(category => category.items.length > 0);
  }, [initialCategories, searchQuery]);

  // Scroll listener to update active category
  useEffect(() => {
    let rafId: number;

    const updateActiveSection = () => {
      if (!isScrollingToCategory.current) {
        // The sticky header takes up some space. We check if a section's top is above this line.
        const triggerLine = 200; 

        let currentActive = displayCategories.length > 0 ? displayCategories[0].id : '';
        for (const category of displayCategories) {
          const el = sectionRefs.current[category.id];
          if (el) {
            const rect = el.getBoundingClientRect();
            // If the top of the section is above our trigger line, it's the active one
            if (rect.top <= triggerLine) {
              currentActive = category.id;
            }
          }
        }
        
        setActiveCategory(prev => prev !== currentActive ? currentActive : prev);
      }
      
      rafId = requestAnimationFrame(updateActiveSection);
    };

    rafId = requestAnimationFrame(updateActiveSection);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Scroll the sticky nav to show active category
  useEffect(() => {
    if (navRef.current) {
      const activeBtn = navRef.current.querySelector(`[data-cat="${activeCategory}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedItem]);

  return (
    <main className="bg-[#F2EFEB] min-h-screen">
      <Navbar />
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-28 px-6 flex flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-signature text-3xl lg:text-5xl text-[#86603A] mb-2"
        >
          Discover
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-anton text-6xl lg:text-9xl xl:text-[10rem] uppercase tracking-tight text-zinc-900 leading-[0.9]"
        >
          Our Menu
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-24 h-[3px] bg-[#86603A] mt-8 origin-left"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 w-full max-w-md relative"
        >
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-zinc-300 focus:border-[#86603A] px-10 py-3 font-brandon text-lg text-center focus:outline-none transition-colors placeholder:text-zinc-400"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </motion.div>
      </section>

      {/* ── DESKTOP STICKY CATEGORY NAV ──────────────── */}
      <div className="hidden lg:block sticky top-[90px] z-[80] bg-[#F2EFEB]/95 backdrop-blur-md border-y border-zinc-300">
        <div
          ref={navRef}
          className="flex overflow-x-auto no-scrollbar px-8 py-1"
        >
          {displayCategories.map((cat) => (
            <a
              key={cat.id}
              data-cat={cat.id}
              href={`#${cat.id}`}
              data-offset="-160"
              onClick={(e) => {
                isScrollingToCategory.current = true;
                setActiveCategory(cat.id);
                setTimeout(() => {
                  isScrollingToCategory.current = false;
                }, 1000);
              }}
              className={`
                whitespace-nowrap px-5 py-3 text-sm tracking-[0.15em] uppercase font-brandon font-semibold transition-all duration-300 border-b-[3px] shrink-0
                ${activeCategory === cat.id
                  ? 'border-[#86603A] text-[#86603A]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'}
              `}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* ── MOBILE FLOATING CATEGORY BUTTON ──────────── */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[90]">
        <button
          onClick={() => setIsMobileCategoryMenuOpen(true)}
          className="bg-black text-white px-6 py-3.5 rounded-full font-brandon uppercase tracking-[0.2em] text-[11px] font-bold shadow-2xl flex items-center gap-3 border border-zinc-800 hover:scale-105 transition-transform"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          Food Category Menu / {displayCategories.find(c => c.id === activeCategory)?.name || (displayCategories.length > 0 ? displayCategories[0].name : 'Search')}
        </button>
      </div>

      {/* ── MOBILE CATEGORY OVERLAY ──────────────────── */}
      <AnimatePresence>
        {isMobileCategoryMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col justify-end lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileCategoryMenuOpen(false)}
            />
            
            {/* Bottom Sheet Menu */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full h-[80vh] bg-[#F2EFEB] rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-300 rounded-full" />
              
              <div className="p-8 pb-4 flex justify-between items-end border-b border-zinc-300 shrink-0 mt-4">
                <h3 className="font-anton text-4xl uppercase tracking-tight text-zinc-900">Food Category Menu</h3>
                <button 
                  onClick={() => setIsMobileCategoryMenuOpen(false)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-zinc-900"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar" data-lenis-prevent="true">
                {displayCategories.map((cat, idx) => (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={cat.id}
                    href={`#${cat.id}`}
                    data-offset="-80"
                    onClick={() => {
                      isScrollingToCategory.current = true;
                      setActiveCategory(cat.id);
                      // Delay closing slightly so the click event can bubble up to document
                      // where our SmoothScroll handler intercepts it and does the smooth scroll.
                      setTimeout(() => {
                        setIsMobileCategoryMenuOpen(false);
                      }, 50);
                      setTimeout(() => {
                        isScrollingToCategory.current = false;
                      }, 1000);
                    }}
                    className={`block w-full py-5 text-left border-b border-zinc-200 transition-colors ${
                      activeCategory === cat.id ? 'text-[#86603A]' : 'text-zinc-500'
                    }`}
                  >
                    <span className="font-anton text-2xl uppercase tracking-wider">{cat.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MENU SECTIONS ────────────────────────────── */}
      <div className="px-[10px] lg:px-[20px] pb-16">
        {displayCategories.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-anton text-2xl text-zinc-400 uppercase tracking-widest">No items found</h3>
            <p className="font-brandon text-zinc-500 mt-2">Try adjusting your search</p>
          </div>
        ) : displayCategories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            ref={(el) => { sectionRefs.current[category.id] = el; }}
            className="pt-16 lg:pt-24"
          >
            {/* Category Header */}
            <div className="mb-10 lg:mb-14 px-4">
              <h2 className="font-anton text-4xl lg:text-6xl xl:text-7xl uppercase tracking-tight text-zinc-900">
                {category.name}
              </h2>
              {category.subtitle && (
                <p className="font-signature text-xl lg:text-2xl text-[#86603A] mt-2">
                  {category.subtitle}
                </p>
              )}
              {/* Notes */}
              {category.notes && category.notes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.notes.map((note, i) => (
                    <span
                      key={i}
                      className="inline-block text-xs lg:text-sm font-brandon text-zinc-600 bg-white/70 border border-zinc-300 px-4 py-2 rounded-full"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              )}
              {/* Add-ons */}
              {category.addOns && category.addOns.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.addOns.map((addon, i) => (
                    <span
                      key={i}
                      className="inline-block text-xs lg:text-sm font-brandon font-semibold text-[#86603A] bg-[#86603A]/10 border border-[#86603A]/30 px-4 py-2 rounded-full"
                    >
                      {addon.name} ${addon.price}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-[1px] bg-transparent lg:bg-black lg:border lg:border-black px-4 lg:px-0">
              {category.items.map((item) => (
                <div key={item.id} className="w-full relative group bg-white cursor-pointer overflow-hidden rounded-2xl lg:rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] lg:shadow-none border border-zinc-200 lg:border-none">
                  <ItemCard
                    item={item}
                    categoryName={category.name}
                    onInfoClick={() => setSelectedItem({ item, category })}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ── DETAIL MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem.item}
            category={selectedItem.category}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

// ─── ITEM CARD (INNER) ───────────────────────────────────
function ItemCard({
  item,
  categoryName,
  onInfoClick,
}: {
  item: MenuItem;
  categoryName: string;
  onInfoClick: () => void;
}) {
  return (
    <div className={`w-full h-full cursor-pointer group ${!item.isAvailable ? 'opacity-75 grayscale-[30%]' : ''}`} onClick={onInfoClick}>
      {/* Image */}
      <div className="relative aspect-[4/3] lg:aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Unavailable Fade Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center pointer-events-none">
            <span className="bg-red-600/90 text-white px-4 py-2 rounded-lg font-brandon font-bold tracking-widest uppercase text-xs shadow-lg">
              Not Available Right Now
            </span>
          </div>
        )}

        {/* Category Label */}
        <span className="absolute top-4 left-4 text-[10px] lg:text-xs tracking-[0.2em] uppercase font-brandon font-semibold text-white/70">
          {categoryName}
        </span>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute top-4 right-4 flex gap-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-brandon font-bold text-white bg-[#86603A] px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Info Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
          className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-[#86603A] hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>

        {/* Item Name & Price */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
          <h3 className="font-brandon font-bold text-sm lg:text-base text-white leading-tight line-clamp-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="font-brandon font-bold text-sm lg:text-base text-white">
              {item.sizes && item.sizes.length > 0 
                ? item.sizes.map(s => {
                    const priceNum = parseFloat(s.price.replace(/[^0-9.]/g, ''));
                    return `$${isNaN(priceNum) ? s.price : priceNum.toFixed(2)}`;
                  }).join(' / ')
                : (() => {
                    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                    return isNaN(priceNum) ? `$${item.price}` : `$${priceNum.toFixed(2)}`;
                  })()
              }
            </span>
            {item.calories && (
              <span className="text-[11px] font-brandon text-white/60">
                {item.calories}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL MODAL ───────────────────────────────────────
function DetailModal({
  item,
  category,
  onClose,
}: {
  item: MenuItem;
  category: MenuCategory;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedSize, setSelectedSize] = useState<{name: string, price: string} | null>(
    item.sizes && item.sizes.length > 0 ? item.sizes[0] : null
  );

  // Extract a base price number from a string like "5.25 / 6.25" only if sizes aren't present
  const basePriceStr = item.price.split('/')[0].replace(/[^0-9.]/g, '');
  const parsedBasePrice = parseFloat(basePriceStr) || 0;
  const basePrice = selectedSize ? parseFloat(selectedSize.price) : parsedBasePrice;

  const handleAddOnToggle = (addon: { name: string; price: string }) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      }
      return [...prev, addon];
    });
  };

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: basePrice,
      quantity,
      addOns: selectedAddOns,
      specialInstructions,
      image: item.image,
      size: selectedSize?.name,
    });
    onClose();
  };

  const addOnsTotal = selectedAddOns.reduce(
    (sum, addon) => sum + parseFloat(addon.price.replace(/[^0-9.]/g, '') || '0'),
    0
  );

  const combinedAddOns = [
    ...(category.addOns || []),
    ...(item.extraIngredients || []),
  ];

  const totalItemPrice = (basePrice + addOnsTotal) * quantity;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-end xl:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content (Bottom Sheet on Mobile, Full Screen on Desktop) */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full h-[92vh] xl:h-full flex flex-col xl:flex-row bg-white overflow-auto rounded-t-3xl xl:rounded-none shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Mobile Drag Handle Indicator */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 backdrop-blur-md rounded-full z-20 xl:hidden shadow-sm" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-[#86603A] hover:text-white transition-colors group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:rotate-90 transition-transform">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Image Side */}
        <div className="relative w-full xl:w-[60%] h-[35vh] lg:h-[45vh] xl:h-full shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority
          />
          {/* Mobile: gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent xl:hidden" />
        </div>

        {/* Details Side */}
        <div className="flex-1 flex flex-col justify-start xl:justify-center p-6 lg:p-12 xl:p-16 overflow-y-auto">
          {/* Category Label */}
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs lg:text-sm tracking-[0.25em] uppercase font-brandon font-semibold text-zinc-400 mb-2"
          >
            {category.name}
          </motion.p>

          {/* Item Name */}
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="font-anton text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-zinc-900 leading-tight"
          >
            {item.name}
          </motion.h2>

          {/* Script accent */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-signature text-2xl lg:text-3xl text-[#86603A] mt-1 mb-4"
          >
            Queen Bean
          </motion.p>

          {/* Description */}
          {item.description && (
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 text-base lg:text-lg font-brandon text-zinc-600 leading-relaxed"
            >
              {item.description}
            </motion.p>
          )}

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-baseline gap-3"
          >
            <span className="font-anton text-3xl lg:text-4xl text-zinc-900">
              ${basePrice.toFixed(2)}
            </span>
          </motion.div>

          {/* Sizes */}
          {item.sizes && item.sizes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="mt-6 border-t border-zinc-200 pt-6"
            >
              <p className="text-xs tracking-[0.2em] uppercase font-brandon font-semibold text-zinc-400 mb-3">
                Size Options
              </p>
              <div className="flex flex-col gap-3">
                {item.sizes.map((sizeOption, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedSize?.name === sizeOption.name
                        ? 'border-[#86603A] bg-[#86603A]/5 ring-1 ring-[#86603A]'
                        : 'border-zinc-200 bg-zinc-50 hover:border-[#86603A]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="item-size"
                        checked={selectedSize?.name === sizeOption.name}
                        onChange={() => setSelectedSize(sizeOption)}
                        className="w-5 h-5 border-zinc-300 text-[#86603A] focus:ring-[#86603A]"
                      />
                      <span className="font-brandon font-semibold text-zinc-900">{sizeOption.name}</span>
                    </div>
                    <span className="font-brandon font-bold text-[#86603A]">${parseFloat(sizeOption.price).toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Nutrition Info */}
          {(item.calories || item.sodium) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-6"
            >
              {item.calories && (
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase font-brandon font-semibold text-zinc-400 mb-1">
                    Calories
                  </p>
                  <p className="font-brandon font-bold text-lg text-zinc-900">{item.calories}</p>
                </div>
              )}
              {item.sodium && (
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase font-brandon font-semibold text-zinc-400 mb-1">
                    Sodium
                  </p>
                  <p className="font-brandon font-bold text-lg text-zinc-900">{item.sodium}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 border-t border-zinc-200 pt-6"
            >
              <p className="text-xs tracking-[0.2em] uppercase font-brandon font-semibold text-zinc-400 mb-3">
                Dietary
              </p>
              <div className="flex gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm font-brandon font-bold text-[#86603A] bg-[#86603A]/10 border border-[#86603A]/30 px-4 py-2 rounded-full"
                  >
                    {tag === 'VN' ? 'Vegan' : tag === 'DF' ? 'Dairy Free' : tag === 'GF' ? 'Gluten Free' : tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Add-ons from category & Extra Ingredients */}
          {combinedAddOns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-6 border-t border-zinc-200 pt-6"
            >
              <p className="text-xs tracking-[0.2em] uppercase font-brandon font-semibold text-zinc-400 mb-3">
                Extras & Add-ons
              </p>
              <div className="flex flex-col gap-3">
                {combinedAddOns.map((addon, i) => {
                  const isSelected = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <label
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:border-[#86603A]/50 bg-zinc-50 border-zinc-200"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleAddOnToggle(addon)}
                          className="w-5 h-5 rounded border-zinc-300 text-[#86603A] focus:ring-[#86603A]"
                        />
                        <span className="font-brandon font-semibold text-zinc-900">{addon.name}</span>
                      </div>
                      <span className="font-brandon font-bold text-[#86603A]">${addon.price}</span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Special Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 border-t border-zinc-200 pt-6"
          >
            <p className="text-xs tracking-[0.2em] uppercase font-brandon font-semibold text-zinc-400 mb-3">
              Special Instructions
            </p>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. No onions, extra sauce..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 resize-none h-24"
            />
          </motion.div>

          {/* Quantity & Add to Cart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-zinc-200 sticky bottom-0 bg-white z-10 pb-4"
          >
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center bg-zinc-100 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <span className="w-8 text-center font-anton text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>

              {/* Add to Cart Button */}
              {item.isAvailable ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#86603A] transition-colors shadow-xl flex items-center justify-between group"
                >
                  <span>Add to Cart</span>
                  <span className="text-[#86603A] group-hover:text-white transition-colors">
                    ${totalItemPrice.toFixed(2)}
                  </span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-zinc-200 text-zinc-500 px-6 py-4 rounded-xl font-brandon uppercase tracking-widest text-xs font-bold flex items-center justify-center cursor-not-allowed"
                >
                  Item Currently Unavailable
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
