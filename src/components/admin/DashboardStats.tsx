import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SalesChart from './SalesChart';
import AddBookingModal from './AddBookingModal';

interface Stats {
    todayBookings: number;
    todayRevenue: number;
    pendingCount: number;
    confirmedCount: number;
}

/* ─── Demo data when Supabase is not connected ─── */
const DEMO_BOOKINGS = [
    { id: '1', customer_name: 'Sarah Johnson', tour_name: 'ATV Mountain Adventure', total_amount: 180, status: 'confirmed', created_at: new Date().toISOString() },
    { id: '2', customer_name: 'Mike Chen', tour_name: 'Jet Ski Ocean Thrill', total_amount: 240, status: 'pending', created_at: new Date().toISOString() },
    { id: '3', customer_name: 'Ana García', tour_name: 'Side by Side Buggy Tour', total_amount: 300, status: 'confirmed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '4', customer_name: 'James Wilson', tour_name: 'Surf Lessons', total_amount: 70, status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '5', customer_name: 'Laura Rodríguez', tour_name: 'Flyboard Experience', total_amount: 150, status: 'cancelled', created_at: new Date(Date.now() - 172800000).toISOString() },
];

export default function DashboardStats() {
    const [stats, setStats] = useState<Stats>({
        todayBookings: 0, todayRevenue: 0, pendingCount: 0, confirmedCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isDemo = !supabase;

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        setLoading(true);

        if (!supabase) {
            // Demo mode
            setStats({ todayBookings: 3, todayRevenue: 720, pendingCount: 2, confirmedCount: 5 });
            setRecentBookings(DEMO_BOOKINGS);
            setLoading(false);
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        try {
            const { data: todayData } = await supabase
                .from('bookings')
                .select('*')
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`);

            const todayBookings = todayData || [];
            const todayRevenue = todayBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

            const { count: pendingCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            const { count: confirmedCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'confirmed');

            setStats({
                todayBookings: todayBookings.length,
                todayRevenue,
                pendingCount: pendingCount || 0,
                confirmedCount: confirmedCount || 0,
            });

            const { data: recent } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentBookings(recent || []);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
        setLoading(false);
    }

    const statCards = [
        {
            label: "Today's Bookings",
            value: stats.todayBookings,
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            percentage: '+15%',
        },
        {
            label: 'Total Revenue',
            value: `$${stats.todayRevenue.toLocaleString()}`,
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            percentage: '+18.4%',
        },
        {
            label: 'Pending Requests',
            value: stats.pendingCount,
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            percentage: 'Level priority',
        },
        {
            label: 'Confirmed Sales',
            value: stats.confirmedCount,
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            percentage: '98% Success',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 p-6 animate-pulse shadow-sm">
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3 mb-3" />
                            <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Section: Welcome & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-1">
                        Welcome back, Admin! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-bold uppercase tracking-widest">
                        Insights & Analytics for Vamos Jacó Tours
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
                        onClick={() => fetchStats()}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                    <button 
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Booking
                    </button>
                </div>
            </div>

            <AddBookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => fetchStats()} 
            />

            {/* Demo banner */}
            {isDemo && (
                <div className="bg-brand-teal/5 border border-brand-teal/20 dark:border-brand-teal/10 rounded-[20px] px-5 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-brand-teal font-semibold text-sm leading-tight dark:text-emerald-400">Demo Mode Active</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Showing sample data. Login with Supabase for real-time tracking.</p>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Stats + Chart) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="glass dark:bg-dark-soft/40 rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-premium hover:border-primary/50 transition-premium group"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center transition-premium group-hover:scale-110 group-hover:rotate-3`}>
                                        <svg className={`w-6 h-6 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                                        </svg>
                                    </div>
                                    {card.percentage.includes('%') ? (
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${card.percentage.startsWith('+') ? 'bg-green-500 text-white' : 'bg-primary text-white'}`}>{card.percentage}</span>
                                    ) : (
                                        <span className="text-[10px] text-gray-700 dark:text-gray-200 font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-1 rounded-md">{card.percentage}</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <span className="block text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">{card.label}</span>
                                    <p className="text-3xl font-heading font-black text-gray-900 dark:text-white leading-none">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sales Chart */}
                    <SalesChart />
                </div>

                {/* Right Column (Recent Activity) */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <div className="glass dark:bg-dark-soft/40 rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-premium h-full max-h-[600px] flex flex-col transition-premium">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-gray-900 dark:text-white font-heading font-black text-xl tracking-tight uppercase">
                                Recent Activity
                            </h3>
                            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                        </div>
                        {recentBookings.length === 0 ? (
                            <p className="text-gray-500 text-sm py-4 text-center">No bookings yet. They will appear here in real time.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentBookings.map((booking) => (
                                    <div key={booking.id} className="group relative flex items-center justify-between p-3 border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] transition-all rounded-2xl cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm transition-transform group-hover:scale-110 ${
                                                booking.status === 'confirmed' ? 'bg-green-500/10 text-green-600' : 
                                                booking.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : 
                                                'bg-amber-500/10 text-amber-600'
                                            }`}>
                                                {booking.customer_name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="text-gray-900 dark:text-white leading-tight text-sm font-black group-hover:text-primary transition-colors">{booking.customer_name}</p>
                                                <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold mt-0.5">{booking.tour_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-900 dark:text-white text-sm font-black tracking-tighter">${Number(booking.total_amount).toLocaleString()}</p>
                                            <div className="flex items-center justify-end gap-1.5 mt-1">
                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                    booking.status === 'confirmed' ? 'bg-green-500' : 
                                                    booking.status === 'cancelled' ? 'bg-red-500' : 
                                                    'bg-amber-500'
                                                }`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                    booking.status === 'confirmed' ? 'text-green-500' : 
                                                    booking.status === 'cancelled' ? 'text-red-500' : 
                                                    'text-amber-500'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
