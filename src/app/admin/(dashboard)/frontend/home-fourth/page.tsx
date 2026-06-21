'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeFourthEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [scriptTitle, setScriptTitle] = useState('Our dishes');
  const [heading, setHeading] = useState('SIMPLE. FRESH. HONEST.');
  const [paragraph, setParagraph] = useState('Our menu celebrates natural, honest ingredients, prepared fresh every day. And at the heart of it all is the bread that brings everything together.');
  const [button1Text, setButton1Text] = useState('Get Inspired by our Menu');
  const [button1Link, setButton1Link] = useState('/menu');
  
  const [image1, setImage1] = useState('https://i.postimg.cc/4dTHwk2X/item-1.jpg');
  const [image2, setImage2] = useState('https://i.postimg.cc/j5rnv03s/item-2.jpg');
  const [image3, setImage3] = useState('https://i.postimg.cc/TwqL47B8/item-3.jpg');
  const [image4, setImage4] = useState('https://i.postimg.cc/qRXh5bWV/item-4.jpg');

  const [image1Mode, setImage1Mode] = useState<'upload' | 'url'>('url');
  const [image2Mode, setImage2Mode] = useState<'upload' | 'url'>('url');
  const [image3Mode, setImage3Mode] = useState<'upload' | 'url'>('url');
  const [image4Mode, setImage4Mode] = useState<'upload' | 'url'>('url');

  const file1InputRef = useRef<HTMLInputElement>(null);
  const file2InputRef = useRef<HTMLInputElement>(null);
  const file3InputRef = useRef<HTMLInputElement>(null);
  const file4InputRef = useRef<HTMLInputElement>(null);

  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  const [uploading3, setUploading3] = useState(false);
  const [uploading4, setUploading4] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/frontend?section_id=home_fourth_section');
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setScriptTitle(data.content.scriptTitle || 'Our dishes');
            setHeading(data.content.heading || 'SIMPLE. FRESH. HONEST.');
            setParagraph(data.content.paragraph || 'Our menu celebrates natural, honest ingredients, prepared fresh every day. And at the heart of it all is the bread that brings everything together.');
            setButton1Text(data.content.button1Text || 'Get Inspired by our Menu');
            setButton1Link(data.content.button1Link || '/menu');
            setImage1(data.content.image1 || 'https://i.postimg.cc/4dTHwk2X/item-1.jpg');
            setImage2(data.content.image2 || 'https://i.postimg.cc/j5rnv03s/item-2.jpg');
            setImage3(data.content.image3 || 'https://i.postimg.cc/TwqL47B8/item-3.jpg');
            setImage4(data.content.image4 || 'https://i.postimg.cc/qRXh5bWV/item-4.jpg');
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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUploading: (val: boolean) => void,
    setImage: (val: string) => void
  ) => {
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
          section_id: 'home_fourth_section',
          content: {
            scriptTitle,
            heading,
            paragraph,
            button1Text,
            button1Link,
            image1,
            image2,
            image3,
            image4,
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

  const renderImageUploader = (
    label: string,
    image: string,
    setImage: (val: string) => void,
    mode: 'upload' | 'url',
    setMode: (val: 'upload' | 'url') => void,
    fileRef: React.RefObject<HTMLInputElement | null>,
    uploading: boolean,
    setUploading: (val: boolean) => void
  ) => (
    <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50">
      <h4 className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-800 mb-3">{label}</h4>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setMode('url')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${mode === 'url' ? 'bg-[#86603A] text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-100'}`}>Paste URL</button>
        <button onClick={() => setMode('upload')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${mode === 'upload' ? 'bg-[#86603A] text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-100'}`}>Upload File</button>
      </div>

      {mode === 'url' ? (
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="https://..." />
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setUploading, setImage)} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full bg-white border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center hover:border-[#86603A] transition-colors disabled:opacity-50 font-brandon text-sm">
            {uploading ? 'Uploading...' : 'Click to upload (Max 5MB)'}
          </button>
        </div>
      )}
      
      {image && (
        <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
          <Image src={image} alt={label} fill className="object-cover" unoptimized />
        </div>
      )}
    </div>
  );

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
            Edit Fourth Section
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
                <input type="text" value={scriptTitle} onChange={(e) => setScriptTitle(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="e.g. Our dishes" />
              </div>

              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Main Heading
                </label>
                <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="e.g. SIMPLE. FRESH. HONEST." />
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

          {/* Images */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Four Row Images
            </h3>
            
            <p className="font-brandon text-xs text-zinc-500 mb-4">📐 Suggested Size: <strong>800×800px (Square or slightly vertical)</strong></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderImageUploader('Image 1', image1, setImage1, image1Mode, setImage1Mode, file1InputRef, uploading1, setUploading1)}
              {renderImageUploader('Image 2', image2, setImage2, image2Mode, setImage2Mode, file2InputRef, uploading2, setUploading2)}
              {renderImageUploader('Image 3', image3, setImage3, image3Mode, setImage3Mode, file3InputRef, uploading3, setUploading3)}
              {renderImageUploader('Image 4', image4, setImage4, image4Mode, setImage4Mode, file4InputRef, uploading4, setUploading4)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
