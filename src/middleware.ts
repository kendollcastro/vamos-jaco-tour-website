import { defineMiddleware } from 'astro:middleware';

const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https: data: blob:",
    "connect-src 'self' https://yebtzzqngiurwddrvhry.supabase.co https://www.google-analytics.com",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
].join('; ');

export const onRequest = defineMiddleware((context, next) => {
    const response = next();

    if (response instanceof Response) {
        const headers = new Headers(response.headers);

        // Only set security headers on HTML responses
        const contentType = headers.get('content-type') || '';
        if (contentType.includes('text/html') || !headers.has('content-security-policy')) {
            if (!headers.has('content-security-policy')) {
                headers.set('content-security-policy', CSP);
            }
            if (!headers.has('strict-transport-security')) {
                headers.set('strict-transport-security', 'max-age=63072000; includeSubDomains; preload');
            }
            if (!headers.has('x-frame-options')) {
                headers.set('x-frame-options', 'DENY');
            }
            if (!headers.has('x-content-type-options')) {
                headers.set('x-content-type-options', 'nosniff');
            }
            if (!headers.has('referrer-policy')) {
                headers.set('referrer-policy', 'strict-origin-when-cross-origin');
            }
            if (!headers.has('permissions-policy')) {
                headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
            }
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    }

    return response;
});
