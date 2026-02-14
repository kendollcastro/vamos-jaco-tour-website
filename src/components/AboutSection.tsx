import React from 'react';
import { Play, Globe, UserCheck, Smile, Trophy, ArrowUpRight } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import AnimatedCounter from './AnimatedCounter';

// Sub-component for individual stat
const StatItem = ({ stat }: { stat: { value: string; label: string; icon: any; color: string } }) => {
    const numericValue = parseInt(stat.value.replace(/\D/g, ''));
    const suffix = stat.value.replace(/[0-9]/g, '');

    return (
        <div className="bg-dark-soft p-6 rounded-[2rem] shadow-soft hover:shadow-hover transition-all duration-300 flex items-center gap-4 group hover:-translate-y-1 ring-1 ring-white/10">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${stat.color} shadow-lg text-white`}>
                <stat.icon className="w-8 h-8" />
            </div>
            <div>
                <h4 className="text-3xl font-bold text-white">
                    <AnimatedCounter end={numericValue} suffix={suffix} />
                </h4>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            </div>
        </div>
    );
};

export default function AboutSection() {
    const $language = useStore(language);

    const t = {
        en: {
            subtitle: "Welcome to Vamos Jacó",
            title: "Your Gateway to Unforgettable Journeys!",
            description: "Vamos Jacó is a trusted name in the travel industry, offering seamless travel planning, personalized itineraries, and unforgettable adventures. With years of experience and a network of global partners, we ensure a hassle-free and memorable journey for every traveler.",
            cta: "About More Vamos Jacó",
            stats: [
                { value: "2k+", label: "Tour Completed", icon: Globe, color: "bg-brand-yellow" },
                { value: "50+", label: "Travel Experience", icon: UserCheck, color: "bg-brand-orange" },
                { value: "12k+", label: "Happy Traveler", icon: Smile, color: "bg-brand-teal" },
                { value: "98%", label: "Retention Rate", icon: Trophy, color: "bg-primary" },
            ]
        },
        es: {
            subtitle: "Bienvenido a Vamos Jacó",
            title: "¡Tu Puerta a Viajes Inolvidables!",
            description: "Vamos Jacó es un nombre de confianza en la industria de viajes, ofreciendo planificación de viajes sin problemas, itinerarios personalizados y aventuras inolvidables. Con años de experiencia y una red de socios globales, aseguramos un viaje sin complicaciones y memorable para cada viajero.",
            cta: "Más sobre Vamos Jacó",
            stats: [
                { value: "2k+", label: "Tours Completados", icon: Globe, color: "bg-brand-yellow" },
                { value: "50+", label: "Experiencia de Viaje", icon: UserCheck, color: "bg-brand-orange" },
                { value: "12k+", label: "Viajeros Felices", icon: Smile, color: "bg-brand-teal" },
                { value: "98%", label: "Tasa de Retención", icon: Trophy, color: "bg-primary" },
            ]
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

                {/* Top Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

                    {/* Left: Text Content */}
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Vamos Jacó <span className="text-primary">#1</span> <br /> Travel Agency
                        </h2>

                        <div className="mb-8">
                            <span className="text-2xl md:text-3xl font-['Inter'] text-brand-teal block mb-4">
                                {content.subtitle}
                            </span>
                            <h3 className="text-xl font-bold text-gray-200 mb-6 italic">
                                {content.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                                {content.description}
                            </p>
                        </div>

                        <button className="flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group">
                            {content.cta}
                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </button>
                    </div>

                    {/* Right: Image & Video */}
                    <div className="relative">
                        <div className="relative h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2574&auto=format&fit=crop"
                                alt="Travelers having fun"
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl shadow-primary/30 hover:scale-110 transition-transform duration-300">
                                    <Play className="w-8 h-8 fill-current ml-1" />
                                </button>
                            </div>

                            {/* Decorative Scribble (CSS Shape approximation or SVG) */}
                            <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 text-brand-teal opacity-90 hidden md:block">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current">
                                    <path d="M45,-76.3C58.3,-69.3,69.3,-58.3,77.3,-45.8C85.3,-33.3,90.3,-19.3,89.5,-5.5C88.7,8.3,82.1,21.9,73.1,33.4C64.1,44.9,52.7,54.3,40.4,62.7C28.1,71.1,14.9,78.5,0.8,77.1C-13.3,75.7,-29.3,65.5,-43.3,55.4C-57.3,45.3,-69.3,35.3,-76.3,22.3C-83.3,9.3,-85.3,-6.7,-79.8,-20.3C-74.3,-33.9,-61.3,-45.1,-48.3,-52.3C-35.3,-59.5,-22.3,-62.7,-8.8,-69.5C4.7,-76.3,27,-79.5,45,-76.3Z" transform="translate(100 100)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.stats.map((stat, index) => (
                        <StatItem key={index} stat={stat} />
                    ))}
                </div>

            </div>
        </section>
    );
}
