'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomeLocationEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [scriptTitle, setScriptTitle] = useState('Visit us');
  const [heading, setHeading] = useState('OUR LOCATION');
  const [locationName, setLocationName] = useState('Queen Bean');
  const [locationCity, setLocationCity] = useState('Philadelphia, PA');
  const [directionsLink, setDirectionsLink] = useState('https://maps.google.com/?q=246+S+11th+St,+Philadelphia,+PA+19107');
  const [addressLine1, setAddressLine1] = useState('246 South 11th Street');
  const [addressLine2, setAddressLine2] = useState('Philadelphia, PA 19107');
  const [phone, setPhone] = useState('(267) 761-4910');
  const [email, setEmail] = useState('queenbeanphilly@gmail.com');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116098.79814347535!2d-75.29684884299014!3d39.95066618242495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c6266c542f15%3A0x817b911039e59fba!2s246%20S%2011th%20St%2C%20Philadelphia%2C%20PA%2019107%2C%20USA!5e1!3m2!1sen!2sbd!4v1781623646838!5m2!1sen!2sbd');
  const [generalHours, setGeneralHours] = useState('6:00 AM - 6:00 PM');
  const [orderButtonText, setOrderButtonText] = useState('ORDER ONLINE');
  const [orderButtonLink, setOrderButtonLink] = useState('/menu');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/frontend?section_id=home_location_section');
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setScriptTitle(data.content.scriptTitle || 'Visit us');
            setHeading(data.content.heading || 'OUR LOCATION');
            setLocationName(data.content.locationName || 'Queen Bean');
            setLocationCity(data.content.locationCity || 'Philadelphia, PA');
            setDirectionsLink(data.content.directionsLink || 'https://maps.google.com/?q=246+S+11th+St,+Philadelphia,+PA+19107');
            setAddressLine1(data.content.addressLine1 || '246 South 11th Street');
            setAddressLine2(data.content.addressLine2 || 'Philadelphia, PA 19107');
            setPhone(data.content.phone || '(267) 761-4910');
            setEmail(data.content.email || 'queenbeanphilly@gmail.com');
            setMapEmbedUrl(data.content.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116098.79814347535!2d-75.29684884299014!3d39.95066618242495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c6266c542f15%3A0x817b911039e59fba!2s246%20S%2011th%20St%2C%20Philadelphia%2C%20PA%2019107%2C%20USA!5e1!3m2!1sen!2sbd!4v1781623646838!5m2!1sen!2sbd');
            setGeneralHours(data.content.generalHours || '6:00 AM - 6:00 PM');
            setOrderButtonText(data.content.orderButtonText || 'ORDER ONLINE');
            setOrderButtonLink(data.content.orderButtonLink || '/menu');
          }
        }
      } catch (error) {
        console.error('Failed to load config', error);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/frontend', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: 'home_location_section',
          content: {
            scriptTitle,
            heading,
            locationName,
            locationCity,
            directionsLink,
            addressLine1,
            addressLine2,
            phone,
            email,
            mapEmbedUrl,
            generalHours,
            orderButtonText,
            orderButtonLink
          }
        }),
      });
      
      if (res.ok) {
        alert('Saved successfully!');
      } else {
        alert('Failed to save.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-zinc-300 border-t-[#86603A]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/frontend" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-2 font-brandon font-bold text-sm uppercase tracking-widest">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Back to Frontend
          </Link>
          <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">
            Edit Location Section
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-black text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#86603A] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-10">
          
          {/* Main Titles */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
              Header Titles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Script Title (Small Cursive Text)
                </label>
                <input type="text" value={scriptTitle} onChange={(e) => setScriptTitle(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
              </div>

              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Main Heading
                </label>
                <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Location Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Store Name</label>
                  <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">City / Region</label>
                  <input type="text" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Google Maps Directions Link</label>
                  <input type="text" value={directionsLink} onChange={(e) => setDirectionsLink(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="https://maps.google.com/..." />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Address Line 1</label>
                  <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Address Line 2 (City, State Zip)</label>
                  <input type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Map Embed URL (src attribute only)</label>
                  <input type="text" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="https://www.google.com/maps/embed?pb=..." />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Contact & Hours
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
              </div>
              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Email</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
              </div>
              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">General Hours</label>
                <input type="text" value={generalHours} onChange={(e) => setGeneralHours(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              Action Button
            </h3>
            
            <div className="max-w-md">
              <div className="space-y-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                <h4 className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-800">Primary Button (Black)</h4>
                <div>
                  <label className="block font-brandon text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Text</label>
                  <input type="text" value={orderButtonText} onChange={(e) => setOrderButtonText(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
                <div>
                  <label className="block font-brandon text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Link (URL or path)</label>
                  <input type="text" value={orderButtonLink} onChange={(e) => setOrderButtonLink(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
