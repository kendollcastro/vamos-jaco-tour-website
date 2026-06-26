import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    if (!supabase) {
        return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

    try {
        let userId: string | undefined;

        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (!error && user) userId = user.id;
        } else {
            // Fallback to session cookie
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!error && user) userId = user.id;
        }

        if (!userId) {
            return new Response(JSON.stringify({ authenticated: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let role = 'secretary';
        let name = '';

        if (supabaseAdmin) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('role, full_name')
                .eq('id', userId)
                .single();

            if (profile) {
                role = (profile as any).role || 'secretary';
                name = (profile as any).full_name || '';
            }
        }

        return new Response(JSON.stringify({
            authenticated: true,
            userId,
            role,
            name,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error in /api/admin/me:', err);
        return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
