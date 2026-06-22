'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { supabase } from '../../lib/supabase';
import { adminTranslations } from '../../lib/admin-translations';
import { Button } from '../ui/button';
import { X, Copy, Mail, MessageCircle, Clock } from 'lucide-react';

interface BookingDetails {
    id: string;
    tour_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    booking_date: string;
    booking_time?: string;
    adults: number;
    children: number;
    total_amount: number;
    status: string;
    tilopay_order_id?: string;
    tilopay_response?: Record<string, any>;
    created_at: string;
    tour_id?: string;
}

interface BookingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: BookingDetails | null;
}

const getBgCards = (isDark: boolean) => isDark ? 'bg-white/5' : 'bg-gray-50';
const getBorderCards = (isDark: boolean) => isDark ? 'border-white/10' : 'border-gray-200';
const getTextPrimary = (isDark: boolean) => isDark ? 'text-white' : 'text-gray-900';
const getTextSecondary = (isDark: boolean) => isDark ? 'text-gray-400' : 'text-gray-500';
const getTextMuted = (isDark: boolean) => isDark ? 'text-gray-500' : 'text-gray-400';
const getBorderDivider = (isDark: boolean) => isDark ? 'border-white/10' : 'border-gray-200';

export default function BookingDetailsModal({ isOpen, onClose, booking }: BookingDetailsModalProps) {
    const $language = useStore(language);
    const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    // Duration: first check stored booking.duration, fallback to tour's general duration
    interface TourRow { duration: string; pricing_options?: any[]; }
    const [tourDuration, setTourDuration] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        // If booking already has a stored exact duration, use it
        if ((booking as any)?.duration) {
            setTourDuration((booking as any).duration);
            return;
        }
        // Fallback: try to deduce from pricing_options using total_amount
        if (!booking?.tour_id) return;
        setTourDuration(null);
        const fetchFallback = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('tours')
                .select('duration, pricing_options')
                .eq('id', booking.tour_id)
                .single();
            if (!data) return;
            const tour = data as unknown as TourRow;
            // Try to match exact price from pricing_options
            if (tour.pricing_options && Array.isArray(tour.pricing_options)) {
                const matched = tour.pricing_options.find((opt: any) => {
                    const pricePerPerson = Number(booking.total_amount) / ((booking.adults || 1) + (booking.children || 0));
                    return Math.abs(Number(opt.price) - pricePerPerson) < 1;
                });
                if (matched?.duration) {
                    setTourDuration(matched.duration);
                    return;
                }
            }
            // Last fallback: tour's general duration
            if (tour.duration) setTourDuration(tour.duration);
        };
        fetchFallback();
    }, [isOpen, booking]);

    if (!isOpen || !booking) return null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString($language === 'en' ? 'en-US' : 'es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const totalGuests = (booking.adults || 0) + (booking.children || 0);

    const safeTilopayResponse = (() => {
        if (!booking.tilopay_response) return null;
        if (typeof booking.tilopay_response === 'object') return booking.tilopay_response;
        try {
            return typeof booking.tilopay_response === 'string' ? JSON.parse(booking.tilopay_response) : null;
        } catch {
            return null;
        }
    })();

    const hasTilopayData = booking.tilopay_order_id || safeTilopayResponse;

    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
        paid: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
        office: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
        confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
        completed: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    };
    
    const colors = statusColors[booking.status] || statusColors.pending;

    const getStatusBadge = () => (
        <span className={`inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
            isDarkMode 
                ? `border ${colors.border.replace('200', '500/30')} ${colors.bg.replace('100', '500/20')} ${colors.text.replace('700', '400')}` 
                : `${colors.bg} ${colors.text} border ${colors.border}`
        }`}>
            {booking.status}
        </span>
    );

    const formatTime = (time: string) => {
        const hour = parseInt(time.split(':')[0]);
        return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
                isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-gray-200'
            }`}>
                <div className="bg-gradient-to-r from-primary to-brand-orange px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-bold text-lg">
                            {$language === 'en' ? 'Booking Details' : 'Detalles de Reserva'}
                        </h2>
                        <p className="text-white/70 text-sm font-mono">
                            #{booking.id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg text-white/70 hover:text-white hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        {getStatusBadge()}
                    </div>

                    {hasTilopayData && (
                        <div className={`${getBgCards(isDarkMode)} rounded-xl p-5 ${getBorderCards(isDarkMode)}`}>
                            <h3 className={`text-xs font-bold ${getTextSecondary(isDarkMode)} uppercase tracking-wider mb-3`}>
                                💳 TiloPay Payment
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {booking.tilopay_order_id && (
                                    <div>
                                        <p className={getTextMuted(isDarkMode) + ' text-xs'}># (Transacción / Auth)</p>
                                        <div className="flex items-center gap-2">
                                            <p className={isDarkMode ? 'text-green-400 font-mono text-sm' : 'text-green-600 font-mono text-sm'}>
                                                {booking.tilopay_order_id}
                                            </p>
                                            <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(booking.tilopay_order_id!)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 h-auto w-auto p-1" title="Copiar #">
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {safeTilopayResponse && (
                                    <>
                                        {((safeTilopayResponse as any).order || (safeTilopayResponse as any).orderNumber) && (
                                            <div>
                                                <p className={getTextMuted(isDarkMode) + ' text-xs'}>#Orden</p>
                                                <div className="flex items-center gap-2">
                                                    <p className={`${getTextPrimary(isDarkMode)} font-mono text-xs truncate max-w-[120px]`} title={(safeTilopayResponse as any).order || (safeTilopayResponse as any).orderNumber}>
                                                        {(safeTilopayResponse as any).order || (safeTilopayResponse as any).orderNumber}
                                                    </p>
                                                    <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText((safeTilopayResponse as any).order || (safeTilopayResponse as any).orderNumber)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 h-auto w-auto p-1" title="Copiar #Orden">
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {(safeTilopayResponse as any).cardBrand && (
                                            <div>
                                                <p className={getTextMuted(isDarkMode) + ' text-xs'}>Card Type</p>
                                                <p className={`${getTextPrimary(isDarkMode)} text-sm`}>{(safeTilopayResponse as any).cardBrand}</p>
                                            </div>
                                        )}
                                        {(safeTilopayResponse as any).lastFour && (
                                            <div>
                                                <p className={getTextMuted(isDarkMode) + ' text-xs'}>Card</p>
                                                <p className={`${getTextPrimary(isDarkMode)} text-sm`}>•••• {(safeTilopayResponse as any).lastFour}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={`${getBgCards(isDarkMode)} rounded-xl p-5 ${getBorderCards(isDarkMode)}`}>
                        <h3 className={`text-xs font-bold ${getTextSecondary(isDarkMode)} uppercase tracking-wider mb-3`}>
                            🏃 Tour
                        </h3>
                        <p className={`${getTextPrimary(isDarkMode)} font-bold text-xl`}>{booking.tour_name}</p>
                        {tourDuration && (
                            <div className="flex items-center gap-2 mt-2">
                                <Clock className={`w-4 h-4 ${getTextSecondary(isDarkMode)}`} />
                                <span className={`${getTextSecondary(isDarkMode)} text-sm font-medium`}>{tourDuration}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`${getBgCards(isDarkMode)} rounded-xl p-5 ${getBorderCards(isDarkMode)}`}>
                            <h3 className={`text-xs font-bold ${getTextSecondary(isDarkMode)} uppercase tracking-wider mb-2`}>📅 Date</h3>
                            <p className={`${getTextPrimary(isDarkMode)} font-bold`}>{formatDate(booking.booking_date)}</p>
                        </div>
                        <div className={`${getBgCards(isDarkMode)} rounded-xl p-5 ${getBorderCards(isDarkMode)}`}>
                            <h3 className={`text-xs font-bold ${getTextSecondary(isDarkMode)} uppercase tracking-wider mb-2`}>🕐 Time</h3>
                            <p className={`${getTextPrimary(isDarkMode)} font-bold`}>
                                {booking.booking_time ? formatTime(booking.booking_time) : ($language === 'en' ? 'Not specified' : 'No especificada')}
                            </p>
                        </div>
                    </div>

                    <div className={`${getBgCards(isDarkMode)} rounded-xl p-5 ${getBorderCards(isDarkMode)}`}>
                        <h3 className={`text-xs font-bold ${getTextSecondary(isDarkMode)} uppercase tracking-wider mb-3`}>👥 Guests</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-black text-primary">{totalGuests}</p>
                                <p className={getTextMuted(isDarkMode) + ' text-xs uppercase'}>Total</p>
                            </div>
                            <div className={`text-center ${getBorderDivider(isDarkMode)} pl-4`}>
                                <p className={`text-3xl font-bold ${getTextPrimary(isDarkMode)}`}>{booking.adults || 0}</p>
                                <p className={getTextMuted(isDarkMode) + ' text-xs uppercase'}>Adults</p>
                            </div>
                            <div className={`text-center ${getBorderDivider(isDarkMode)} pl-4`}>
                                <p className={`text-3xl font-bold ${getTextPrimary(isDarkMode)}`}>{booking.children || 0}</p>
                                <p className={getTextMuted(isDarkMode) + ' text-xs uppercase'}>Kids</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${getBgCards(isDarkMode)} rounded-xl p-5 ${getBorderCards(isDarkMode)}`}>
                        <h3 className={`text-xs font-bold ${getTextSecondary(isDarkMode)} uppercase tracking-wider mb-3`}>👤 Customer</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {booking.customer_name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <p className={`${getTextPrimary(isDarkMode)} font-bold`}>{booking.customer_name}</p>
                            </div>
                            <div className={`grid grid-cols-2 gap-4 pt-3 ${getBorderDivider(isDarkMode)}`}>
                                <div>
                                    <p className={getTextMuted(isDarkMode) + ' text-xs'}>Email</p>
                                    <a href={`mailto:${booking.customer_email}`} className="text-brand-teal hover:underline text-sm">{booking.customer_email}</a>
                                </div>
                                <div>
                                    <p className={getTextMuted(isDarkMode) + ' text-xs'}>WhatsApp</p>
                                    {booking.customer_phone && (
                                        <a href={`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline text-sm flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" fill="currentColor" />
                                            {booking.customer_phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/20 to-brand-orange/20 rounded-xl p-5 border border-primary/20">
                        <div className="flex items-center justify-between">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>💵 Total</span>
                            <span className="text-3xl font-black text-primary">${Number(booking.total_amount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className={`px-6 py-4 ${getBgCards(isDarkMode)} ${getBorderDivider(isDarkMode)} flex items-center justify-between`}>
                    <Button variant="ghost" onClick={() => window.open(`mailto:${booking.customer_email}?subject=Booking: ${booking.tour_name}`)} className={`gap-2 text-sm font-medium ${getTextMuted(isDarkMode)} hover:${getTextPrimary(isDarkMode)} h-auto`}>
                        <Mail className="w-4 h-4" />
                        {$language === 'en' ? 'Email' : 'Email'}
                    </Button>
                    <div className="flex items-center gap-3">
                        {booking.customer_phone && (
                            <Button variant="ghost" onClick={() => window.open(`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`)} className="gap-2 text-brand-teal hover:text-teal-300 text-sm font-medium h-auto">
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </Button>
                        )}
                        <Button variant="ghost" onClick={onClose} className={`${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg text-sm font-bold h-auto`}>
                            {$language === 'en' ? 'Close' : 'Cerrar'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
