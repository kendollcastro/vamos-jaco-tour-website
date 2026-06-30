import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../../lib/supabase';

export const prerender = false;

const ALLOWED_ROLES = ['admin', 'secretary'];

async function verifyRequest(request: Request): Promise<{ authorized: boolean; userId?: string; role?: string }> {
    const authClient = supabaseAdmin || supabase;
    if (!authClient) return { authorized: false };
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
    try {
        let userId: string | undefined;
        if (token) {
            const { data: { user } } = await authClient.auth.getUser(token);
            if (user) userId = user.id;
        } else {
            const { data: { user } } = await authClient.auth.getUser();
            if (user) userId = user.id;
        }
        if (!userId) return { authorized: false };
        const { data: profile } = await authClient.from('profiles').select('role').eq('id', userId).single();
        const role = (profile as any)?.role;
        return role && ALLOWED_ROLES.includes(role) ? { authorized: true, userId, role } : { authorized: false };
    } catch { return { authorized: false }; }
}

// GET: fetch all profiles with their permissions
export const GET: APIRoute = async ({ request }) => {
    const auth = await verifyRequest(request);
    if (!auth.authorized || auth.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const dbClient = supabaseAdmin || supabase;
    if (!dbClient) {
        return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const { data } = await dbClient.from('profiles').select('id, email, full_name, role, permissions').order('email');
    return new Response(JSON.stringify({ users: data || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

// PUT: update a single user's permissions
export const PUT: APIRoute = async ({ request }) => {
    const auth = await verifyRequest(request);
    if (!auth.authorized || auth.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const dbClient = supabaseAdmin || supabase;
    if (!dbClient) {
        return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    try {
        const { userId, permissions } = await request.json();
        if (!userId) {
            return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        const { error } = await dbClient.from('profiles').update({ permissions: permissions || [] }).eq('id', userId);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to update permissions' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
