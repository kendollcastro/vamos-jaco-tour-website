import React from 'react';
import { Send, Flame } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

export default function NewsletterSection() {
    const $language = useStore(language);

    const t = {
        en: {
            tagline: 'EXCLUSIVE DEALS',
            title: "Get insider access to extreme adventures.",
            placeholder: "Your email address",
            subtext: "Join 2,000+ adventure seekers. Get exclusive deals, new experience alerts & local tips.",
        },
        es: {
            tagline: 'OFERTAS EXCLUSIVAS',
            title: "Acceso exclusivo a aventuras extremas.",
            placeholder: "Tu correo electrónico",
            subtext: "Únete a 2,000+ buscadores de aventura. Ofertas exclusivas, alertas y tips locales.",
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-4">
            <div className="w-full">
                <div className="bg-gradient-to-br from-[#1A4D45] via-[#1A4D45] to-[#0D3B34] w-full p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center">

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                            alt=""
                            className="w-full h-full object-cover grayscale invert"
                        />
                    </div>

                    {/* Glowing Orbs */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-2xl mx-auto pt-4 pb-4">
                        <span className="inline-flex items-center gap-2 text-brand-yellow font-bold text-xs tracking-[0.2em] uppercase mb-6">
                            <Flame className="w-4 h-4" />
                            {content.tagline}
                            <Flame className="w-4 h-4" />
                        </span>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-10 leading-tight uppercase tracking-tight">
                            {content.title}
                        </h2>

                        <div className="bg-dark/40 backdrop-blur-xl p-2 rounded-full flex items-center ring-1 ring-white/20 max-w-xl mx-auto w-full mb-6 hover:ring-white/30 transition-colors">
                            <input
                                type="email"
                                placeholder={content.placeholder}
                                className="flex-grow px-6 py-3 rounded-full bg-transparent text-white focus:outline-none placeholder:text-gray-400 font-medium"
                            />
                            <button className="bg-gradient-to-r from-primary to-brand-orange text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                                <Send className="w-5 h-5 -ml-0.5 translate-x-0.5" />
                            </button>
                        </div>

                        <p className="text-gray-300/80 text-sm md:text-base font-medium">
                            {content.subtext}
                        </p>
                    </div>

                    {/* Decorative Dashed Line */}
                    <div className="absolute top-20 left-1/4 w-32 h-32 border-t-2 border-r-2 border-dashed border-yellow-200/20 rounded-tr-full hidden xl:block"></div>
                    <div className="absolute bottom-20 right-1/4 w-24 h-24 border-b-2 border-l-2 border-dashed border-yellow-200/15 rounded-bl-full hidden xl:block"></div>
                </div>
            </div>
        </section>
    );
}
