import React from 'react';
import { Zap, Shield, Mountain, ArrowRight } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

export default function ServicesBanner() {
    const $language = useStore(language);

    const t = {
        en: {
            titleBold: "Your Adventure,",
            titleScript: "our expertise.",
            feature1Title: "Instant Adrenaline",
            feature1Desc: "Book your rush in seconds — seamless online booking for every extreme experience.",
            feature2Title: "Best Price Guarantee",
            feature2Desc: "Unbeatable deals on the most thrilling adventures in Costa Rica.",
            feature3Title: "Expert Local Guides",
            feature3Desc: "Certified pros who know every trail, wave, and hidden waterfall.",
            ctaText: "Ready to build your ultimate adventure package?",
            ctaButton: "Build Your Adventure"
        },
        es: {
            titleBold: "Tu Aventura,",
            titleScript: "nuestra experiencia.",
            feature1Title: "Adrenalina Instantánea",
            feature1Desc: "Reserva tu dosis de emoción en segundos — reserva en línea para cada experiencia extrema.",
            feature2Title: "Mejor Precio Garantizado",
            feature2Desc: "Ofertas inmejorables en las aventuras más emocionantes de Costa Rica.",
            feature3Title: "Guías Locales Expertos",
            feature3Desc: "Profesionales certificados que conocen cada sendero, ola y cascada oculta.",
            ctaText: "¿Listo para crear tu paquete de aventura definitivo?",
            ctaButton: "Crea Tu Aventura"
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-12 md:py-24 px-4 relative">
            <div className="max-w-7xl mx-auto bg-dark-soft rounded-[2.5rem] md:rounded-[4rem] px-6 py-12 md:py-20 relative overflow-hidden ring-1 ring-white/10">

                {/* Background: Adventure Image Underlay */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Glowing Accent */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-teal/5 blur-[80px] rounded-full pointer-events-none"></div>

                {/* Header */}
                <div className="text-center mb-16 md:mb-20 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                        {content.titleBold}
                    </h2>
                    <p className="text-3xl md:text-5xl font-['Inter'] text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-teal/70">
                        {content.titleScript}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 mb-16 md:mb-24 px-4 md:px-12">

                    {/* Feature 1 */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 group">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{content.feature1Title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                            {content.feature1Desc}
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 group">
                        <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-brand-orange/30 group-hover:scale-110 transition-transform duration-300">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{content.feature2Title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                            {content.feature2Desc}
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 group">
                        <div className="w-16 h-16 bg-brand-teal rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-brand-teal/30 group-hover:scale-110 transition-transform duration-300">
                            <Mountain className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{content.feature3Title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                            {content.feature3Desc}
                        </p>
                    </div>

                </div>

                {/* CTA Bar */}
                <div className="bg-dark/80 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg ring-1 ring-white/10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                    <div className="px-6 py-2 text-center md:text-left">
                        <p className="text-gray-300 font-medium text-sm md:text-base">
                            {content.ctaText}
                        </p>
                    </div>
                    <button className="bg-gradient-to-r from-primary to-brand-orange text-white px-8 py-4 rounded-full font-bold text-sm md:text-base flex items-center gap-2 hover:shadow-[0_0_25px_rgba(220,53,34,0.4)] transition-all duration-300 hover:scale-105 w-full md:w-auto justify-center">
                        {content.ctaButton}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </section>
    );
}
