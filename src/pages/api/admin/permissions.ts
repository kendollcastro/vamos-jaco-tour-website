import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

const ALLOWED_ROLES = ['admin', 'secretary'];

// GET: fetch all role permissions
export const GET: APIRoute = async ({ request }) => {
    const auth = await verifyRequest(request);
    if (!auth.authorized) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const dbClient = supabaseAdmin || supabase;
    if (!dbClient) {
        return new Response(JSON.stringify({ error: 'Database not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { data: permissions } = await dbClient!
        .from('role_permissions')
        .select('role, module')
        .order('role')
        .order('module');

    return new Response(JSON.stringify({ permissions: permissions || [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

// POST: save role permissions (admin only)
export const POST: APIRoute = async ({ request }) => {
    const auth = await verifyRequest(request);
    if (!auth.authorized) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    if (auth.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Only admins can manage permissions' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const dbClient = supabaseAdmin || supabase;
    if (!dbClient) {
        return new Response(JSON.stringify({ error: 'Database not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const body = await request.json();
        const { permissions } = body;

        if (!Array.isArray(permissions)) {
            return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Atomic replace: delete all, insert new
        const { error: delError } = await dbClient
            .from('role_permissions')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (delError) throw delError;

        if (permissions.length > 0) {
            const { error: insError } = await dbClient
                .from('role_permissions')
                .insert(permissions);
            if (insError) throw insError;
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error saving permissions:', err);
        return new Response(JSON.stringify({ error: 'Failed to save permissions' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

async function verifyRequest(request: Request): Promise<{ authorized: boolean; role?: string }> {
    const authClient = supabaseAdmin || supabase;
    if (!authClient) return { authorized: false };

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

    try {
        let userId: string | undefined;
        if (token) {
            const { data: { user }, error } = await authClient.auth.getUser(token);
            if (!error && user) userId = user.id;
        } else {
            const { data: { user }, error } = await authClient.auth.getUser();
            if (!error && user) userId = user.id;
        }

        if (!userId) return { authorized: false };

        const { data: profile } = await authClient
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        const role = (profile as any)?.role;
        return role && ALLOWED_ROLES.includes(role)
            ? { authorized: true, role }
            : { authorized: false };
    } catch {
        return { authorized: false };
    }
}
