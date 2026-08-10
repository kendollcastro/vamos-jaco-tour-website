import React from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { HelpCircle } from 'lucide-react';
import type { TourFaqEntry } from '../data/tour-seo-overrides';

interface TourFaqSectionProps {
    faqs: { en: TourFaqEntry[]; es: TourFaqEntry[] };
}

export default function TourFaqSection({ faqs }: TourFaqSectionProps) {
    const $language = useStore(language);
    const list = faqs[$language] || faqs.en;
    const heading = $language === 'en' ? 'Jet Ski in Jacó — FAQ' : 'Jet Ski en Jacó — Preguntas Frecuentes';

    return (
        <section>
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3 italic uppercase tracking-tight">
                <span className="w-8 h-1 bg-gradient-to-r from-primary to-brand-orange rounded-full"></span>
                {heading}
            </h2>

            <div className="space-y-4">
                {list.map((faq, i) => (
                    <div
                        key={i}
                        className="border border-white/10 bg-white/5 rounded-2xl p-5 md:p-6 transition-colors hover:border-white/20"
                    >
                        <h3 className="text-white font-bold text-base md:text-lg mb-2 flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                            {faq.question}
                        </h3>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
