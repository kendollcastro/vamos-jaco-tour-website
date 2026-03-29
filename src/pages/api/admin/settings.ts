import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { verifyAdmin } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.authorized) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'Unauthorized' 
        }), { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!supabaseAdmin) return new Response(JSON.stringify({ message: 'Supabase not configured' }), { status: 500 });

    try {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('key, value');

        if (error) throw error;

        const settings = data.reduce((acc: any, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        return new Response(JSON.stringify({ success: true, settings }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Settings GET error:', error);
        return new Response(JSON.stringify({ success: false, message: 'Failed to fetch settings' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export const POST: APIRoute = async ({ request }) => {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.authorized) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'Unauthorized' 
        }), { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!supabaseAdmin) return new Response(JSON.stringify({ message: 'Supabase not configured' }), { status: 500 });

    try {
        const { key, value } = await request.json();

        if (!key || value === undefined) {
            return new Response(JSON.stringify({ message: 'Key and Value are required' }), { status: 400 });
        }

        // Whitelist of allowed setting keys
        const allowedKeys = ['site_name', 'contact_email', 'whatsapp_number', 'currency', 'tax_rate'];
        if (!allowedKeys.includes(key)) {
            return new Response(JSON.stringify({ message: 'Invalid setting key' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { error } = await supabaseAdmin
            .from('settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, message: `Setting ${key} updated` }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Settings POST error:', error);
        return new Response(JSON.stringify({ success: false, message: 'Failed to update setting' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
