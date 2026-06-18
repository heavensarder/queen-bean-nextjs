import Link from 'next/link';

export default function SecondSection({ content }: { content?: any }) {
  return (
    <section className="sticky top-0 z-30 w-full p-[10px] lg:p-[20px] -mt-[100vh]">
      <div className="flex flex-col lg:flex-row border border-black w-full min-h-[calc(100vh-20px)] lg:min-h-[calc(100vh-40px)] bg-white drop-shadow-2xl overflow-hidden">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center p-8 md:p-10 lg:p-16 xl:p-24">
          <div className="max-w-[28rem] flex flex-col items-center">
            {/* Script Font for "Better Choice" */}
            <h3 className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl text-[#86603A] font-signature mb-1 lg:mb-2">
              {content?.scriptTitle}
            </h3>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-[5rem] font-anton uppercase tracking-tight leading-[1.0] text-zinc-900 mb-4 lg:mb-8"
              dangerouslySetInnerHTML={{ __html: content?.heading || '' }}
            />
            <p className="text-sm lg:text-base text-zinc-700 leading-relaxed mb-6 lg:mb-10 font-medium whitespace-pre-wrap">
              {content?.paragraph}
            </p>
            <div className="flex flex-row gap-3 lg:gap-4">
              <Link href={content?.button1Link || '#'} className="bg-black text-white px-6 lg:px-8 py-2.5 lg:py-3 text-xs lg:text-sm tracking-widest font-bold hover:bg-zinc-800 transition-colors text-center inline-block">
                {content?.button1Text}
              </Link>
              <Link href={content?.button2Link || '/menu'} className="bg-white text-black border border-black px-6 lg:px-8 py-2.5 lg:py-3 text-xs lg:text-sm tracking-widest font-bold hover:bg-zinc-100 transition-colors text-center inline-block">
                {content?.button2Text}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-black min-h-[40vh] lg:min-h-0">
          <img 
            src={content?.image} 
            alt="Section image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
