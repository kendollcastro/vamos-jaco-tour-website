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
    title?: { en: string; es: string };
    subtitle?: { en: string; es: string };
}

export default function TourFilter({ 
    initialTours, 
    defaultLimit = 8, 
    hideLoadMore = false, 
    hideFilter = false, 
    featuredSlugs, 
    gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    title,
    subtitle
}: TourFilterProps) {
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
                    {/* Header with Dynamic Count */}
                    {(title || subtitle) && (
                        <div className="flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-6 mb-12">
                            <div>
                                {subtitle && (
                                    <span className="text-brand-orange font-bold tracking-widest uppercase mb-2 block animate-fade-in">
                                        {$language === 'en' ? subtitle.en : subtitle.es}
                                    </span>
                                )}
                                {title && (
                                    <h2 className="text-4xl md:text-6xl font-heading font-black text-white leading-[1.1] tracking-tight">
                                        {$language === 'en' ? title.en : title.es}
                                    </h2>
                                )}
                            </div>
                            <div className="mt-4 md:mt-0 md:text-right animate-fade-in" key={filteredTours.length}>
                                <p className="text-gray-400 font-medium whitespace-nowrap bg-white/5 md:bg-transparent px-4 py-2 rounded-full inline-flex items-center">
                                    <span className="text-primary font-black text-xl mr-2">{filteredTours.length}</span> 
                                    <span className="text-sm uppercase tracking-wider">
                                        {$language === 'en' ? 'Experiences Available' : 'Experiencias Disponibles'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Search Bar - Redesigned for Desktop */}
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-brand-orange blur-2xl rounded-full opacity-0 group-focus-within:opacity-20 transition-premium -z-10" />
                            <div className="relative flex items-center glass border border-white/10 rounded-full p-2 pr-4 focus-within:border-primary/50 transition-premium shadow-2xl">
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
                                    <button className="bg-primary text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hidden md:block hover:bg-primary-dark transition-premium shadow-lg shadow-primary/20 active:scale-95">
                                        {$language === 'en' ? 'Search' : 'Buscar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Categories (Chips) */}
                    <div className="relative group">
                        <div className="flex items-center gap-4 text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-6 md:justify-center">
                            <div className="h-px w-8 bg-white/10 hidden md:block"></div>
                            <Filter className="w-3.5 h-3.5 text-primary" />
                            <span>{$language === 'en' ? 'Filter by Category' : 'Filtrar por Categoría'}</span>
                            <div className="h-px w-8 bg-white/10 hidden md:block"></div>
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
                                            "whitespace-nowrap px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-premium border shrink-0",
                                            activeCategory === cat.id
                                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-110 active:scale-105"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 active:scale-95"
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
                            slug={tour.slug}
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
                <div className="mt-16 text-center">
                    <button
                        onClick={() => setDisplayLimit(prev => prev + 8)}
                        className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 hover:border-primary/50 transition-premium shadow-xl active:scale-95"
                    >
                        {$language === 'en' ? 'Explore More Tours' : 'Explorar Más Tours'}
                        <ChevronRight className="w-4 h-4 text-primary" />
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
