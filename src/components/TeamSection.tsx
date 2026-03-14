import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Correct import for Swiper v12 might be slightly different depending on setup, but usually modules are correct. If v12 issues, will check. 
// Actually v12 usually imports from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

interface TeamMember {
    id: number | string;
    name: string;
    position?: string;
    position_en?: string;
    position_es?: string;
    image: string;
    social: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
    };
}

const fallbackTeamMembers: TeamMember[] = [
    {
        id: 1,
        name: "Carlos Rodríguez",
        position_en: "CEO & Founder",
        position_es: "CEO y Fundador",
        position: "CEO & Founder",
        image: "/images/team/carlos-rodriguez.png",
        social: { instagram: "https://www.instagram.com/vamosjacotours" }
    },
    {
        id: 2,
        name: "María Fernández",
        position_en: "Tour Operations Manager",
        position_es: "Gerente de Operaciones",
        position: "Tour Operations Manager",
        image: "/images/team/maria-fernandez.png",
        social: { instagram: "https://www.instagram.com/vamosjacotours" }
    },
    {
        id: 3,
        name: "José Herrera",
        position_en: "Lead Adventure Guide",
        position_es: "Guía de Aventura Principal",
        position: "Lead Adventure Guide",
        image: "/images/team/jose-herrera.png",
        social: { instagram: "https://www.instagram.com/vamosjacotours" }
    },
    {
        id: 4,
        name: "Andrea Mora",
        position_en: "Customer Experience",
        position_es: "Experiencia del Cliente",
        position: "Customer Experience",
        image: "/images/team/andrea-mora.png",
        social: { instagram: "https://www.instagram.com/vamosjacotours" }
    },
];

interface TeamProps {
    members?: TeamMember[];
}

export default function TeamSection({ members }: TeamProps) {
    const $language = useStore(language);

    const displayMembers = members && members.length > 0 ? members : fallbackTeamMembers;

    const t = {
        en: {
            tagline: "Our Guides",
            title: "Meet our team",
            description: "Dedicated professionals passionate about sharing the best of Costa Rica with you.",
        },
        es: {
            tagline: "Nuestros Guías",
            title: "Conoce al equipo",
            description: "Profesionales dedicados y apasionados por compartir lo mejor de Costa Rica contigo.",
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                    <div className="max-w-xl">
                        <span className="text-primary font-bold uppercase tracking-wider text-sm block mb-2">
                            {content.tagline}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {content.title}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {content.description}
                        </p>
                    </div>

                    {/* Navigation Buttons (Desktop) */}
                    <div className="hidden md:flex gap-4">
                        <button 
                            className="swiper-button-prev-custom w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                            aria-label={$language === 'en' ? "Previous slide" : "Diapositiva anterior"}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            className="swiper-button-next-custom w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                            aria-label={$language === 'en' ? "Next slide" : "Siguiente diapositiva"}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Slider */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination-custom',
                            renderBullet: function (index, className) {
                                return '<span class="' + className + ' ring-1 ring-white/50"></span>';
                            }
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 3.5 }, // Peeking effect
                        }}
                        className="!pb-16" // Space for pagination
                    >
                        {displayMembers.map((member) => {
                            // Determine bilingual position
                            const displayPosition = $language === 'en'
                                ? (member.position_en || member.position)
                                : (member.position_es || member.position);

                            return (
                                <SwiperSlide key={member.id} className="h-auto">
                                    <div className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-soft cursor-pointer">
                                        {/* Image */}
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Content Box (Floating at bottom like design) */}
                                        <div className="absolute bottom-4 left-4 right-4 bg-dark-soft/90 backdrop-blur-md p-6 rounded-[1.5rem] shadow-lg ring-1 ring-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                            <p className="text-primary font-medium text-sm mb-3">{displayPosition}</p>

                                            {/* Social Links */}
                                            <div className="flex gap-3 text-gray-400">
                                                {member.social?.linkedin && <Linkedin className="w-4 h-4 hover:text-primary transition-colors hover:scale-110" />}
                                                {member.social?.twitter && <Twitter className="w-4 h-4 hover:text-brand-teal transition-colors hover:scale-110" />}
                                                {member.social?.instagram && <Instagram className="w-4 h-4 hover:text-brand-orange transition-colors hover:scale-110" />}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Mobile Pagination */}
                    <div className="swiper-pagination-custom flex justify-center gap-2 mt-4 md:hidden"></div>
                </div>

            </div>
        </section>
    );
}
