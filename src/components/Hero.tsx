'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function ScrollText({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track this element's scroll progress
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 10%"] // Animates from entering bottom to right before hitting the menu
  });

  // Calculate blur: starts blurry, becomes sharp quickly, blurs again right at the top
  const blurValue = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [15, 0, 0, 15]);
  const blur = useTransform(blurValue, (v) => `blur(${v}px)`);
  
  // Opacity and slight slide
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div 
      ref={ref}
      style={{ filter: blur, opacity, y }}
      className="text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-anton uppercase tracking-normal leading-[1.1] text-zinc-900 mix-blend-multiply text-center"
    >
      {children}
    </motion.div>
  );
}

export default function Hero({ content }: { content?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track the scroll progress of the entire Hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scale the food image smoothly from 1 to 1.15 over the entire scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div ref={containerRef} className="relative w-full bg-white">
      {/* Layer 1: Background (Sticky, Bottom Layer) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${content?.backgroundImage}")` }}
        />
      </div>

      {/* Layer 2: Food Image (Sticky, Top Layer) */}
      {/* Reduced max-w to make it smaller and leave more space above it */}
      <div className="sticky top-0 h-screen w-full z-20 pointer-events-none -mt-[100vh]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl flex flex-col items-center justify-end pb-4 lg:pb-0 translate-y-[2%]">
          <motion.img 
            style={{ scale }}
            src={content?.foodImage} 
            alt="Queen Bean Omelete"
            className="w-full h-auto object-contain drop-shadow-2xl origin-bottom mb-2 lg:mb-0"
          />
          {/* Scroll down indicator for mobile */}
          <div className="flex lg:hidden flex-col items-center gap-1 pointer-events-auto animate-bounce">
             <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center bg-white/80 shadow-sm backdrop-blur-sm">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
             </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Text (Scrolling, Middle Layer) */}
      {/* Decreased text size and space between elements */}
      <div className="relative z-10 w-full -mt-[100vh]">
        <div 
          className="hero-scroll-text flex flex-col items-center justify-start pt-[38vh] lg:pt-[25vh] pb-[100vh] lg:pb-[120vh] px-4"
        >
          
          {content?.texts?.map((text: string, idx: number) => (
            <ScrollText key={idx}>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </ScrollText>
          ))}
          
        </div>
      </div>
    </div>
  );
}
