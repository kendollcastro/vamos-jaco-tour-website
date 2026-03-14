import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { MapPin, Calendar, ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

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

    const fallbackContent = $language === 'en' ? t.en : t.es;

    const title = fallbackContent.title;
    const subtitle = fallbackContent.subtitle;
    const viewAllBtn = fallbackContent.viewAll;

    const inspirationsList = [
        {
            id: 1,
            location: "Herradura Coast, Costa Rica",
            title: "Catch the Perfect Wave.",
            date: "Daily Classes",
            description: "Master the art of surfing with our professional instructors in some of the most consistent and beginner-friendly waves in the world.",
            image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2670&auto=format&fit=crop"
        },
        {
            id: 2,
            location: "Jaco Rain Forest, Costa Rica",
            title: "Canopy Zipline Adventure.",
            date: "Year-Round",
            description: "Soar through the treetops of the dense Costa Rican jungle and experience the vibrant wildlife from a bird's eye perspective.",
            image: "https://images.unsplash.com/photo-1621262609935-4303498f3957?q=80&w=2574&auto=format&fit=crop"
        },
        {
            id: 3,
            location: "Savegre River, Costa Rica",
            title: "Whitewater Rafting Thrills.",
            date: "Wet Season Special",
            description: "Navigate exhilarating rapids surrounded by pristine rainforest. A perfect mix of adrenaline and breathtaking natural scenery.",
            image: "https://images.unsplash.com/photo-1530866495561-507c9faab9ed?q=80&w=2576&auto=format&fit=crop"
        },
        {
            id: 4,
            location: "Tarcoles, Costa Rica",
            title: "Mangrove & Crocodile Safari.",
            date: "Daily Tours",
            description: "Explore the complex mangrove ecosystems and get up close with massive American Crocodiles in their natural habitat.",
            image: "https://images.unsplash.com/photo-1549479366-a320bed9e52e?q=80&w=2670&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg max-w-2xl mx-auto">
                        {subtitle}
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
                        {inspirationsList.map((item) => (
                            <SwiperSlide key={item.id} className="h-auto">
                                <div className="bg-dark-soft ring-1 ring-white/10 rounded-[2rem] overflow-hidden flex flex-col sm:flex-row h-full hover:ring-white/20 transition-all duration-300 group/card">
                                    {/* Image Side */}
                                    <div className="w-full sm:w-1/2 h-64 sm:h-auto overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            loading="lazy"
                                            decoding="async"
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
                        {viewAllBtn}
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                </div>

            </div>
        </section>
    );
}
