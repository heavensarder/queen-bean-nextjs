'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  jsonLd: string;
}

export default function SEOManagerPage() {
  const [settings, setSettings] = useState<SEOSettings>({
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    jsonLd: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [ogImageMode, setOgImageMode] = useState<'upload' | 'url'>('url');
  const ogFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingOg, setUploadingOg] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/seo-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch SEO settings', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsSaving(true);
    setMessage('');
    
    // Validate JSON-LD
    try {
      if (settings.jsonLd.trim() !== '') {
        JSON.parse(settings.jsonLd);
      }
    } catch (e) {
      setMessage('Error: JSON-LD schema is not valid JSON.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/seo-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('SEO Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      console.error('Save error', error);
      setMessage('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-[#86603A] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-200">
          <h1 className="font-anton text-3xl uppercase tracking-wider text-zinc-900">SEO Manager</h1>
          <p className="text-zinc-500 font-brandon mt-2">
            Configure global SEO metadata, Open Graph settings, and JSON-LD markup schema to help the site rank better in search engines.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* General SEO */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-brandon text-zinc-800 border-b pb-2">General Metadata</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold font-brandon text-zinc-700 mb-1">Site Title</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 transition-all"
                  placeholder="e.g. Queen Bean"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold font-brandon text-zinc-700 mb-1">Site Description</label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={2}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 transition-all resize-y"
                  placeholder="A royal culinary experience."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-brandon text-zinc-700 mb-1">Keywords</label>
                <input
                  type="text"
                  value={settings.keywords}
                  onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 transition-all"
                  placeholder="e.g. coffee, brunch, restaurant"
                />
                <p className="text-xs text-zinc-400 mt-1">Comma separated list of keywords.</p>
              </div>
            </div>
          </div>

          {/* Open Graph */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-brandon text-zinc-800 border-b pb-2">Social Sharing (Open Graph)</h2>
            <div>
              <label className="block text-sm font-semibold font-brandon text-zinc-700 mb-1">OG Image URL</label>
              
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setOgImageMode('url')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${ogImageMode === 'url' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Paste URL</button>
                <button onClick={() => setOgImageMode('upload')} className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${ogImageMode === 'upload' ? 'bg-[#86603A] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Upload File</button>
              </div>

              {ogImageMode === 'url' ? (
                <input
                  type="text"
                  value={settings.ogImage}
                  onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 transition-all"
                  placeholder="https://example.com/cover.png"
                />
              ) : (
                <div>
                  <input ref={ogFileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setUploadingOg, (url) => setSettings({ ...settings, ogImage: url }))} className="hidden" />
                  <button onClick={() => ogFileInputRef.current?.click()} disabled={uploadingOg} className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-[#86603A] hover:bg-[#86603A]/5 transition-colors disabled:opacity-50 font-brandon text-zinc-600 font-semibold">
                    {uploadingOg ? 'Uploading...' : 'Click to upload (Max 1MB)'}
                  </button>
                </div>
              )}
              
              <p className="text-xs text-zinc-400 mt-2 font-brandon">📐 Suggested Size: <strong>1200×630px (1.91:1)</strong> - The image displayed when the site is shared on social media (Facebook, Twitter, etc).</p>
            </div>
            {settings.ogImage && (
              <div className="mt-4 border border-zinc-200 rounded-xl p-2 w-full max-w-sm">
                <img src={settings.ogImage} alt="OG Preview" className="w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          {/* JSON-LD Schema */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-brandon text-zinc-800 border-b pb-2">Advanced Schema Markup (JSON-LD)</h2>
            <p className="text-sm text-zinc-500 font-brandon">
              Provide raw JSON-LD markup to help search engines understand the content of your site (e.g., LocalBusiness, Restaurant schema).
            </p>
            <div>
              <textarea
                value={settings.jsonLd}
                onChange={(e) => setSettings({ ...settings, jsonLd: e.target.value })}
                rows={12}
                className="w-full p-4 bg-[#1E1E1E] text-[#D4D4D4] font-mono text-sm border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 transition-all resize-y"
                placeholder='{ "@context": "https://schema.org", "@type": "Restaurant", ... }'
                spellCheck="false"
              />
            </div>
          </div>

        </div>

        <div className="p-8 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <p className={`text-sm font-semibold ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-black hover:bg-[#86603A] text-white px-8 py-3 rounded-full font-brandon font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
