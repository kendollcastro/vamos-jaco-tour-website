import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DayData {
    label: string;
    revenue: number;
    count: number;
}

const DEMO_DATA: DayData[] = [
    { label: 'Wed', revenue: 420, count: 3 },
    { label: 'Thu', revenue: 180, count: 1 },
    { label: 'Fri', revenue: 650, count: 4 },
    { label: 'Sat', revenue: 890, count: 6 },
    { label: 'Sun', revenue: 720, count: 5 },
    { label: 'Mon', revenue: 340, count: 2 },
    { label: 'Tue', revenue: 510, count: 3 },
];

export default function SalesChart() {
    const [data, setData] = useState<DayData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeeklyData();
    }, []);

    async function fetchWeeklyData() {
        setLoading(true);

        if (!supabase) {
            setData(DEMO_DATA);
            setLoading(false);
            return;
        }

        const days: DayData[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayLabel = date.toLocaleDateString('en', { weekday: 'short' });

            try {
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select('total_amount')
                    .gte('created_at', `${dateStr}T00:00:00`)
                    .lte('created_at', `${dateStr}T23:59:59`)
                    .eq('status', 'confirmed');

                const revenue = (bookings || []).reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
                days.push({ label: dayLabel, revenue, count: bookings?.length || 0 });
            } catch {
                days.push({ label: dayLabel, revenue: 0, count: 0 });
            }
        }

        setData(days);
        setLoading(false);
    }

    const maxRevenue = Math.max(...data.map((d) => d.revenue), 100);

    // Generate SVG path for line chart
    const getSvgPath = () => {
        if (data.length === 0) return '';
        const w = 100;
        const h = 100;
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - (d.revenue / maxRevenue) * h;
            return `${x},${y}`;
        });

        // Add a point for a smooth curve (catmull-rom or simple polyline)
        return `M ${points.join(' L ')}`;
    };

    const getGradientPath = () => {
        if (data.length === 0) return '';
        const w = 100;
        const h = 100;
        const line = getSvgPath();
        return `${line} L ${w},${h} L 0,${h} Z`;
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 p-6 animate-pulse shadow-sm transition-colors duration-300">
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-40 mb-6" />
                <div className="flex items-end gap-3 h-40">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="flex-1 bg-gray-100 dark:bg-white/5 rounded-lg" style={{ height: `${20 + Math.random() * 80}%` }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-soft rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">Revenue Trends</h3>
                    <p className="text-gray-500 text-xs mt-1">Weekly overview of sales performance</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 dark:bg-black/20 rounded-xl max-w-fit border border-gray-200 dark:border-white/5">
                    <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-dark shadow-sm text-gray-900 dark:text-white transition-colors">Week</button>
                    <button className="px-4 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Month</button>
                    <button className="px-4 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Year</button>
                </div>
            </div>

            {/* Line Chart Area */}
            <div className="relative w-full h-[220px]">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D92818" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#D92818" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Gradient Area Below Line */}
                    <path
                        d={getGradientPath()}
                        fill="url(#gradientRed)"
                        className="transition-all duration-700 ease-in-out"
                    />

                    {/* Red Line Graph */}
                    <path
                        d={getSvgPath()}
                        fill="none"
                        stroke="#D92818"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        className="transition-all duration-700 ease-in-out drop-shadow-[0_2px_4px_rgba(217,40,24,0.3)]"
                    />

                    {/* Points on the line */}
                    {data.map((day, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - (day.revenue / maxRevenue) * 100;
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="1.5"
                                fill="#fff"
                                stroke="#D92818"
                                strokeWidth="0.8"
                                vectorEffect="non-scaling-stroke"
                            />
                        );
                    })}
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between">
                    {data.map((day, i) => (
                        <span key={i} className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{day.label}</span>
                    ))}
                </div>
            </div>
            {/* Add some padding to account for the absolute labels */}
            <div className="h-6" />
        </div>
    );
}
