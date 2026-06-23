import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { History, FilePlus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
    recordId: string;
}

interface AuditEntry {
    action: string;
    user_email: string;
    summary: string;
    created_at: string;
}

export default function AuditInfo({ recordId }: Props) {
    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open || entries.length > 0 || !supabase) return;
        setLoading(true);
        supabase
            .from('audit_log')
            .select('action, user_email, summary, created_at')
            .eq('record_id', recordId)
            .order('created_at', { ascending: false })
            .limit(5)
            .then(({ data }) => {
                setEntries((data as AuditEntry[]) || []);
                setLoading(false);
            });
    }, [open, recordId]);

    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        setTimeout(() => document.addEventListener('click', handleClick), 0);
        return () => document.removeEventListener('click', handleClick);
    }, [open]);

    const ActionIcon = (action: string) => {
        switch (action) {
            case 'create': return FilePlus;
            case 'update': return Pencil;
            case 'delete': return Trash2;
            default: return History;
        }
    };

    const actionColor = (action: string) => {
        switch (action) {
            case 'create': return 'text-emerald-500';
            case 'update': return 'text-blue-500';
            case 'delete': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="relative inline-block">
            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="h-7 w-7">
                <History className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </Button>
            {open && (
                <div
                    ref={popoverRef}
                    className="absolute right-0 top-full mt-1 z-50 w-72 rounded-lg border bg-card shadow-xl"
                >
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">History</span>
                        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-5 w-5">
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="p-2 max-h-48 overflow-y-auto">
                        {loading ? (
                            <p className="text-xs text-muted-foreground p-2">Loading...</p>
                        ) : entries.length === 0 ? (
                            <p className="text-xs text-muted-foreground p-2">No history recorded</p>
                        ) : (
                            entries.map((e, i) => {
                                const Icon = ActionIcon(e.action);
                                return (
                                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50">
                                        <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${actionColor(e.action)}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-foreground truncate">{e.summary || `${e.action} record`}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-muted-foreground truncate">{e.user_email}</span>
                                                <span className="text-[10px] text-muted-foreground shrink-0">
                                                    {formatTimeAgo(e.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function formatTimeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
}
