'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, HelpCircle } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { faqs } from '../data/faqs';
import clsx from 'clsx';

interface FaqSectionProps {
    faqs?: any[]; // Allow override from props if needed
}

export default function FaqSection({ faqs: wpFaqs }: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const $language = useStore(language);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    const lang = mounted ? $language : 'en';

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const t = {
        en: {
            bannerTitle: "Need Answers?",
            bannerSubtitle: "Frequently Asked Questions",
            title: "Questions & Answers",
            subtitle: "We're committed to offering more than just tours—we provide secure, exceptional experiences.",
        },
        es: {
            bannerTitle: "¿Dudas?",
            bannerSubtitle: "Preguntas Frecuentes",
            title: "Preguntas y Respuestas",
            subtitle: "Estamos comprometidos a ofrecer más que tours: brindamos experiencias seguras y excepcionales.",
        }
    };

    const fallbackContent = lang === 'en' ? t.en : t.es;

    const bannerTitle = fallbackContent.bannerTitle;
    const bannerSubtitle = fallbackContent.bannerSubtitle;
    const title = fallbackContent.title;
    const subtitle = fallbackContent.subtitle;

    const currentLanguageFaqs = lang === 'en' ? faqs.en : faqs.es;
    const faqsToDisplay = wpFaqs && wpFaqs.length > 0 ? wpFaqs : currentLanguageFaqs;

    return (
        <section className="relative pb-24">

            {/* Header / Banner Image */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/40 to-dark/90 z-10"></div>
                <img
                    src="/images/Sidebyside/sidebyside-vamos-jaco-tours-001.webp"
                    alt="Adventure Background"
                    className="w-full h-full object-cover"
                />

                {/* Banner Content */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white pb-32">
                    <h2 className="font-['Inter'] text-5xl md:text-7xl mb-2 drop-shadow-lg">
                        {bannerTitle}
                    </h2>
                    <p className="text-sm md:text-base font-bold uppercase tracking-widest opacity-90 mb-6">
                        {bannerSubtitle}
                    </p>
                </div>
            </div>

            {/* Overlapping Content Box */}
            <div className="max-w-4xl mx-auto px-6 relative z-30 -mt-32 md:-mt-40">
                <div className="bg-dark-soft rounded-[2rem] shadow-xl p-8 md:p-12 ring-1 ring-white/10">

                    {/* Title */}
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
                        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
                            {subtitle}
                        </p>
                    </div>

                    {/* Accordion */}
                    <div className="space-y-4">
                        {faqsToDisplay.map((faq, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    "border transition-all duration-300 rounded-2xl overflow-hidden",
                                    openIndex === index
                                        ? "border-primary/20 bg-white/5 shadow-sm"
                                        : "border-white/10 bg-dark"
                                )}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className={clsx(
                                        "font-bold text-sm md:text-base transition-colors",
                                        openIndex === index ? "text-primary" : "text-white"
                                    )}>
                                        {faq.question}
                                    </span>
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full flex items-center justify-center bg-white/10 text-gray-400 transition-all duration-300",
                                        openIndex === index ? "bg-primary text-white rotate-180" : ""
                                    )}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </button>

                                <div
                                    className={clsx(
                                        "px-6 transition-all duration-300 ease-in-out overflow-hidden",
                                        openIndex === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                                    )}
                                >
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
