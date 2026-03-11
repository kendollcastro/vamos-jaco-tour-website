import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { TourRow } from '../../lib/supabase-tours';
import ImagePicker from './ImagePicker';

interface Props {
    tour: TourRow | null; // null = creating new
    onClose: () => void;
}

type LangTab = 'en' | 'es';

const CATEGORIES = ['atv', 'water', 'nature', 'extreme', 'relax'];
const BADGE_COLORS = ['yellow', 'red', 'green'];

const EMPTY_TOUR: Partial<TourRow> = {
    slug: '',
    name_en: '',
    name_es: '',
    description_en: '',
    description_es: '',
    price_base: 0,
    original_price: null,
    image_url: '',
    location: 'Jacó, Costa Rica',
    duration: '',
    category: 'nature',
    badge_text: '',
    badge_color: 'yellow',
    highlights_en: [],
    highlights_es: [],
    includes_en: [],
    includes_es: [],
    pricing_options: [],
    gallery: [],
    is_active: true,
};

export default function TourEditor({ tour, onClose }: Props) {
    const isNew = !tour;
    const [form, setForm] = useState<Partial<TourRow>>(tour ? { ...tour } : { ...EMPTY_TOUR });
    const [langTab, setLangTab] = useState<LangTab>('en');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showGalleryPicker, setShowGalleryPicker] = useState(false);

    function updateField(field: string, value: any) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    /* ─── Array field helpers ─── */
    function addToArray(field: string) {
        const arr = (form as any)[field] || [];
        setForm((prev) => ({ ...prev, [field]: [...arr, ''] }));
    }

    function updateArrayItem(field: string, index: number, value: string) {
        const arr = [...((form as any)[field] || [])];
        arr[index] = value;
        setForm((prev) => ({ ...prev, [field]: arr }));
    }

    function removeArrayItem(field: string, index: number) {
        const arr = [...((form as any)[field] || [])];
        arr.splice(index, 1);
        setForm((prev) => ({ ...prev, [field]: arr }));
    }

    /* ─── Pricing options ─── */
    function addPricingOption() {
        const opts = [...(form.pricing_options || []), { duration: '', price: 0 }];
        setForm((prev) => ({ ...prev, pricing_options: opts }));
    }

    function updatePricingOption(index: number, field: 'duration' | 'price', value: string | number) {
        const opts = [...(form.pricing_options || [])];
        opts[index] = { ...opts[index], [field]: field === 'price' ? Number(value) : value };
        setForm((prev) => ({ ...prev, pricing_options: opts }));
    }

    function removePricingOption(index: number) {
        const opts = [...(form.pricing_options || [])];
        opts.splice(index, 1);
        setForm((prev) => ({ ...prev, pricing_options: opts }));
    }

    /* ─── Save ─── */
    async function handleSave() {
        if (!form.name_en || !form.slug) {
            setError('Name (EN) and Slug are required.');
            return;
        }

        setSaving(true);
        setError('');

        if (!supabase) {
            // Demo mode — just close
            onClose();
            return;
        }

        try {
            if (isNew) {
                const { error: dbError } = await supabase.from('tours').insert(form);
                if (dbError) throw dbError;
            } else {
                const { id, created_at, updated_at, ...updates } = form as TourRow;
                const { error: dbError } = await supabase.from('tours').update(updates).eq('id', id);
                if (dbError) throw dbError;
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save');
            setSaving(false);
        }
    }

    /* ─── Reusable components ─── */
    function ArrayEditor({ field, label }: { field: string; label: string }) {
        const items: string[] = (form as any)[field] || [];
        return (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">{label}</label>
                    <button
                        type="button"
                        onClick={() => addToArray(field)}
                        className="text-xs text-brand-teal hover:text-brand-teal/80 transition flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add
                    </button>
                </div>
                <div className="space-y-2">
                    {items.map((item, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => updateArrayItem(field, i, e.target.value)}
                                className="flex-1 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                                placeholder={`Item ${i + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem(field, i)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <p className="text-gray-600 text-xs py-2">No items yet</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isNew ? 'New Tour' : 'Edit Tour'}</h2>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-full transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                >
                    {saving && (
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    )}
                    {isNew ? 'Create Tour' : 'Save Changes'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Fields */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Language Tabs */}
                    <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300">
                        <div className="flex gap-2 mb-6">
                            {(['en', 'es'] as LangTab[]).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLangTab(lang)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${langTab === lang
                                        ? 'bg-primary/10 text-primary border border-primary/30'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {lang === 'en' ? '🇺🇸 English' : '🇨🇷 Español'}
                                </button>
                            ))}
                        </div>

                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Tour Name ({langTab.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                value={(form as any)[`name_${langTab}`] || ''}
                                onChange={(e) => updateField(`name_${langTab}`, e.target.value)}
                                className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                                placeholder={langTab === 'en' ? 'ATV Mountain Adventure' : 'Aventura en Cuadra'}
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Description ({langTab.toUpperCase()})
                            </label>
                            <textarea
                                value={(form as any)[`description_${langTab}`] || ''}
                                onChange={(e) => updateField(`description_${langTab}`, e.target.value)}
                                rows={4}
                                className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none resize-none transition-colors"
                                placeholder="Describe the tour experience..."
                            />
                        </div>

                        {/* Highlights */}
                        <ArrayEditor
                            field={`highlights_${langTab}`}
                            label={`Highlights (${langTab.toUpperCase()})`}
                        />

                        {/* Includes */}
                        <div className="mt-4">
                            <ArrayEditor
                                field={`includes_${langTab}`}
                                label={`Includes (${langTab.toUpperCase()})`}
                            />
                        </div>
                    </div>

                    {/* Pricing Options */}
                    <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-gray-900 dark:text-white font-bold text-sm">Pricing Options</h3>
                            <button
                                type="button"
                                onClick={addPricingOption}
                                className="text-xs text-brand-teal hover:text-brand-teal/80 transition flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Option
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(form.pricing_options || []).map((opt, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={opt.duration}
                                        onChange={(e) => updatePricingOption(i, 'duration', e.target.value)}
                                        className="flex-1 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                                        placeholder="1 Hour"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">$</span>
                                        <input
                                            type="number"
                                            value={opt.price}
                                            onChange={(e) => updatePricingOption(i, 'price', e.target.value)}
                                            className="w-24 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removePricingOption(i)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {(form.pricing_options || []).length === 0 && (
                                <p className="text-gray-600 text-xs py-2">No pricing options — click "Add Option" above</p>
                            )}
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Gallery Images
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowGalleryPicker(true)}
                                className="text-xs text-brand-teal hover:text-brand-teal/80 transition flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add from Gallery
                            </button>
                        </div>

                        {(form.gallery || []).length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {(form.gallery || []).map((url, i) => (
                                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                                        <img
                                            src={url}
                                            alt={`Gallery ${i + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100/1A1816/666?text=Error'; }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('gallery', i)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark rounded-xl py-8 text-center transition-colors">
                                <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-xs">No gallery images</p>
                                <button
                                    type="button"
                                    onClick={() => setShowGalleryPicker(true)}
                                    className="mt-2 text-xs text-brand-teal hover:underline"
                                >
                                    Select from Gallery
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 space-y-5 shadow-sm transition-colors duration-300">
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm">Details</h3>

                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={form.slug || ''}
                                onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                                placeholder="atv-mountain-adventure"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Base Price ($)</label>
                                <input
                                    type="number"
                                    value={form.price_base || 0}
                                    onChange={(e) => updateField('price_base', Number(e.target.value))}
                                    className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Original Price</label>
                                <input
                                    type="number"
                                    value={form.original_price || ''}
                                    onChange={(e) => updateField('original_price', e.target.value ? Number(e.target.value) : null)}
                                    className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                value={form.location || ''}
                                onChange={(e) => updateField('location', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                                placeholder="Jacó, Costa Rica"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</label>
                            <input
                                type="text"
                                value={form.duration || ''}
                                onChange={(e) => updateField('duration', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                                placeholder="1 - 5 Hours"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Category</label>
                            <select
                                value={form.category || 'nature'}
                                onChange={(e) => updateField('category', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active ?? true}
                                    onChange={(e) => updateField('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-dark"
                                />
                                <span className="text-sm text-gray-300">Active</span>
                            </label>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 space-y-4 shadow-sm transition-colors duration-300">
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm">Badge</h3>
                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Badge Text</label>
                            <input
                                type="text"
                                value={form.badge_text || ''}
                                onChange={(e) => updateField('badge_text', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                                placeholder="Best Seller"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color</label>
                            <div className="flex gap-2">
                                {BADGE_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => updateField('badge_color', c)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${form.badge_color === c
                                            ? c === 'red' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40'
                                                : c === 'green' ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/40'
                                                    : 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/40'
                                            : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 space-y-4 shadow-sm transition-colors duration-300">
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm">Featured Image</h3>

                        {form.image_url ? (
                            <div className="relative group">
                                <img
                                    src={form.image_url}
                                    alt="Preview"
                                    className="w-full h-32 rounded-xl object-cover border border-white/10"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/1A1816/666?text=Invalid+URL'; }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowImagePicker(true)}
                                        className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition"
                                    >
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateField('image_url', '')}
                                        className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowImagePicker(true)}
                                className="w-full border-2 border-dashed border-white/10 rounded-xl py-8 text-center hover:border-primary/30 transition group"
                            >
                                <svg className="w-8 h-8 text-gray-600 mx-auto mb-2 group-hover:text-primary/50 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-xs">Click to select from gallery</p>
                            </button>
                        )}

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={form.image_url || ''}
                                onChange={(e) => updateField('image_url', e.target.value)}
                                className="flex-1 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary outline-none transition-colors"
                                placeholder="or paste URL manually..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowImagePicker(true)}
                                className="px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition shrink-0"
                            >
                                Browse
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Picker Modals */}
            <ImagePicker
                isOpen={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onSelect={(path) => updateField('image_url', path)}
            />

            <ImagePicker
                isOpen={showGalleryPicker}
                onClose={() => setShowGalleryPicker(false)}
                onSelect={() => { }}
                multiple={true}
                onSelectMultiple={(paths) => {
                    const existing = form.gallery || [];
                    const newPaths = paths.filter(p => !existing.includes(p));
                    updateField('gallery', [...existing, ...newPaths]);
                }}
            />
        </div>
    );
}
