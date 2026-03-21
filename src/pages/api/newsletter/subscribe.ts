import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid email address'
            }), { status: 400 });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Database connection not available'
            }), { status: 500 });
        }

        // 1. Try to insert new subscriber
        const { error } = await supabaseAdmin
            .from('subscribers')
            .insert([{ email }]);
 
        if (error) {
            // Check if it's a duplicate key error (Postgres code 23505)
            if (error.code === '23505') {
                return new Response(JSON.stringify({
                    success: true,
                    alreadySubscribed: true,
                    message: 'You are already subscribed to our newsletter!'
                }), { status: 200 });
            }

            console.error('Newsletter subscription error:', error);
            return new Response(JSON.stringify({
                success: false,
                message: 'Failed to subscribe. Please try again later.'
            }), { status: 500 });
        }

        // 3. Send welcome email (asynchronous, don't block response)
        const { sendNewsletterWelcome } = await import('../../../lib/email-service');
        sendNewsletterWelcome(email).catch(err => console.error('Error sending welcome email:', err));

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully subscribed to our newsletter!'
        }), { status: 200 });

    } catch (error) {
        console.error('Newsletter API error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }), { status: 500 });
    }
};
