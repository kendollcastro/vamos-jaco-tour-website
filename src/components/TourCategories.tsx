import React from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

export default function TourCategories() {
    const $language = useStore(language);

    const title = $language === 'en' ? 'Browse by Category' : 'Explorar por Categoría';

    // Placeholder data for categories - simulating what will come from WP later
    const categories = [
        {
            id: 'atv',
            name: { en: 'ATV & Buggy', es: 'ATV y Buggy' },
            image: 'https://images.unsplash.com/photo-1599368383849-c1b2f93933c0?q=80&w=2070&auto=format&fit=crop',
            colSpan: 'md:col-span-1',
            rotate: '-rotate-6'
        },
        {
            id: 'water',
            name: { en: 'Water Sports', es: 'Deportes Acuáticos' },
            image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop',
            colSpan: 'md:col-span-2',
            rotate: '-rotate-3'
        },
        {
            id: 'nature',
            name: { en: 'Nature & Wildlife', es: 'Naturaleza' },
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
            colSpan: 'md:col-span-1',
            rotate: 'rotate-6'
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-dark mb-8">
                    {title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[300px]">
                    {categories.map((cat) => (
                        <div key={cat.id} className={`${cat.colSpan} relative h-[250px] md:h-full rounded-[25px] overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300`}>
                            <img
                                src={cat.image}
                                alt={cat.name.en}
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-white text-3xl md:text-4xl font-['Inter'] drop-shadow-lg transform ${cat.rotate} group-hover:scale-110 transition-transform duration-300`}>
                                    {$language === 'en' ? cat.name.en : cat.name.es}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
