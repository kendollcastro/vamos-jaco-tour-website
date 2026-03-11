import React from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { MapPin, Clock, ArrowUpRight, Info, CircleCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface TourCardProps {
    id?: string;
    title: { en: string; es: string } | string;
    price: number;
    originalPrice?: number;
    image_url: string;
    location: string;
    duration: string;
    badge?: {
        text: string;
        color: 'yellow' | 'red' | 'green';
    };
}

export default function TourCard({ id, title, price, originalPrice, image_url, location, duration, badge }: TourCardProps) {
    const $language = useStore(language);

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to get text based on language or fallback to string
    const getText = (content: { en: string; es: string } | string) => {
        if (!mounted) return typeof content === 'string' ? content : content.en; // Default to English during SSR to match server
        if (typeof content === 'string') return content;
        return content[$language] || content.en;
    };

    const currentTitle = getText(title);
    const bookText = $language === 'en' ? 'Book Now' : 'Reservar';
    const startingFromText = $language === 'en' ? 'Starting From' : 'Desde';
    const experienceText = $language === 'en' ? 'Experience' : 'Experiencia';
    const inclusionText = $language === 'en' ? 'Inclusion' : 'Incluye';

    const getBadgeColor = (color: string) => {
        switch (color) {
            case 'yellow': return 'bg-yellow-400 text-gray-900';
            case 'red': return 'bg-red-500 text-white';
            case 'green': return 'bg-green-500 text-white';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    const CardWrapper = ({ children }: { children: React.ReactNode }) => {
        if (id) {
            return <a href={`/tours/${id}`} className="block h-full">{children}</a>;
        }
        return <>{children}</>;
    };

    return (
        <CardWrapper>
            <div className="group bg-dark-soft rounded-[20px] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border-none ring-1 ring-white/10 hover:ring-primary/30">

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden p-3 pb-0">
                    <div className="relative h-full w-full rounded-[15px] overflow-hidden">
                        <img
                            src={image_url}
                            alt={currentTitle}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Badge */}
                        {badge && (
                            <div className={clsx(
                                "absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide z-10",
                                getBadgeColor(badge.color)
                            )}>
                                {badge.text}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 py-5 flex flex-col flex-grow">

                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {currentTitle}
                    </h3>

                    {/* Meta Row */}
                    <div className="flex items-center gap-3 text-gray-400 text-xs mb-4">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span>{location}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{duration}</span>
                        </div>
                    </div>

                    {/* Price and Action Row */}
                    <div className="flex items-end justify-between mb-4 mt-auto">
                        <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-primary/30">
                            {bookText}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 font-medium mb-0.5">{startingFromText}</p>
                            <div className="flex items-center justify-end gap-1.5">
                                {originalPrice && (
                                    <span className="text-xs text-gray-400 line-through decoration-gray-400">
                                        ${originalPrice.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-xl font-bold text-white">
                                    ${price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="border-t border-white/10 pt-3 flex items-center gap-4">
                        <button className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-primary transition-colors">
                            <Info className="w-3 h-3" />
                            {experienceText}
                        </button>
                        <button className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-primary transition-colors">
                            <CircleCheck className="w-3 h-3" />
                            {inclusionText}
                        </button>
                    </div>

                </div>
            </div>
        </CardWrapper>
    );
}
