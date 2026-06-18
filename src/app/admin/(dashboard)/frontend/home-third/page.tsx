'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeThirdEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [scriptTitle, setScriptTitle] = useState('Welcome home');
  const [heading, setHeading] = useState('PLEASE TAKE<br />YOUR TIME');
  const [paragraph, setParagraph] = useState('Our restaurants, much like the vibrant community around them, embody a blend of new and contemporary design with traditional bakery roots.');
  const [button1Text, setButton1Text] = useState('Find bakery');
  const [button1Link, setButton1Link] = useState('#locations');
  const [image, setImage] = useState('https://i.postimg.cc/7Yqbfnd0/restaurant-view-3rd-section.jpg');

  const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/frontend?section_id=home_third_section');
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setScriptTitle(data.content.scriptTitle || 'Welcome home');
            setHeading(data.content.heading || 'PLEASE TAKE<br />YOUR TIME');
            setParagraph(data.content.paragraph || 'Our restaurants, much like the vibrant community around them, embody a blend of new and contemporary design with traditional bakery roots.');
            setButton1Text(data.content.button1Text || 'Find bakery');
            setButton1Link(data.content.button1Link || '#locations');
            setImage(data.content.image || 'https://i.postimg.cc/7Yqbfnd0/restaurant-view-3rd-section.jpg');
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImage(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/frontend', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: 'home_third_section',
          content: {
            scriptTitle,
            heading,
            paragraph,
            button1Text,
            button1Link,
            image,
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
            Edit Third Section
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
          
          {/* Text Content */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
              Text Content
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Script Title (Small Cursive Text)
                </label>
                <input type="text" value={scriptTitle} onChange={(e) => setScriptTitle(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="e.g. Welcome home" />
              </div>

              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Main Heading
                </label>
                <p className="font-brandon text-[11px] text-zinc-400 mb-2">Use &lt;br /&gt; for line breaks.</p>
                <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="e.g. PLEASE TAKE<br />YOUR TIME" />
              </div>

              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Paragraph
                </label>
                <textarea rows={4} value={paragraph} onChange={(e) => setParagraph(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 resize-y" placeholder="Paragraph text..." />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              Button
            </h3>
            
            <div className="max-w-md">
              <div className="space-y-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                <h4 className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-800">Primary Button (Black)</h4>
                <div>
                  <label className="block font-brandon text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Text</label>
                  <input type="text" value={button1Text} onChange={(e) => setButton1Text(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
                <div>
                  <label className="block font-brandon text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Link (URL or path)</label>
                  <input type="text" value={button1Link} onChange={(e) => setButton1Link(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Section Image
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setImageMode('url')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${imageMode === 'url' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Paste URL</button>
              <button onClick={() => setImageMode('upload')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${imageMode === 'upload' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Upload File</button>
            </div>

            {imageMode === 'url' ? (
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="https://..." />
            ) : (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-[#86603A] hover:bg-[#86603A]/5 transition-colors disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Click to upload (Max 5MB)'}
                </button>
              </div>
            )}
            
            <p className="font-brandon text-xs text-zinc-400 mt-2">📐 Suggested Size: <strong>1000×1200px (Vertical)</strong></p>

            {image && (
              <div className="mt-4 relative h-64 w-48 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                <Image src={image} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
