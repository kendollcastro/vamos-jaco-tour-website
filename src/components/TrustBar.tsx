import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Plane, Map, Shield, Heart, Globe, Compass, Award, ShieldCheck, FileCheck, UserCheck, Star, Lock } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import AnimatedCounter from './AnimatedCounter';

import 'swiper/css';

// Map icon names to Lucide components
const IconMap: Record<string, any> = {
    Plane, Map, Shield, Heart, Globe, Compass, Award, ShieldCheck, FileCheck, UserCheck, Star, Lock
};

interface TrustBarProps {
    items?: any[];
}

export default function TrustBar({ items }: TrustBarProps) {
    const $language = useStore(language);

    const partners = items && items.length > 0 ? items.map((item, i) => ({
        id: item.id || i,
        name: $language === 'es' ? (item as any).name_es || item.name : item.name,
        icon: item.icon && IconMap[item.icon] ? IconMap[item.icon] : Shield,
        color: (item as any).color || 'text-primary',
        image: item.image || null
    })) : [];

    // If no partners, don't render the section to avoid empty space
    if (partners.length === 0) {
        return null;
    }

    return (
        <section className="py-12 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <h3 className="text-center text-gray-400 font-medium tracking-wide text-sm mb-8 px-4 leading-relaxed max-w-3xl mx-auto">
                    {$language === 'en' ? 'YOUR SAFETY IS OUR PRIORITY. WE OPERATE WITH ALL REQUIRED PERMITS, INSURANCE, AND RISK POLICIES IN COSTA RICA.' : 'TU SEGURIDAD ES NUESTRA PRIORIDAD. OPERAMOS CON TODOS LOS PERMISOS, SEGUROS Y PÓLIZAS DE RIESGO DE LEY EN COSTA RICA.'}
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
                            <div className="flex flex-col items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default group py-4 text-center">
                                {partner.image ? (
                                    <img src={partner.image} alt={partner.name} className="h-10 md:h-12 w-auto object-contain group-hover:scale-110 transition-transform" />
                                ) : (
                                    <partner.icon className={`w-10 h-10 md:w-12 md:h-12 ${partner.color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                                )}
                                <span className="text-sm md:text-base font-bold text-gray-300 group-hover:text-white leading-tight">{partner.name}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
