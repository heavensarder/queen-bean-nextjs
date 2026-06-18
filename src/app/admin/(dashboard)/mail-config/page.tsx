'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MailConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [locked, setLocked] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [hasExistingConfig, setHasExistingConfig] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form fields
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [forceSenderName, setForceSenderName] = useState('');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/mail-config');
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            const c = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
            setSenderEmail(c.senderEmail || '');
            setReceiverEmail(c.receiverEmail || '');
            setForceSenderName(c.forceSenderName || '');
            setSmtpHost(c.smtpHost || 'smtp.gmail.com');
            setSmtpPort(String(c.smtpPort || 587));
            setSmtpUsername(c.smtpUsername || '');
            setSmtpPassword(c.smtpPassword || '');
            setHasExistingConfig(true);
          }
        }
      } catch (error) {
        console.error('Failed to load mail config', error);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!senderEmail || !receiverEmail || !smtpUsername || !smtpPassword) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/mail-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            senderEmail,
            receiverEmail,
            forceSenderName,
            smtpHost: smtpHost || 'smtp.gmail.com',
            smtpPort: parseInt(smtpPort) || 587,
            smtpUsername,
            smtpPassword,
          },
        }),
      });

      if (res.ok) {
        showToast('success', 'Mail configuration saved successfully!');
        setHasExistingConfig(true);
        setLocked(true); // Auto-lock after save
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to save configuration.');
      }
    } catch {
      showToast('error', 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/admin/mail-config/test', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        showToast('success', `Test email sent to ${receiverEmail}! Check your inbox.`);
      } else {
        showToast('error', data.error || 'Test email failed.');
      }
    } catch {
      showToast('error', 'Could not connect to the server.');
    } finally {
      setTesting(false);
    }
  };

  const handleUnlock = () => {
    setLocked(false);
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
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50"
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-2xl font-brandon text-sm font-bold flex items-center gap-3 border ${
                toast.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <span className="text-xl">{toast.type === 'success' ? '✅' : '❌'}</span>
              {toast.message}
              <button
                onClick={() => setToast(null)}
                className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">
            Mail Configuration
          </h1>
          <p className="font-signature text-2xl text-[#86603A] mt-1">
            Gmail SMTP setup for contact form
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Lock Status Badge */}
          <motion.div
            layout
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-brandon text-xs font-bold uppercase tracking-widest border transition-colors ${
              locked
                ? 'bg-zinc-100 text-zinc-500 border-zinc-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: locked ? 0 : 12 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {locked ? (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </>
              ) : (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </>
              )}
            </motion.svg>
            {locked ? 'Locked' : 'Unlocked'}
          </motion.div>

          {locked ? (
            <button
              onClick={handleUnlock}
              className="px-6 py-3 bg-[#86603A] text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#6d4f2e] transition-colors flex items-center gap-2 shadow-lg shadow-[#86603A]/20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
              Unlock to Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-black text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#86603A] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save & Lock
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Config Card */}
      <div className="relative">
        {/* Locked Overlay */}
        <AnimatePresence>
          {locked && hasExistingConfig && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-2xl flex flex-col items-center justify-center cursor-pointer group"
              onClick={handleUnlock}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-[#86603A]/10 group-hover:border-[#86603A]/30 transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-[#86603A] transition-colors">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-brandon font-bold text-sm text-zinc-600 uppercase tracking-widest">Configuration Locked</p>
                  <p className="font-brandon text-xs text-zinc-400 mt-1">Click to unlock and edit credentials</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-10">
            {/* Email Settings */}
            <div>
              <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Sender Email <span className="text-red-400">*</span>
                  </label>
                  <p className="font-brandon text-[11px] text-zinc-400 mb-2">The Gmail address that sends emails</p>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    disabled={locked}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    placeholder="bakery@gmail.com"
                  />
                </div>
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Receiver Email <span className="text-red-400">*</span>
                  </label>
                  <p className="font-brandon text-[11px] text-zinc-400 mb-2">Where contact form submissions go</p>
                  <input
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    disabled={locked}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    placeholder="owner@queenbean.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                  Force Sender Name
                </label>
                <p className="font-brandon text-[11px] text-zinc-400 mb-2">Display name in the &quot;From&quot; field (e.g. &quot;Queen Bean Bakery&quot;)</p>
                <input
                  type="text"
                  value={forceSenderName}
                  onChange={(e) => setForceSenderName(e.target.value)}
                  disabled={locked}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  placeholder="Queen Bean Bakery"
                />
              </div>
            </div>

            {/* SMTP Credentials */}
            <div>
              <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                SMTP Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    disabled={locked}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    disabled={locked}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Gmail Username <span className="text-red-400">*</span>
                  </label>
                  <p className="font-brandon text-[11px] text-zinc-400 mb-2">Usually the same as sender email</p>
                  <input
                    type="email"
                    value={smtpUsername}
                    onChange={(e) => setSmtpUsername(e.target.value)}
                    disabled={locked}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    placeholder="bakery@gmail.com"
                  />
                </div>
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Gmail App Password <span className="text-red-400">*</span>
                  </label>
                  <p className="font-brandon text-[11px] text-zinc-400 mb-2">16-character App Password from Google</p>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      disabled={locked}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 pr-12 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity font-mono tracking-wider"
                      placeholder="xxxx xxxx xxxx xxxx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Email */}
            {hasExistingConfig && (
              <div>
                <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                  Test Configuration
                </h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex-1">
                    <p className="font-brandon text-sm text-zinc-700">
                      Send a test email to <strong className="text-zinc-900">{receiverEmail || 'your receiver email'}</strong> to verify your SMTP configuration works.
                    </p>
                    <p className="font-brandon text-xs text-zinc-400 mt-1">
                      Make sure you&apos;ve saved your configuration before testing.
                    </p>
                  </div>
                  <button
                    onClick={handleTest}
                    disabled={testing || !hasExistingConfig}
                    className="px-6 py-3 bg-[#86603A] text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#6d4f2e] transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-[#86603A]/20"
                  >
                    {testing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Test Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="font-anton text-xl tracking-wider uppercase text-zinc-900">
                Gmail SMTP Setup Guide
              </h3>
              <p className="font-brandon text-sm text-zinc-500 mt-0.5">
                Step-by-step instructions to generate a Gmail App Password
              </p>
            </div>
          </div>
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: showGuide ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-zinc-400 shrink-0"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-8 pb-8 space-y-6">
                <div className="border-t border-zinc-100 pt-6" />

                {/* Important Notice */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0 mt-0.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div>
                    <p className="font-brandon font-bold text-sm text-amber-800">Important</p>
                    <p className="font-brandon text-sm text-amber-700 mt-1">
                      Gmail requires an <strong>App Password</strong> to send emails via SMTP. You cannot use your regular Gmail password. 2-Step Verification must be enabled first.
                    </p>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-5">
                  {[
                    {
                      step: 1,
                      title: 'Enable 2-Step Verification',
                      desc: 'Go to your Google Account → Security → 2-Step Verification and turn it on. This is required before you can create an App Password.',
                      link: 'https://myaccount.google.com/security',
                      linkText: 'Open Google Security Settings →',
                    },
                    {
                      step: 2,
                      title: 'Generate an App Password',
                      desc: 'Go to Google Account → Security → App Passwords (or search "App Passwords" in your Google Account settings). Select "Mail" as the app and "Other" as the device, then name it "Queen Bean Website".',
                      link: 'https://myaccount.google.com/apppasswords',
                      linkText: 'Open App Passwords →',
                    },
                    {
                      step: 3,
                      title: 'Copy the 16-Character Password',
                      desc: 'Google will show you a 16-character password (e.g. "abcd efgh ijkl mnop"). Copy this password — you\'ll only see it once! Paste it into the "Gmail App Password" field above.',
                    },
                    {
                      step: 4,
                      title: 'Fill in the Configuration',
                      desc: 'Enter your Gmail address as both the Sender Email and Gmail Username. Set your desired Receiver Email (where contact form messages should arrive). SMTP Host should be "smtp.gmail.com" and Port should be "587".',
                    },
                    {
                      step: 5,
                      title: 'Save & Test',
                      desc: 'Click "Save & Lock" to save your configuration, then use the "Send Test Email" button to verify everything works. Check the receiver\'s inbox (and spam folder) for the test email.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 group">
                      <div className="w-8 h-8 rounded-lg bg-[#86603A]/10 text-[#86603A] flex items-center justify-center font-anton text-sm shrink-0 group-hover:bg-[#86603A] group-hover:text-white transition-colors">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-brandon font-bold text-sm text-zinc-900 uppercase tracking-widest mb-1">
                          {item.title}
                        </h4>
                        <p className="font-brandon text-sm text-zinc-600 leading-relaxed">
                          {item.desc}
                        </p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 font-brandon text-xs font-bold text-[#86603A] hover:text-[#6d4f2e] transition-colors uppercase tracking-widest"
                          >
                            {item.linkText}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Reference */}
                <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200">
                  <h4 className="font-brandon font-bold text-xs uppercase tracking-widest text-zinc-500 mb-3">
                    Quick Reference — Default Gmail SMTP Settings
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Host', value: 'smtp.gmail.com' },
                      { label: 'Port (TLS)', value: '587' },
                      { label: 'Port (SSL)', value: '465' },
                      { label: 'Auth', value: 'App Password' },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="font-brandon text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{item.label}</p>
                        <p className="font-brandon text-sm text-zinc-900 font-bold mt-0.5 font-mono">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
