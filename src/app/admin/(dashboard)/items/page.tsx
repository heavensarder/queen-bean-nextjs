'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Item {
  id: string;
  category_id: string;
  category_name: string;
  name: string;
  description: string | null;
  price: string;
  calories: string | null;
  sodium: string | null;
  image: string;
  tags: string[] | null;
  is_available: boolean;
  extra_ingredients: { name: string; price: string }[] | null;
  order_index: number;
}

interface Category {
  id: string;
  name: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [formSodium, setFormSodium] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formExtraIngredients, setFormExtraIngredients] = useState<{name: string, price: string}[]>([]);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    const url = filterCategory
      ? `/api/admin/items?category_id=${filterCategory}`
      : '/api/admin/items';
    const res = await fetch(url);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, [filterCategory]);

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormCategoryId(categories[0]?.id || '');
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormCalories('');
    setFormSodium('');
    setFormImage('');
    setFormTags('');
    setFormIsAvailable(true);
    setFormExtraIngredients([]);
    setImageMode('url');
    setShowModal(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setFormCategoryId(item.category_id);
    setFormName(item.name);
    setFormDescription(item.description || '');
    setFormPrice(item.price);
    setFormCalories(item.calories || '');
    setFormSodium(item.sodium || '');
    setFormImage(item.image);
    setFormTags(item.tags ? item.tags.join(', ') : '');
    setFormIsAvailable(item.is_available ?? true);
    setFormExtraIngredients(item.extra_ingredients || []);
    setImageMode('url');
    setShowModal(true);
  };

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
        setFormImage(data.url);
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

    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: editingItem?.id,
      category_id: formCategoryId,
      name: formName,
      description: formDescription || null,
      price: formPrice,
      calories: formCalories || null,
      sodium: formSodium || null,
      image: formImage,
      tags: tags.length > 0 ? tags : null,
      is_available: formIsAvailable,
      extra_ingredients: formExtraIngredients.length > 0 ? formExtraIngredients : null,
    };

    const method = editingItem ? 'PUT' : 'POST';
    await fetch('/api/admin/items', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    setShowModal(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await fetch(`/api/admin/items?id=${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-zinc-300 border-t-[#86603A]" />
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">
            Menu Items
          </h1>
          <p className="font-signature text-2xl text-[#86603A] mt-1">
            Manage your menu items
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-3 bg-white border border-zinc-200 rounded-xl font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 w-full lg:w-auto min-w-[200px]"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white border border-zinc-200 rounded-xl font-brandon text-sm focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 w-full lg:w-auto min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-black text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#86603A] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-44 bg-zinc-100 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={item.image.startsWith('http')}
              />
              <div className="absolute top-3 right-3 flex gap-1.5">
                {!item.is_available && (
                  <span className="px-2 py-1 bg-red-600/90 text-white text-[10px] font-brandon font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                    Unavailable
                  </span>
                )}
                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-black/70 text-white text-[10px] font-brandon font-bold uppercase tracking-widest rounded-md backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="font-brandon text-[10px] uppercase tracking-widest text-[#86603A] font-bold mb-1">
                {item.category_name}
              </p>
              <p className="font-brandon font-bold text-zinc-900 text-lg leading-tight">
                {item.name}
              </p>
              {item.description && (
                <p className="font-brandon text-xs text-zinc-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="font-brandon font-bold text-zinc-900">
                  ${item.price}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-zinc-400 hover:text-[#86603A] hover:bg-[#86603A]/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-6 py-16 text-center">
          <p className="font-brandon text-zinc-400">
            No items found. Click &quot;Add Item&quot; to create one.
          </p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-zinc-200">
                <h2 className="font-anton text-2xl uppercase tracking-wider text-zinc-900">
                  {editingItem ? 'Edit Item' : 'New Item'}
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Is Available Toggle */}
                <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="is-available"
                    checked={formIsAvailable}
                    onChange={(e) => setFormIsAvailable(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-300 text-[#86603A] focus:ring-[#86603A]"
                  />
                  <label htmlFor="is-available" className="font-brandon text-sm uppercase tracking-widest text-zinc-900 font-bold select-none cursor-pointer">
                    Item is Available
                  </label>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Category *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                    placeholder="e.g. Matcha Latte"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all resize-none"
                    placeholder="Ingredients or extra details..."
                  />
                </div>

                {/* Price, Calories, Sodium row */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                      Price ($) *
                    </label>
                    <input
                      type="text"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                      placeholder="$5.25"
                    />
                  </div>
                  <div>
                    <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                      Calories
                    </label>
                    <input
                      type="text"
                      value={formCalories}
                      onChange={(e) => setFormCalories(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                      placeholder="120 cal"
                    />
                  </div>
                  <div>
                    <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                      Sodium
                    </label>
                    <input
                      type="text"
                      value={formSodium}
                      onChange={(e) => setFormSodium(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                      placeholder="90mg"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Tags <span className="text-zinc-400 normal-case tracking-normal">(comma separated: GF, DF, VN)</span>
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                    placeholder="GF, DF"
                  />
                </div>

                {/* Extra Ingredients */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-brandon text-xs uppercase tracking-widest text-zinc-500 font-bold">
                      Extra Ingredients
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormExtraIngredients([...formExtraIngredients, { name: '', price: '' }])}
                      className="text-xs font-brandon font-bold text-[#86603A] hover:underline"
                    >
                      + Add Ingredient
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formExtraIngredients.map((ingredient, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={ingredient.name}
                          onChange={(e) => {
                            const newIngredients = [...formExtraIngredients];
                            newIngredients[idx].name = e.target.value;
                            setFormExtraIngredients(newIngredients);
                          }}
                          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                          placeholder="Name (e.g. Extra Cheese)"
                        />
                        <input
                          type="text"
                          value={ingredient.price}
                          onChange={(e) => {
                            const newIngredients = [...formExtraIngredients];
                            newIngredients[idx].price = e.target.value;
                            setFormExtraIngredients(newIngredients);
                          }}
                          className="w-24 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                          placeholder="Price ($)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newIngredients = formExtraIngredients.filter((_, i) => i !== idx);
                            setFormExtraIngredients(newIngredients);
                          }}
                          className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                    Image *
                  </label>

                  {/* Toggle between upload and URL */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${
                        imageMode === 'url'
                          ? 'bg-[#86603A] text-white'
                          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}
                    >
                      Paste URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-4 py-2 rounded-lg font-brandon text-xs uppercase tracking-widest font-bold transition-colors ${
                        imageMode === 'upload'
                          ? 'bg-[#86603A] text-white'
                          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>

                  {imageMode === 'url' ? (
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
                      placeholder="https://images.unsplash.com/..."
                    />
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-[#86603A] hover:bg-[#86603A]/5 transition-colors disabled:opacity-50"
                      >
                        {uploading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-[#86603A]" />
                            <span className="font-brandon text-sm text-zinc-500">Uploading...</span>
                          </div>
                        ) : (
                          <div>
                            <svg className="mx-auto mb-2 text-zinc-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            <p className="font-brandon text-sm text-zinc-500">
                              Click to upload <span className="text-zinc-400">(JPG, PNG, WebP, AVIF · Max 5MB)</span>
                            </p>
                          </div>
                        )}
                      </button>
                    </div>
                  )}

                  <p className="font-brandon text-[11px] text-zinc-400 mt-2">
                    📐 Preferred image size: <strong>800×600px</strong> (4:3 ratio) for best results.
                  </p>

                  {/* Image preview */}
                  {formImage && (
                    <div className="mt-3 relative h-40 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                      <Image
                        src={formImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized={formImage.startsWith('http')}
                      />
                    </div>
                  )}
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
                  disabled={!formName.trim() || !formPrice.trim() || !formImage.trim() || saving}
                  className="px-6 py-3 bg-black text-white rounded-xl font-brandon uppercase tracking-widest text-xs font-bold hover:bg-[#86603A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
