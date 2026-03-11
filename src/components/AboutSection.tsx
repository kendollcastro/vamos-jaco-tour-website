import React, { useState, useEffect } from 'react';
import { Play, Globe, UserCheck, Smile, Trophy, ArrowRight, Flame, ShieldAlert, X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import AnimatedCounter from './AnimatedCounter';

const StatItem = ({ stat }: { stat: { value: string; label: string; icon: any; color: string; hexColor: string } }) => {
    const numericValue = parseInt(stat.value.replace(/\D/g, ''));
    const suffix = stat.value.replace(/[0-9]/g, '');

    return (
        <div className="relative bg-[#0d0d0d] p-6 lg:p-8 rounded-3xl border border-white/10 group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]" style={{ borderColor: stat.hexColor || '#ff3b3b' }}>
            {/* Graphic background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent bg-opacity-0 rounded-3xl group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <stat.icon className="w-8 h-8 opacity-80" style={{ color: stat.hexColor || '#fff' }} />
                </div>
                <div>
                    <h4 className="text-4xl font-black text-white italic tracking-tighter drop-shadow-lg">
                        <AnimatedCounter end={numericValue} suffix={suffix} />
                    </h4>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-2">{stat.label}</p>
                </div>
            </div>
        </div>
    );
};

export default function AboutSection() {
    const $language = useStore(language);
    const [showVideoModal, setShowVideoModal] = useState(false);

    useEffect(() => {
        if (showVideoModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showVideoModal]);

    const t = {
        en: {
            subtitle: "Unleash the Adventure",
            title: "THE WILD SIDE OF COSTA RICA",
            description: "Vamos Jacó isn't just a travel agency; we are your adrenaline dealers. We craft raw, heart-pounding adventures and unforgettable extreme experiences. Drop the boring tours and buckle up for the ride of your life.",
            cta: "CHOOSE YOUR ADVENTURE",
            stats: [
                { value: "2k+", label: "Adventures Survived", icon: ShieldAlert, color: "bg-brand-yellow", hexColor: "#ffca28" },
                { value: "50+", label: "Extreme Routes", icon: Globe, color: "bg-brand-orange", hexColor: "#ff7b00" },
                { value: "12k+", label: "Adrenaline Junkies", icon: Flame, color: "bg-primary", hexColor: "#dc3522" },
                { value: "98%", label: "Epic Ratings", icon: Trophy, color: "bg-brand-teal", hexColor: "#00b4d8" },
            ]
        },
        es: {
            subtitle: "Desata la Aventura",
            title: "EL LADO SALVAJE DE COSTA RICA",
            description: "Vamos Jacó no es una simple agencia de viajes; somos tus proveedores de adrenalina. Diseñamos aventuras crudas y emocionantes. Deja de lado los tours aburridos y prepárate para la experiencia de tu vida.",
            cta: "ELIGE TU AVENTURA",
            stats: [
                { value: "2k+", label: "Aventuras Superadas", icon: ShieldAlert, color: "bg-brand-yellow", hexColor: "#ffca28" },
                { value: "50+", label: "Rutas Extremas", icon: Globe, color: "bg-brand-orange", hexColor: "#ff7b00" },
                { value: "12k+", label: "Adictos a la Adrenalina", icon: Flame, color: "bg-primary", hexColor: "#dc3522" },
                { value: "98%", label: "Calificaciones Épicas", icon: Trophy, color: "bg-brand-teal", hexColor: "#00b4d8" },
            ]
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-32 relative bg-dark overflow-hidden">
            {/* Extreme Background Elements */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #dc3522 0%, transparent 60%)', filter: 'blur(100px)' }}></div>

            {/* Giant watermark text */}
            <div className="absolute top-10 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] pointer-events-none select-none flex">
                <span className="text-[12rem] md:text-[15rem] font-black italic uppercase tracking-tighter text-white">EXTREME VAMOS JACÓ EXTREME VAMOS JACÓ</span>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                {/* Top Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">

                    {/* Left: Aggressive Text Content */}
                    <div className="relative z-10">
                        {/* Rounded decorative */}
                        <div className="w-16 h-2 bg-primary mb-8 rounded-full"></div>

                        <h2 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] uppercase italic tracking-tighter drop-shadow-2xl">
                            Vamos Jacó <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-orange drop-shadow-[0_0_30px_rgba(220,53,34,0.6)]">
                                #1
                            </span> AGENCY
                        </h2>

                        <div className="mb-10 block">
                            <span className="text-xl md:text-2xl font-black uppercase tracking-widest text-brand-teal block mb-4">
                                {content.subtitle}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase">
                                {content.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg lg:text-xl font-medium border-l-4 border-white/20 pl-6">
                                {content.description}
                            </p>
                        </div>

                        <a href="/tours" className="relative inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-black text-white uppercase tracking-widest bg-gradient-to-r from-primary to-brand-orange hover:shadow-[0_0_25px_rgba(220,53,34,0.4)] transition-all duration-300 hover:scale-105 rounded-full overflow-hidden group">
                            <span className="absolute inset-0 w-full h-full -mt-1 rounded-full opacity-30 shadow-inset"></span>
                            <span className="relative z-10 flex items-center gap-3">
                                {content.cta}
                                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                            </span>
                        </a>
                    </div>

                    {/* Right: Aggressive Image */}
                    <div className="relative">
                        {/* Image background offset box */}
                        <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0"></div>

                        <div className="relative h-[450px] md:h-[600px] w-full z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter grayscale hover:grayscale-0 transition-all duration-700">
                            <video
                                src="/vamos-jaco-tour-home-hero-video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />

                            {/* Heavy Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>

                            {/* Overlay grid pattern */}
                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <button 
                                    onClick={() => setShowVideoModal(true)}
                                    className="pointer-events-auto relative flex items-center justify-center w-24 h-24 rounded-full bg-black/60 backdrop-blur-md border-2 border-white text-white hover:bg-primary hover:border-primary transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                >
                                    <Play className="w-10 h-10 fill-current ml-2 group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:animate-ping"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.stats.map((stat, index) => (
                        <StatItem key={index} stat={stat} />
                    ))}
                </div>

            </div>

            {/* Video Modal */}
            {showVideoModal && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
                    onClick={() => setShowVideoModal(false)}
                >
                    <div 
                        className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] ring-1 ring-white/20 relative z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Improved close button inside the modal container */}
                        <button 
                            onClick={() => setShowVideoModal(false)}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/40 hover:bg-black/80 rounded-full p-2.5 z-50 flex items-center justify-center backdrop-blur-md group"
                            title="Close Video"
                        >
                            <X className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                        </button>
                        
                        <video
                            src="/vamos-jaco-tour-home-hero-video.mp4"
                            autoPlay
                            controls
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
