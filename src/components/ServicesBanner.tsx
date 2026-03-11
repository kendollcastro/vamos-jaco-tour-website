import React from 'react';
import { Zap, Shield, Mountain, ArrowRight, type LucideIcon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

const IconMap: Record<string, LucideIcon> = {
    Zap,
    Shield,
    Mountain
};

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

    const fallbackContent = $language === 'en' ? t.en : t.es;

    const titleBold = fallbackContent.titleBold;
    const titleScript = fallbackContent.titleScript;
    const ctaText = fallbackContent.ctaText;
    const ctaButton = fallbackContent.ctaButton;

    const features = [
        { title: fallbackContent.feature1Title, description: fallbackContent.feature1Desc, icon: 'Zap' },
        { title: fallbackContent.feature2Title, description: fallbackContent.feature2Desc, icon: 'Shield' },
        { title: fallbackContent.feature3Title, description: fallbackContent.feature3Desc, icon: 'Mountain' }
    ];

    return (
        <section className="py-12 md:py-24 px-4 relative">
            <div className="max-w-7xl mx-auto bg-dark-soft rounded-[2.5rem] md:rounded-[4rem] px-6 py-12 md:py-20 relative overflow-hidden ring-1 ring-white/10">

                {/* Background: Adventure Image Underlay */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                    <img
                        src="/images/jetski-vamos-jaco-tours-005.webp"
                        alt="Extreme adventure"
                        className="w-full h-full object-cover filter contrast-125"
                    />
                </div>

                {/* Glowing Accent */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-teal/5 blur-[80px] rounded-full pointer-events-none"></div>

                {/* Header */}
                <div className="text-center mb-16 md:mb-20 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                        {titleBold}
                    </h2>
                    <p className="text-3xl md:text-5xl font-['Inter'] text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-teal/70">
                        {titleScript}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 mb-16 md:mb-24 px-4 md:px-12">
                    {features.map((feature, i) => {
                        const IconComponent = IconMap[feature.icon] || Zap;
                        const bgColors = ['bg-primary', 'bg-brand-orange', 'bg-brand-teal'];
                        const shadowColors = ['shadow-primary/30', 'shadow-brand-orange/30', 'shadow-brand-teal/30'];
                        const bgColor = bgColors[i % bgColors.length];
                        const shadowColor = shadowColors[i % shadowColors.length];

                        return (
                            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-4 group">
                                <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mb-2 shadow-lg ${shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Bar */}
                <div className="bg-dark/80 backdrop-blur-sm rounded-[2rem] md:rounded-full p-4 md:p-3 shadow-lg ring-1 ring-white/10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4 relative z-10 w-full">
                    <div className="px-2 md:px-6 py-2 text-center md:text-left w-full">
                        <p className="text-gray-300 font-medium text-sm md:text-base">
                            {ctaText}
                        </p>
                    </div>
                    <a href="/tours" className="relative inline-flex items-center justify-center px-4 md:px-8 py-4 text-sm md:text-lg font-black text-white uppercase tracking-wider md:tracking-widest bg-gradient-to-r from-primary to-brand-orange hover:shadow-[0_0_25px_rgba(220,53,34,0.4)] transition-all duration-300 hover:scale-105 rounded-full overflow-hidden group w-full md:w-auto shrink-0">
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-full opacity-30 shadow-inset"></span>
                        <span className="relative z-10 flex items-center gap-2 md:gap-3 text-center">
                            {ctaButton}
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </span>
                    </a>
                </div>

            </div>
        </section>
    );
}
