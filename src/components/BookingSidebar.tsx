import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useStore } from '@nanostores/react';
import { bookingStore, setBookingDate, setBookingTime, setGuests, setBookingTour } from '../store/booking';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import TranslatedText from './TranslatedText';

interface PricingOption {
    duration: string;
    price: number;
    variation_id?: number;
}

interface BookingSidebarProps {
    tourId: string;
    tourTitle: string;
    price: number;
    durationOptions?: PricingOption[];
}

export default function BookingSidebar({ tourId, tourTitle, price, durationOptions }: BookingSidebarProps) {
    const $booking = useStore(bookingStore);
    const [selectedDurationIdx, setSelectedDurationIdx] = useState(0);

    const rawOptions = durationOptions && durationOptions.length > 0
        ? durationOptions
        : [{ duration: "Standard Tour", price: price || 0 }];

    const packages = useMemo(() => {
        const pkgMap = new Map<string, { duration: string; adultPrice: number; childPrice: number; variation_id?: number }>();

        rawOptions.forEach(opt => {
            const rawName = opt.duration;
            let baseName = rawName;
            let isChild = false;

            if (baseName.toLowerCase().includes('child') || baseName.toLowerCase().includes('niño')) {
                isChild = true;
                baseName = baseName.replace(/\s*-\s*child.*$/i, '').replace(/\s*-\s*niño.*$/i, '').replace(/\s*niños.*$/i, '').replace(/\([-+a-z0-9\s]*\)/i, '').trim();
            } else if (baseName.toLowerCase().includes('adult') || baseName.toLowerCase().includes('adulto')) {
                baseName = baseName.replace(/\s*-\s*adult.*$/i, '').replace(/\s*-\s*adulto.*/i, '').trim();
            }

            // Cleanup trailing hyphens/spaces
            baseName = baseName.replace(/[-\s]+$/, '');

            if (!pkgMap.has(baseName)) {
                pkgMap.set(baseName, { duration: baseName, adultPrice: opt.price, childPrice: 0, variation_id: opt.variation_id });
            }

            const pkg = pkgMap.get(baseName)!;
            if (isChild) {
                pkg.childPrice = opt.price;
            } else {
                pkg.adultPrice = opt.price;
                if (opt.variation_id) pkg.variation_id = opt.variation_id;
            }
        });

        return Array.from(pkgMap.values());
    }, [rawOptions]);

    // Initialize store with tour details on mount
    useEffect(() => {
        if (packages && packages.length > 0) {
            setBookingTour(tourId, tourTitle, packages[0].adultPrice, packages[0].childPrice);
        }
    }, [tourId, tourTitle, price, packages]);

    const handleDurationChange = (index: number) => {
        setSelectedDurationIdx(index);
        // Update store with new price
        setBookingTour(tourId, tourTitle, packages[index].adultPrice, packages[index].childPrice);
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setBookingDate(date);
        }
    };

    const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 1;
        setGuests(val, $booking.children);
    };

    const totalPrice = $booking.totalPrice;

    return (
        <div className="bg-dark/60 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden sticky top-28 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-brand-orange/20 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <TranslatedText content={{en: "Book Your Adventure", es: "Reserva tu Aventura"}} />
                </h3>
            </div>

            <div className="p-6 space-y-6">
                {/* Duration Selection */}
                <div className="space-y-3">
                    <label className="text-sm text-gray-400 font-medium uppercase tracking-wider"><TranslatedText content={{en: "Select Duration", es: "Seleccionar Duración"}} /></label>
                    <div className="space-y-2">
                        {packages.map((pkg, index) => (
                            <div
                                key={index}
                                onClick={() => handleDurationChange(index)}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedDurationIdx === index
                                    ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/30'
                                    : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <span className={`text-sm font-medium ${selectedDurationIdx === index ? 'text-white' : 'text-gray-400'}`}>
                                    {pkg.duration}
                                </span>
                                <span className={`font-bold ${selectedDurationIdx === index ? 'text-white' : 'text-gray-400'}`}>
                                    ${pkg.adultPrice} {pkg.childPrice > 0 ? <span className="text-xs font-normal opacity-75 ml-1">(Child: ${pkg.childPrice})</span> : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date Picker */}
                <div className="space-y-3">
                    <label className="text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> <TranslatedText content={{en: "Date", es: "Fecha"}} />
                    </label>
                    <div className="relative">
                        <DatePicker
                            selected={$booking.date ? new Date($booking.date) : null}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            placeholderText="Select a date"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shadow-inner"
                            wrapperClassName="w-full"
                        />
                    </div>
                </div>

                {/* Guests */}
                <div className="space-y-3">
                    <label className="text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4" /> <TranslatedText content={{en: "Guests", es: "Huéspedes"}} />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500"><TranslatedText content={{en: "Adults", es: "Adultos"}} /></span>
                            <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-1 shadow-inner text-white">
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={$booking.adults}
                                    onChange={(e) => setGuests(parseInt(e.target.value) || 1, $booking.children)}
                                    className="w-full bg-transparent font-bold py-2 focus:outline-none"
                                />
                            </div>
                        </div>

                        {packages[selectedDurationIdx]?.childPrice > 0 && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500"><TranslatedText content={{en: "Children", es: "Niños"}} /></span>
                                <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-1 shadow-inner text-white">
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        value={$booking.children}
                                        onChange={(e) => setGuests($booking.adults, parseInt(e.target.value) || 0)}
                                        className="w-full bg-transparent font-bold py-2 focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Total & CTA */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-400 text-sm"><TranslatedText content={{en: "Total Price", es: "Precio Total"}} /></span>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white block leading-none">
                                ${totalPrice > 0 ? totalPrice : (packages[selectedDurationIdx] ? packages[selectedDurationIdx].adultPrice : price)}
                            </span>
                            <span className="text-xs text-brand-orange font-medium"><TranslatedText content={{en: "Best Price Guaranteed", es: "Mejor Precio Garantizado"}} /></span>
                        </div>
                    </div>

                    <a
                        href={`/checkout?product_id=${tourId}&variation_id=${packages[selectedDurationIdx]?.variation_id || ''}&date=${$booking.date || ''}&adults=${$booking.adults}&children=${$booking.children}`}
                        className={`w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/20 ${!$booking.date ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    >
                        <TranslatedText content={{en: "Proceed to Checkout", es: "Proceder al Pago"}} />
                        <CheckCircle className="w-5 h-5" />
                    </a>

                    {!$booking.date && (
                        <p className="text-center text-xs text-red-400/80"><TranslatedText content={{en: "Please select a date to continue", es: "Por favor selecciona una fecha para continuar"}} /></p>
                    )}

                    <div className="flex items-center justify-center gap-2 pt-1 pb-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                        </span>
                        <p className="text-xs text-gray-400 font-medium">
                            <span className="text-white"><TranslatedText content={{en: "Hot tour!", es: "¡Tour Popular!"}} /></span> 14 <TranslatedText content={{en: "people viewed this today", es: "personas vieron esto hoy"}} />
                        </p>
                    </div>

                    <p className="text-center text-xs text-gray-500">
                        <TranslatedText content={{en: "Instant confirmation • Secure Payment", es: "Confirmación instantánea • Pago seguro"}} />
                    </p>
                </div>
            </div>
        </div>
    );
}
