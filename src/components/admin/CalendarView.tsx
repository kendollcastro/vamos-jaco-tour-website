import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import { cardClasses } from '../../lib/admin-design-tokens';
import BookingDetailsModal from './BookingDetailsModal';
import AddBookingModal from './AddBookingModal';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Users } from 'lucide-react';

interface Booking {
    id: string;
    customer_name: string;
    tour_name: string;
    tour_id: string;
    booking_date: string;
    booking_time: string;
    total_amount: number;
    status: string;
    guests: number;
    email: string;
    phone: string;
    created_at: string;
    tilopay_order_id?: string;
    tilopay_transaction_id?: string;
    card_type?: string;
    card_last_four?: string;
}

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    bookings: Booking[];
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-400',
    paid: 'bg-blue-500',
    office: 'bg-purple-500',
    confirmed: 'bg-emerald-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500 line-through opacity-50',
    overbooked: 'bg-red-600 animate-pulse',
};

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarView() {
    const $language = useStore(language);
    const t = adminTranslations[$language];
    const isDemo = !supabase;

    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const weekdays = $language === 'en' ? WEEKDAYS_EN : WEEKDAYS_ES;
    const months = $language === 'en' ? MONTHS_EN : MONTHS_ES;

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        
        if (isDemo) {
            const demoBookings: Booking[] = [
                {
                    id: '1',
                    customer_name: 'Sarah Johnson',
                    tour_name: 'ATV Mountain Adventure',
                    tour_id: 'tour-1',
                    booking_date: new Date().toISOString().split('T')[0],
                    booking_time: '10:00',
                    total_amount: 180,
                    status: 'confirmed',
                    guests: 2,
                    email: 'sarah@example.com',
                    phone: '555-0123',
                    created_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    customer_name: 'Mike Chen',
                    tour_name: 'Jet Ski Ocean Thrill',
                    tour_id: 'tour-2',
                    booking_date: new Date().toISOString().split('T')[0],
                    booking_time: '14:00',
                    total_amount: 240,
                    status: 'pending',
                    guests: 1,
                    email: 'mike@example.com',
                    phone: '555-0124',
                    created_at: new Date().toISOString(),
                },
                {
                    id: '3',
                    customer_name: 'Ana García',
                    tour_name: 'Side by Side Buggy Tour',
                    tour_id: 'tour-3',
                    booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    booking_time: '09:00',
                    total_amount: 300,
                    status: 'confirmed',
                    guests: 3,
                    email: 'ana@example.com',
                    phone: '555-0125',
                    created_at: new Date().toISOString(),
                },
            ];
            setBookings(demoBookings);
            setLoading(false);
            return;
        }

        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    tours(name_en, name_es)
                `)
                .gte('booking_date', startDate)
                .lte('booking_date', endDate)
                .order('booking_date', { ascending: true })
                .order('booking_time', { ascending: true });

            if (error) throw error;

            const formattedBookings = (data || []).map((b: any) => ({
                ...b,
                tour_name: $language === 'en' ? b.tours?.name_en : b.tours?.name_es || 'Unknown Tour',
            }));

            setBookings(formattedBookings);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
        setLoading(false);
    }, [year, month, isDemo, $language]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings, refreshKey]);

    const getDaysInMonth = (): CalendarDay[] => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        
        const days: CalendarDay[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Previous month's trailing days
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: date.getTime() === today.getTime(),
                bookings: [],
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const dayBookings = bookings.filter(b => b.booking_date === dateStr);
            
            days.push({
                date,
                isCurrentMonth: true,
                isToday: date.getTime() === today.getTime(),
                bookings: dayBookings,
            });
        }

        // Next month's leading days to complete the grid (6 rows * 7 days = 42)
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const date = new Date(year, month + 1, i);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: date.getTime() === today.getTime(),
                bookings: [],
            });
        }

        return days;
    };

    const days = getDaysInMonth();

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(year, month + direction, 1));
    };

    const handleDateClick = (day: CalendarDay) => {
        if (day.bookings.length > 0) {
            setSelectedDate(day.date);
            setSelectedDateBookings(day.bookings);
        }
    };

    const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    const handleAddBookingForDate = (date: Date) => {
        setSelectedDate(date);
        setShowAddModal(true);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-heading font-black text-gray-900 dark:text-white">
                        {months[month]} {year}
                    </h2>
                    <Button
                        variant="ghost"
                        onClick={goToToday}
                        className="px-3 py-1 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 h-auto"
                    >
                        {$language === 'en' ? 'Today' : 'Hoy'}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateMonth(-1)}
                        className="w-10 h-10 rounded-xl"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateMonth(1)}
                        className="w-10 h-10 rounded-xl"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200/50 dark:border-white/5">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {$language === 'en' ? 'Status:' : 'Estado:'}
                </span>
                {Object.entries(STATUS_COLORS).filter(([key]) => key !== 'cancelled').map(([status, color]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                            {status}
                        </span>
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200/50 dark:border-white/5 overflow-hidden shadow-sm">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-gray-200/50 dark:border-white/5">
                    {weekdays.map((day) => (
                        <div key={day} className="p-4 text-center">
                            <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {day}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {days.map((day, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleDateClick(day)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDateClick(day); }}
                            tabIndex={0}
                            role="button"
                            aria-label={`${day.date.toLocaleDateString()} ${day.bookings.length} bookings`}
                            className={`
                                min-h-[100px] sm:min-h-[120px] p-2 border-b border-r border-gray-200/50 dark:border-white/5 cursor-pointer
                                transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.02] focus:outline-none focus:ring-2 focus:ring-primary focus:z-10
                                ${!day.isCurrentMonth ? 'opacity-30' : ''}
                                ${day.isToday ? 'bg-primary/5 dark:bg-primary/10' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`
                                    text-sm font-bold w-7 h-7 rounded-lg flex items-center justify-center
                                    ${day.isToday 
                                        ? 'bg-primary text-white' 
                                        : 'text-gray-700 dark:text-gray-300'
                                    }
                                `}>
                                    {day.date.getDate()}
                                </span>
                                {day.isCurrentMonth && day.date >= new Date(new Date().setHours(0,0,0,0)) && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddBookingForDate(day.date);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.stopPropagation();
                                                handleAddBookingForDate(day.date);
                                            }
                                        }}
                                        className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:opacity-100"
                                        title={$language === 'en' ? 'Add booking' : 'Agregar reserva'}
                                        aria-label={$language === 'en' ? `Add booking for ${day.date.toLocaleDateString()}` : `Agregar reserva para ${day.date.toLocaleDateString()}`}
                                    >
                                        <Plus className="w-3 h-3" strokeWidth={2} />
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                {day.bookings.slice(0, 3).map((booking) => (
                                    <div
                                        key={booking.id}
                                        onClick={(e) => handleBookingClick(booking, e)}
                                        className={`
                                            text-[10px] px-1.5 py-0.5 rounded-md truncate cursor-pointer
                                            hover:shadow-md transition-all
                                            ${STATUS_COLORS[booking.status] || 'bg-gray-300'}
                                            ${booking.status === 'cancelled' ? 'line-through opacity-50' : ''}
                                            text-white font-semibold
                                        `}
                                        title={`${booking.customer_name} - ${booking.tour_name} (${booking.booking_time})`}
                                    >
                                        {booking.booking_time} {booking.customer_name.split(' ')[0]}
                                    </div>
                                ))}
                                {day.bookings.length > 3 && (
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold pl-1">
                                        +{day.bookings.length - 3} {$language === 'en' ? 'more' : 'más'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Date Modal */}
            {selectedDate && selectedDateBookings.length > 0 && !showDetailsModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDate(null)}>
                    <div className="bg-white dark:bg-[#111111] rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 dark:border-white/5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {selectedDate.toLocaleDateString($language === 'en' ? 'en-US' : 'es-ES', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-6 space-y-3 overflow-y-auto max-h-[60vh]">
                            {selectedDateBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    onClick={() => {
                                        setSelectedBooking(booking);
                                        setShowDetailsModal(true);
                                    }}
                                    className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 cursor-pointer hover:border-primary/50 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-gray-900 dark:text-white">{booking.customer_name}</span>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${STATUS_COLORS[booking.status]?.replace('bg-', 'text-')} bg-current/10`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{booking.tour_name}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {booking.booking_time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {booking.guests}
                                        </span>
                                        <span className="font-bold">${booking.total_amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Details Modal */}
            {showDetailsModal && selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedBooking(null);
                    }}
                    onUpdate={() => {
                        setRefreshKey(k => k + 1);
                        setShowDetailsModal(false);
                    }}
                />
            )}

            {/* Add Booking Modal */}
            {showAddModal && selectedDate && (
                <AddBookingModal
                    isOpen={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedDate(null);
                    }}
                    onSuccess={() => {
                        setRefreshKey(k => k + 1);
                        setShowAddModal(false);
                    }}
                    prefillDate={selectedDate.toISOString().split('T')[0]}
                />
            )}
        </div>
    );
}
