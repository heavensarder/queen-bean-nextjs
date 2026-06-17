'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from './CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="fixed top-[10px] left-[10px] right-[10px] lg:top-[20px] lg:left-[20px] lg:right-[20px] z-[100] pointer-events-none">
      {/* Changed font to brandon and removed uppercase */}
      <div className="bg-white border border-black pointer-events-auto text-sm lg:text-base tracking-wide font-brandon font-normal text-black drop-shadow-sm flex flex-col">
        
        {/* Desktop Layout (Hidden on Mobile) */}
        <div className="hidden lg:flex h-14 lg:h-16">
          <div className="flex-1 border-r border-black flex">
            <NavLink href="/" isActive={pathname === '/'}>Home</NavLink>
            <NavLink href="#" comingSoon>Atelier</NavLink>
            <NavLink href="#" comingSoon>Magazine</NavLink>
            <NavLink href="#" comingSoon>Franchise</NavLink>
          </div>
          
          <div className="flex items-center justify-center px-4 lg:px-8 border-r border-black flex-[1.5] overflow-hidden">
            <Link href="/" className="relative w-[280px] h-[50px] flex items-center">
              <motion.div 
                className="absolute left-0 z-10 flex items-center justify-center bg-white rounded-full"
                animate={{ x: [120, 120, 0, 0, 0, 0, 120, 120], scale: [1.6, 1.6, 1, 1, 1, 1, 1.6, 1.6] }}
                transition={{ duration: 10, times: [0, 0.15, 0.25, 0.35, 0.65, 0.75, 0.85, 1], repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="https://i.postimg.cc/Yqr4m6jh/queen-been-icon.png" 
                  alt="Queen Bean Icon" 
                  className="w-10 h-10 object-contain" 
                />
              </motion.div>

              <div className="absolute left-[52px] right-0 overflow-hidden h-full flex items-center">
                <motion.div 
                  animate={{ x: ["-105%", "-105%", "-105%", "0%", "0%", "-105%", "-105%", "-105%"] }}
                  transition={{ duration: 10, times: [0, 0.15, 0.25, 0.35, 0.65, 0.75, 0.85, 1], repeat: Infinity, ease: "easeInOut" }}
                  className="w-full"
                >
                  <span 
                    className="text-3xl font-bold tracking-widest whitespace-nowrap uppercase block"
                    style={{ fontFamily: '"Hatsch Sans", sans-serif', color: '#513626' }}
                  >
                    QUEEN BEAN
                  </span>
                </motion.div>
              </div>
            </Link>
          </div>
          
          <div className="flex-1 flex">
            <NavLink href="/menu" isActive={pathname === '/menu'}>Food Menu</NavLink>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex-1 flex flex-col items-center justify-center transition-colors group border-r border-black hover:bg-zinc-50"
            >
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="bg-[#86603A] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-hover:bg-[#86603A] transition-colors" />
            </button>
            <NavLink href="/contact" noBorder>Contact</NavLink>
          </div>
        </div>

        {/* Mobile Layout (Hidden on Desktop) */}
        <div className="flex lg:hidden flex-col w-full">
          <div className="h-16 border-b border-black flex items-center justify-center overflow-hidden">
            <Link href="/" className="relative w-[220px] h-[40px] flex items-center">
              <motion.div 
                className="absolute left-0 z-10 flex items-center justify-center bg-white rounded-full"
                animate={{ x: [96, 96, 0, 0, 0, 0, 96, 96], scale: [1.6, 1.6, 1, 1, 1, 1, 1.6, 1.6] }}
                transition={{ duration: 10, times: [0, 0.15, 0.25, 0.35, 0.65, 0.75, 0.85, 1], repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="https://i.postimg.cc/Yqr4m6jh/queen-been-icon.png" 
                  alt="Queen Bean Icon" 
                  className="w-7 h-7 object-contain" 
                />
              </motion.div>

              <div className="absolute left-[36px] right-0 overflow-hidden h-full flex items-center">
                <motion.div 
                  animate={{ x: ["-105%", "-105%", "-105%", "0%", "0%", "-105%", "-105%", "-105%"] }}
                  transition={{ duration: 10, times: [0, 0.15, 0.25, 0.35, 0.65, 0.75, 0.85, 1], repeat: Infinity, ease: "easeInOut" }}
                  className="w-full"
                >
                  <span 
                    className="text-xl font-bold tracking-widest whitespace-nowrap uppercase block"
                    style={{ fontFamily: '"Hatsch Sans", sans-serif', color: '#513626' }}
                  >
                    QUEEN BEAN
                  </span>
                </motion.div>
              </div>
            </Link>
          </div>
          {/* Bottom Row: Menu Toggle, Cart & Locations */}
          <div className="h-12 flex">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex-1 border-r border-black flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors"
            >
              {isMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
              <span>Menu</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 border-r border-black flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors relative"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-[calc(50%-28px)] bg-[#86603A] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Contact</span>
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col border-t border-black bg-white">
            <MobileNavLink href="/" isActive={pathname === '/'} onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="#" comingSoon>Atelier</MobileNavLink>
            <MobileNavLink href="#" comingSoon>Magazine</MobileNavLink>
            <MobileNavLink href="#" comingSoon>Franchise</MobileNavLink>
            <MobileNavLink href="/menu" isActive={pathname === '/menu'} onClick={() => setIsMenuOpen(false)}>Food Menu</MobileNavLink>
            <MobileNavLink href="/contact" noBorder>Contact</MobileNavLink>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children, noBorder, isActive, comingSoon }: { href: string; children: React.ReactNode; noBorder?: boolean; isActive?: boolean; comingSoon?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`relative flex-1 flex flex-col items-center justify-center transition-colors group
        ${noBorder ? '' : 'border-r border-black'} 
        ${isActive ? 'bg-[#86603A] text-white' : 'hover:bg-zinc-50'}`}
    >
      <span>{children}</span>
      {comingSoon && (
        <span className="text-sm lg:text-base font-signature text-[#86603A] mt-[-2px] leading-none capitalize tracking-normal font-normal">Coming soon</span>
      )}
      {/* The bottom border hover effect */}
      {!isActive && (
        <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-hover:bg-[#86603A] transition-colors" />
      )}
    </Link>
  );
}

function MobileNavLink({ href, children, noBorder, isActive, onClick, comingSoon }: { href: string; children: React.ReactNode; noBorder?: boolean; isActive?: boolean; onClick?: () => void; comingSoon?: boolean }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`relative h-16 flex flex-col items-center justify-center transition-colors group
        ${noBorder ? '' : 'border-b border-black'} 
        ${isActive ? 'bg-[#86603A] text-white' : 'hover:bg-zinc-50'}`}
    >
      <span>{children}</span>
      {comingSoon && (
        <span className="text-sm lg:text-base font-signature text-[#86603A] mt-[-2px] leading-none capitalize tracking-normal font-normal">Coming soon</span>
      )}
      {/* The bottom border hover effect for mobile */}
      {!isActive && (
        <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-hover:bg-[#86603A] transition-colors" />
      )}
    </Link>
  );
}
