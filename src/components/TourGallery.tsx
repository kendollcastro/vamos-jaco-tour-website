import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

import './TourGallery.css'; // Custom styles for navigation buttons

interface TourGalleryProps {
    images: string[];
    title: string;
}

export default function TourGallery({ images, title }: TourGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-4 select-none">
            {/* Main Slider */}
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                } as React.CSSProperties}
                spaceBetween={10}
                navigation={true}
                effect={'fade'}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay, EffectFade]}
                className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img}
                            alt={`${title} - Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail Slider */}
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={Math.min(images.length, 4)}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper h-24 rounded-xl overflow-hidden mt-4"
                breakpoints={{
                    640: {
                        slidesPerView: Math.min(images.length, 5),
                    },
                    768: {
                        slidesPerView: Math.min(images.length, 6),
                    }
                }}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index} className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300">
                        <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-transparent hover:border-brand-orange transition-all"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
