import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center relative overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl mx-auto pt-20">
        
        {/* The 404 text behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[45%] lg:-translate-y-[55%] z-0 select-none">
          <span className="font-signature text-[5rem] lg:text-[8rem] xl:text-[10rem] text-[#F4B41A] leading-none">
            404
          </span>
        </div>
        
        {/* Main Header Text */}
        <div className="z-10 relative mt-8 lg:mt-12">
          <h1 className="font-anton text-[2.5rem] md:text-5xl lg:text-7xl xl:text-[5.5rem] xl:text-[6.5rem] uppercase tracking-tighter text-black mb-6 lg:mb-8 leading-[0.9]">
            OOPS! WE'RE STILL BAKING THIS PAGE.
          </h1>
          
          <p className="font-brandon text-zinc-800 text-xs md:text-sm lg:text-base mb-10 lg:mb-12 font-medium tracking-wide">
            We're sorry we can't seem to find the page you are looking for.
          </p>
          
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 lg:px-12 py-3.5 lg:py-4 font-brandon tracking-widest text-[10px] lg:text-xs font-bold hover:bg-[#86603A] transition-colors"
          >
            go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
