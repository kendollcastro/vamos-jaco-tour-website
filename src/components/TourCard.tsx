import React from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { MapPin, Clock, ArrowUpRight, Info, CircleCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface TourCardProps {
    id: string; // The UUID
    slug: string; // The URL identifier
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

export default function TourCard({ id, slug, title, price, originalPrice, image_url, location, duration, badge }: TourCardProps) {
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
        return <a href={`/tours/${slug}`} className="block h-full">{children}</a>;
    };

    return (
        <CardWrapper>
            <div className="group bg-dark-soft rounded-[25px] overflow-hidden shadow-premium hover:shadow-2xl hover:scale-[1.02] transition-premium h-full flex flex-col border border-white/5 hover:border-primary/30 relative">

                {/* Image Container */}
                <div className="relative h-52 md:h-64 overflow-hidden p-2 md:p-3 pb-0">
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
                <div className="px-6 py-5 flex flex-col flex-grow">

                    <h3 className="text-xl font-heading font-bold text-white mb-2 line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors">
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
                        <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-premium shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-95">
                            {bookText}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="text-right">
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">{startingFromText}</p>
                            <div className="flex items-center justify-end gap-1.5">
                                {originalPrice && (
                                    <span className="text-xs text-gray-400 line-through decoration-gray-400">
                                        ${originalPrice.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-2xl font-heading font-black text-white">
                                    ${price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="border-t border-white/10 pt-4 mt-2 flex items-center gap-5">
                        <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-premium uppercase tracking-wider">
                            <Info className="w-3.5 h-3.5" />
                            {experienceText}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-premium uppercase tracking-wider">
                            <CircleCheck className="w-3.5 h-3.5" />
                            {inclusionText}
                        </button>
                    </div>

                </div>
            </div>
        </CardWrapper>
    );
}
