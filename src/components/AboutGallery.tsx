import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { Instagram } from 'lucide-react';

export default function AboutGallery() {
    const $language = useStore(language);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const title = $language === 'en' ? 'Our Best Moments' : 'Nuestros Mejores Momentos';
    const subtitle = $language === 'en' ? 'Follow us on Instagram' : 'Síguenos en Instagram';

    const images = [
        "/images/Bestmoments/bestmoments-vamos-jaco-tours-004.jpg", // Zip Line
        "/images/Bestmoments/bestmoments-vamos-jaco-tours-001.jpg", // Surf
        "/images/Tube/tube-vamos-jaco-tours-004.png", // ATV
        "/images/Bestmoments/bestmoments-vamos-jaco-tours-003.jpg", // Fishing
        "/images/Bestmoments/bestmoments-vamos-jaco-tours-002.jpg"  // Jet Ski
    ];

    if (!mounted) return <div className="min-h-[400px]"></div>;

    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-brand-orange font-bold uppercase tracking-wider text-sm block mb-2">
                        @vamosjacotours
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg uppercase tracking-tight">
                        {title}
                    </h2>
                    <a href="#" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-yellow transition-colors group">
                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium underline decoration-gray-600 hover:decoration-brand-yellow underline-offset-4">{subtitle}</span>
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
                    {/* Large Featured Image */}
                    <div className="col-span-2 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden group shadow-2xl ring-1 ring-white/10">
                        <img
                            src={images[0]}
                            alt="Gallery Highlight"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    </div>

                    {/* Smaller Images */}
                    <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10">
                        <img
                            src={images[1]}
                            alt="Gallery 1"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10">
                        <img
                            src={images[2]}
                            alt="Gallery 2"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10">
                        <img
                            src={images[3]}
                            alt="Gallery 3"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10">
                        <img
                            src={images[4]}
                            alt="Gallery 4"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
