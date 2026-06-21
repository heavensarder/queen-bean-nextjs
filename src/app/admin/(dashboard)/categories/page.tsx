'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  subtitle: string | null;
  notes: string[] | null;
  add_ons: { name: string; price: string }[] | null;
  order_index: number;
  item_count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formAddOns, setFormAddOns] = useState('');

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  // Save draft
  useEffect(() => {
    if (!editingCategory && showModal) {
      const draft = { formName, formSubtitle, formNotes, formAddOns };
      localStorage.setItem('queenbean_cat_draft', JSON.stringify(draft));
    }
  }, [formName, formSubtitle, formNotes, formAddOns, editingCategory, showModal]);

  const openCreateModal = () => {
    setEditingCategory(null);
    const draftStr = localStorage.getItem('queenbean_cat_draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        setFormName(draft.formName || '');
        setFormSubtitle(draft.formSubtitle || '');
        setFormNotes(draft.formNotes || '');
        setFormAddOns(draft.formAddOns || '');
        setShowModal(true);
        return;
      } catch (e) {}
    }

    setFormName('');
    setFormSubtitle('');
    setFormNotes('');
    setFormAddOns('');
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSubtitle(cat.subtitle || '');
    setFormNotes(cat.notes ? cat.notes.join('\n') : '');
    setFormAddOns(
      cat.add_ons
        ? cat.add_ons.map((a) => `${a.name}: ${a.price}`).join('\n')
        : ''
    );
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);

    const notes = formNotes
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);
    const addOns = formAddOns
      .split('\n')
      .map((line) => {
        const parts = line.split(':').map((p) => p.trim());
        if (parts.length >= 2) return { name: parts[0], price: parts[1] };
        return null;
      })
      .filter(Boolean);

    const payload = {
      id: editingCategory?.id,
      name: formName,
      subtitle: formSubtitle || null,
      notes: notes.length > 0 ? notes : null,
      addOns: addOns.length > 0 ? addOns : null,
    };

    const method = editingCategory ? 'PUT' : 'POST';
    await fetch('/api/admin/categories', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!editingCategory) {
      localStorage.removeItem('queenbean_cat_draft');
    }

    setSaving(false);
    setShowModal(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete the category and ALL its items.'))
      return;

    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-zinc-300 border-t-[#86603A]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">
            Categories
          </h1>
          <p className="font-signature text-2xl text-[#86603A] mt-1">
            Manage your menu categories
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-black text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#86603A] transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Desktop table header - hidden on mobile */}
        <div className="hidden lg:grid grid-cols-[1fr_200px_120px_120px] gap-4 px-6 py-4 bg-zinc-50 border-b border-zinc-200">
          <span className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold">Name</span>
          <span className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold">Subtitle</span>
          <span className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold text-center">Items</span>
          <span className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold text-center">Actions</span>
        </div>

        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors"
          >
            {/* Desktop row */}
            <div className="hidden lg:grid grid-cols-[1fr_200px_120px_120px] gap-4 px-6 py-5 items-center">
              <div>
                <p className="font-brandon font-bold text-zinc-900">{cat.name}</p>
                {cat.notes && (
                  <p className="font-brandon text-xs text-zinc-400 mt-0.5">
                    {cat.notes.length} note(s)
                  </p>
                )}
              </div>
              <p className="font-brandon text-sm text-zinc-500 truncate">
                {cat.subtitle || '—'}
              </p>
              <p className="font-brandon text-sm text-zinc-700 font-bold text-center">
                {cat.item_count}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 text-zinc-400 hover:text-[#86603A] hover:bg-[#86603A]/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            </div>

            {/* Mobile card */}
            <div className="lg:hidden px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-brandon font-bold text-zinc-900 text-lg">{cat.name}</p>
                  {cat.subtitle && (
                    <p className="font-brandon text-sm text-zinc-500 mt-0.5 truncate">{cat.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-brandon text-xs text-zinc-500">
                      <span className="font-bold text-zinc-700">{cat.item_count}</span> items
                    </span>
                    {cat.notes && (
                      <span className="font-brandon text-xs text-zinc-400">
                        {cat.notes.length} note(s)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 text-zinc-400 hover:text-[#86603A] hover:bg-[#86603A]/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {categories.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="font-brandon text-zinc-400">No categories yet. Click "Add Category" to create one.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
            // onClick={() => setShowModal(false)} // Removed to prevent accidental closing
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
                <h2 className="font-anton text-2xl uppercase tracking-wider text-zinc-900">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                    placeholder="e.g. Crafted Hot Drinks"
                  />
                </div>

                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                    placeholder="e.g. Comes with salad & baguette"
                  />
                </div>

                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Notes <span className="text-zinc-400 normal-case tracking-normal">(one per line)</span>
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all resize-none"
                    placeholder="Pick whole or non-fat dairy milk.&#10;Add dairy free milk (+1)"
                  />
                </div>

                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Add-Ons <span className="text-zinc-400 normal-case tracking-normal">(Name: Price, one per line)</span>
                  </label>
                  <textarea
                    value={formAddOns}
                    onChange={(e) => setFormAddOns(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all resize-none"
                    placeholder="Smoke Salmon: +5&#10;Bacon: +2.50"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 font-brandon uppercase tracking-widest text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formName.trim() || saving}
                  className="px-6 py-3 bg-black text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#86603A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
