import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Subscriber {
    id: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

const DEMO_SUBSCRIBERS: Subscriber[] = [
    { id: '1', email: 'traveler1@example.com', is_active: true, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', email: 'adventure.fan@gmail.com', is_active: true, created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: '3', email: 'jaco.lover@outlook.com', is_active: false, created_at: new Date(Date.now() - 259200000).toISOString() },
];

export default function SubscribersTable() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const isDemo = !supabase;

    useEffect(() => {
        fetchSubscribers();

        if (!supabase) return;

        const channel = supabase
            .channel('subscribers-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'subscribers' }, () => {
                fetchSubscribers();
            })
            .subscribe();

        return () => { supabase?.removeChannel(channel); };
    }, []);

    async function fetchSubscribers() {
        setLoading(true);

        if (!supabase) {
            setSubscribers(DEMO_SUBSCRIBERS);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching subscribers:', error);
        }
        setSubscribers((data as Subscriber[]) || []);
        setLoading(false);
    }

    async function toggleActive(id: string, currentStatus: boolean) {
        if (isDemo) {
            setSubscribers(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
            return;
        }

        if (!supabase) return;
        const { error } = await supabase
            .from('subscribers')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (!error) fetchSubscribers();
    }

    const filtered = subscribers.filter((s) => 
        !searchQuery || s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by email..."
                        className="w-full bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors shadow-sm"
                    />
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold border border-primary/20">
                    Total: {subscribers.length} Subscribers
                </div>
            </div>

            <div className="bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No subscribers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                    <th className="text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]">Email Address</th>
                                    <th className="text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]">Joined Date</th>
                                    <th className="text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]">Status</th>
                                    <th className="text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filtered.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                sub.is_active 
                                                    ? 'bg-green-500/10 text-green-500' 
                                                    : 'bg-gray-500/10 text-gray-500'
                                            }`}>
                                                {sub.is_active ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleActive(sub.id, sub.is_active)}
                                                className={`p-2 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 inline-block ${
                                                    sub.is_active 
                                                        ? 'bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white' 
                                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                }`}
                                                title={sub.is_active ? 'Unsubscribe' : 'Re-subscribe'}
                                            >
                                                {sub.is_active ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
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
