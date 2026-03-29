import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit';

export const POST: APIRoute = async ({ request }) => {
    // Rate limiting: 3 requests per minute per IP (newsletter is less frequent)
    const ip = getClientIP(request);
    const { limited, resetIn } = checkRateLimit(ip, { windowMs: 60000, max: 3 });
    
    if (limited) {
        return new Response(JSON.stringify({ 
            success: false,
            message: 'Too many requests. Please try again later.' 
        }), { 
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil(resetIn / 1000).toString()
            }
        });
    }

    try {
        const body = await request.json();
        const { email, language = 'en' } = body;

        // Validate email with strict regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!email || !emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid email address'
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Sanitize email
        const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Service temporarily unavailable'
            }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Insert new subscriber
        const { error } = await supabaseAdmin
            .from('subscribers')
            .insert([{ email: sanitizedEmail }]);
 
        if (error) {
            // Check if it's a duplicate key error (Postgres code 23505)
            if (error.code === '23505') {
                return new Response(JSON.stringify({
                    success: true,
                    alreadySubscribed: true,
                    message: 'You are already subscribed to our newsletter!'
                }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            console.error('Newsletter subscription error:', error.code);
            return new Response(JSON.stringify({
                success: false,
                message: 'Failed to subscribe. Please try again later.'
            }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Send welcome email (asynchronous)
        const { sendNewsletterWelcome } = await import('../../../lib/email-service');
        sendNewsletterWelcome(sanitizedEmail, undefined, language as 'en' | 'es')
            .catch(err => console.error('Error sending welcome email:', err));

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully subscribed to our newsletter!'
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Newsletter API error');
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
