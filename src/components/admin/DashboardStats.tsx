import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import SalesChart from './SalesChart';
import AddBookingModal from './AddBookingModal';
import CalendarView from './CalendarView';
import { cardClasses, statusBadge } from '../../lib/admin-design-tokens';
import { Button } from '../ui/button';
import { RefreshCw, Plus, AlertTriangle, Info, Zap, ClipboardList, Image, Mail, Calendar, Layers, Star, Edit, History } from 'lucide-react';

interface Stats {
    todayBookings: number;
    todayRevenue: number;
    pendingCount: number;
    confirmedCount: number;
    weekGrowth: number;
    totalTours: number;
}

const DEMO_BOOKINGS = [
    { id: '1', customer_name: 'Sarah Johnson', tour_name: 'ATV Mountain Adventure', total_amount: 180, status: 'confirmed', created_at: new Date().toISOString() },
    { id: '2', customer_name: 'Mike Chen', tour_name: 'Jet Ski Ocean Thrill', total_amount: 240, status: 'pending', created_at: new Date().toISOString() },
    { id: '3', customer_name: 'Ana García', tour_name: 'Side by Side Buggy Tour', total_amount: 300, status: 'confirmed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '4', customer_name: 'James Wilson', tour_name: 'Surf Lessons', total_amount: 70, status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '5', customer_name: 'Laura Rodríguez', tour_name: 'Flyboard Experience', total_amount: 150, status: 'cancelled', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const DEMO_ACTIVITY = [
    { id: '1', type: 'booking', message: 'New booking from Sarah Johnson', time: '2 min ago', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-emerald-500 bg-emerald-500/10' },
    { id: '2', type: 'tour', message: 'Updated "ATV Mountain Adventure" pricing', time: '15 min ago', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'text-blue-500 bg-blue-500/10' },
    { id: '3', type: 'payment', message: 'Payment received: $300', time: '1 hour ago', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-brand-orange bg-brand-orange/10' },
    { id: '4', type: 'user', message: 'Mike Chen registered as subscriber', time: '3 hours ago', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-purple-500 bg-purple-500/10' },
    { id: '5', type: 'alert', message: 'Low availability: Jet Ski Ocean Thrill', time: '5 hours ago', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-amber-500 bg-amber-500/10' },
];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const height = 40;
    const width = 60;
    
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((v - min) / range) * height
    }));
    
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x},${points[i].y}`;
    }
    
    return (
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    );
}

export default function DashboardStats({ onNavigate, onToast }: { onNavigate?: (view: string) => void, onToast?: (message: string) => void }) {
    const $language = useStore(language);
    const t = adminTranslations[$language];
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const lang = mounted ? $language : 'en';
    
    const [stats, setStats] = useState<Stats>({
        todayBookings: 0, todayRevenue: 0, pendingCount: 0, confirmedCount: 0, weekGrowth: 0, totalTours: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [recentTours, setRecentTours] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [overbookings, setOverbookings] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isDemo = !supabase;

    useEffect(() => {
        fetchStats();
        if (!supabase) return;
        const channel = supabase
            .channel('dashboard-audit')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'audit_log' },
                (payload: any) => {
                    const entry = payload.new;
                    const formatted = formatAuditActivities([entry]);
                    setActivities(prev => [formatted[0], ...prev].slice(0, 10));
                }
            )
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    async function fetchStats() {
        setLoading(true);

        if (!supabase) {
            setStats({ todayBookings: 3, todayRevenue: 720, pendingCount: 2, confirmedCount: 5, weekGrowth: 12.5, totalTours: 8 });
            setRecentBookings(DEMO_BOOKINGS);
            setRecentTours([]);
            setActivities(DEMO_ACTIVITY);
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
            
            const { count: totalTours } = await supabase
                .from('tours')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            setStats({
                todayBookings: todayBookings.length,
                todayRevenue,
                pendingCount: pendingCount || 0,
                confirmedCount: confirmedCount || 0,
                weekGrowth: 12.5,
                totalTours: totalTours || 0,
            });

            const { data: recent } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentBookings(recent || []);
            const { data: tours } = await supabase
                .from('tours')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(2);

            setRecentTours(tours || []);

            const { data: overbooked } = await supabase
                .from('bookings')
                .select('*, tours:tour_id(name_en, name_es)')
                .eq('status', 'overbooked')
                .order('created_at', { ascending: false });

            setOverbookings(overbooked || []);

            // Fetch audit log activity
            const { data: auditData } = await supabase
                .from('audit_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (auditData) {
                setActivities(formatAuditActivities(auditData));
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
        setLoading(false);
    }

    function formatAuditActivities(entries: any[]) {
        const actionIcons: Record<string, string> = {
            create: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
            update: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
            delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        };
        const tableColors: Record<string, string> = {
            bookings: 'text-blue-500 bg-blue-500/10',
            commissions: 'text-emerald-500 bg-emerald-500/10',
            tours: 'text-purple-500 bg-purple-500/10',
        };
        const getTimeAgo = (date: string) => {
            const diff = Date.now() - new Date(date).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return 'just now';
            if (mins < 60) return `${mins} min ago`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs}h ago`;
            return `${Math.floor(hrs / 24)}d ago`;
        };
        return entries.map((e: any) => ({
            id: e.id,
            type: e.table_name,
            message: e.summary || `${e.action} ${e.table_name}`,
            time: getTimeAgo(e.created_at),
            icon: actionIcons[e.action] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: tableColors[e.table_name] || 'text-gray-500 bg-gray-500/10',
        }));
    }

    const statCards = [
        {
            label: t.dashboard.todayBookings,
            value: stats.todayBookings,
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-[#1A1F2C]',
            percentage: '+15%',
            sparkline: [3, 5, 4, 6, 3, 5, 4],
            sparkColor: '#3B82F6',
        },
        {
            label: t.dashboard.totalRevenue,
            value: `$${stats.todayRevenue.toLocaleString()}`,
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-orange-500 dark:text-[#F97316]',
            bg: 'bg-orange-50 dark:bg-[#2C1A1A]',
            percentage: '+8.4%',
            sparkline: [420, 180, 650, 890, 720, 340, 510],
            sparkColor: '#F97316',
        },
        {
            label: t.dashboard.pendingRequests,
            value: stats.pendingCount,
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-purple-500 dark:text-[#A855F7]',
            bg: 'bg-purple-50 dark:bg-[#1E1A2C]',
            percentage: lang === 'en' ? 'Low priority' : 'Baja prioridad',
            sparkline: [2, 4, 3, 5, 2, 3, 2],
            sparkColor: '#A855F7',
        },
        {
            label: t.dashboard.confirmedSales,
            value: stats.confirmedCount,
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-emerald-500 dark:text-[#10B981]',
            bg: 'bg-emerald-50 dark:bg-[#0F291E]',
            percentage: lang === 'en' ? '98% Success' : '98% Éxito',
            sparkline: [5, 7, 6, 8, 5, 6, 5],
            sparkColor: '#10B981',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-[#111111] rounded-[24px] border border-gray-200 dark:border-white/5 p-6 animate-pulse shadow-sm">
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
                        {t.dashboard.welcomeBack}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-bold uppercase tracking-widest">
                        {t.dashboard.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => fetchStats()}
                        className="flex-1 md:flex-none gap-2 shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {t.common.refresh}
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 md:flex-none gap-2 shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        {t.common.addBooking}
                    </Button>
                </div>
            </div>

            <AddBookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => fetchStats()} 
            />

            {/* Overbooking Alert */}
            {overbookings.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-500 rounded-xl p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-red-800 dark:text-red-400 font-bold text-lg">
                                {lang === 'en' ? '⚠️ OVERBOOKING ALERT' : '⚠️ ALERTA DE SOBREBOOKING'}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {overbookings.slice(0, 3).map((b: any) => (
                                    <div key={b.id} className="text-sm text-red-700 dark:text-red-300">
                                        <span className="font-bold">{b.tours?.name_en || b.tours?.name_es || 'Tour'}</span>
                                        {' - '} 
                                        {new Date(b.booking_date).toLocaleDateString()}
                                        {' - '}
                                        <span className="font-bold">{b.customer_name}</span>
                                    </div>
                                ))}
                                {overbookings.length > 3 && (
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                        +{overbookings.length - 3} {lang === 'en' ? 'more' : 'más'}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => onNavigate?.('bookings')}
                            className="flex-shrink-0 text-sm"
                        >
                            {lang === 'en' ? 'View All' : 'Ver Todos'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Demo banner */}
            {isDemo && (
                <div className="bg-brand-teal/5 border border-brand-teal/20 dark:border-brand-teal/10 rounded-[20px] px-5 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/20 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-brand-teal" />
                    </div>
                    <div>
                        <p className="text-brand-teal font-semibold text-sm leading-tight dark:text-emerald-400">{t.dashboard.demoMode}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{t.dashboard.demoMessage}</p>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Stats + Chart) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stat Cards - Bento Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((card, idx) => (
                            <div
                                key={card.label}
                                className="relative overflow-hidden bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 shadow-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Background Gradient */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.bg.replace('dark:bg-', 'from-').split(' ')[0]}/30 to-transparent`} />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center transition-premium group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                                            <svg className={`w-6 h-6 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                                            </svg>
                                        </div>
                                        {card.percentage.includes('%') ? (
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${card.percentage.startsWith('+') || card.percentage.includes('Success') ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-primary/10 text-primary'}`}>{card.percentage}</span>
                                        ) : (
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5">{card.percentage}</span>
                                        )}
                                    </div>
                                    <div className="space-y-1 mb-4">
                                        <span className="block text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.label}</span>
                                        <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">{card.value}</p>
                                    </div>
                                    {/* Mini Sparkline */}
                                    <div className="h-10 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                                        <MiniSparkline data={card.sparkline} color={card.sparkColor} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sales Chart */}
                    <SalesChart onToast={onToast} />
                </div>

                {/* Right Column - Activity Timeline & Quick Stats */}
                <div className="space-y-6">
                    {/* Activity Timeline - Premium Glassmorphism */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-white/80 via-white/60 to-blue-50/30 dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 dark:to-blue-950/10 rounded-3xl border border-white/20 dark:border-white/5 p-6 shadow-xl backdrop-blur-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-gray-900 dark:text-white font-heading font-black text-lg tracking-tight uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    {t.dashboard.liveActivity}
                                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider ml-auto">audit log</span>
                                </h3>
                                <Button variant="link" onClick={() => onNavigate?.('auditLog')} className="text-[10px] uppercase tracking-widest">{t.common.viewAll}</Button>
                            </div>
                            
                            {activities.length === 0 ? (
                                <p className="text-gray-500 text-sm py-4 text-center">{t.dashboard.noBookings}</p>
                            ) : (
                                <div className="space-y-4">
                                    {activities.slice(0, 5).map((activity, idx) => (
                                        <div key={activity.id} className="flex items-start gap-3 group">
                                            <div className={`w-8 h-8 rounded-xl ${activity.color} flex items-center justify-center shrink-0 shadow-sm`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={activity.icon} />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-900 dark:text-white text-xs font-semibold leading-tight group-hover:text-primary transition-colors">{activity.message}</p>
                                                <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5 font-medium">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Widget */}
                    <div className="bg-gradient-to-br from-primary/10 to-brand-orange/10 dark:from-primary/20 dark:to-brand-orange/20 rounded-3xl p-6 border border-primary/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t.dashboard.quickStats}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/5">
                                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{t.dashboard.weekGrowth}</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">+{stats.weekGrowth}%</p>
                            </div>
                            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/5">
                                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{t.dashboard.activeTours}</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalTours}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-2">{t.quickActions.title}</span>
                <Button variant="ghost" onClick={() => onNavigate?.('tours')} className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-400 text-xs font-bold rounded-xl gap-2 h-auto">
                    <Plus className="w-4 h-4" />
                    {t.quickActions.newTour}
                </Button>
                <Button variant="ghost" onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange text-xs font-bold rounded-xl gap-2 h-auto">
                    <ClipboardList className="w-4 h-4" />
                    {t.quickActions.addBooking}
                </Button>
                <Button variant="ghost" onClick={() => onNavigate?.('gallery')} className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-xl gap-2 h-auto">
                    <Image className="w-4 h-4" />
                    {t.quickActions.uploadMedia}
                </Button>
                <Button variant="ghost" onClick={() => onNavigate?.('subscribers')} className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl gap-2 h-auto">
                    <Mail className="w-4 h-4" />
                    {t.quickActions.sendNewsletter}
                </Button>
            </div>

            {/* Calendar View Section */}
            <div className="mt-8 space-y-6">
                <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-heading font-black text-gray-900 dark:text-white tracking-tight">
                        {lang === 'en' ? 'Booking Calendar' : 'Calendario de Reservas'}
                    </h2>
                </div>
                <CalendarView />
            </div>

            {/* Manage Tours Preview Grid */}
            <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-heading font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Layers className="w-6 h-6 text-primary" />
                        {t.dashboard.manageTours}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="px-4 py-2 rounded-full text-[11px] font-bold h-auto">{t.common.allCategories}</Button>
                        <Button variant="outline" className="px-4 py-2 rounded-full text-[11px] font-bold h-auto">{t.common.filter}</Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentTours.map((tour) => (
                        <div key={tour.id} className="group cursor-pointer bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200/50 dark:border-white/5 overflow-hidden shadow-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col">
                            <div className="h-44 relative overflow-hidden bg-gray-100 dark:bg-[#1A1A1A]">
                                {tour.image_url ? (
                                    <img src={tour.image_url} alt={tour.name_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">Popular</span>
                                </div>
                                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                    <span className="font-black text-2xl text-white">${tour.price_base}</span>
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                        <span className="text-white font-bold text-xs">{tour.rating || '4.9'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex items-center justify-between">
                                <h4 className="text-gray-900 dark:text-white font-bold text-base">{tour.name_en}</h4>
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary hover:bg-primary/10">
                                    <Edit className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div onClick={() => onNavigate?.('tours')} className="group cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0A0A0A] dark:to-blue-950/10 border-2 border-dashed border-gray-300/50 dark:border-white/10 hover:border-primary dark:hover:border-primary/50 rounded-3xl flex flex-col items-center justify-center h-72 transition-all duration-500">
                        <div className="w-16 h-16 rounded-2xl border-2 border-gray-300 dark:border-white/20 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 text-gray-400 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                            <Plus className="w-7 h-7" />
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 font-bold text-base tracking-wide">Add New Tour</span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs mt-1">Create a new adventure</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
