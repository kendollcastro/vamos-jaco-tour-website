import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { bookingStore, setBookingDate, setBookingTime, setGuests, setBookingTour, setVehicleBooking } from '../store/booking';
import { Calendar, Users, Clock, CheckCircle, Info, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { language } from '../store';
import { supabase } from '../lib/supabase';
import { fetchBlockedRanges, isDateBlocked, nextBlockedRange, localDateISO, type BlockedRange } from '../lib/blocked-dates';
import TranslatedText from './TranslatedText';

interface PricingOption {
    duration: string;
    price: number;
    variation_id?: number;
}

interface BookingSidebarProps {
    tourId: string;
    tourSlug: string;
    tourTitle: string;
    price: number;
    durationOptions?: PricingOption[];
}

export default function BookingSidebar({ tourId, tourSlug, tourTitle, price, durationOptions }: BookingSidebarProps) {
    const $booking = useStore(bookingStore);
    const $language = useStore(language);
    const [selectedDurationIdx, setSelectedDurationIdx] = useState(0);
    const [durationOpen, setDurationOpen] = useState(false);
    const [DatePickerComp, setDatePickerComp] = useState<any>(null);
    const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([]);

    useEffect(() => {
        import('react-datepicker').then(mod => {
            import('react-datepicker/dist/react-datepicker.css');
            setDatePickerComp(() => mod.default);
        }).catch(e => console.error('Failed to load react-datepicker:', e));
    }, []);

    // Closures (vacations, holidays) — days inside a range cannot be selected
    useEffect(() => {
        fetchBlockedRanges(supabase).then(setBlockedRanges);
    }, []);

    const upcomingBlock = nextBlockedRange(blockedRanges);

    const formatDateRange = (r: BlockedRange) => {
        const locale = $language === 'es' ? 'es-ES' : 'en-US';
        const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const start = new Date(r.start_date + 'T12:00:00').toLocaleDateString(locale, opts);
        const end = new Date(r.end_date + 'T12:00:00').toLocaleDateString(locale, opts);
        return start === end ? start : `${start} → ${end}`;
    };

    const rawOptions = durationOptions && durationOptions.length > 0
        ? durationOptions
        : [{ duration: "Standard Tour", price: price || 0 }];

    // Extract duration in hours from duration string
    const extractHours = (durationStr: string): number => {
        const match = durationStr.match(/(\d+)\s*(hour|hr|hora)/i);
        return match ? parseInt(match[1]) : 2; // Default 2 hours if not found
    };

    const packages = useMemo(() => {
        const pkgMap = new Map<string, { duration: string; adultPrice: number; childPrice: number; variation_id?: number; hours: number }>();

        rawOptions.forEach(opt => {
            const rawName = opt.duration;
            let baseName = rawName;
            let isChild = false;
            const hours = extractHours(rawName);

            if (baseName.toLowerCase().includes('child') || baseName.toLowerCase().includes('niño')) {
                isChild = true;
                baseName = baseName.replace(/\s*-\s*child.*$/i, '').replace(/\s*-\s*niño.*$/i, '').replace(/\s*niños.*$/i, '').replace(/\([-+a-z0-9\s]*\)/i, '').trim();
            } else if (baseName.toLowerCase().includes('adult') || baseName.toLowerCase().includes('adulto')) {
                baseName = baseName.replace(/\s*-\s*adult.*$/i, '').replace(/\s*-\s*adulto.*/i, '').trim();
            }

            baseName = baseName.replace(/[-\s]+$/, '');

            if (!pkgMap.has(baseName)) {
                pkgMap.set(baseName, { duration: baseName, adultPrice: opt.price, childPrice: 0, variation_id: opt.variation_id, hours });
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

    // Get available times based on selected duration
    const getAvailableTimes = () => {
        const tourHours = packages[selectedDurationIdx]?.hours || 2;
        const startHour = 8; // 8 AM
        const endHour = 17; // 5 PM
        const times: string[] = [];
        
        for (let h = startHour; h <= endHour - tourHours; h++) {
            times.push(`${h.toString().padStart(2, '0')}:00`);
        }
        
        return times;
    };

    const availableTimes = getAvailableTimes();

    // Check if tour duration exceeds closing time
    const selectedHours = packages[selectedDurationIdx]?.hours || 2;
    const maxStartHour = 17 - selectedHours;
    const isTimeUnavailable = availableTimes.length === 0;

    useEffect(() => {
        if (packages && packages.length > 0) {
            setBookingTour(tourId, tourSlug, tourTitle, packages[0].adultPrice, packages[0].childPrice, packages[0].variation_id, packages[0].duration);
        }
    }, [tourId, tourSlug, tourTitle, price, packages]);

    const handleDurationChange = (index: number) => {
        setSelectedDurationIdx(index);
        setBookingTour(tourId, tourSlug, tourTitle, packages[index].adultPrice, packages[index].childPrice, packages[index].variation_id, packages[index].duration);
        
        // Clear selected time if it's no longer available with new duration
        const newAvailableTimes = getAvailableTimesForDuration(index);
        if ($booking.time && !newAvailableTimes.includes($booking.time)) {
            setBookingTime(null);
        }
    };

    // Get available times for a specific duration index
    const getAvailableTimesForDuration = (durationIdx: number) => {
        const tourHours = packages[durationIdx]?.hours || 2;
        const startHour = 8;
        const endHour = 17;
        const times: string[] = [];
        
        for (let h = startHour; h <= endHour - tourHours; h++) {
            times.push(`${h.toString().padStart(2, '0')}:00`);
        }
        
        return times;
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setBookingDate(date);
        }
    };

    const totalPrice = $booking.totalPrice;

    // Vehicle tours: linked steppers — machines on one side, total people on the other.
    // NOTE: `tourId` may be a Supabase UUID; detection must use the slug.
    const vSlug = tourSlug || tourId;
    const isVehicle = ['side-by-side-tour', 'jet-ski-tour', 'jaco-atv-adventure'].includes(vSlug);
    const isJetSki = vSlug === 'jet-ski-tour';
    const isBuggy = vSlug === 'side-by-side-tour';
    const isAtv = vSlug === 'jaco-atv-adventure';
    const vehicleCfg = isBuggy
        ? { maxPerUnit: 4, includedPerUnit: 2 }
        : isJetSki
            ? { maxPerUnit: 2, includedPerUnit: 1 }
            : { maxPerUnit: 1, includedPerUnit: 1 };
    const totalPeople = $booking.adults + $booking.extraPassengers;

    // Each stepper is independent — no auto-copying in either direction.
    // Only hard rule: people cannot exceed machines × maxPerUnit.
    const handleMachinesChange = (machines: number) => {
        // If the group no longer fits, cap people at the new capacity.
        const people = Math.min(totalPeople, machines * vehicleCfg.maxPerUnit);
        const extras = Math.max(0, people - machines * vehicleCfg.includedPerUnit);
        setVehicleBooking(machines, extras);
    };

    const handlePeopleChange = (people: number) => {
        // The stepper's max already prevents exceeding capacity; machines stay as chosen.
        const extras = Math.max(0, people - $booking.adults * vehicleCfg.includedPerUnit);
        setVehicleBooking($booking.adults, extras);
    };

    const Stepper = ({ value, min, max, onChange, label }: { value: number, min: number, max: number, onChange: (val: number) => void, label?: string }) => (
        <div className="flex flex-col gap-1 w-full">
            {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 shadow-inner text-white h-12">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="w-10 h-full flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg tabular-nums">{value}</span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="w-10 h-full flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-dark/60 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden sticky top-28 shadow-2xl">
            <div className="bg-gradient-to-r from-primary/20 to-brand-orange/20 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <TranslatedText content={{en: "Book Your Adventure", es: "Reserva tu Aventura"}} />
                </h3>
            </div>

            <div className="p-6 space-y-5">
                <div className="space-y-3">
                    <label className="text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-4 h-4" /> <TranslatedText content={{en: "Select Duration", es: "Seleccionar Duración"}} />
                    </label>
                    
                    <div className="relative">
                        <button
                            onClick={() => setDurationOpen(!durationOpen)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${durationOpen ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                        >
                            <div className="flex flex-col items-start translate-y-[-1px]">
                                <span className="text-sm font-bold text-white">{packages[selectedDurationIdx]?.duration}</span>
                                <span className="text-xs text-primary font-medium mt-0.5">${packages[selectedDurationIdx]?.adultPrice} {packages[selectedDurationIdx]?.childPrice > 0 ? `(Child: $${packages[selectedDurationIdx].childPrice})` : ''}</span>
                            </div>
                            {durationOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </button>

                        {durationOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {packages.map((pkg, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            handleDurationChange(index);
                                            setDurationOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-white/5 text-left ${selectedDurationIdx === index ? 'bg-primary/10' : ''}`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${selectedDurationIdx === index ? 'text-primary' : 'text-white'}`}>{pkg.duration}</span>
                                            <span className="text-xs text-gray-500">${pkg.adultPrice}</span>
                                        </div>
                                        {selectedDurationIdx === index && <CheckCircle className="w-4 h-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> <TranslatedText content={{en: "Date", es: "Fecha"}} />
                    </label>
                    <div className="relative">
                        {DatePickerComp ? (
                            <DatePickerComp
                                selected={$booking.date ? new Date($booking.date) : null}
                                onChange={(date: Date | null) => {
                                    handleDateChange(date);
                                    if (date) setBookingDate(date);
                                }}
                                minDate={new Date()}
                                filterDate={(date: Date) => !isDateBlocked(localDateISO(date), blockedRanges)}
                                placeholderText="Select a date"
                                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shadow-inner"
                                wrapperClassName="w-full"
                            />
                        ) : (
                            <input
                                type="text"
                                readOnly
                                placeholder="Select a date"
                                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 cursor-pointer shadow-inner"
                            />
                        )}
                    </div>
                    {upcomingBlock && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-2 mt-1">
                            <Info className="w-3 h-3 text-red-400 shrink-0" />
                            <span className="text-[10px] text-gray-400">
                                {$language === 'en'
                                    ? `Closed ${formatDateRange(upcomingBlock)}${upcomingBlock.reason ? ` — ${upcomingBlock.reason}` : ''}`
                                    : `Cerrados ${formatDateRange(upcomingBlock)}${upcomingBlock.reason ? ` — ${upcomingBlock.reason}` : ''}`}
                            </span>
                        </div>
                    )}
                    {!$booking.date && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 flex items-center gap-2 mt-1">
                            <Info className="w-3 h-3 text-primary" />
                            <span className="text-[10px] text-gray-400">Select a date in the calendar above to continue.</span>
                        </div>
                    )}
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                    <label className="text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-4 h-4" /> <TranslatedText content={{en: "Preferred Time", es: "Hora Preferida"}} />
                    </label>
                    {isTimeUnavailable ? (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                                <Info className="w-4 h-4" />
                                {$language === 'en' 
                                    ? `This ${selectedHours}-hour tour cannot be scheduled within our operating hours (8am - 5pm)`
                                    : `Este tour de ${selectedHours} horas no puede programarse dentro de nuestro horario (8am - 5pm)`
                                }
                            </div>
                            <p className="text-gray-500 text-xs mt-2">
                                {$language === 'en'
                                    ? `Please select a shorter duration or contact us directly.`
                                    : `Por favor seleccione una duración más corta o contáctenos directamente.`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                value={$booking.time || ''}
                                onChange={(e) => setBookingTime(e.target.value || null)}
                                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shadow-inner appearance-none"
                            >
                                <option value="" className="bg-[#1A1A1A] text-gray-400">
                                    {$language === 'en' ? "Select a time (optional)" : "Seleccionar hora (opcional)"}
                                </option>
                                {availableTimes.map(time => (
                                    <option key={time} value={time} className="bg-[#1A1A1A]">
                                        {time.startsWith('0') ? time.slice(1) : time} {parseInt(time) < 12 ? 'AM' : 'PM'}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    )}
                    <span className="text-[10px] text-gray-500">{$language === 'en' ? "Pickup time will be confirmed via WhatsApp" : "La hora de recogida se confirmará por WhatsApp"}</span>
                </div>

                <div className="space-y-3">
                    <label className="text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4" /> <TranslatedText content={{en: "Guests", es: "Huéspedes"}} />
                    </label>
                    
                    {isVehicle ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Stepper 
                                    label={isBuggy 
                                        ? ($language === 'en' ? "Buggies" : "Buggies")
                                        : isJetSki
                                            ? ($language === 'en' ? "Jet Skis" : "Jet Skis")
                                            : ($language === 'en' ? "ATVs (Solo)" : "ATVs (Solo)")
                                    }
                                    value={$booking.adults}
                                    min={1}
                                    max={10}
                                    onChange={handleMachinesChange}
                                />

                                {!isAtv && (
                                    <Stepper 
                                        label={$language === 'en' ? "People" : "Personas"}
                                        value={totalPeople}
                                        min={1}
                                        max={$booking.adults * vehicleCfg.maxPerUnit}
                                        onChange={handlePeopleChange}
                                    />
                                )}
                            </div>
                            {!isAtv && (
                                <>
                                    <p className="text-[10px] text-gray-500 leading-tight">
                                        {$language === 'en'
                                            ? (isJetSki
                                                ? `Up to ${vehicleCfg.maxPerUnit} people per jet ski. The 2nd rider pays $20. Need more people? Add more jet skis.`
                                                : `Up to ${vehicleCfg.maxPerUnit} people per buggy (2 included). Riders 3 & 4 pay $20 each.`)
                                            : (isJetSki
                                                ? `Hasta ${vehicleCfg.maxPerUnit} personas por jet ski. El 2do pasajero paga $20. ¿Más personas? Agrega más jet skis.`
                                                : `Hasta ${vehicleCfg.maxPerUnit} personas por buggy (2 incluidas). El 3ro y 4to pagan $20 c/u.`)
                                        }
                                    </p>
                                    {totalPeople < $booking.adults && (
                                        <p className="text-[10px] text-gray-400 leading-tight">
                                            {$language === 'en' 
                                                ? 'Note: more machines selected than people.' 
                                                : 'Nota: hay más máquinas que personas.'}
                                        </p>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <Stepper 
                                label={$language === 'en' ? "Adults" : "Adultos"}
                                value={$booking.adults}
                                min={1}
                                max={20}
                                onChange={(val) => setGuests(val, $booking.children)}
                            />

                            {packages[selectedDurationIdx]?.childPrice > 0 && (
                                <Stepper 
                                    label={$language === 'en' ? "Children" : "Niños"}
                                    value={$booking.children}
                                    min={0}
                                    max={20}
                                    onChange={(val) => setGuests($booking.adults, val)}
                                />
                            )}
                        </div>
                    )}
                </div>
                
                {isVehicle && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-[10px] text-gray-400">
                            <div className="flex gap-2">
                                <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-white mb-0.5">
                                        {$language === 'en' ? 'Occupancy' : 'Capacidad'}
                                    </p>
                                    <p className="leading-tight">
                                        {isBuggy 
                                            ? ($language === 'en' ? 'Price is per buggy. Base covers 2pax. Extra pax (max 4) $20 ea.' : 'El precio es por buggy. Base incluye 2p. Pax extra (máx 4) $20 c/u.')
                                            : isJetSki
                                                ? ($language === 'en' ? 'Price is per jet ski (1 rider included). Add a shared 2nd rider for $20.' : 'El precio es por jet ski (incluye 1 piloto). Agregue un 2do pasajero por $20.')
                                                : ($language === 'en' ? 'Price is per ATV (1 rider included).' : 'El precio es por ATV (incluye 1 piloto).')
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 text-[10px] text-gray-400">
                            <div className="flex gap-2">
                                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-white mb-0.5">
                                        {$language === 'en' ? 'Security Hold' : 'Depósito'}
                                    </p>
                                    <p className="leading-tight">
                                        {isJetSki
                                            ? ($language === 'en'
                                                ? `$${Math.max(1, $booking.adults) * 500} credit card hold ($${Math.max(1, $booking.adults)} × $500 per jet ski). Released in 24h as per bank policy.`
                                                : `Hold de $${Math.max(1, $booking.adults) * 500} en tarjeta ($${Math.max(1, $booking.adults)} × $500 por jetski). Liberación en 24h según banco.`)
                                            : ($language === 'en' 
                                                ? '$1000 credit card hold. Released in 24h as per bank policy.' 
                                                : 'Hold de $1000 en tarjeta. Liberación en 24h según banco.')
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-400 text-sm"><TranslatedText content={{en: "Total Price", es: "Precio Total"}} /></span>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white block leading-none">
                                ${$booking.totalPrice > 0 ? ($booking.totalPrice - $booking.ivaAmount).toFixed(0) : (packages[selectedDurationIdx] ? packages[selectedDurationIdx].adultPrice : price)}
                            </span>
                            <span className="text-xs text-brand-orange font-medium"><TranslatedText content={{en: "Best Price Guaranteed", es: "Mejor Precio Garantizado"}} /></span>
                        </div>
                    </div>

                    <a
                        href={`/checkout?product_id=${tourId}&variation_id=${packages[selectedDurationIdx]?.variation_id || ''}&date=${$booking.date || ''}&adults=${$booking.adults}&children=${$booking.children}&extra_pax=${$booking.extraPassengers}&duration=${encodeURIComponent(packages[selectedDurationIdx]?.duration || '')}`}
                        className={`w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/20 ${!$booking.date ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => {
                            if (!$booking.date) {
                                e.preventDefault();
                                alert($language === 'en' ? 'Please select a date first!' : '¡Por favor selecciona una fecha primero!');
                            }
                        }}
                    >
                        <TranslatedText content={{en: "Request Booking", es: "Solicitar Reserva"}} />
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
                        <TranslatedText content={{en: "No payment now • We confirm via WhatsApp • Pay on arrival", es: "Sin pago ahora • Confirmamos por WhatsApp • Paga al llegar"}} />
                    </p>
                </div>
            </div>
        </div>
    );
}
