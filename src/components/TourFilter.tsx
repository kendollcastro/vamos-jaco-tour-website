import React, { useState, useEffect, useMemo } from 'react';
import TourCard from './TourCard';
import { type Tour, type TourCategory } from '../data/tours';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { clsx } from 'clsx';
import { Filter, Search, X, ChevronRight } from 'lucide-react';

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
        { id: 'water', label: { en: 'Water Sports', es: 'Aventura en el Mar' } },
        { id: 'canopy', label: { en: 'Canopy & Zip', es: 'Canopy y Tirolesa' } },
        { id: 'extreme', label: { en: 'Extreme', es: 'Extremo' } },
        { id: 'nature', label: { en: 'Nature & Eco', es: 'Naturaleza y Eco' } },
        { id: 'relax', label: { en: 'Relax', es: 'Relax' } },
        { id: 'combos', label: { en: 'Combos', es: 'Combos' } },
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
    }, [initialTours, activeCategory, searchQuery, featuredSlugs]);

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
        <div className="relative">
            {/* Search and Filters Container */}
            {!hideFilter && (
                <div className="space-y-12 mb-16">
                    {/* Search Bar - Redesigned for Desktop */}
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
                            <div className="relative flex items-center bg-dark-soft/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 pr-4 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 shadow-2xl">
                                <div className="pl-6 pr-4 border-r border-white/5 hidden md:block">
                                    <Search className="w-6 h-6 text-primary animate-pulse-slow" />
                                </div>
                                <div className="pl-5 pr-3 md:hidden">
                                     <Search className="w-5 h-5 text-primary" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={$language === 'en' ? "Search for tours, activities..." : "Busca tours, actividades..."}
                                    className="w-full bg-transparent py-4 px-4 text-white text-lg placeholder-gray-500 focus:outline-none"
                                />
                                <div className="flex items-center gap-2">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                            aria-label="Clear search"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hidden md:block hover:bg-red-700 transition-colors shadow-lg shadow-primary/20 active:scale-95">
                                        {$language === 'en' ? 'Search' : 'Buscar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Categories (Chips) */}
                    <div className="relative group">
                        <div className="flex items-center gap-4 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 md:justify-center">
                            <Filter className="w-4 h-4 text-primary" />
                            <span>{$language === 'en' ? 'Filter by Category' : 'Filtrar por Categoría'}</span>
                        </div>
                        
                        <div className="relative">
                            {/* Scroll indicators/gradients */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none md:hidden" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none md:hidden" />
                            
                            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar md:justify-center md:flex-wrap px-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={clsx(
                                            "whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border shrink-0",
                                            activeCategory === cat.id
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                                                : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {$language === 'en' ? cat.label.en : cat.label.es}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className={`grid ${gridCols} gap-6 md:gap-8`}>
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
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary/10 to-brand-orange/10 border border-primary/20 text-white font-bold hover:from-primary hover:to-brand-orange transition-all duration-300 shadow-lg hover:shadow-primary/20"
                    >
                        {$language === 'en' ? 'See More Adventures' : 'Ver Más Aventuras'}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
