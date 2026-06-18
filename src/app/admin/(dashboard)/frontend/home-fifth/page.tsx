'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomeFifthEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [text1, setText1] = useState('FOUR INGREDIENTS.');
  const [text2, setText2] = useState('MILLIONS OF LOAVES.');
  const [text3, setText3] = useState('ONE TRADITION.');
  const [button1Text, setButton1Text] = useState('Tour the Atelier');
  const [button1Link, setButton1Link] = useState('#');
  
  const [videoUrl, setVideoUrl] = useState('https://videos.pexels.com/video-files/7405929/7405929-uhd_2560_1440_24fps.mp4');

  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('url');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/frontend?section_id=home_fifth_section');
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setText1(data.content.text1 || 'FOUR INGREDIENTS.');
            setText2(data.content.text2 || 'MILLIONS OF LOAVES.');
            setText3(data.content.text3 || 'ONE TRADITION.');
            setButton1Text(data.content.button1Text || 'Tour the Atelier');
            setButton1Link(data.content.button1Link || '#');
            setVideoUrl(data.content.videoUrl || 'https://videos.pexels.com/video-files/7405929/7405929-uhd_2560_1440_24fps.mp4');
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
    setUrl: (val: string) => void
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
        setUrl(data.url);
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
          section_id: 'home_fifth_section',
          content: {
            text1,
            text2,
            text3,
            button1Text,
            button1Link,
            videoUrl,
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
            Edit Fifth Section
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
          
          {/* Background Video */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              Background Video
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setVideoMode('url')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${videoMode === 'url' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Paste URL</button>
              <button onClick={() => setVideoMode('upload')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${videoMode === 'upload' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Upload File</button>
            </div>

            {videoMode === 'url' ? (
              <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="https://...mp4" />
            ) : (
              <div>
                <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" onChange={(e) => handleFileUpload(e, setUploadingVideo, setVideoUrl)} className="hidden" />
                <button onClick={() => videoInputRef.current?.click()} disabled={uploadingVideo} className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-[#86603A] hover:bg-[#86603A]/5 transition-colors disabled:opacity-50">
                  {uploadingVideo ? 'Uploading...' : 'Click to upload (Max 5MB)'}
                </button>
              </div>
            )}

            <p className="font-brandon text-xs text-zinc-400 mt-2">📐 Suggested Format: <strong>MP4 (16:9)</strong></p>

            {videoUrl && (
              <div className="mt-4 relative h-48 w-full rounded-xl overflow-hidden bg-black border border-zinc-200 flex items-center justify-center">
                 <video src={videoUrl} className="max-h-full max-w-full" controls muted playsInline />
              </div>
            )}
          </div>

          {/* Text Mask Content */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
              Mask Text Content
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Line 1
                </label>
                <input type="text" value={text1} onChange={(e) => setText1(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="e.g. FOUR INGREDIENTS." />
              </div>

              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Line 2
                </label>
                <input type="text" value={text2} onChange={(e) => setText2(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="e.g. MILLIONS OF LOAVES." />
              </div>

              <div>
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Line 3
                </label>
                <input type="text" value={text3} onChange={(e) => setText3(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50" placeholder="e.g. ONE TRADITION." />
              </div>
            </div>
          </div>

          {/* Button */}
          <div>
            <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              Tour Button
            </h3>
            
            <div className="max-w-md">
              <div className="space-y-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                <h4 className="font-brandon font-bold text-sm uppercase tracking-widest text-zinc-800">Secondary Button (White)</h4>
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

        </div>
      </div>
    </div>
  );
}
