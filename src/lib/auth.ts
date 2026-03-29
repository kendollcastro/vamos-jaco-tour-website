import { supabase } from './supabase';

/**
 * Verify that the request comes from an authenticated admin user.
 * Checks the Authorization Bearer token against Supabase Auth.
 * Optionally checks if the user's email is in the allowed admin list.
 */
export async function verifyAdmin(request: Request): Promise<{ authorized: boolean; userId?: string; error?: string }> {
    if (!supabase) {
        return { authorized: false, error: 'Supabase not configured' };
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { authorized: false, error: 'Missing or invalid Authorization header' };
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return { authorized: false, error: 'Invalid or expired token' };
        }

        // Optional: Check if user email is in admin list
        // const adminEmails = (import.meta.env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim());
        // if (adminEmails.length > 0 && !adminEmails.includes(user.email || '')) {
        //     return { authorized: false, error: 'User is not an admin' };
        // }

        return { authorized: true, userId: user.id };
    } catch (err) {
        return { authorized: false, error: 'Token verification failed' };
    }
}

/**
 * Middleware-style wrapper for API routes that require admin auth.
 * Usage: export const POST = withAdminAuth(async ({ request }) => { ... });
 */
export function withAdminAuth(handler: Function) {
    return async (context: any) => {
        const authResult = await verifyAdmin(context.request);
        if (!authResult.authorized) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: 'Unauthorized',
                error: authResult.error 
            }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return handler(context);
    };
}
