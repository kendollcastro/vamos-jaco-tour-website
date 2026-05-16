import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import AddBookingModal from './AddBookingModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import BookingDetailsModal from './BookingDetailsModal';

interface Booking {
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
    status: 'pending' | 'paid' | 'office' | 'confirmed' | 'completed' | 'cancelled' | 'overbooked';
    tilopay_order_id?: string;
    tilopay_response?: Record<string, any>;
    created_at: string;
}

const STATUS_STYLES: Record<string, { light: string; dark: string }> = {
    pending: { light: 'bg-yellow-100 text-yellow-700 border-yellow-200', dark: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    paid: { light: 'bg-green-100 text-green-700 border-green-200', dark: 'bg-green-500/20 text-green-400 border-green-500/30' },
    office: { light: 'bg-blue-100 text-blue-700 border-blue-200', dark: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    confirmed: { light: 'bg-emerald-100 text-emerald-700 border-emerald-200', dark: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    completed: { light: 'bg-gray-100 text-gray-600 border-gray-200', dark: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    cancelled: { light: 'bg-red-100 text-red-700 border-red-200', dark: 'bg-red-500/20 text-red-400 border-red-500/30' },
    overbooked: { light: 'bg-red-200 text-red-800 border-red-300 animate-pulse', dark: 'bg-red-600/30 text-red-400 border-red-600/40 animate-pulse' },
};

const DEMO_BOOKINGS: Booking[] = [
    { id: '1', tour_name: 'ATV Mountain Adventure', customer_name: 'Sarah Johnson', customer_email: 'sarah@email.com', customer_phone: '+1 555-0101', booking_date: new Date().toISOString().split('T')[0], adults: 2, children: 1, total_amount: 180, status: 'paid', tilopay_order_id: 'TIL-2024-ABC123', tilopay_response: { orderNumber: 'ORD-001', authorizationCode: 'AUTH123', cardBrand: 'Visa', lastFour: '4242' }, created_at: new Date().toISOString() },
    { id: '2', tour_name: 'Jet Ski Ocean Thrill', customer_name: 'Mike Chen', customer_email: 'mike@email.com', customer_phone: '+1 555-0102', booking_date: new Date().toISOString().split('T')[0], adults: 2, children: 0, total_amount: 240, status: 'pending', created_at: new Date().toISOString() },
    { id: '3', tour_name: 'Side by Side Buggy Tour', customer_name: 'Ana García', customer_email: 'ana@email.com', customer_phone: '+506 8888-1234', booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], adults: 4, children: 2, total_amount: 600, status: 'office', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '4', tour_name: 'Surf Lessons', customer_name: 'James Wilson', customer_email: 'james@email.com', customer_phone: '+1 555-0104', booking_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], adults: 1, children: 0, total_amount: 70, status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '5', tour_name: 'Flyboard Experience', customer_name: 'Laura Rodríguez', customer_email: 'laura@email.com', customer_phone: '+506 7777-5678', booking_date: new Date(Date.now() - 172800000).toISOString().split('T')[0], adults: 2, children: 0, total_amount: 160, status: 'cancelled', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: '6', tour_name: 'Slingshot Rental', customer_name: 'Carlos Méndez', customer_email: 'carlos@email.com', customer_phone: '+506 6666-4321', booking_date: new Date().toISOString().split('T')[0], adults: 1, children: 0, total_amount: 350, status: 'confirmed', created_at: new Date(Date.now() - 7200000).toISOString() },
];

export default function BookingsTable({ onToast }: { onToast?: (message: string) => void }) {
    const $language = useStore(language);
    const t = adminTranslations[$language];
    
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<{id: string; customerName: string; tourName: string} | null>(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
    const isDemo = !supabase;

    async function handleRefresh() {
        setRefreshing(true);
        await fetchBookings();
        setRefreshing(false);
    }

    useEffect(() => {
        fetchBookings();

        if (!supabase) return;

        // Real-time subscription
        const channel = supabase
            .channel('bookings-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                fetchBookings();
            })
            .subscribe();

        return () => { supabase?.removeChannel(channel); };
    }, []);

    async function fetchBookings() {
        setLoading(true);

        if (!supabase) {
            setBookings(DEMO_BOOKINGS);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bookings:', error);
        }
        
        console.log('Bookings fetched:', data);
        setBookings((data as Booking[]) || []);
        setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
        if (isDemo) {
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
            onToast?.(newStatus === 'confirmed' ? ($language === 'en' ? 'Booking confirmed!' : '¡Reserva confirmada!') : ($language === 'en' ? 'Booking cancelled' : 'Reserva cancelada'));
            return;
        }

        if (!supabase) return;
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchBookings();
            onToast?.(newStatus === 'confirmed' ? ($language === 'en' ? 'Booking confirmed!' : '¡Reserva confirmada!') : ($language === 'en' ? 'Booking cancelled' : 'Reserva cancelada'));
        }
    }

    async function deleteBooking(id: string) {
        const booking = bookings.find(b => b.id === id);
        if (booking) {
            setBookingToDelete({ id, customerName: booking.customer_name, tourName: booking.tour_name });
            setDeleteModalOpen(true);
        }
    }

    async function confirmDelete() {
        if (!bookingToDelete) return;
        
        const id = bookingToDelete.id;
        
        if (isDemo) {
            setBookings(prev => prev.filter(b => b.id !== id));
            onToast?.($language === 'en' ? 'Booking deleted' : 'Reserva eliminada');
            setDeleteModalOpen(false);
            setBookingToDelete(null);
            return;
        }

        if (!supabase) return;
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchBookings();
            onToast?.($language === 'en' ? 'Booking deleted' : 'Reserva eliminada');
        }
        setDeleteModalOpen(false);
        setBookingToDelete(null);
    }

    function exportToCSV() {
        const headers = ['Date', 'Customer', 'Email', 'Phone', 'Tour', 'Adults', 'Children', 'Amount', 'Status'];
        const rows = filtered.map(b => [
            new Date(b.booking_date).toLocaleDateString(),
            b.customer_name,
            b.customer_email,
            b.customer_phone,
            b.tour_name,
            b.adults,
            b.children,
            b.total_amount,
            b.status
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        onToast?.($language === 'en' ? `Exported ${filtered.length} bookings to CSV` : `Exportados ${filtered.length} reservas a CSV`);
    }

    const filtered = bookings.filter((b) => {
        const matchesFilter = filter === 'all' || b.status === filter;
        const matchesSearch = !searchQuery ||
            b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.tour_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const bookingDate = new Date(b.booking_date);
        const matchesDateFrom = !dateFrom || bookingDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || bookingDate <= new Date(dateTo);
        
        return matchesFilter && matchesSearch && matchesDateFrom && matchesDateTo;
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
                {/* Search */}
                <div className="relative w-full xl:w-96">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={$language === 'en' ? "Search customer, email or tour..." : "Buscar cliente, email o tour..."}
                        className="w-full bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors shadow-sm"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 px-4 py-3 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary hover:border-primary/30 transition-all shadow-sm shrink-0 disabled:opacity-50"
                    >
                        <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {$language === 'en' ? 'Refresh' : 'Actualizar'}
                    </button>

                    {/* Export CSV Button */}
                    <button
                        onClick={exportToCSV}
                        disabled={filtered.length === 0}
                        className="flex items-center gap-2 bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 px-4 py-3 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-green-600 hover:border-green-500/30 transition-all shadow-sm shrink-0 disabled:opacity-50"
                        title={$language === 'en' ? 'Export to CSV' : 'Exportar a CSV'}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden md:inline">{$language === 'en' ? 'Export' : 'Exportar'}</span>
                    </button>

                    {/* Status Filter */}
                    <div className="flex p-1.5 bg-gray-100 dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/5 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                        {[
                            { key: 'all', en: 'All', es: 'Todos' },
                            { key: 'confirmed', en: 'Confirmed', es: 'Confirmado' },
                            { key: 'cancelled', en: 'Cancelled', es: 'Cancelado' }
                        ].map((s) => (
                            <button
                                key={s.key}
                                onClick={() => setFilter(s.key)}
                                className={`px-5 py-2 rounded-md text-xs font-bold transition-all capitalize whitespace-nowrap ${filter === s.key
                                    ? 'bg-white dark:bg-dark-soft shadow-sm text-gray-900 dark:text-white'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {$language === 'en' ? s.en : s.es}
                            </button>
                        ))}
                    </div>

                    {/* Date Filters */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="pl-10 pr-3 py-2 bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-primary outline-none"
                                title={$language === 'en' ? 'From date' : 'Desde fecha'}
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative">
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:border-primary outline-none"
                                title={$language === 'en' ? 'To date' : 'Hasta fecha'}
                            />
                        </div>
                        {(dateFrom || dateTo) && (
                            <button
                                onClick={() => { setDateFrom(''); setDateTo(''); }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title={$language === 'en' ? 'Clear dates' : 'Limpiar fechas'}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Create Booking Button */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        {$language === 'en' ? 'Create Booking' : 'Crear Reserva'}
                    </button>
                </div>
            </div>

            <AddBookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => fetchBookings()} 
            />

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => { setDeleteModalOpen(false); setBookingToDelete(null); }}
                onConfirm={confirmDelete}
                bookingInfo={bookingToDelete ? { customerName: bookingToDelete.customerName, tourName: bookingToDelete.tourName } : { customerName: '', tourName: '' }}
            />

            <BookingDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => { setDetailsModalOpen(false); setSelectedBookingDetails(null); }}
                booking={selectedBookingDetails}
            />

            {/* Table */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors duration-300">
                {loading ? (
                    <div className="p-6">
                        {/* Header skeleton */}
                        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100 dark:border-white/5">
                            <div className="w-24 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-32 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-40 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse hidden md:block" />
                            <div className="w-20 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-24 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-16 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse ml-auto" />
                        </div>
                        {/* Row skeletons */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-50 dark:border-white/5 last:border-0">
                                <div className="w-24 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                                <div className="flex items-center gap-3 w-48">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="w-32 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                                        <div className="w-24 h-3 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="w-40 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse hidden md:block" />
                                <div className="w-20 h-6 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
                                <div className="w-16 h-6 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
                                <div className="w-16 h-8 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse ml-auto" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500 font-medium">{$language === 'en' ? 'No bookings found' : 'No se encontraron reservas'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{$language === 'en' ? 'Date' : 'Fecha'}</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{$language === 'en' ? 'Customer' : 'Cliente'}</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden md:table-cell">{$language === 'en' ? 'Tour' : 'Tour'}</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{$language === 'en' ? 'Amount' : 'Monto'}</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{$language === 'en' ? 'Status' : 'Estado'}</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{$language === 'en' ? 'Actions' : 'Acciones'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filtered.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 dark:text-white text-sm font-bold">{new Date(booking.booking_date).toLocaleDateString()}</div>
                                            <div className="text-gray-500 text-xs font-medium">{new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-black shrink-0 shadow-sm">
                                                    {booking.customer_name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 dark:text-white font-bold leading-tight">{booking.customer_name}</p>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">{booking.customer_email}</p>
                                                    {booking.customer_phone && (
                                                        <a href={`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-teal text-xs font-bold flex items-center gap-1 mt-0.5 hover:underline">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.478-.677-6.309-1.834l-.452-.274-2.645.887.887-2.645-.274-.452A9.955 9.955 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                                                            {booking.customer_phone}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-gray-900 dark:text-white font-bold leading-tight line-clamp-1">{booking.tour_name}</p>
                                            <p className="text-gray-500 text-xs font-medium">{booking.adults} adults, {booking.children} kids</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 dark:text-white font-black text-base">${Number(booking.total_amount).toLocaleString()}</span>
                                            {booking.tilopay_order_id && (
                                                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-green-600 dark:text-green-500/90 font-bold bg-green-500/20 w-max px-2 py-0.5 rounded border border-green-500/30">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    TiloPay - Paid
                                                </div>
                                            )}
                                            {!booking.tilopay_order_id && (
                                                <div className="mt-1 text-[10px] text-gray-400 font-medium">Cash / Manual</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                                                STATUS_STYLES[booking.status] 
                                                ? (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
                                                    ? STATUS_STYLES[booking.status].dark 
                                                    : STATUS_STYLES[booking.status].light)
                                                : STATUS_STYLES.pending.light
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                    </svg>
                                                </button>
                                                
                                                {/* Quick View Button - Open Details Modal */}
                                                <button 
                                                    onClick={() => { setSelectedBookingDetails(booking); setDetailsModalOpen(true); }}
                                                    className="ml-2 p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title={$language === 'en' ? 'View Details' : 'Ver Detalles'}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                
                                                {selectedBooking?.id === booking.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#111111] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                                        {booking.status === 'pending' && (
                                                            <>
                                                                <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                                                            </>
                                                        )}
                                                        
                                                        {booking.status === 'paid' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => { updateStatus(booking.id, 'confirmed'); setSelectedBooking(null); }}
                                                                    className="w-full px-4 py-2 text-left text-sm font-medium text-green-600 hover:bg-green-500/10 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    {$language === 'en' ? 'Confirm' : 'Confirmar'}
                                                                </button>
                                                                <button 
                                                                    onClick={() => { updateStatus(booking.id, 'completed'); setSelectedBooking(null); }}
                                                                    className="w-full px-4 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-500/10 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    {$language === 'en' ? 'Mark Completed' : 'Marcar Completado'}
                                                                </button>
                                                                <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                                                            </>
                                                        )}

                                                        {booking.status === 'office' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => { updateStatus(booking.id, 'confirmed'); setSelectedBooking(null); }}
                                                                    className="w-full px-4 py-2 text-left text-sm font-medium text-green-600 hover:bg-green-500/10 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    {$language === 'en' ? 'Confirm' : 'Confirmar'}
                                                                </button>
                                                                <button 
                                                                    onClick={() => { updateStatus(booking.id, 'completed'); setSelectedBooking(null); }}
                                                                    className="w-full px-4 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-500/10 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    {$language === 'en' ? 'Mark Completed' : 'Marcar Completado'}
                                                                </button>
                                                                <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                                                            </>
                                                        )}

                                                        {booking.status === 'confirmed' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => { updateStatus(booking.id, 'completed'); setSelectedBooking(null); }}
                                                                    className="w-full px-4 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-500/10 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    {$language === 'en' ? 'Mark Completed' : 'Marcar Completado'}
                                                                </button>
                                                                <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                                                            </>
                                                        )}
                                                        <button 
                                                            onClick={() => { window.open(`mailto:${booking.customer_email}?subject=Booking: ${booking.tour_name}`); setSelectedBooking(null); }}
                                                            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                            {$language === 'en' ? 'Send Email' : 'Enviar Email'}
                                                        </button>
                                                        {booking.customer_phone && (
                                                            <button 
                                                                onClick={() => { window.open(`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`); setSelectedBooking(null); }}
                                                                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                                            >
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                                                                {$language === 'en' ? 'WhatsApp' : 'WhatsApp'}
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => {
                                                                const printWindow = window.open('', '_blank');
                                                                if (printWindow && booking) {
                                                                    printWindow.document.write(`
                                                                        <!DOCTYPE html>
                                                                        <html>
                                                                        <head>
                                                                            <title>Booking #${booking.id.slice(0, 8)}</title>
                                                                            <style>
                                                                                * { margin: 0; padding: 0; box-sizing: border-box; }
                                                                                body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: 0 auto; }
                                                                                .header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; border-bottom: 2px solid #D92818; padding-bottom: 20px; }
                                                                                .header img { width: 80px; height: 80px; object-fit: contain; }
                                                                                .header-text h1 { color: #D92818; font-size: 24px; margin-bottom: 4px; }
                                                                                .header-text p { color: #666; font-size: 13px; }
                                                                                .booking-id { background: #f5f5f5; padding: 8px 16px; border-radius: 8px; font-family: monospace; font-size: 14px; color: #666; margin-bottom: 25px; text-align: center; }
                                                                                .section { margin-bottom: 20px; }
                                                                                .section h3 { font-size: 11px; text-transform: uppercase; color: #999; margin-bottom: 6px; letter-spacing: 1px; }
                                                                                .section p { font-size: 16px; font-weight: 600; }
                                                                                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                                                                                .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                                                                                .status.pending { background: #fef3c7; color: #d97706; }
                                                                                .status.confirmed { background: #d1fae5; color: #059669; }
                                                                                .status.cancelled { background: #fee2e2; color: #dc2626; }
                                                                                .total { font-size: 36px; font-weight: 800; color: #D92818; margin-top: 16px; }
                                                                                .total-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
                                                                                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
                                                                                .footer a { color: #D92818; text-decoration: none; }
                                                                                @media print { body { padding: 20px; } }
                                                                            </style>
                                                                        </head>
                                                                        <body>
                                                                            <div class="header">
                                                                                <img src="/logo-optimized.png" alt="Vamos Jacó Tours" />
                                                                                <div class="header-text">
                                                                                    <h1>VAMOS JACÓ TOURS</h1>
                                                                                    <p>Adventure Booking Confirmation</p>
                                                                                </div>
                                                                            </div>
                                                                            <div class="booking-id">Booking ID: ${booking.id.slice(0, 8).toUpperCase()}</div>
                                                                            <div class="grid">
                                                                                <div class="section">
                                                                                    <h3>Customer</h3>
                                                                                    <p>${booking.customer_name}</p>
                                                                                </div>
                                                                                <div class="section">
                                                                                    <h3>Email</h3>
                                                                                    <p style="font-size: 14px;">${booking.customer_email}</p>
                                                                                </div>
                                                                                <div class="section">
                                                                                    <h3>Phone</h3>
                                                                                    <p>${booking.customer_phone || 'N/A'}</p>
                                                                                </div>
                                                                                <div class="section">
                                                                                    <h3>Tour Experience</h3>
                                                                                    <p>${booking.tour_name}</p>
                                                                                </div>
                                                                                <div class="section">
                                                                                    <h3>Tour Date</h3>
                                                                                    <p>${new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                                                </div>
                                                                                <div class="section">
                                                                                    <h3>Status</h3>
                                                                                    <span class="status ${booking.status}">${booking.status}</span>
                                                                                </div>
                                                                                <div class="section">
                                                                                    <h3>Adults</h3>
                                                                                    <p>${booking.adults}</p>
                                                                                </div>
                                                                                <div class="section">
                                                                                    <h3>Children</h3>
                                                                                    <p>${booking.children}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div class="section">
                                                                                <p class="total-label">Total Amount</p>
                                                                                <p class="total">$${Number(booking.total_amount).toLocaleString()}</p>
                                                                            </div>
                                                                            <div class="footer">
                                                                                <p>📍 Jacó Beach, Costa Rica | 📞 +506 2643-1234</p>
                                                                                <p><a href="https://vamosjaco.com">vamosjaco.com</a> | Generated ${new Date().toLocaleString()}</p>
                                                                            </div>
                                                                        </body>
                                                                        </html>
                                                                    `);
                                                                    printWindow.document.close();
                                                                    printWindow.print();
                                                                }
                                                                setSelectedBooking(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                            {$language === 'en' ? 'Print' : 'Imprimir'}
                                                        </button>
                                                        <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                                                        <button 
                                                            onClick={() => { deleteBooking(booking.id); }}
                                                            className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            {$language === 'en' ? 'Delete' : 'Eliminar'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
