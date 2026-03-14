'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { X, Images } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TourGalleryBentoProps {
    images: string[];
    title: string;
}

export default function TourGalleryBento({ images, title }: TourGalleryBentoProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => {
        setInitialSlide(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    // Bento Grid Layout Strategy
    const renderGrid = () => {
        if (images.length === 1) {
            return (
                <div
                    className="w-full h-[350px] md:h-[500px] rounded-[25px] overflow-hidden cursor-pointer shadow-lg relative group"
                    onClick={() => openLightbox(0)}
                >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                    <img src={images[0]} alt={`${title} 1`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
            );
        }

        if (images.length === 2) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full h-[400px] md:h-[500px] rounded-[25px] overflow-hidden shadow-lg">
                    {images.map((img, i) => (
                        <div key={i} className="w-full h-full cursor-pointer relative overflow-hidden group" onClick={() => openLightbox(i)}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                            <img src={img} alt={`${title} ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            );
        }

        // 3 or more images: 1 large left, up to 4 small grid right (Bento styling)
        const rightImages = images.slice(1, 5);
        const hasMore = images.length > 5;

        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full h-[450px] md:h-[500px] rounded-[25px] overflow-hidden shadow-lg">
                {/* Large Left Image (takes 2 columns out of 4 on md) */}
                <div
                    className="md:col-span-2 w-full h-full cursor-pointer relative overflow-hidden group min-h-[250px]"
                    onClick={() => openLightbox(0)}
                >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                    <img src={images[0]} alt={`${title} 1`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>

                {/* Right Images (take remaining 2 columns) */}
                <div className={`md:col-span-2 grid ${rightImages.length > 2 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1 grid-rows-2'} gap-3 h-full hidden md:grid`}>
                    {rightImages.map((img, i) => {
                        const actualIndex = i + 1;
                        const isLast = i === rightImages.length - 1;

                        return (
                            <div
                                key={i}
                                className="w-full h-full relative cursor-pointer overflow-hidden group"
                                onClick={() => openLightbox(actualIndex)}
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                <img src={img} alt={`${title} ${actualIndex + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                                {isLast && hasMore && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 transition-colors hover:bg-black/50">
                                        <div className="text-center">
                                            <Images className="w-8 h-8 mx-auto text-white mb-2 opacity-80" />
                                            <span className="text-white font-bold text-lg tracking-wide">+{images.length - 5}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mobile 'More' badge */}
                {images.length > 1 && (
                    <div
                        className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full md:hidden z-20 flex items-center gap-2 cursor-pointer shadow-xl"
                        onClick={() => openLightbox(1)}
                    >
                        <Images className="w-4 h-4" /> View {images.length} Photos
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mb-10 animate-fade-in-up">
            {renderGrid()}

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 z-[110] bg-white/10 p-3 rounded-full backdrop-blur-md transition-all border border-white/10"
                        onClick={closeLightbox}
                        aria-label="Close Gallery"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="w-full h-full max-w-6xl p-4 md:p-12 flex items-center justify-center">
                        <Swiper
                            initialSlide={initialSlide}
                            navigation={true}
                            pagination={{
                                type: 'fraction',
                                el: '.custom-pagination',
                            }}
                            keyboard={{ enabled: true }}
                            modules={[Navigation, Pagination, Keyboard]}
                            className="w-full h-full"
                        >
                            {images.map((img, index) => (
                                <SwiperSlide key={index} className="flex items-center justify-center p-4">
                                    <img
                                        src={img}
                                        alt={`${title} - Photo ${index + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl select-none"
                                    />
                                </SwiperSlide>
                            ))}
                            <div className="custom-pagination absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm z-10 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 w-auto text-center" />
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
}
