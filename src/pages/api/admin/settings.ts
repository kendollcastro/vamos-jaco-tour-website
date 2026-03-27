import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
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
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}

export const POST: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) return new Response(JSON.stringify({ message: 'Supabase not configured' }), { status: 500 });

    try {
        const { key, value } = await request.json();

        if (!key || value === undefined) {
            return new Response(JSON.stringify({ message: 'Key and Value are required' }), { status: 400 });
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
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}
