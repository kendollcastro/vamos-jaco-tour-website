import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { TourRow } from '../../lib/supabase-tours';
import TourEditor from './TourEditor';

const DEMO_TOURS: TourRow[] = [];

export default function TourList() {
    const [tours, setTours] = useState<TourRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTour, setEditingTour] = useState<TourRow | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const isDemo = !supabase;

    useEffect(() => {
        fetchTours();
    }, []);

    async function fetchTours() {
        setLoading(true);

        if (!supabase) {
            setTours(DEMO_TOURS);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) console.error('Error fetching tours:', error);
        setTours((data as TourRow[]) || []);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this tour?')) return;

        if (isDemo) {
            setTours(prev => prev.filter(t => t.id !== id));
            return;
        }

        if (!supabase) return;
        const { error } = await supabase.from('tours').delete().eq('id', id);
        if (!error) fetchTours();
    }

    function handleEdit(tour: TourRow) {
        setEditingTour(tour);
        setShowEditor(true);
    }

    function handleAdd() {
        setEditingTour(null);
        setShowEditor(true);
    }

    function handleEditorClose() {
        setShowEditor(false);
        setEditingTour(null);
        fetchTours();
    }

    if (showEditor) {
        return <TourEditor tour={editingTour} onClose={handleEditorClose} />;
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{tours.length} tours</p>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Tour
                </button>
            </div>

            {/* Tours Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 p-5 animate-pulse shadow-sm">
                            <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-xl mb-4" />
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : tours.length === 0 ? (
                <div className="bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 p-12 text-center shadow-sm">
                    <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">No tours yet</p>
                    <p className="text-gray-400 dark:text-gray-600 text-sm mb-4">Add your first tour to get started</p>
                    <button
                        onClick={handleAdd}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-primary/20"
                    >
                        Create First Tour
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <div
                            key={tour.id}
                            className="bg-white dark:bg-dark-soft rounded-[24px] border border-gray-200 dark:border-white/5 overflow-hidden group hover:border-gray-300 dark:hover:border-white/10 transition-all shadow-sm flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="h-48 bg-gray-100 dark:bg-dark relative overflow-hidden">
                                {tour.image_url ? (
                                    <img
                                        src={tour.image_url}
                                        alt={tour.name_en}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/1A1816/666?text=No+Image'; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-white/5">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Overlay Badges */}
                                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                                    <div className="flex justify-between items-start">
                                        {/* Badge (e.g. Popular/Bestseller) */}
                                        {tour.badge_text ? (
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md ${tour.badge_color === 'red' ? 'bg-red-500/90 text-white' :
                                                tour.badge_color === 'green' ? 'bg-green-500/90 text-white' :
                                                    'bg-yellow-500/90 text-black'
                                                }`}>
                                                {tour.badge_text}
                                            </span>
                                        ) : <div />}

                                        {/* Price Pill */}
                                        <span className="bg-primary/95 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-primary/20">
                                            Price: ${tour.price_base}
                                        </span>
                                    </div>

                                    <div className="flex justify-end">
                                        {/* Status Pill */}
                                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md ${tour.is_active ? 'bg-green-500/90 text-white' : 'bg-gray-900/90 text-gray-300'
                                            }`}>
                                            {tour.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-2 line-clamp-1">{tour.name_en}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 flex items-center gap-1.5 font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {tour.location} &bull; {tour.duration}
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2 w-full">
                                    <button
                                        onClick={() => handleEdit(tour)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-sm transition-colors"
                                        title="Edit Tour"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tour.id)}
                                        className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                        title="Delete Tour"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
