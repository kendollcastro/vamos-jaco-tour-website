import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import clsx from 'clsx';

const faqs = [
    {
        question: "What Services Does Your Travel Agency Provide?",
        answer: "A travel agency typically provides a wide range of services to ensure a smooth and enjoyable travel experience. As like- Hotel booking, Flight Booking, Visa & Customized Travel Pakcge etc."
    },
    {
        question: "Do You Offer Customized Travel Packages?",
        answer: "Yes! We specialize in creating tailor-made itineraries that match your preferences, budget, and travel style. Whether you want a relaxing beach getaway or an action-packed adventure, we can build it for you."
    },
    {
        question: "Can I Book Flights, Hotels, and Tours Separately?",
        answer: "Absolutely. While we offer comprehensive packages, you can also book individual services like flight tickets, hotel stays, or specific day tours and activities through us."
    },
    {
        question: "Do You Provide Visa Assistance?",
        answer: "Yes, we provide guidance and assistance with visa applications for many destinations. However, the final approval lies with the respective embassy or consulate."
    },
    {
        question: "What Payment Methods Do You Accept?",
        answer: "We accept all major credit cards, bank transfers, and secure online payment platforms to make your booking process convenient and safe."
    },
    {
        question: "What Travel Documents are Required for International Travel?",
        answer: "Typically, you will need a valid passport (usually with 6 months validity), a visa (depending on destination), and sometimes proof of vaccinations or travel insurance. We will guide you on specific requirements for your trip."
    }
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const $language = useStore(language);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const t = {
        en: {
            bannerTitle: "Water Rafting",
            bannerSubtitle: "View All Package",
            title: "Questions & Answer",
            subtitle: "We're committed to offering more than just products—we provide exceptional experiences.",
        },
        es: {
            bannerTitle: "Rafting en Aguas",
            bannerSubtitle: "Ver Todos los Paquetes",
            title: "Preguntas y Respuestas",
            subtitle: "Estamos comprometidos a ofrecer más que solo productos: brindamos experiencias excepcionales.",
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="relative pb-24">

            {/* Header / Banner Image */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1530866495561-507c9faab9ed?q=80&w=2576&auto=format&fit=crop"
                    alt="Rafting Adventure"
                    className="w-full h-full object-cover"
                />

                {/* Banner Content */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white pb-32">
                    <h2 className="font-['Inter'] text-5xl md:text-7xl mb-2 drop-shadow-lg">
                        {content.bannerTitle}
                    </h2>
                    <p className="text-sm md:text-base font-bold uppercase tracking-widest opacity-90 mb-6">
                        {content.bannerSubtitle}
                    </p>

                    {/* Decorative Icons (Simulated from design) */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 hidden md:flex">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
                            <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-lg translate-x-4">
                            <img src="https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2626&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
                            <img src="https://images.unsplash.com/photo-1621262609935-4303498f3957?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlapping Content Box */}
            <div className="max-w-4xl mx-auto px-6 relative z-30 -mt-32 md:-mt-40">
                <div className="bg-dark-soft rounded-[2rem] shadow-xl p-8 md:p-12 ring-1 ring-white/10">

                    {/* Title */}
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">{content.title}</h3>
                        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
                            {content.subtitle}
                        </p>
                    </div>

                    {/* Accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
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
