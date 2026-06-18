'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeHeroEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [bgImage, setBgImage] = useState('');
  const [foodImage, setFoodImage] = useState('');
  const [texts, setTexts] = useState<string[]>([]);

  // UI state for image inputs
  const [bgImageMode, setBgImageMode] = useState<'upload' | 'url'>('url');
  const [foodImageMode, setFoodImageMode] = useState<'upload' | 'url'>('url');
  
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const foodFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingFood, setUploadingFood] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/frontend?section_id=home_hero');
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setBgImage(data.content.backgroundImage || '');
            setFoodImage(data.content.foodImage || '');
            setTexts(data.content.texts || []);
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
          section_id: 'home_hero',
          content: {
            backgroundImage: bgImage,
            foodImage: foodImage,
            texts: texts,
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
            Edit Home Hero
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
          
          {/* Background Image */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Background Image
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setBgImageMode('url')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${bgImageMode === 'url' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Paste URL</button>
              <button onClick={() => setBgImageMode('upload')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${bgImageMode === 'upload' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Upload File</button>
            </div>

            {bgImageMode === 'url' ? (
              <input type="text" value={bgImage} onChange={(e) => setBgImage(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="https://..." />
            ) : (
              <div>
                <input ref={bgFileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setUploadingBg, setBgImage)} className="hidden" />
                <button onClick={() => bgFileInputRef.current?.click()} disabled={uploadingBg} className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-[#86603A] hover:bg-[#86603A]/5 transition-colors disabled:opacity-50">
                  {uploadingBg ? 'Uploading...' : 'Click to upload (Max 5MB)'}
                </button>
              </div>
            )}
            
            <p className="font-brandon text-xs text-zinc-400 mt-2">📐 Suggested Size: <strong>1920×1080px (16:9)</strong></p>

            {bgImage && (
              <div className="mt-4 relative h-48 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                <Image src={bgImage} alt="Background Preview" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>

          {/* Food Image */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
              Food Image (Foreground)
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setFoodImageMode('url')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${foodImageMode === 'url' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Paste URL</button>
              <button onClick={() => setFoodImageMode('upload')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${foodImageMode === 'upload' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Upload File</button>
            </div>

            {foodImageMode === 'url' ? (
              <input type="text" value={foodImage} onChange={(e) => setFoodImage(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="https://..." />
            ) : (
              <div>
                <input ref={foodFileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setUploadingFood, setFoodImage)} className="hidden" />
                <button onClick={() => foodFileInputRef.current?.click()} disabled={uploadingFood} className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-[#86603A] hover:bg-[#86603A]/5 transition-colors disabled:opacity-50">
                  {uploadingFood ? 'Uploading...' : 'Click to upload (Max 5MB)'}
                </button>
              </div>
            )}

            <p className="font-brandon text-xs text-zinc-400 mt-2">📐 Suggested Size: <strong>800×800px (Transparent PNG/WebP)</strong></p>

            {foodImage && (
              <div className="mt-4 relative h-48 w-48 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <Image src={foodImage} alt="Food Preview" fill className="object-contain p-2" unoptimized />
              </div>
            )}
          </div>

          {/* Texts */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-2">
              <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
                Scrolling Text Lines
              </h3>
              <button 
                onClick={() => setTexts([...texts, ''])}
                className="text-[#86603A] hover:text-black font-brandon font-bold text-sm tracking-widest uppercase transition-colors flex items-center gap-1"
              >
                + Add Line
              </button>
            </div>
            
            <p className="font-brandon text-sm text-zinc-500 mb-4">
              Use <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">&lt;br /&gt;</code> for line breaks within a scrolling element.
            </p>

            <div className="space-y-3">
              {texts.map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-12 flex items-center justify-center bg-zinc-100 rounded-lg font-anton text-zinc-400 shrink-0">
                    {idx + 1}
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => {
                      const newTexts = [...texts];
                      newTexts[idx] = e.target.value;
                      setTexts(newTexts);
                    }}
                    rows={2}
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 resize-y"
                    placeholder="e.g. THIS IS NOT<br />JUST FOOD."
                  />
                  <button 
                    onClick={() => setTexts(texts.filter((_, i) => i !== idx))}
                    className="p-3 mt-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              ))}
              {texts.length === 0 && (
                <div className="text-center py-6 text-zinc-400 font-brandon">
                  No text lines. Click "Add Line" to add one.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
