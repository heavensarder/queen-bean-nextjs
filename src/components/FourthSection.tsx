'use client';

export default function FourthSection() {
  return (
    <section className="relative z-50 w-full bg-[#F2EFEB] pt-16 md:pt-24 pb-0 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center px-4 mb-12 md:mb-20">
        {/* Script Font */}
        <h3 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl text-[#86603A] font-signature mb-2">
          Our dishes
        </h3>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-anton uppercase tracking-normal leading-[1.0] text-zinc-900 mb-6 md:mb-8">
          SIMPLE. FRESH. HONEST.
        </h2>
        <p className="text-sm md:text-base text-zinc-700 leading-relaxed mb-8 md:mb-10 font-medium max-w-2xl">
          Our menu celebrates natural, honest ingredients, prepared fresh every day. And at the heart of it all is the bread that brings everything together.
        </p>
        <button className="bg-black text-white px-8 md:px-10 py-3 md:py-4 text-xs md:text-sm tracking-widest font-bold hover:bg-zinc-800 transition-colors">
          Get Inspired by our Menu
        </button>
      </div>

      {/* Exact Match Images Row */}
      <div className="w-full overflow-hidden py-12 md:py-20">
        <div className="flex flex-row w-[104%] -ml-[2%] items-center justify-center -space-x-4 md:-space-x-6 lg:-space-x-8">
          
          {/* Image 1 */}
          <div className="flex-1 z-10 transform -rotate-6 translate-y-4 md:translate-y-8">
            <img 
              src="https://i.postimg.cc/4dTHwk2X/item-1.jpg" 
              alt="Dish 1" 
              className="w-full h-auto border-2 md:border-[6px] border-white shadow-xl"
            />
          </div>
          
          {/* Image 2 */}
          <div className="flex-1 z-20 transform rotate-2 -translate-y-2 md:-translate-y-4">
            <img 
              src="https://i.postimg.cc/j5rnv03s/item-2.jpg" 
              alt="Dish 2" 
              className="w-full h-auto border-2 md:border-[6px] border-white shadow-xl"
            />
          </div>
          
          {/* Image 3 */}
          <div className="flex-1 z-30 transform -rotate-3 translate-y-2 md:translate-y-4">
            <img 
              src="https://i.postimg.cc/TwqL47B8/item-3.jpg" 
              alt="Dish 3" 
              className="w-full h-auto border-2 md:border-[6px] border-white shadow-xl"
            />
          </div>
          
          {/* Image 4 */}
          <div className="flex-1 z-40 transform rotate-6 -translate-y-4 md:-translate-y-8">
            <img 
              src="https://i.postimg.cc/qRXh5bWV/item-4.jpg" 
              alt="Dish 4" 
              className="w-full h-auto border-2 md:border-[6px] border-white shadow-xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
