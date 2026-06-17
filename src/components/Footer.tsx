'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-8 px-6 lg:px-12 flex flex-col items-center z-[80] relative transform-gpu">
      {/* Logo Area */}
      <div className="mb-20 flex flex-col items-center">
        <Link href="/" className="text-5xl lg:text-6xl font-bold font-serif tracking-widest uppercase text-white hover:text-zinc-300 transition-colors">
          QUEEN BEAN
        </Link>
      </div>

      {/* Links Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-8 mb-24">
        
        {/* Column 1: Experience */}
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-[#86603A] text-xs lg:text-sm tracking-[0.2em] font-bold uppercase mb-2">Experience</h4>
          <FooterLink href="#">Home</FooterLink>
          <FooterLink href="#">Atelier</FooterLink>
          <FooterLink href="#">Magazine</FooterLink>
          <FooterLink href="/menu">Menu</FooterLink>
          <FooterLink href="#locations">Locations</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </div>

        {/* Column 2: Follow Us */}
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-[#86603A] text-xs lg:text-sm tracking-[0.2em] font-bold uppercase mb-2">Follow Us</h4>
          <FooterLink href="#" isExternal>Instagram</FooterLink>
          <FooterLink href="#" isExternal>Facebook</FooterLink>
          <FooterLink href="#" isExternal>LinkedIn</FooterLink>
        </div>

        {/* Column 3: Place Your Order */}
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-[#86603A] text-xs lg:text-sm tracking-[0.2em] font-bold uppercase mb-2">Place Your Order</h4>
          <FooterLink href="#">Catering</FooterLink>
          <FooterLink href="#">Order Online</FooterLink>
        </div>

        {/* Column 4: Contact Us */}
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-[#86603A] text-xs lg:text-sm tracking-[0.2em] font-bold uppercase mb-2">Contact Us</h4>
          <span className="text-sm lg:text-base font-brandon font-medium text-white text-center">
            246 South 11th Street<br />
            Philadelphia, PA 19107
          </span>
          <a href="tel:2677614910" className="text-sm lg:text-base font-brandon font-medium text-white hover:text-zinc-300 transition-colors">
            (267) 761-4910
          </a>
          <a href="mailto:queenbeanphilly@gmail.com" className="text-sm lg:text-base font-brandon font-medium text-white hover:text-zinc-300 transition-colors">
            queenbeanphilly@gmail.com
          </a>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="w-full max-w-6xl border-t border-zinc-800 pt-8 flex flex-col xl:flex-row justify-between items-center gap-6 text-xs lg:text-sm text-zinc-400 font-brandon tracking-wide">
        <div className="text-center xl:text-left leading-relaxed">
          © {currentYear} Queen Bean. All rights reserved. 
          <span className="block md:inline md:ml-2 mt-2 md:mt-0">
            Developed By <a href="https://www.heavensarder.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#86603A] transition-colors font-bold underline underline-offset-4 decoration-zinc-700 hover:decoration-[#86603A]">Web With Heaven</a>
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span className="text-zinc-600">·</span>
          <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          <span className="text-zinc-600">·</span>
          <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, isExternal }: { href: string; children: React.ReactNode; isExternal?: boolean }) {
  return (
    <Link 
      href={href} 
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-sm lg:text-base font-brandon font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2 group"
    >
      {children}
      {isExternal && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      )}
    </Link>
  );
}
