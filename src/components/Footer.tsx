'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white pt-24 lg:pt-32 pb-12 px-6 lg:px-12 z-[80] relative border-t border-zinc-900 overflow-hidden">
      
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-24 relative z-10">
        
        {/* Left Brand Column */}
        <div className="flex flex-col items-center lg:items-start lg:w-1/3 text-center lg:text-left">
          <Link href="/" className="hover:opacity-80 transition-opacity mb-8">
            <img 
              src="https://i.postimg.cc/sDjBZY1B/queen-been-white-logo.png" 
              alt="Queen Bean Logo" 
              className="h-16 lg:h-24 object-contain"
            />
          </Link>
          
          <div className="flex flex-col items-center lg:items-start gap-5 text-sm lg:text-base font-brandon font-medium text-zinc-400 mt-2">
            <p className="leading-relaxed text-zinc-500">
              246 South 11th Street<br />
              Philadelphia, PA 19107
            </p>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <a href="tel:2677614910" className="hover:text-white transition-colors flex items-center justify-center lg:justify-start gap-4 group">
                <span className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-zinc-500 bg-zinc-900/50 transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </span>
                (267) 761-4910
              </a>
              <a href="mailto:queenbeanphilly@gmail.com" className="hover:text-white transition-colors flex items-center justify-center lg:justify-start gap-4 group">
                <span className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-zinc-500 bg-zinc-900/50 transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                queenbeanphilly@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Right Links Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 pt-4">
          
          {/* Column 1: Experience */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h4 className="text-zinc-100 text-[11px] lg:text-xs tracking-[0.25em] font-bold uppercase mb-4 border-b border-zinc-800 pb-3 w-full text-center lg:text-left">Experience</h4>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <FooterLink href="#">Home</FooterLink>
              <FooterLink href="#">Atelier</FooterLink>
              <FooterLink href="#">Magazine</FooterLink>
              <FooterLink href="/menu">Menu</FooterLink>
              <FooterLink href="#locations">Locations</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </div>
          </div>

          {/* Column 2: Follow Us */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h4 className="text-zinc-100 text-[11px] lg:text-xs tracking-[0.25em] font-bold uppercase mb-4 border-b border-zinc-800 pb-3 w-full text-center lg:text-left">Follow Us</h4>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <FooterLink href="#" isExternal>Instagram</FooterLink>
              <FooterLink href="#" isExternal>Facebook</FooterLink>
              <FooterLink href="#" isExternal>LinkedIn</FooterLink>
            </div>
          </div>

          {/* Column 3: Place Your Order */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h4 className="text-zinc-100 text-[11px] lg:text-xs tracking-[0.25em] font-bold uppercase mb-4 border-b border-zinc-800 pb-3 w-full text-center lg:text-left">Place Your Order</h4>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <FooterLink href="#">Catering</FooterLink>
              <FooterLink href="#">Order Online</FooterLink>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] lg:text-xs text-zinc-500 font-brandon tracking-widest uppercase relative z-10">
        <div className="text-center md:text-left leading-loose flex flex-col md:block items-center">
          <span>© {currentYear} Queen Bean. All rights reserved.</span>
          <span className="block md:inline md:ml-4 mt-2 md:mt-0">
            Developed By <a href="https://www.heavensarder.com/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors font-bold ml-1">Web With Heaven</a>
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
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
      className="text-sm lg:text-base font-brandon text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 group relative w-fit py-1"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-0 left-1/2 lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
      {isExternal && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 group-hover:text-white transition-colors ml-1 relative z-10">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      )}
    </Link>
  );
}
