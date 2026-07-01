import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { logAudit } from '../../lib/audit';
import AuditInfo from './AuditInfo';
import type { TourRow } from '../../lib/supabase-tours';
import TourEditor from './TourEditor';
import { Button } from '../ui/button';
import { Plus, Pencil, Trash2, MapPin, Image as ImageIcon } from 'lucide-react';

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
        if (!error) {
            await logAudit({
                action: 'delete',
                table_name: 'tours',
                record_id: id,
            });
            fetchTours();
        }
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
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{tours.length} tours</p>
                <Button
                    variant="default"
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-xl text-sm font-semibold gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Tour
                </Button>
            </div>

            {/* Tours Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-border/40 p-5 animate-pulse shadow-sm">
                            <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-xl mb-4" />
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : tours.length === 0 ? (
                <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-border/40 p-12 text-center shadow-sm">
                    <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" strokeWidth={1} />
                    <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">No tours yet</p>
                    <p className="text-gray-400 dark:text-gray-600 text-sm mb-4">Add your first tour to get started</p>
                    <Button
                        variant="default"
                        onClick={handleAdd}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                    >
                        Create First Tour
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <div
                            key={tour.id}
                            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-border/40 overflow-hidden group hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col"
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
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-dark-soft">
                                        <ImageIcon className="w-10 h-10" strokeWidth={1} />
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
                                    <MapPin className="w-3.5 h-3.5" />
                                    {tour.location} &bull; {tour.duration}
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-auto pt-4 border-t border-border/40 flex gap-2 w-full">
                                    <AuditInfo recordId={tour.id} />
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleEdit(tour)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-sm h-auto"
                                        title="Edit Tour"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleDelete(tour.id)}
                                        className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 h-auto"
                                        title="Delete Tour"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
