import React, { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import Flame from 'lucide-react/dist/esm/icons/flame';

export default function PopularActivities() {
    const $language = useStore(language);

    const content = {
        en: {
            tagline: 'WHAT WE OFFER',
            title: 'Feel the',
            titleAccent: 'Rush',
        },
        es: {
            tagline: 'LO QUE OFRECEMOS',
            title: 'Siente la',
            titleAccent: 'Adrenalina',
        }
    };

    const fallbackContent = content[$language];

    const tagline = fallbackContent.tagline;
    const titleText = fallbackContent.title;
    const titleAccent = fallbackContent.titleAccent;

    const activities = [
        {
            name: $language === 'en' ? 'ATV Tours' : 'Tours ATV',
            badge: 'EXTREME',
            image: '/images/activities/atv-activity-optimized.jpg',
            rotation: '-rotate-6',
            link: '/tours/jaco-atv-adventure',
            width: 800,
            height: 1422
        },
        {
            name: $language === 'en' ? 'Zipline' : 'Tirolesa',
            badge: 'THRILL',
            image: '/images/Zipline/zipline-vamos-jaco-tours-001.jpg',
            rotation: '-rotate-3',
            link: '/tours/zipline-canopy',
            width: 800,
            height: 769
        },
        {
            name: $language === 'en' ? 'Surfing' : 'Surf',
            badge: 'WATER SPORT',
            image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop',
            rotation: 'rotate-3',
            link: '/tours/surf-class'
        },
        {
            name: $language === 'en' ? 'Sport Fishing' : 'Pesca Deportiva',
            badge: 'OCEAN',
            image: '/images/activities/sport-fishing.png',
            rotation: 'rotate-6',
            link: '/tours/costa-cat-cruise' // Defaulting to Costa Cat as there isn't a direct sport-fishing slug in recent DB
        }
    ];
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
        <section className="py-20 md:py-28 relative overflow-hidden">
            {/* Glowing Background Orbs */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16">
                    <span className="inline-flex items-center gap-2 text-primary font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
                        <Flame className="w-4 h-4" />
                        {tagline}
                        <Flame className="w-4 h-4" />
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter md:tracking-tight">
                        {titleText}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-orange to-brand-yellow italic animate-gradient-text block md:inline mt-2 md:mt-0">
                            {titleAccent}
                        </span>
                    </h2>
                </div>

                {/* Activities Grid — Bento Layout with Stagger */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px] stagger-children">

                    {/* First Column - Tall */}
                    <a href={activities[0].link} className="md:col-span-1 relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 hover:ring-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(220,53,34,0.2)] block">
                        <img
                            src={activities[0].image}
                            alt={activities[0].name}
                            loading="lazy"
                            decoding="async"
                            width={activities[0].width}
                            height={activities[0].height}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent"></div>
                        {/* Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                                {activities[0].badge}
                            </span>
                        </div>
                        <div className="absolute inset-0 flex items-end p-6 md:p-8 pb-8">
                            <span className={`text-white text-3xl font-black drop-shadow-xl transform ${activities[0].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`}>
                                {activities[0].name}
                            </span>
                        </div>
                    </a>

                    {/* Middle Column - Two Stacked */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full md:h-full">
                        <a href={activities[1].link} className="relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 hover:ring-brand-orange/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,152,0,0.2)] block">
                            <img
                                src={activities[1].image}
                                alt={activities[1].name}
                                loading="lazy"
                                decoding="async"
                                width={activities[1].width}
                                height={activities[1].height}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent"></div>
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-full bg-brand-orange/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                                    {activities[1].badge}
                                </span>
                            </div>
                            <div className="absolute inset-0 flex items-end p-6 md:p-8 pb-8">
                                <span className={`text-white text-3xl font-black drop-shadow-xl transform ${activities[1].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`}>
                                    {activities[1].name}
                                </span>
                            </div>
                        </a>

                        <a href={activities[2].link} className="relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 hover:ring-brand-teal/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,150,136,0.2)] block">
                            <img
                                src={activities[2].image}
                                alt={activities[2].name}
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent"></div>
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-full bg-brand-teal/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                                    {activities[2].badge}
                                </span>
                            </div>
                            <div className="absolute inset-0 flex items-end p-6 md:p-8 pb-8">
                                <span className={`text-white text-3xl font-black drop-shadow-xl transform ${activities[2].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`}>
                                    {activities[2].name}
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Last Column - Tall */}
                    <a href={activities[3].link} className="md:col-span-1 relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 hover:ring-brand-yellow/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,193,7,0.2)] block">
                        <img
                            src={activities[3].image}
                            alt={activities[3].name}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-brand-yellow/90 text-dark text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                                {activities[3].badge}
                            </span>
                        </div>
                        <div className="absolute inset-0 flex items-end p-6 md:p-8 pb-8">
                            <span className={`text-white text-3xl font-black drop-shadow-xl transform ${activities[3].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`}>
                                {activities[3].name}
                            </span>
                        </div>
                    </a>

                </div>
            </div>
        </section>
    );
}
