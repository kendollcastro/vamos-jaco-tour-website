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

const teamMembers = [
    {
        id: 1,
        name: "Carlos Rodriguez",
        position: "CEO & Founder",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        id: 2,
        name: "Elena Vargas",
        position: "Tour Operations Manager",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
        social: { linkedin: "#", instagram: "#" }
    },
    {
        id: 3,
        name: "Mateo Silva",
        position: "Lead Adventure Guide",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop",
        social: { twitter: "#", instagram: "#" }
    },
    {
        id: 4,
        name: "Sofia Mendez",
        position: "Customer Experience",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop",
        social: { linkedin: "#" }
    },
    {
        id: 5,
        name: "Alejandro Ruiz",
        position: "Safety Coordinator",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
        social: { linkedin: "#", instagram: "#" }
    }
];

export default function TeamSection() {
    const $language = useStore(language);

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
                        <button className="swiper-button-prev-custom w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button className="swiper-button-next-custom w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
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
                            bulletClass: 'swiper-pagination-bullet bg-gray-300 opacity-100',
                            bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary'
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 3.5 }, // Peeking effect
                        }}
                        className="!pb-16" // Space for pagination
                    >
                        {teamMembers.map((member) => (
                            <SwiperSlide key={member.id} className="h-auto">
                                <div className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-soft cursor-pointer">
                                    {/* Image */}
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Content Box (Floating at bottom like design) */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-dark-soft/90 backdrop-blur-md p-6 rounded-[1.5rem] shadow-lg ring-1 ring-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                        <p className="text-primary font-medium text-sm mb-3">{member.position}</p>

                                        {/* Social Links (Hidden initially, reveal on hover could be cool, but keeping simple for now) */}
                                        <div className="flex gap-3 text-gray-400">
                                            {member.social.linkedin && <Linkedin className="w-4 h-4 hover:text-primary transition-colors hover:scale-110" />}
                                            {member.social.twitter && <Twitter className="w-4 h-4 hover:text-brand-teal transition-colors hover:scale-110" />}
                                            {member.social.instagram && <Instagram className="w-4 h-4 hover:text-brand-orange transition-colors hover:scale-110" />}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Pagination */}
                    <div className="swiper-pagination-custom flex justify-center gap-2 mt-4 md:hidden"></div>
                </div>

            </div>
        </section>
    );
}
