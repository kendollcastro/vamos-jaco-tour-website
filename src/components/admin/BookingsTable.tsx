import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { logAudit } from '../../lib/audit';
import AuditInfo from './AuditInfo';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import AddBookingModal from './AddBookingModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import BookingDetailsModal from './BookingDetailsModal';
import BulkDeleteModal from './BulkDeleteModal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Search, RefreshCw, Download, Calendar, X, Plus, MoreHorizontal, Eye, Check, Mail, Printer, Trash2, CheckCircle, FileText, CheckSquare } from 'lucide-react';

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
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const lang = mounted ? $language : 'en';
    
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
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
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
            onToast?.(newStatus === 'confirmed' ? (lang === 'en' ? 'Booking confirmed!' : '¡Reserva confirmada!') : (lang === 'en' ? 'Booking cancelled' : 'Reserva cancelada'));
            return;
        }

        if (!supabase) return;
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            const booking = bookings.find(b => b.id === id);
            await logAudit({
                action: 'update',
                table_name: 'bookings',
                record_id: id,
                summary: `Updated booking ${booking?.customer_name || id} status to ${newStatus}`
            });
            fetchBookings();
            onToast?.(newStatus === 'confirmed' ? (lang === 'en' ? 'Booking confirmed!' : '¡Reserva confirmada!') : (lang === 'en' ? 'Booking cancelled' : 'Reserva cancelada'));
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
            onToast?.(lang === 'en' ? 'Booking deleted' : 'Reserva eliminada');
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
            await logAudit({
                action: 'delete',
                table_name: 'bookings',
                record_id: id,
                summary: `Deleted booking: ${bookingToDelete.customerName} - ${bookingToDelete.tourName}`
            });
            fetchBookings();
            onToast?.(lang === 'en' ? 'Booking deleted' : 'Reserva eliminada');
        }
        setDeleteModalOpen(false);
        setBookingToDelete(null);
    }

    async function confirmBulkDelete(ids: string[]) {
        if (isDemo) {
            setBookings(prev => prev.filter(b => !ids.includes(b.id)));
            setSelectedIds(new Set());
            setBulkDeleteOpen(false);
            onToast?.(lang === 'en' ? `${ids.length} bookings deleted` : `${ids.length} reservas eliminadas`);
            return;
        }

        if (!supabase) return;
        let successCount = 0;
        for (const id of ids) {
            const booking = bookings.find(b => b.id === id);
            const { error } = await supabase.from('bookings').delete().eq('id', id);
            if (!error) {
                await logAudit({
                    action: 'delete',
                    table_name: 'bookings',
                    record_id: id,
                    summary: `Deleted booking: ${booking?.customer_name || id} - ${booking?.tour_name || ''}`
                });
                successCount++;
            }
        }
        fetchBookings();
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        onToast?.(lang === 'en' ? `${successCount} bookings deleted` : `${successCount} reservas eliminadas`);
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

        onToast?.(lang === 'en' ? `Exported ${filtered.length} bookings to CSV` : `Exportados ${filtered.length} reservas a CSV`);
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={lang === 'en' ? "Search customer, email or tour..." : "Buscar cliente, email o tour..."}
                        className="w-full rounded-full pl-11 pr-4 py-3 h-auto text-sm shadow-sm"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="gap-2 rounded-full shadow-sm shrink-0"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {lang === 'en' ? 'Refresh' : 'Actualizar'}
                    </Button>

                    {/* Export CSV Button */}
                    <Button
                        variant="outline"
                        onClick={exportToCSV}
                        disabled={filtered.length === 0}
                        className="gap-2 rounded-full shadow-sm shrink-0"
                        title={lang === 'en' ? 'Export to CSV' : 'Exportar a CSV'}
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden md:inline">{lang === 'en' ? 'Export' : 'Exportar'}</span>
                    </Button>

                    {/* Bulk Delete Button */}
                    {selectedIds.size > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => setBulkDeleteOpen(true)}
                            className="gap-2 rounded-full shadow-sm shrink-0"
                        >
                            <Trash2 className="w-4 h-4" />
                            {lang === 'en' ? `Delete (${selectedIds.size})` : `Eliminar (${selectedIds.size})`}
                        </Button>
                    )}

                    {/* Status Filter */}
                    <div className="flex p-1.5 bg-gray-100 dark:bg-black/20 rounded-lg border border-border/20 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                        {[
                            { key: 'all', en: 'All', es: 'Todos' },
                            { key: 'confirmed', en: 'Confirmed', es: 'Confirmado' },
                            { key: 'cancelled', en: 'Cancelled', es: 'Cancelado' }
                        ].map((s) => (
                            <Button
                                key={s.key}
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilter(s.key)}
                                className={`px-5 rounded-md text-xs font-bold capitalize ${filter === s.key
                                    ? 'bg-white dark:bg-dark-soft shadow-sm text-gray-900 dark:text-white hover:bg-white dark:hover:bg-dark-soft'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {lang === 'en' ? s.en : s.es}
                            </Button>
                        ))}
                    </div>

                    {/* Date Filters */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-auto pl-10 pr-3 py-2 h-auto rounded-lg text-xs font-medium"
                                title={lang === 'en' ? 'From date' : 'Desde fecha'}
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative">
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-auto px-3 py-2 h-auto rounded-lg text-xs font-medium"
                                title={lang === 'en' ? 'To date' : 'Hasta fecha'}
                            />
                        </div>
                        {(dateFrom || dateTo) && (
                            <Button
                                variant="ghost"
                                onClick={() => { setDateFrom(''); setDateTo(''); }}
                                className="p-2 h-auto text-gray-400 hover:text-red-500"
                                title={lang === 'en' ? 'Clear dates' : 'Limpiar fechas'}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Create Booking Button */}
                    <Button
                        variant="default"
                        onClick={() => setIsModalOpen(true)}
                        className="hidden sm:flex gap-2 rounded-full shadow-lg shadow-primary/25"
                    >
                        <Plus className="w-4 h-4" strokeWidth={3} />
                        {lang === 'en' ? 'Create Booking' : 'Crear Reserva'}
                    </Button>
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

            <BulkDeleteModal
                isOpen={bulkDeleteOpen}
                onClose={() => setBulkDeleteOpen(false)}
                onConfirm={confirmBulkDelete}
                bookings={Array.from(selectedIds).map(id => {
                    const b = bookings.find(bk => bk.id === id);
                    return { id, customerName: b?.customer_name || '', tourName: b?.tour_name || '' };
                })}
            />

            {/* Table */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-border/20 overflow-hidden shadow-sm transition-colors duration-300">
                {loading ? (
                    <div className="p-6">
                        {/* Header skeleton */}
                        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-border/20">
                            <div className="w-24 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-32 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-40 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse hidden md:block" />
                            <div className="w-20 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-24 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            <div className="w-16 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse ml-auto" />
                        </div>
                        {/* Row skeletons */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-4 py-4 border-b border-border/10 last:border-0">
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
                        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" strokeWidth={1} />
                        <p className="text-gray-500 font-medium">{lang === 'en' ? 'No bookings found' : 'No se encontraron reservas'}</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border/20 bg-muted/30">
                                <TableHead className="w-12 px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={filtered.length > 0 && selectedIds.size === filtered.length}
                                        indeterminate={selectedIds.size > 0 && selectedIds.size < filtered.length}
                                        onChange={() => {
                                            if (selectedIds.size === filtered.length) {
                                                setSelectedIds(new Set());
                                            } else {
                                                setSelectedIds(new Set(filtered.map(b => b.id)));
                                            }
                                        }}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </TableHead>
                                <TableHead className="text-left px-4 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{lang === 'en' ? 'Date' : 'Fecha'}</TableHead>
                                <TableHead className="text-left px-4 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{lang === 'en' ? 'Customer' : 'Cliente'}</TableHead>
                                <TableHead className="text-left px-4 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden md:table-cell">{lang === 'en' ? 'Tour' : 'Tour'}</TableHead>
                                <TableHead className="text-left px-4 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{lang === 'en' ? 'Amount' : 'Monto'}</TableHead>
                                <TableHead className="text-left px-4 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{lang === 'en' ? 'Status' : 'Estado'}</TableHead>
                                <TableHead className="text-left px-4 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">{lang === 'en' ? 'Actions' : 'Acciones'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border/20">
                            {filtered.map((booking) => (
                                <TableRow key={booking.id} className="hover:bg-accent/50 transition-colors group">
                                    <TableCell className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(booking.id)}
                                            onChange={() => {
                                                const next = new Set(selectedIds);
                                                if (next.has(booking.id)) {
                                                    next.delete(booking.id);
                                                } else {
                                                    next.add(booking.id);
                                                }
                                                setSelectedIds(next);
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary cursor-pointer"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="text-gray-900 dark:text-white text-sm font-bold">{new Date(booking.booking_date).toLocaleDateString()}</div>
                                        <div className="text-gray-500 text-xs font-medium">{new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
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
                                    </TableCell>
                                    <TableCell className="px-4 py-4 hidden md:table-cell">
                                        <p className="text-gray-900 dark:text-white font-bold leading-tight line-clamp-1">{booking.tour_name}</p>
                                        <p className="text-gray-500 text-xs font-medium">{booking.adults} adults, {booking.children} kids</p>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className="text-gray-900 dark:text-white font-black text-base">${Number(booking.total_amount).toLocaleString()}</span>
                                        {booking.tilopay_order_id && (
                                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-green-600 dark:text-green-500/90 font-bold bg-green-500/20 w-max px-2 py-0.5 rounded border border-green-500/30">
                                                <CheckCircle className="w-3 h-3" />
                                                TiloPay - Paid
                                            </div>
                                        )}
                                        {!booking.tilopay_order_id && (
                                            <div className="mt-1 text-[10px] text-gray-400 font-medium">Cash / Manual</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                                            STATUS_STYLES[booking.status] 
                                            ? (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
                                                ? STATUS_STYLES[booking.status].dark 
                                                : STATUS_STYLES[booking.status].light)
                                            : STATUS_STYLES.pending.light
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                                                className="rounded-xl"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                            
                                            <AuditInfo recordId={booking.id} />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => { setSelectedBookingDetails(booking); setDetailsModalOpen(true); }}
                                                className="ml-1 rounded-xl"
                                                title={lang === 'en' ? 'View Details' : 'Ver Detalles'}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            
                                            {selectedBooking?.id === booking.id && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#111111] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <div className="border-t border-border/20 my-1" />
                                                        </>
                                                    )}
                                                    
                                                    {booking.status === 'paid' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => { updateStatus(booking.id, 'confirmed'); setSelectedBooking(null); }}
                                                                className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-green-600 hover:bg-green-500/10 gap-2 rounded-none"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                {lang === 'en' ? 'Confirm' : 'Confirmar'}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => { updateStatus(booking.id, 'completed'); setSelectedBooking(null); }}
                                                                className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-gray-600 hover:bg-gray-500/10 gap-2 rounded-none"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                {lang === 'en' ? 'Mark Completed' : 'Marcar Completado'}
                                                            </Button>
                                                            <div className="border-t border-border/20 my-1" />
                                                        </>
                                                    )}

                                                    {booking.status === 'office' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => { updateStatus(booking.id, 'confirmed'); setSelectedBooking(null); }}
                                                                className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-green-600 hover:bg-green-500/10 gap-2 rounded-none"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                {lang === 'en' ? 'Confirm' : 'Confirmar'}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => { updateStatus(booking.id, 'completed'); setSelectedBooking(null); }}
                                                                className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-gray-600 hover:bg-gray-500/10 gap-2 rounded-none"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                {lang === 'en' ? 'Mark Completed' : 'Marcar Completado'}
                                                            </Button>
                                                            <div className="border-t border-border/20 my-1" />
                                                        </>
                                                    )}

                                                    {booking.status === 'confirmed' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => { updateStatus(booking.id, 'completed'); setSelectedBooking(null); }}
                                                                className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-gray-600 hover:bg-gray-500/10 gap-2 rounded-none"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                {lang === 'en' ? 'Mark Completed' : 'Marcar Completado'}
                                                            </Button>
                                                            <div className="border-t border-border/20 my-1" />
                                                        </>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => { window.open(`mailto:${booking.customer_email}?subject=Booking: ${booking.tour_name}`); setSelectedBooking(null); }}
                                                        className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 gap-2 rounded-none"
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                        {lang === 'en' ? 'Send Email' : 'Enviar Email'}
                                                    </Button>
                                                    {booking.customer_phone && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => { window.open(`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`); setSelectedBooking(null); }}
                                                            className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 gap-2 rounded-none"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                                                            {lang === 'en' ? 'WhatsApp' : 'WhatsApp'}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const printWindow = window.open('', '_blank');
                                                            if (printWindow && booking) {
                                                                const escape = (s: any) => String(s ?? '')
                                                                    .replace(/&/g, '&amp;')
                                                                    .replace(/</g, '&lt;')
                                                                    .replace(/>/g, '&gt;')
                                                                    .replace(/"/g, '&quot;')
                                                                    .replace(/'/g, '&#39;');
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
                                                                        <div class="booking-id">Booking ID: ${escape(booking.id).slice(0, 8).toUpperCase()}</div>
                                                                        <div class="grid">
                                                                            <div class="section">
                                                                                <h3>Customer</h3>
                                                                                <p>${escape(booking.customer_name)}</p>
                                                                            </div>
                                                                            <div class="section">
                                                                                <h3>Email</h3>
                                                                                <p style="font-size: 14px;">${escape(booking.customer_email)}</p>
                                                                            </div>
                                                                            <div class="section">
                                                                                <h3>Phone</h3>
                                                                                <p>${escape(booking.customer_phone || 'N/A')}</p>
                                                                            </div>
                                                                            <div class="section">
                                                                                <h3>Tour Experience</h3>
                                                                                <p>${escape(booking.tour_name)}</p>
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
                                                        className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 gap-2 rounded-none"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                        {lang === 'en' ? 'Print' : 'Imprimir'}
                                                    </Button>
                                                    <div className="border-t border-border/20 my-1" />
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => { deleteBooking(booking.id); }}
                                                        className="w-full justify-start px-4 py-2 h-auto text-sm font-medium text-red-500 hover:bg-red-500/10 gap-2 rounded-none"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        {lang === 'en' ? 'Delete' : 'Eliminar'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
