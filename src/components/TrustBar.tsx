import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Plane, Map, Shield, Heart, Globe, Compass } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import AnimatedCounter from './AnimatedCounter';

import 'swiper/css';

export default function TrustBar() {
    const $language = useStore(language);

    const partners = [
        { id: 1, name: 'Traverse', icon: Plane, color: 'text-blue-500' },
        { id: 2, name: 'TripZone', icon: Map, color: 'text-indigo-500' },
        { id: 3, name: 'Borcelle', icon: Heart, color: 'text-red-500' },
        { id: 4, name: 'GoTrip', icon: Globe, color: 'text-primary' },
        { id: 5, name: 'Travel', icon: Compass, color: 'text-primary' },
        { id: 6, name: 'G-Glo', icon: Shield, color: 'text-green-500' },
    ];

    return (
        <section className="py-12 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <h3 className="text-center text-gray-400 font-medium tracking-wide uppercase text-sm mb-8">
                    {$language === 'en' ? 'Those Companies You Can Easily Trust!' : '¡Compañías en las que puedes confiar!'}
                </h3>

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={2}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                        },
                        768: {
                            slidesPerView: 4,
                        },
                        1024: {
                            slidesPerView: 5,
                        },
                    }}
                    className="w-full"
                >
                    {partners.map((partner) => (
                        <SwiperSlide key={partner.id}>
                            <div className="flex items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default group py-2">
                                <partner.icon className={`w-8 h-8 ${partner.color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                                <span className="text-xl font-bold text-gray-300 group-hover:text-white">{partner.name}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
