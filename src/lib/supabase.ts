import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Creates a Supabase client safely — returns null if URL/key are not configured.
 */
function createSafeClient(url: string, key: string, options?: any): SupabaseClient | null {
    if (!url || !key) {
        return null;
    }
    return createClient(url, key, options);
}

/**
 * Public client – uses the anon key.
 * Safe to use on the frontend (reads only public-policy rows).
 * Will be null if Supabase is not configured (demo mode).
 */
export const supabase = createSafeClient(supabaseUrl, supabaseAnon);

/**
 * Admin client – uses the service-role key.
 * ⚠️  Only use in server-side code (API routes, Astro frontmatter).
 */
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseAdmin = serviceRoleKey
    ? createSafeClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
    : supabase;
