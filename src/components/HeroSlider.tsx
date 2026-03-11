import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { ChevronDown, Play } from 'lucide-react';
import HeroSearch from './HeroSearch';

export default function HeroSlider() {
    const $language = useStore(language);
    const [isLoaded, setIsLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const HERO_VIDEO = '/vamos-jaco-tour-home-hero-video.mp4';
    const HERO_POSTER = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop';

    const content = {
        en: {
            tagline: 'COSTA RICA\'S #1 ADVENTURE COMPANY',
            titleLine1: 'UNLEASH YOUR',
            titleAccent: 'WILD SIDE',
            subtitle: 'ATV trails through the jungle • Zipline over the canopy • Surf the Pacific waves',
            cta: 'Explore Adventures',
            scrollText: 'Scroll to discover'
        },
        es: {
            tagline: 'LA #1 EMPRESA DE AVENTURA EN COSTA RICA',
            titleLine1: 'LIBERA TU',
            titleAccent: 'LADO SALVAJE',
            subtitle: 'Senderos ATV por la jungla • Tirolesa sobre el dosel • Surfing en el Pacífico',
            cta: 'Explorar Aventuras',
            scrollText: 'Desliza para descubrir'
        }
    };

    const t = content[$language];

    return (
        <div className="relative w-full min-h-[100svh] md:h-screen overflow-hidden flex flex-col justify-between">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={HERO_POSTER}
                    className="w-full h-full object-cover scale-105"
                    onLoadedData={() => setIsLoaded(true)}
                    // @ts-ignore - React 19 supports fetchpriority but some types lagging
                    fetchpriority="high"
                >
                    <source src={HERO_VIDEO} type="video/mp4" />
                </video>

                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark"></div>

                {/* Side Vignette */}
                <div className="absolute inset-0 bg-gradient-to-r from-dark/50 via-transparent to-dark/50"></div>
            </div>

            {/* Animated Background Particles / Glowing Orbs */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-brand-teal/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Hero Content */}
            <div className={`relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 md:pt-0 pb-32 md:pb-96 lg:pb-80 xl:pb-48 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Tagline Badge */}
                <div className="mb-6 md:mb-8">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm font-bold tracking-[0.2em] text-white/90 uppercase">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        {t.tagline}
                    </span>
                </div>

                {/* Main Title - Extreme Typography */}
                <h1 className="mb-6 md:mb-8">
                    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl leading-[1.1] pb-1">
                        {t.titleLine1}
                    </span>
                    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter italic drop-shadow-2xl leading-[1.1] pt-1 text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-orange to-brand-yellow animate-gradient-text">
                        {t.titleAccent}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-xl text-gray-300 font-medium max-w-3xl mx-auto mb-10 md:mb-12 tracking-wide">
                    {t.subtitle}
                </p>

                {/* CTA Button with Glow */}
                <a
                    href="/tours"
                    className="group relative inline-flex items-center gap-3 bg-primary hover:bg-primary text-white text-lg md:text-xl font-bold py-4 px-10 md:py-5 md:px-14 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(220,53,34,0.4)] hover:shadow-[0_0_50px_rgba(220,53,34,0.6)]"
                >
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                    {t.cta}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>

            {/* Search Bar — Flow on mobile, Absolute on Desktop */}
            <div className="relative z-20 w-full px-6 flex justify-center pb-24 md:pb-0 md:absolute md:bottom-28 md:left-0 md:right-0">
                <HeroSearch />
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-white/50 text-xs font-medium tracking-wider uppercase hidden md:block">{t.scrollText}</span>
                <ChevronDown className="w-6 h-6 text-white/50" />
            </div>

            {/* Bottom Fade to Body */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-[5]"></div>
        </div>
    );
}
