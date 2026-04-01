import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AddBookingModal from './AddBookingModal';

interface Booking {
    id: string;
    tour_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    booking_date: string;
    adults: number;
    children: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    tilopay_order_id?: string;
    created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const DEMO_BOOKINGS: Booking[] = [
    { id: '1', tour_name: 'ATV Mountain Adventure', customer_name: 'Sarah Johnson', customer_email: 'sarah@email.com', customer_phone: '+1 555-0101', booking_date: new Date().toISOString().split('T')[0], adults: 2, children: 1, total_amount: 180, status: 'confirmed', created_at: new Date().toISOString() },
    { id: '2', tour_name: 'Jet Ski Ocean Thrill', customer_name: 'Mike Chen', customer_email: 'mike@email.com', customer_phone: '+1 555-0102', booking_date: new Date().toISOString().split('T')[0], adults: 2, children: 0, total_amount: 240, status: 'pending', created_at: new Date().toISOString() },
    { id: '3', tour_name: 'Side by Side Buggy Tour', customer_name: 'Ana García', customer_email: 'ana@email.com', customer_phone: '+506 8888-1234', booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], adults: 4, children: 2, total_amount: 600, status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '4', tour_name: 'Surf Lessons', customer_name: 'James Wilson', customer_email: 'james@email.com', customer_phone: '+1 555-0104', booking_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], adults: 1, children: 0, total_amount: 70, status: 'confirmed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '5', tour_name: 'Flyboard Experience', customer_name: 'Laura Rodríguez', customer_email: 'laura@email.com', customer_phone: '+506 7777-5678', booking_date: new Date(Date.now() - 172800000).toISOString().split('T')[0], adults: 2, children: 0, total_amount: 160, status: 'cancelled', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: '6', tour_name: 'Slingshot Rental', customer_name: 'Carlos Méndez', customer_email: 'carlos@email.com', customer_phone: '+506 6666-4321', booking_date: new Date().toISOString().split('T')[0], adults: 1, children: 0, total_amount: 350, status: 'confirmed', created_at: new Date(Date.now() - 7200000).toISOString() },
];

export default function BookingsTable() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
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
        setBookings((data as Booking[]) || []);
        setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
        if (isDemo) {
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
            return;
        }

        if (!supabase) return;
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) fetchBookings();
    }

    const filtered = bookings.filter((b) => {
        const matchesFilter = filter === 'all' || b.status === filter;
        const matchesSearch = !searchQuery ||
            b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.tour_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
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
                        placeholder="Search customer, email or tour..."
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
                        Refresh
                    </button>

                    {/* Status Filter */}
                    <div className="flex p-1.5 bg-gray-100 dark:bg-black/20 rounded-[14px] border border-gray-200 dark:border-white/5 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                        {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-5 py-2 rounded-[10px] text-xs font-bold transition-all capitalize whitespace-nowrap ${filter === s
                                    ? 'bg-white dark:bg-dark-soft shadow-sm text-gray-900 dark:text-white'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Create Booking Button */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Booking
                    </button>
                </div>
            </div>

            <AddBookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => fetchBookings()} 
            />

            {/* Table */}
            <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors duration-300">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500 font-medium">No bookings found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden md:table-cell">Tour</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">Actions</th>
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
                                            {booking.tilopay_order_id ? (
                                                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-green-500/80 font-mono font-bold bg-green-500/10 w-max px-2 py-0.5 rounded border border-green-500/20" title="Tilopay Transition ID">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                                                    {booking.tilopay_order_id.substring(0, 16)}...
                                                </div>
                                            ) : (
                                                <div className="mt-1 text-[10px] text-gray-400 font-medium">Cash / Manual</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${STATUS_STYLES[booking.status] || ''}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {booking.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, 'confirmed')}
                                                            className="p-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm hover:-translate-y-0.5 active:scale-95"
                                                            title="Confirm"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, 'cancelled')}
                                                            className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:-translate-y-0.5 active:scale-95"
                                                            title="Cancel"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                        </svg>
                                                    </button>
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
