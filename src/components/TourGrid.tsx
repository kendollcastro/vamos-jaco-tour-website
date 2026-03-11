import React, { useEffect, useRef } from 'react';
import TourCard from './TourCard';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import type { Tour } from '../data/tours';

interface TourGridProps {
    tours: Tour[];
    limit?: number;
}

export default function TourGrid({ tours, limit = 6 }: TourGridProps) {
    const $language = useStore(language);
    const displayedTours = tours.slice(0, limit);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {displayedTours.map((tour) => (
                <TourCard
                    key={tour.id}
                    id={tour.id}
                    title={tour.title}
                    price={tour.price}
                    originalPrice={tour.originalPrice}
                    image_url={tour.image_url}
                    location={tour.location}
                    duration={tour.duration}
                    badge={tour.badge}
                />
            ))}
        </div>
    );
}
