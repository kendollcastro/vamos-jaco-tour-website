import React, { useState, useEffect } from 'react';
import TourCard from './TourCard';
import { tours, type TourCategory } from '../data/tours';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { clsx } from 'clsx';
import { Filter } from 'lucide-react';

export default function TourFilter() {
    const $language = useStore(language);
    const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>('all');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-[400px]"></div>; // Prevent hydration mismatch
    }

    const categories: { id: TourCategory | 'all'; label: { en: string; es: string } }[] = [
        { id: 'all', label: { en: 'All Tours', es: 'Todos los Tours' } },
        { id: 'atv', label: { en: 'ATV & Buggy', es: 'ATV y Buggy' } },
        { id: 'water', label: { en: 'Water Sports', es: 'Deportes Acuáticos' } },
        { id: 'extreme', label: { en: 'Extreme', es: 'Extremo' } },
        // { id: 'nature', label: { en: 'Nature', es: 'Naturaleza' } },
    ];

    const filteredTours = activeCategory === 'all'
        ? tours
        : tours.filter(tour => tour.category === activeCategory);

    return (
        <div>
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 mr-4 text-gray-400 font-medium">
                    <Filter className="w-5 h-5" />
                    <span>{$language === 'en' ? 'Filter by:' : 'Filtrar por:'}</span>
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTours.map((tour) => (
                    <div key={tour.id} className="h-full animate-fade-in-up">
                        <TourCard
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
        </div>
    );
}
