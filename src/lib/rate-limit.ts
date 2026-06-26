/**
 * Serverless-compatible rate limiter using Supabase.
 * Tracks request counts per IP per time window in the rate_limits table.
 */

import { supabaseAdmin } from './supabase';

interface RateLimitOptions {
    windowMs?: number;  // Time window in ms (default: 60000 = 1 minute)
    max?: number;       // Max requests per window (default: 10)
}

/**
 * Check if a request should be rate limited.
 * @param identifier - Unique identifier (usually IP address)
 * @param options - Rate limit options
 * @returns Object with limited status and remaining requests
 */
export async function checkRateLimit(identifier: string, options: RateLimitOptions = {}): Promise<{ limited: boolean; remaining: number; resetIn: number }> {
    const { windowMs = 60000, max = 10 } = options;

    if (!supabaseAdmin) {
        // Fallback: no rate limiting if Supabase isn't configured
        return { limited: false, remaining: max, resetIn: 0 };
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    try {
        // Clean up old entries for this identifier
        await supabaseAdmin
            .from('rate_limits')
            .delete()
            .lt('window_start', windowStart.toISOString());

        // Find existing window for this identifier
        const { data: existing } = await supabaseAdmin
            .from('rate_limits')
            .select('id, request_count')
            .eq('identifier', identifier)
            .gte('window_start', windowStart.toISOString())
            .order('window_start', { ascending: false })
            .limit(1);

        if (existing && existing.length > 0) {
            const entry = existing[0] as any;
            if (entry.request_count >= max) {
                const resetIn = windowMs - (Date.now() - windowStart.getTime());
                return { limited: true, remaining: 0, resetIn: Math.max(resetIn, 0) };
            }

            // Increment count
            await supabaseAdmin
                .from('rate_limits')
                .update({ request_count: entry.request_count + 1 })
                .eq('id', entry.id);

            return { limited: false, remaining: max - entry.request_count - 1, resetIn: windowMs };
        }

        // Start new window
        await supabaseAdmin
            .from('rate_limits')
            .insert({ identifier, window_start: now.toISOString(), request_count: 1 });

        return { limited: false, remaining: max - 1, resetIn: windowMs };
    } catch (err) {
        console.error('Rate limit check failed:', err);
        return { limited: false, remaining: max, resetIn: 0 };
    }
}

/**
 * Get client IP from request headers (works with Netlify/Vercel)
 */
export function getClientIP(request: Request): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') ||
           request.headers.get('cf-connecting-ip') ||
           'unknown';
}

/**
 * Rate limit middleware wrapper for API routes.
 */
export function withRateLimit(options: RateLimitOptions = {}) {
    return function(handler: Function) {
        return async (context: any) => {
            const ip = getClientIP(context.request);
            const { limited, remaining, resetIn } = await checkRateLimit(ip, options);
            
            if (limited) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Too many requests. Please try again later.'
                }), {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': Math.ceil(resetIn / 1000).toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString()
                    }
                });
            }
            
            const response = await handler(context);
            
            // Add rate limit headers to response
            if (response instanceof Response) {
                response.headers.set('X-RateLimit-Remaining', remaining.toString());
            }
            
            return response;
        };
    };
}
