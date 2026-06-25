import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { History, FilePlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Props {
    recordId: string;
}

interface AuditEntry {
    action: string;
    user_email: string;
    user_name: string;
    summary: string;
    created_at: string;
}

export default function AuditInfo({ recordId }: Props) {
    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !supabase) return;
        setLoading(true);
        supabase
            .from('audit_log')
            .select('action, user_email, user_name, summary, created_at')
            .eq('record_id', recordId)
            .order('created_at', { ascending: false })
            .limit(10)
            .then(({ data }) => {
                if (data) setEntries(data as AuditEntry[]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [open, recordId]);

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
            case 'create': return 'text-emerald-500 bg-emerald-500/10';
            case 'update': return 'text-blue-500 bg-blue-500/10';
            case 'delete': return 'text-red-500 bg-red-500/10';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    return (
        <>
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setOpen(true); }} className="h-7 w-7" title="View history">
                <History className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <History className="w-4 h-4" />
                            Record History
                        </DialogTitle>
                    </DialogHeader>
                    <div className="max-h-80 overflow-y-auto -mx-6 -mb-6 px-6 pb-6">
                        {loading ? (
                            <div className="space-y-3 py-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-start gap-3 animate-pulse">
                                        <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-3 bg-muted rounded w-3/4" />
                                            <div className="h-2.5 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="py-8 text-center">
                                <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">No history recorded yet</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {entries.map((e, i) => {
                                    const Icon = ActionIcon(e.action);
                                    return (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${actionColor(e.action)}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground">{e.summary || `${e.action} record`}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-muted-foreground">{e.user_name || e.user_email}</span>
                                                    <span className="text-[10px] text-muted-foreground/60">&middot;</span>
                                                    <span className="text-xs text-muted-foreground">{formatTimeAgo(e.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function formatTimeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}
