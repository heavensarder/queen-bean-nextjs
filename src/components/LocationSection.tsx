'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LocationSection({ content }: { content?: any }) {
  const [showHours, setShowHours] = useState(false);
  const [activeTab, setActiveTab] = useState<'Store' | 'Pickup' | 'Delivery'>('Store');

  // Use defaults if content is not provided
  const scriptTitle = content?.scriptTitle || "Visit us";
  const heading = content?.heading || "OUR LOCATION";
  const locationName = content?.locationName || "Queen Bean";
  const locationCity = content?.locationCity || "Philadelphia, PA";
  const directionsLink = content?.directionsLink || "https://maps.google.com/?q=246+S+11th+St,+Philadelphia,+PA+19107";
  const addressLine1 = content?.addressLine1 || "246 South 11th Street";
  const addressLine2 = content?.addressLine2 || "Philadelphia, PA 19107";
  const phone = content?.phone || "(267) 761-4910";
  const email = content?.email || "queenbeanphilly@gmail.com";
  const mapEmbedUrl = content?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116098.79814347535!2d-75.29684884299014!3d39.95066618242495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c6266c542f15%3A0x817b911039e59fba!2s246%20S%2011th%20St%2C%20Philadelphia%2C%20PA%2019107%2C%20USA!5e1!3m2!1sen!2sbd!4v1781623646838!5m2!1sen!2sbd";
  const generalHours = content?.generalHours || "6:00 AM - 6:00 PM";
  const orderButtonText = content?.orderButtonText || "ORDER ONLINE";
  const orderButtonLink = content?.orderButtonLink || "/menu";

  // Get the current day specifically in Philadelphia (Eastern Time)
  const phillyTimeStr = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const todayIndex = new Date(phillyTimeStr).getDay(); // 0 is Sunday
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <section id="locations" className="relative z-[70] w-full bg-[#F2EFEB] p-[10px] lg:p-[20px] transform-gpu">
      <div className="flex flex-col lg:flex-row border border-black bg-white shadow-2xl overflow-hidden min-h-[60vh] lg:min-h-[70vh] transform-gpu">
        
        {/* Map Side (Left) */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-black min-h-[40vh] lg:min-h-[60vh] relative">
          <iframe 
            src={mapEmbedUrl} 
            className="absolute inset-0 w-full h-full border-0 pointer-events-none"
            allowFullScreen={false} 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Content Side (Right) */}
        <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-10 lg:p-16 xl:p-24 justify-center">
          <h3 className="text-5xl md:text-6xl text-[#86603A] font-signature mb-2">
            {scriptTitle}
          </h3>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-[5rem] font-anton uppercase tracking-tight leading-[1.0] text-zinc-900 mb-8 lg:mb-12">
            {heading}
          </h2>

          {!showHours ? (
            // Info View
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-4">
                <div>
                  <h4 className="text-zinc-500 text-xs tracking-widest uppercase font-bold mb-1">{locationName}</h4>
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-zinc-900">{locationCity}</h3>
                </div>
                <a 
                  href={directionsLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white text-black border border-black px-6 py-2.5 text-xs tracking-widest font-bold hover:bg-zinc-100 transition-colors whitespace-nowrap"
                >
                  GET DIRECTIONS
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-auto">
                <div>
                  <h5 className="text-zinc-500 text-xs tracking-widest uppercase font-bold mb-3">Address</h5>
                  <p className="text-sm lg:text-base text-zinc-900 leading-relaxed font-medium">
                    {addressLine1}<br />
                    {addressLine2}
                  </p>
                </div>
                <div>
                  <h5 className="text-zinc-500 text-xs tracking-widest uppercase font-bold mb-3">Contacts</h5>
                  <p className="text-sm lg:text-base text-zinc-900 leading-relaxed font-medium">
                    {phone}<br />
                    {email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Hours View
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <div className="flex gap-6 border-b border-black mb-6">
                {['Store', 'Pickup', 'Delivery'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-3 text-xs lg:text-sm tracking-widest uppercase font-bold relative ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col gap-3 font-medium text-sm lg:text-base">
                {days.map((day, index) => (
                  <div key={day} className={`grid grid-cols-2 py-1 ${index === todayIndex ? 'font-bold text-black' : 'text-zinc-500'}`}>
                    <div className={index === todayIndex ? 'text-black' : ''}>{day}</div>
                    <div className={index === todayIndex ? 'text-black' : ''}>{generalHours}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-8 pt-6 border-t border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="font-bold text-sm text-zinc-900 tracking-wide">
              Today: {generalHours}
            </div>
            <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
              <button 
                onClick={() => setShowHours(!showHours)}
                className="text-xs tracking-widest font-bold uppercase text-zinc-500 hover:text-black transition-colors"
              >
                {showHours ? 'See Info' : 'See Hours'}
              </button>
              <Link href={orderButtonLink} className="bg-black text-white px-8 py-3 text-xs tracking-widest font-bold hover:bg-zinc-800 transition-colors ml-auto md:ml-0 inline-block text-center">
                {orderButtonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
