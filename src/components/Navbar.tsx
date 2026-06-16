'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-[10px] left-[10px] right-[10px] md:top-[20px] md:left-[20px] md:right-[20px] z-[100] pointer-events-none">
      {/* Changed font to brandon and removed uppercase */}
      <div className="bg-white border border-black pointer-events-auto text-sm md:text-base tracking-wide font-brandon font-normal text-black drop-shadow-sm flex flex-col">
        
        {/* Desktop Layout (Hidden on Mobile) */}
        <div className="hidden md:flex h-14 md:h-16">
          <div className="flex-1 border-r border-black flex">
            <NavLink href="#" isActive>Home</NavLink>
            <NavLink href="#">Atelier</NavLink>
            <NavLink href="#">Magazine</NavLink>
            <NavLink href="#">Franchise</NavLink>
          </div>
          
          <div className="flex items-center justify-center px-8 border-r border-black flex-[1.5]">
            <Link href="/" className="text-2xl md:text-4xl font-bold font-serif tracking-widest whitespace-nowrap uppercase">
              QUEEN BEAN
            </Link>
          </div>
          
          <div className="flex-1 flex">
            <NavLink href="#">Menu</NavLink>
            <NavLink href="#">Order Online</NavLink>
            <NavLink href="#" noBorder>Locations</NavLink>
          </div>
        </div>

        {/* Mobile Layout (Hidden on Desktop) */}
        <div className="flex md:hidden flex-col w-full">
          {/* Top Row: Logo */}
          <div className="h-12 border-b border-black flex items-center justify-center">
            <Link href="/" className="text-lg font-bold font-serif tracking-widest whitespace-nowrap uppercase">
              QUEEN BEAN
            </Link>
          </div>
          {/* Bottom Row: Menu Toggle & Locations */}
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
            <Link href="#" className="flex-1 flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Locations</span>
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col border-t border-black bg-white">
            <MobileNavLink href="#" isActive>Home</MobileNavLink>
            <MobileNavLink href="#">Atelier</MobileNavLink>
            <MobileNavLink href="#">Magazine</MobileNavLink>
            <MobileNavLink href="#">Franchise</MobileNavLink>
            <MobileNavLink href="#">Menu</MobileNavLink>
            <MobileNavLink href="#">Order Online</MobileNavLink>
            <MobileNavLink href="#">Locations</MobileNavLink>
            <MobileNavLink href="#" noBorder>Contact</MobileNavLink>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children, noBorder, isActive }: { href: string; children: React.ReactNode; noBorder?: boolean; isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`relative flex-1 flex items-center justify-center transition-colors group
        ${noBorder ? '' : 'border-r border-black'} 
        ${isActive ? 'bg-[#86603A] text-white' : 'hover:bg-zinc-50'}`}
    >
      {children}
      {/* The bottom border hover effect */}
      {!isActive && (
        <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-hover:bg-[#86603A] transition-colors" />
      )}
    </Link>
  );
}

function MobileNavLink({ href, children, noBorder, isActive }: { href: string; children: React.ReactNode; noBorder?: boolean; isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`relative h-14 flex items-center justify-center transition-colors group
        ${noBorder ? '' : 'border-b border-black'} 
        ${isActive ? 'bg-[#86603A] text-white' : 'hover:bg-zinc-50'}`}
    >
      {children}
      {/* The bottom border hover effect for mobile */}
      {!isActive && (
        <span className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent group-hover:bg-[#86603A] transition-colors" />
      )}
    </Link>
  );
}
