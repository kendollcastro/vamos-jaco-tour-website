import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, EyeOff, Check } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';

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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by email..."
                        className="pl-11 rounded-full h-12"
                    />
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold border border-primary/20">
                    Total: {subscribers.length} Subscribers
                </div>
            </div>

            <div className="bg-white dark:bg-dark-soft rounded-3xl border border-border/40 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No subscribers found</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border/40 bg-muted/30">
                                <TableHead className="px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]">Email Address</TableHead>
                                <TableHead className="px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]">Joined Date</TableHead>
                                <TableHead className="px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]">Status</TableHead>
                                <TableHead className="px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border/30">
                            {filtered.map((sub) => (
                                <TableRow key={sub.id} className="hover:bg-accent/50 transition-colors group">
                                    <TableCell className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                        {sub.email}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                        {new Date(sub.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            sub.is_active 
                                                ? 'bg-green-500/10 text-green-500' 
                                                : 'bg-gray-500/10 text-gray-500'
                                        }`}>
                                            {sub.is_active ? 'Active' : 'Unsubscribed'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleActive(sub.id, sub.is_active)}
                                            className={sub.is_active 
                                                ? 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-700 dark:hover:text-white' 
                                                : 'text-primary hover:bg-primary/10'
                                            }
                                            title={sub.is_active ? 'Unsubscribe' : 'Re-subscribe'}
                                        >
                                            {sub.is_active ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            )}
                                        </Button>
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
