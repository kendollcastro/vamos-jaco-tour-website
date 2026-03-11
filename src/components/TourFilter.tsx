import React, { useState, useEffect, useMemo } from 'react';
import TourCard from './TourCard';
import { type Tour, type TourCategory } from '../data/tours';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { clsx } from 'clsx';
import { Filter } from 'lucide-react';

interface TourFilterProps {
    initialTours: Tour[];
    defaultLimit?: number;
    hideLoadMore?: boolean;
    hideFilter?: boolean;
    featuredSlugs?: string[];
    gridCols?: string;
}

export default function TourFilter({ initialTours, defaultLimit = 8, hideLoadMore = false, hideFilter = false, featuredSlugs, gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" }: TourFilterProps) {
    const $language = useStore(language);
    const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>('all');
    const [mounted, setMounted] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(defaultLimit); // Limit initial display
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setMounted(true);
        // Parse URL params
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) {
            setSearchQuery(q);
        }
    }, []);

    const categories: { id: TourCategory | 'all'; label: { en: string; es: string } }[] = [
        { id: 'all', label: { en: 'All Tours', es: 'Todos los Tours' } },
        { id: 'atv', label: { en: 'ATV & Buggy', es: 'ATV y Buggy' } },
        { id: 'water', label: { en: 'Water Sports', es: 'Deportes Acuáticos' } },
        { id: 'extreme', label: { en: 'Extreme', es: 'Extremo' } },
        // { id: 'nature', label: { en: 'Nature', es: 'Naturaleza' } },
    ];

    const filteredTours = useMemo(() => {
        let sortedTours = [...initialTours].sort((a, b) => {
            // Priority: Featured -> Rank -> Active. Since we show 'all', maybe sort by badge (Top Rated first)
            // or by order if available. Let's rely on initial order but limit.
            return 0; // Keeping original order from DB
        });

        if (activeCategory !== 'all') {
            sortedTours = sortedTours.filter(tour => tour.category === activeCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            sortedTours = sortedTours.filter(tour => {
                const titleMatch = tour.title?.en?.toLowerCase().includes(query) || tour.title?.es?.toLowerCase().includes(query);
                const locMatch = tour.location?.toLowerCase().includes(query);
                return titleMatch || locMatch;
            });
        }

        if (featuredSlugs && featuredSlugs.length > 0) {
            sortedTours = sortedTours.filter(tour => featuredSlugs.includes(tour.id) || featuredSlugs.includes(tour.slug || ''));
        }

        return sortedTours;
    }, [initialTours, activeCategory, featuredSlugs]);

    if (!mounted) {
        return <div className="min-h-[400px]"></div>; // Prevent hydration mismatch
    }

    const displayedTours = filteredTours.slice(0, displayLimit);
    const hasMore = displayLimit < filteredTours.length;

    const handleCategoryChange = (id: TourCategory | 'all') => {
        setActiveCategory(id);
        setDisplayLimit(8); // Reset limit when changing category
    };

    return (
        <div>
            {/* Filter Controls */}
            {!hideFilter && (
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2 mr-4 text-gray-400 font-medium">
                            <Filter className="w-5 h-5" />
                            <span>{$language === 'en' ? 'Filter by:' : 'Filtrar por:'}</span>
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={clsx(
                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border",
                                    activeCategory === cat.id
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                                        : "bg-dark-soft text-gray-300 border-white/10 hover:border-primary/30 hover:text-primary hover:bg-white/5"
                                )}
                            >
                                {$language === 'en' ? cat.label.en : cat.label.es}
                            </button>
                        ))}
                    </div>

                    {searchQuery && (
                        <div className="flex items-center gap-3 bg-brand-orange/10 border border-brand-orange/20 px-6 py-2 rounded-full">
                            <span className="text-brand-orange font-bold text-sm">
                                {$language === 'en' ? `Showing results for "${searchQuery}"` : `Mostrando resultados para "${searchQuery}"`}
                            </span>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    const url = new URL(window.location.href);
                                    url.searchParams.delete('q');
                                    window.history.pushState({}, '', url.toString());
                                }}
                                className="text-gray-400 hover:text-white text-xs bg-dark px-3 py-1 rounded-full ml-2"
                            >
                                {$language === 'en' ? 'Clear Search' : 'Limpiar Búsqueda'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Grid */}
            <div className={`grid ${gridCols} gap-8`}>
                {displayedTours.map((tour) => (
                    <div key={tour.id} className="h-full animate-fade-in-up">
                        <TourCard
                            id={tour.id}
                            title={tour.title}
                            price={tour.price}
                            image_url={tour.image_url}
                            location={tour.location}
                            duration={tour.duration}
                            badge={tour.badge}
                        />
                    </div>
                ))}
            </div>

            {filteredTours.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p>{$language === 'en' ? 'No tours found in this category.' : 'No se encontraron tours en esta categoría.'}</p>
                </div>
            )}

            {/* Show More Button */}
            {hasMore && !hideLoadMore && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setDisplayLimit(prev => prev + 8)}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
                    >
                        {$language === 'en' ? 'Load More Tours' : 'Cargar Más Tours'}
                    </button>
                </div>
            )}
        </div>
    );
}
