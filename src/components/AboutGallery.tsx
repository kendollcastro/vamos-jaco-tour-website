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
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop", // Zip Line
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop", // Surf
        "https://images.unsplash.com/photo-1599368383849-c1b2f93933c0?q=80&w=2070&auto=format&fit=crop", // ATV
        "https://images.unsplash.com/photo-1534445698717-3932a370e08f?q=80&w=2070&auto=format&fit=crop", // Fishing
        "https://images.unsplash.com/photo-1582650082728-1c4b14647347?q=80&w=2070&auto=format&fit=crop"  // Jet Ski
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
