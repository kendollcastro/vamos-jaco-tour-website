import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { ChevronDown, MapPin, Phone } from 'lucide-react';

export default function ContactHero() {
    const $language = useStore(language);
    const [offset, setOffset] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 300);
        const handleScroll = () => setOffset(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const t = {
        en: {
            tagline: "LET'S CONNECT",
            titleLine1: "PLAN YOUR",
            titleAccent: "ADVENTURE",
            desc: "Ready to hit the trails? Send us a message and we'll craft the perfect adrenaline-packed experience for you.",
        },
        es: {
            tagline: "CONTÁCTANOS",
            titleLine1: "PLANEA TU",
            titleAccent: "AVENTURA",
            desc: "¿Listo para la acción? Envíanos un mensaje y crearemos la experiencia perfecta llena de adrenalina para ti.",
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="relative h-[70vh] min-h-[550px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax */}
            <div
                className="absolute inset-0 z-0"
                style={{ transform: `translateY(${offset * 0.3}px)` }}
            >
                <img
                    src="/images/Sidebyside/sidebyside-vamos-jaco-tours-003.webp"
                    alt="ATV adventure through Costa Rica jungle"
                    className="w-full h-[120%] object-cover"
                    onLoad={() => setIsLoaded(true)}
                />
                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/40 to-dark"></div>
                {/* Side Vignette */}
                <div className="absolute inset-0 bg-gradient-to-r from-dark/40 via-transparent to-dark/40"></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-brand-teal/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Content */}
            <div className={`relative z-10 text-center px-6 max-w-4xl mx-auto mt-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Tagline Badge */}
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm font-bold tracking-[0.2em] text-white/90 uppercase">
                        <Phone className="w-3.5 h-3.5" />
                        {content.tagline}
                    </span>
                </div>

                {/* Extreme Title */}
                <h1 className="mb-6">
                    <span className="block text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl leading-[0.9]">
                        {content.titleLine1}
                    </span>
                    <span className="block text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic drop-shadow-2xl leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-orange to-brand-yellow">
                        {content.titleAccent}
                    </span>
                </h1>

                {/* Description */}
                <p className="text-base md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-8 tracking-wide">
                    {content.desc}
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <a
                        href="https://wa.me/50685858462"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.478-.677-6.309-1.834l-.452-.274-2.645.887.887-2.645-.274-.452A9.955 9.955 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
                        WhatsApp
                    </a>
                    <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80">
                        <MapPin className="w-4 h-4 text-primary" />
                        Jacó, Costa Rica
                    </span>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
                <ChevronDown className="w-6 h-6 text-white/50" />
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-[5]"></div>
        </section>
    );
}
