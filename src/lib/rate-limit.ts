/**
 * Simple in-memory rate limiter for API endpoints.
 * Uses a sliding window approach.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

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
export function checkRateLimit(identifier: string, options: RateLimitOptions = {}): { limited: boolean; remaining: number; resetIn: number } {
    const { windowMs = 60000, max = 10 } = options;
    const now = Date.now();
    
    const entry = store.get(identifier);
    
    if (!entry || now > entry.resetTime) {
        // New window
        store.set(identifier, {
            count: 1,
            resetTime: now + windowMs
        });
        return { limited: false, remaining: max - 1, resetIn: windowMs };
    }
    
    if (entry.count >= max) {
        return { limited: true, remaining: 0, resetIn: entry.resetTime - now };
    }
    
    entry.count++;
    return { limited: false, remaining: max - entry.count, resetIn: entry.resetTime - now };
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
            const { limited, remaining, resetIn } = checkRateLimit(ip, options);
            
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
