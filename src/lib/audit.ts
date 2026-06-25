import { supabase } from './supabase';

type AuditAction = 'create' | 'update' | 'delete';
type AuditTable = 'tours' | 'bookings' | 'commissions' | 'team_members' | 'subscribers' | 'profiles';

interface AuditEntry {
    action: AuditAction;
    table_name: AuditTable;
    record_id?: string;
    summary?: string;
    changes?: Record<string, any>;
    user_id?: string;
    user_email?: string;
}

export async function logAudit(entry: AuditEntry) {
    if (!supabase) return;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = entry.user_id || session?.user?.id || '';
        const userEmail = entry.user_email || session?.user?.email || '';
        const userName = session?.user?.user_metadata?.full_name || '';

        const { error } = await supabase.from('audit_log').insert({
            user_id: userId,
            user_email: userEmail,
            user_name: userName,
            action: entry.action,
            table_name: entry.table_name,
            record_id: entry.record_id || null,
            summary: entry.summary || '',
            changes: entry.changes || null,
        });
        if (error) console.error('[audit] insert error:', error);
    } catch (err) {
        console.error('[audit] unexpected error:', err);
    }
}
