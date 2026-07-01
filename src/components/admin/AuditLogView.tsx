import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { RefreshCw, History } from 'lucide-react';

interface AuditEntry {
    id: string;
    user_email: string;
    user_name: string;
    action: string;
    table_name: string;
    record_id: string;
    summary: string;
    changes: any;
    created_at: string;
}

export default function AuditLogView() {
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLog(); }, []);

    async function fetchLog() {
        setLoading(true);
        if (!supabase) { setLoading(false); return; }

        const { data, error } = await supabase
            .from('audit_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (!error) setEntries((data as AuditEntry[]) || []);
        setLoading(false);
    }

    if (!supabase) {
        return <div className="text-center text-muted-foreground py-12">Connect Supabase to view audit log.</div>;
    }

    const actionColor = (action: string) => {
        switch (action) {
            case 'create': return 'text-emerald-500 bg-emerald-500/10';
            case 'update': return 'text-blue-500 bg-blue-500/10';
            case 'delete': return 'text-red-500 bg-red-500/10';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <History className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Audit Log</h2>
                        <p className="text-sm text-muted-foreground">Track all changes made in the system</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={fetchLog} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
                <ScrollArea className="h-[600px]">
                    {entries.length === 0 ? (
                        <div className="text-center text-muted-foreground py-16">
                            {loading ? 'Loading...' : 'No audit entries yet.'}
                        </div>
                    ) : (
                        <div className="divide-y divide-border/30">
                            {entries.map((entry) => (
                                <div key={entry.id} className="p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${actionColor(entry.action)}`}>
                                            {entry.action}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold capitalize">{entry.table_name}</span>
                                                <span className="text-xs text-muted-foreground">by</span>
                                                <span className="text-sm font-medium">{entry.user_name || entry.user_email || 'Unknown'}</span>
                                            </div>
                                            {entry.summary && (
                                                <p className="text-sm text-muted-foreground mt-0.5">{entry.summary}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                            {new Date(entry.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
