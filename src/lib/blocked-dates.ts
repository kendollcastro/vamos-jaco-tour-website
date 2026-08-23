/* Blocked dates (closures): shared helpers for client and API use. */

export interface BlockedRange {
    id: string;
    start_date: string; // YYYY-MM-DD
    end_date: string;   // YYYY-MM-DD
    reason: string | null;
}

type MinimalClient = { from: (table: string) => any };

/** Fetch all blocked ranges with the given Supabase client. Returns [] on any failure. */
export async function fetchBlockedRanges(client: MinimalClient | null): Promise<BlockedRange[]> {
    if (!client) return [];
    try {
        const { data, error } = await client
            .from('blocked_dates')
            .select('id, start_date, end_date, reason')
            .order('start_date', { ascending: true });
        if (error || !data) return [];
        return data as BlockedRange[];
    } catch {
        return [];
    }
}

/** Local-date ISO string (avoids UTC off-by-one from toISOString). */
export function localDateISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function isDateBlocked(dateISO: string, ranges: BlockedRange[]): boolean {
    return ranges.some(r => dateISO >= r.start_date && dateISO <= r.end_date);
}

/** Next upcoming/current range relative to today (for UI notices). */
export function nextBlockedRange(ranges: BlockedRange[], todayISO = localDateISO(new Date())): BlockedRange | undefined {
    return ranges.find(r => r.end_date >= todayISO);
}
