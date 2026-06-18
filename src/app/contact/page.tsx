'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const phillyTimeStr = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const todayIndex = new Date(phillyTimeStr).getDay(); // 0 is Sunday
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormState('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormState('idle'), 5000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to send message. Please try again.');
        setFormState('error');
        setTimeout(() => setFormState('idle'), 5000);
      }
    } catch {
      setErrorMsg('Could not connect to the server. Please try again later.');
      setFormState('error');
      setTimeout(() => setFormState('idle'), 5000);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 lg:px-8 pt-36 lg:pt-40 pb-12 lg:pb-24 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-20 w-full"
        >
          <h3 className="text-4xl lg:text-5xl text-[#86603A] font-signature mb-2">Get in touch</h3>
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-anton uppercase tracking-tighter leading-none text-zinc-900 mb-6">
            WE'D LOVE TO<br />HEAR FROM YOU
          </h1>
          <p className="font-brandon text-zinc-600 text-sm md:text-base max-w-xl mx-auto">
            Whether you have a question about our menu, catering, or anything else, our team is ready to answer all your questions.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Form Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white border border-zinc-200 p-8 lg:p-12 shadow-xl"
          >
            <h2 className="font-anton text-3xl uppercase tracking-widest text-zinc-900 mb-8">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-brandon uppercase tracking-[0.2em] font-bold text-zinc-500">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 border-b-2 border-zinc-200 px-4 py-3 font-brandon focus:outline-none focus:border-[#86603A] focus:bg-white transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-brandon uppercase tracking-[0.2em] font-bold text-zinc-500">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-50 border-b-2 border-zinc-200 px-4 py-3 font-brandon focus:outline-none focus:border-[#86603A] focus:bg-white transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-brandon uppercase tracking-[0.2em] font-bold text-zinc-500">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-zinc-50 border-b-2 border-zinc-200 px-4 py-3 font-brandon focus:outline-none focus:border-[#86603A] focus:bg-white transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-brandon uppercase tracking-[0.2em] font-bold text-zinc-500">Message</label>
                <textarea 
                  required 
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-zinc-50 border-b-2 border-zinc-200 px-4 py-3 font-brandon focus:outline-none focus:border-[#86603A] focus:bg-white transition-colors resize-none"
                  placeholder="Tell us everything..."
                />
              </div>

              <div className="pt-4 flex items-center gap-6">
                <button 
                  type="submit" 
                  disabled={formState === 'submitting' || formState === 'success'}
                  className="bg-black text-white px-10 py-4 font-brandon text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#86603A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 relative overflow-hidden group"
                >
                  <span className="relative z-10">{formState === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                  {formState === 'idle' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  )}
                </button>
                
                {formState === 'success' && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-600 font-brandon font-bold text-sm"
                  >
                    Thanks! We&apos;ll be in touch soon.
                  </motion.p>
                )}
                
                {formState === 'error' && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-600 font-brandon font-bold text-sm"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </div>
            </form>
          </motion.div>

          {/* Info & Map Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 flex flex-col gap-8 lg:gap-12"
          >
            {/* Info Box */}
            <div className="bg-[#1A1A1A] text-white p-8 lg:p-12 shadow-xl">
              <h2 className="font-anton text-3xl uppercase tracking-widest text-[#86603A] mb-8">Visit Our Bakery</h2>
              
              <div className="space-y-8 font-brandon text-sm lg:text-base text-zinc-300">
                {/* Location */}
                <div className="flex gap-4 items-start group">
                  <div className="mt-1 p-3 bg-white/5 rounded-full group-hover:bg-[#86603A]/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#86603A]"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-1">Address</h4>
                    <p>246 South 11th Street<br/>Philadelphia, PA 19107</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex gap-4 items-start group">
                  <div className="mt-1 p-3 bg-white/5 rounded-full group-hover:bg-[#86603A]/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#86603A]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-1">Contact</h4>
                    <p>(267) 761-4910<br/>queenbeanphilly@gmail.com</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start group pt-4 border-t border-white/10">
                  <div className="mt-1 p-3 bg-white/5 rounded-full group-hover:bg-[#86603A]/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#86603A]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-3">Opening Hours</h4>
                    <div className="space-y-2 text-sm">
                      {days.map((day, index) => (
                        <div key={day} className={`flex justify-between items-center ${index === todayIndex ? 'text-white font-bold bg-[#86603A]/20 -mx-2 px-2 py-1 rounded' : ''}`}>
                          <span>{day}</span>
                          <span>6:00 AM - 6:00 PM</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Box */}
            <div className="w-full h-[400px] bg-zinc-100 border border-zinc-200 shadow-xl overflow-hidden group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116098.79814347535!2d-75.29684884299014!3d39.95066618242495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c6266c542f15%3A0x817b911039e59fba!2s246%20S%2011th%20St%2C%20Philadelphia%2C%20PA%2019107%2C%20USA!5e1!3m2!1sen!2sbd!4v1781623646838!5m2!1sen!2sbd" 
                className="w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen={false} 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
