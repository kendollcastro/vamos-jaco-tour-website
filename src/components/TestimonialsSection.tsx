import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useStore } from '@nanostores/react';
import { language } from '../store';

const testimonials = [
    {
        id: 1,
        name: "James Bonde",
        role: "Vamos Jacó Traveler",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop",
        quote: "The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!",
        rating: 5
    },
    {
        id: 2,
        name: "Michael D Linda",
        role: "Vamos Jacó Traveler",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop",
        quote: "An absolute dream come true. The zip-lining tour was exhilarating and safely managed. The team at Vamos Jacó knows exactly how to create unforgettable moments.",
        rating: 5
    },
    {
        id: 3,
        name: "Amber Lashley",
        role: "Vamos Jacó Traveler",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop",
        quote: "Traveling with kids can be stressful, but Vamos Jacó made it a breeze. They found family-friendly activities that we all enjoyed. We will definitely be coming back!",
        rating: 5
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "Solo Traveler",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
        quote: "As a solo traveler, I felt safe and welcomed. The guides were friendly and very knowledgeable. It was the perfect mix of relaxation and adventure.",
        rating: 5
    },
    {
        id: 5,
        name: "David Wilson",
        role: "Nature Lover",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop",
        quote: "The wildlife tours were incredible. Seeing monkeys and sloths in their natural habitat was a highlight. Thank you for an amazing value experience.",
        rating: 5
    }
];

export default function TestimonialsSection() {
    const $language = useStore(language);

    const t = {
        en: {
            title: "Hear It from Travelers",
            subtitle: "We go beyond just booking trips—we create unforgettable travel experiences that match your dreams!",
            avg: "Average Experience",
            reviews: "Reviews"
        },
        es: {
            title: "Escúchalo de los Viajeros",
            subtitle: "Vamos más allá de solo reservar viajes: ¡creamos experiencias de viaje inolvidables que coinciden con tus sueños!",
            avg: "Experiencia Promedio",
            reviews: "Reseñas"
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Grid Pattern (simulated) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {content.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        {content.subtitle}
                    </p>
                </div>

                {/* Carousel */}
                <div className="mb-20">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.testi-prev',
                            nextEl: '.testi-next',
                        }}
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="!pb-4"
                    >
                        {testimonials.map((item) => (
                            <SwiperSlide key={item.id} className="h-auto">
                                <div className="bg-dark-soft p-8 rounded-[2rem] h-full flex flex-col shadow-sm ring-1 ring-white/10 hover:ring-white/20 transition-all">
                                    {/* Rating */}
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="bg-[#00B67A] p-[2px] rounded-[2px] mr-[1px]">
                                                <Star className="w-3 h-3 text-white fill-current" />
                                            </div>
                                        ))}
                                    </div>
                                    <h4 className="font-bold text-white text-sm mb-4">{content.avg}</h4>

                                    {/* Quote */}
                                    <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                                        "{item.quote}"
                                    </p>

                                    {/* User Info */}
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-white">{item.name}</h5>
                                            <p className="text-xs text-gray-400">{item.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Footer Bar: Ratings & Navigation */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/10">

                    {/* Trustpilot (Left) */}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-white">4.5</span>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <Star className="w-5 h-5 text-[#00B67A] fill-current" />
                                <span className="font-bold text-white text-sm">Trustpilot</span>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-[#00B67A] p-[2px] rounded-[1px]">
                                        <Star className="w-2.5 h-2.5 text-white fill-current" />
                                    </div>
                                ))}
                                <span className="text-xs text-gray-400 ml-1">{content.reviews}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons (Center) */}
                    <div className="flex gap-4">
                        <button className="testi-prev w-12 h-12 rounded-full bg-dark-soft shadow-soft ring-1 ring-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="testi-next w-12 h-12 rounded-full bg-dark-soft shadow-soft ring-1 ring-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tripadvisor (Right) */}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-white">4.5</span>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <div className="w-5 h-5 bg-[#34E0A1] rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-black rounded-full" />
                                    {/* Simple approximation of tripadvisor eye/owl */}
                                </div>
                                <span className="font-bold text-white text-sm">Tripadvisor</span>
                            </div>
                            <div className="flex gap-0.5 items-center">
                                <span className="text-xs text-gray-400 mr-1">{content.reviews}</span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === 4 ? 'border border-[#34E0A1]' : 'bg-[#34E0A1]'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
