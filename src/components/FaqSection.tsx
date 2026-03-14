'use client';
import React, { useState } from 'react';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import clsx from 'clsx';

const faqs = {
    en: [
        {
            question: "How far in advance should I book my tour?",
            answer: "We recommend booking at least 2-3 days in advance, especially during the high season (December to April) to ensure availability for your preferred dates."
        },
        {
            question: "Is round-trip transportation included?",
            answer: "Yes! Many of our tours include free round-trip transportation from hotels and rentals within the Jaco and Herradura areas. Please check the specific details of your chosen tour."
        },
        {
            question: "Are the tours suitable for children?",
            answer: "Most tours are family-friendly. For example, the Crocodile Safari and Banana Boat have very low minimum ages. However, ATV and Jet Ski driving is strictly for adults (18+)."
        },
        {
            question: "What is your cancellation policy?",
            answer: "We offer a full refund for cancellations made at least 48 hours prior to the tour start time. Cancellations within 48 hours are non-refundable."
        },
        {
            question: "Do I need prior experience for the ATV or Jet Ski tours?",
            answer: "No prior experience is necessary. Our professional guides provide a full safety briefing and operational instructions before every tour begins."
        },
        {
            question: "What should I bring to the tours?",
            answer: "It depends on the tour, but generally we highly recommend sunscreen, insect repellent, comfortable clothes, closed-toe shoes (for ATV/Zipline), and a swimsuit/towel for water tours."
        },
        {
            question: "Do tours operate if it rains?",
            answer: "Yes, we operate rain or shine. In fact, ATV and Rafting tours are even more fun in the rain! We only cancel in case of extreme weather conditions that compromise safety."
        },
        {
            question: "Do you offer options for large groups or corporate events?",
            answer: "Absolutely! We can organize unforgettable experiences for groups, weddings, or corporate events. Contact us directly for special rates and custom packages."
        }
    ],
    es: [
        {
            question: "¿Con cuánta anticipación debo reservar mi tour?",
            answer: "Recomendamos reservar con al menos 2 o 3 días de anticipación, especialmente durante la temporada alta (diciembre a abril) para asegurar su lugar."
        },
        {
            question: "¿Está incluido el transporte de ida y vuelta?",
            answer: "¡Sí! Muchos de nuestros tours incluyen transporte gratuito desde hoteles en Jacó y Herradura. Por favor revise los detalles específicos del tour elegido."
        },
        {
            question: "¿Los tours son aptos para niños?",
            answer: "La mayoría son ideales para familias, como el Safari de Cocodrilos o Banana Boat. Sin embargo, manejar ATV y Jet Ski es estrictamente para adultos (18+)."
        },
        {
            question: "¿Cuál es su política de cancelación?",
            answer: "Ofrecemos reembolso completo para cancelaciones realizadas al menos 48 horas antes del inicio del tour. Cancelaciones en menos de 48 horas no son reembolsables."
        },
        {
            question: "¿Necesito experiencia previa para los ATV o Jet Ski?",
            answer: "No se requiere experiencia previa. Nuestros guías profesionales brindan una sesión completa de seguridad y manejo antes de iniciar cada recorrido."
        },
        {
            question: "¿Qué debo llevar a los tours?",
            answer: "Depende del tour, pero en general recomendamos: protector solar, repelente de insectos, ropa cómoda, zapatos cerrados (para ATV/Zipline) y traje de baño/toalla para tours acuáticos."
        },
        {
            question: "¿Los tours se realizan si llueve?",
            answer: "Sí, operamos bajo lluvia o sol. De hecho, ¡los tours de ATV y Rafting son aún más divertidos con lluvia! Solo cancelamos en caso de condiciones climáticas extremas que comprometan la seguridad."
        },
        {
            question: "¿Ofrecen opciones para grupos grandes o eventos corporativos?",
            answer: "¡Por supuesto! Podemos organizar experiencias inolvidables para grupos, bodas o eventos corporativos. Contáctenos directamente para tarifas y paquetes especiales."
        }
    ]
};

interface FaqSectionProps {
    faqs?: any[]; // Allow override from props if needed
}

export default function FaqSection({ faqs: wpFaqs }: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const $language = useStore(language);

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

    const fallbackContent = $language === 'en' ? t.en : t.es;

    const bannerTitle = fallbackContent.bannerTitle;
    const bannerSubtitle = fallbackContent.bannerSubtitle;
    const title = fallbackContent.title;
    const subtitle = fallbackContent.subtitle;

    const currentLanguageFaqs = $language === 'en' ? faqs.en : faqs.es;
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
