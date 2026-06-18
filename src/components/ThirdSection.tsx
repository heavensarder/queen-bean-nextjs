'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function ThirdSection({ content }: { content?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect: scale the image up so it can translate without showing empty space,
  // and translate Y slightly based on scroll progress.
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  // Use defaults if content is not provided
  const scriptTitle = content?.scriptTitle || "Welcome home";
  const heading = content?.heading || "PLEASE TAKE<br />YOUR TIME";
  const paragraph = content?.paragraph || "Our restaurants, much like the vibrant community around them, embody a blend of new and contemporary design with traditional bakery roots.";
  const button1Text = content?.button1Text || "Find bakery";
  const button1Link = content?.button1Link || "#locations";
  const image = content?.image || "https://i.postimg.cc/7Yqbfnd0/restaurant-view-3rd-section.jpg";

  return (
    <section ref={containerRef} className="relative z-40 w-full p-[10px] lg:p-[20px] bg-[#F2EFEB]">
      <div className="flex flex-col-reverse lg:flex-row border border-black w-full min-h-[calc(100vh-20px)] lg:min-h-[calc(100vh-40px)] bg-white drop-shadow-2xl overflow-hidden">
        
        {/* Left Image (Desktop) / Bottom Image (Mobile) */}
        <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-r border-black min-h-[40vh] lg:min-h-0 relative overflow-hidden">
          <motion.img 
            style={{ y, scale: 1.3 }}
            src={image} 
            alt="Restaurant view"
            className="absolute inset-0 w-full h-full object-cover origin-center"
          />
        </div>

        {/* Right Content (Desktop) / Top Content (Mobile) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center p-8 md:p-10 lg:p-16 xl:p-24 bg-white">
          <div className="max-w-[28rem] flex flex-col items-center">
            {/* Script Font */}
            <h3 className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl text-[#86603A] font-signature mb-1 lg:mb-2">
              {scriptTitle}
            </h3>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-[5rem] font-anton uppercase tracking-tight leading-[1.0] text-zinc-900 mb-4 lg:mb-8"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            <p className="text-sm lg:text-base text-zinc-700 leading-relaxed mb-6 lg:mb-10 font-medium">
              {paragraph}
            </p>
            <div className="flex flex-row gap-3 lg:gap-4">
              <Link href={button1Link} className="bg-black text-white px-8 lg:px-10 py-3 lg:py-4 text-xs lg:text-sm tracking-widest font-bold hover:bg-zinc-800 transition-colors text-center inline-block">
                {button1Text}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
