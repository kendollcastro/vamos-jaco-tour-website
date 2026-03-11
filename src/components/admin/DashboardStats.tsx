import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SalesChart from './SalesChart';

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
            {/* Demo banner */}
            {isDemo && (
                <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-[20px] px-5 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-brand-teal font-semibold text-sm">Demo Mode</p>
                        <p className="text-gray-400 text-xs">Showing sample data. Connect Supabase to see real bookings.</p>
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
                                className="bg-white dark:bg-dark-soft rounded-2xl border border-gray-200 dark:border-white/5 p-5 shadow-sm hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                                        <svg className={`w-5 h-5 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                                        </svg>
                                    </div>
                                    {card.percentage.includes('%') ? (
                                        <span className={`text-xs font-bold ${card.percentage.startsWith('+') ? 'text-green-500' : 'text-primary'}`}>{card.percentage}</span>
                                    ) : (
                                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{card.percentage}</span>
                                    )}
                                </div>
                                <div>
                                    <span className="block text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">{card.label}</span>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</p>
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
                    <div className="bg-white dark:bg-dark-soft rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm h-full max-h-[600px] flex flex-col transition-colors duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                                Recent Activity
                            </h3>
                            <button className="text-primary text-xs font-bold hover:underline">View All</button>
                        </div>
                        {recentBookings.length === 0 ? (
                            <p className="text-gray-500 text-sm py-4 text-center">No bookings yet. They will appear here in real time.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors rounded-lg px-2 -mx-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {booking.customer_name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="text-gray-900 dark:text-white leading-tight text-sm font-bold">{booking.customer_name}</p>
                                                <p className="text-gray-500 text-[11px] font-medium">{booking.tour_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-900 dark:text-white text-sm font-black">${Number(booking.total_amount).toLocaleString()}</p>
                                            <p className="text-gray-400 text-[10px] mt-0.5">2 mins ago</p>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400'
                                                : booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400'
                                                    : 'bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {booking.status}
                                            </span>
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
