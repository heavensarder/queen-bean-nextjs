'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function FifthSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth gentle zoom spread over a long scroll distance
  const maskScale = useTransform(scrollYProgress, [0, 0.45], [1, 8]);
  // Fade the overlay out gracefully
  const maskOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);
  // After fade, hide entirely so nothing lingers
  const maskDisplay = useTransform(scrollYProgress, (v) => (v > 0.45 ? "none" : "flex"));
  
  // Fade out the Tour button smoothly
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const buttonDisplay = useTransform(scrollYProgress, (v) => (v > 0.15 ? "none" : "flex"));

  // Only show the Play/Pause button when the video is fully revealed
  const playButtonOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const playButtonPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.4 ? "auto" : "none"));

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    /* Shorter on mobile (350vh) vs desktop (500vh) to avoid endless scrolling on small screens */
    <section ref={containerRef} className="relative z-[60] h-[350vh] md:h-[500vh] bg-[#F2EFEB] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black">
        
        {/* Background Video Layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/7405929/7405929-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* SVG Mask Layer */}
        <motion.div 
          style={{ scale: maskScale, opacity: maskOpacity, display: maskDisplay as any }}
          className="absolute inset-0 w-full h-full z-10 flex items-center justify-center origin-center pointer-events-none"
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1000 600" 
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <defs>
              <mask id="video-mask">
                <rect width="1000" height="600" fill="white" />
                <text 
                  x="500" y="230" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontFamily="var(--font-anton), Anton, sans-serif"
                  fontSize="52"
                  fontWeight="400"
                  letterSpacing="2"
                  fill="black"
                >FOUR INGREDIENTS.</text>
                <text 
                  x="500" y="295" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontFamily="var(--font-anton), Anton, sans-serif"
                  fontSize="52"
                  fontWeight="400"
                  letterSpacing="2"
                  fill="black"
                >MILLIONS OF LOAVES.</text>
                <text 
                  x="500" y="360" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontFamily="var(--font-anton), Anton, sans-serif"
                  fontSize="52"
                  fontWeight="400"
                  letterSpacing="2"
                  fill="black"
                >ONE TRADITION.</text>
              </mask>
            </defs>
            <rect width="1000" height="600" fill="#F2EFEB" mask="url(#video-mask)" />
          </svg>
        </motion.div>

        {/* Tour the Atelier Button */}
        <motion.div 
          style={{ opacity: buttonOpacity, display: buttonDisplay as any }}
          className="absolute bottom-[8%] sm:bottom-[10%] md:bottom-[15%] z-20"
        >
          <button className="bg-white text-black border border-black px-6 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-xs md:text-sm tracking-widest font-bold hover:bg-zinc-100 transition-colors">
            Tour the Atelier
          </button>
        </motion.div>

        {/* Pause/Play Button (Only shows when video is fully revealed) */}
        <motion.div 
          style={{ opacity: playButtonOpacity, pointerEvents: playButtonPointerEvents as any }}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-12 md:right-12 z-30"
        >
          <button 
            onClick={togglePlay}
            className="flex items-center gap-2 sm:gap-3 text-white hover:text-zinc-300 transition-colors"
          >
            <span className="text-[10px] sm:text-xs md:text-sm tracking-widest font-bold">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 bg-black/20 backdrop-blur-sm border-white flex items-center justify-center">
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </div>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
