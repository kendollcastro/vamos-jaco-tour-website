'use client';

import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';

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
                    <button onClick={onClose} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
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
                                            <button onClick={() => navigator.clipboard.writeText(booking.tilopay_order_id!)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Copiar #">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                            </button>
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
                                                    <button onClick={() => navigator.clipboard.writeText((safeTilopayResponse as any).order || (safeTilopayResponse as any).orderNumber)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Copiar #Orden">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                                    </button>
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
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
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
                    <button onClick={() => window.open(`mailto:${booking.customer_email}?subject=Booking: ${booking.tour_name}`)} className={`flex items-center gap-2 ${getTextMuted(isDarkMode)} hover:${getTextPrimary(isDarkMode)} transition-colors text-sm font-medium`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {$language === 'en' ? 'Email' : 'Email'}
                    </button>
                    <div className="flex items-center gap-3">
                        {booking.customer_phone && (
                            <button onClick={() => window.open(`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`)} className="flex items-center gap-2 text-brand-teal hover:text-teal-300 transition-colors text-sm font-medium">
                                WhatsApp
                            </button>
                        )}
                        <button onClick={onClose} className={`${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg text-sm font-bold transition-colors`}>
                            {$language === 'en' ? 'Close' : 'Cerrar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}