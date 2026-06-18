'use client';

import Link from 'next/link';

export default function FrontendCMSPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">
          Frontend Content
        </h1>
        <p className="font-signature text-2xl text-[#86603A] mt-1">
          Manage your website's content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Home Page Group */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-zinc-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#86603A]/10 flex items-center justify-center text-[#86603A]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <h2 className="font-anton text-xl tracking-wider uppercase text-zinc-900">Home Page</h2>
          </div>
          
          <ul className="space-y-2">
            <li>
              <Link href="/admin/frontend/home-hero" className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group">
                <span className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-700 group-hover:text-zinc-900">Hero Section</span>
                <svg className="text-zinc-400 group-hover:text-[#86603A] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>
            <li>
              <Link href="/admin/frontend/home-second" className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group">
                <span className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-700 group-hover:text-zinc-900">Secound Section</span>
                <svg className="text-zinc-400 group-hover:text-[#86603A] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>
            <li>
              <Link href="/admin/frontend/home-third" className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group">
                <span className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-700 group-hover:text-zinc-900">Third Section</span>
                <svg className="text-zinc-400 group-hover:text-[#86603A] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>
            <li>
              <Link href="/admin/frontend/home-fourth" className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group">
                <span className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-700 group-hover:text-zinc-900">Fourth Section</span>
                <svg className="text-zinc-400 group-hover:text-[#86603A] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>
            <li>
              <Link href="/admin/frontend/home-fifth" className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group">
                <span className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-700 group-hover:text-zinc-900">Fifth Section</span>
                <svg className="text-zinc-400 group-hover:text-[#86603A] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>
            <li>
              <Link href="/admin/frontend/home-location" className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group">
                <span className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-700 group-hover:text-zinc-900">Location Section</span>
                <svg className="text-zinc-400 group-hover:text-[#86603A] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </li>
            {/* Add more sections here later */}
          </ul>
        </div>
      </div>
    </div>
  );
}
