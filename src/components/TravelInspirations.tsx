import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { MapPin, Calendar, ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

const inspirations = [
    {
        id: 1,
        location: "Jacó, Costa Rica",
        title: "Tropical Escapes & Beach Getaways.",
        date: "12 Sep, 2025",
        description: "Escape to the World's Most Breathtaking Islands and immerse yourself in paradise.",
        image: "https://images.unsplash.com/photo-1540206395-688085723adb?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 2,
        location: "Manuel Antonio, Costa Rica",
        title: "Crystal-Clear Waters & White Sands.",
        date: "12 Sep, 2025",
        description: "Escape to the World's Most Breathtaking Islands and immerse yourself in paradise.",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 3,
        location: "Tortuga Island, Costa Rica",
        title: "Hidden Gems of the Pacific Coast.",
        date: "15 Oct, 2025",
        description: "Discover secluded beaches and vibrant marine life in this unforgettable journey.",
        image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 4,
        location: "Monteverde, Costa Rica",
        title: "Cloud Forests & Canopy Tours.",
        date: "20 Nov, 2025",
        description: "Experience the magic of the cloud forest from high above in the canopy.",
        image: "https://images.unsplash.com/photo-1621262609935-4303498f3957?q=80&w=2574&auto=format&fit=crop"
    }
];

export default function TravelInspirations() {
    const $language = useStore(language);

    const t = {
        en: {
            title: "Travel Inspirations",
            subtitle: "A curated list of inspiration the most tour & travel based on different destinations.",
            viewAll: "View All Inspiration"
        },
        es: {
            title: "Inspiraciones de Viaje",
            subtitle: "Una lista curada de inspiración de los mejores tours y viajes basados en diferentes destinos.",
            viewAll: "Ver Toda la Inspiración"
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {content.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg max-w-2xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                {/* Slider Container with Navigation Arrows */}
                <div className="relative group">

                    {/* Navigation Buttons (Absolute Positioned) */}
                    <button className="insp-prev absolute top-1/2 -translate-y-1/2 -left-4 md:-left-8 z-20 w-12 h-12 bg-dark-soft rounded-full shadow-lg ring-1 ring-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:ring-primary transition-all duration-300">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button className="insp-next absolute top-1/2 -translate-y-1/2 -right-4 md:-right-8 z-20 w-12 h-12 bg-dark-soft rounded-full shadow-lg ring-1 ring-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:ring-primary transition-all duration-300">
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.insp-prev',
                            nextEl: '.insp-next',
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            768: { slidesPerView: 1 },
                            1024: { slidesPerView: 2 },
                        }}
                        className="!px-1 !py-4"
                    >
                        {inspirations.map((item) => (
                            <SwiperSlide key={item.id} className="h-auto">
                                <div className="bg-dark-soft ring-1 ring-white/10 rounded-[2rem] overflow-hidden flex flex-col sm:flex-row h-full hover:ring-white/20 transition-all duration-300 group/card">
                                    {/* Image Side */}
                                    <div className="w-full sm:w-1/2 h-64 sm:h-auto overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover/card:bg-transparent transition-colors duration-300"></div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col">
                                        {/* Location */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                <MapPin className="w-3 h-3 text-brand-teal" />
                                            </div>
                                            <span className="text-sm font-bold text-white">{item.location}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight group-hover/card:text-primary transition-colors">
                                            {item.title}
                                        </h3>

                                        {/* Date/Meta */}
                                        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-6">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-400">{item.date}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-white/20 font-bold text-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group">
                        {content.viewAll}
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                </div>

            </div>
        </section>
    );
}
