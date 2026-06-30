import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

const ALL_MODULES = [
    'dashboard', 'tours', 'bookings', 'calendar', 'subscribers',
    'gallery', 'team', 'website', 'emails', 'commissions',
    'auditLog', 'users', 'profile', 'roles',
];

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
        let permissions: string[] | null = null;

        const dbClient = supabaseAdmin || supabase;
        if (dbClient) {
            const { data: profile } = await dbClient
                .from('profiles')
                .select('role, full_name, permissions')
                .eq('id', userId)
                .single();

            if (profile) {
                role = (profile as any).role || 'secretary';
                name = (profile as any).full_name || '';

                // Get role defaults from role_permissions
                const { data: rolePerms } = await dbClient
                    .from('role_permissions')
                    .select('module')
                    .eq('role', role);

                const roleDefaults: string[] = (rolePerms || []).map((r: any) => r.module);
                const userOverrides: string[] | null = (profile as any)?.permissions || null;

                // Merge: per-user overrides take precedence, fall back to role defaults
                if (userOverrides && Array.isArray(userOverrides) && userOverrides.length > 0) {
                    permissions = userOverrides;
                } else {
                    permissions = roleDefaults.length > 0 ? roleDefaults : (role === 'admin' ? [...ALL_MODULES] : []);
                }
            }

            return new Response(JSON.stringify({
                authenticated: true,
                userId,
                role,
                name,
                permissions,
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({
            authenticated: true,
            userId,
            role,
            name,
            permissions: null,
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
