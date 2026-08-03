import { defineMiddleware } from 'astro:middleware';
import type { APIContext } from 'astro';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://ddukdjdiqjvfjywuhnpn.supabase.co';
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
const MAINTENANCE_TOKEN = process.env.MAINTENANCE_TOKEN || '';

const MAINTENANCE_PAGE = '/maintenance/';

function isMaintenanceBypassed(context: APIContext): boolean {
    if (!MAINTENANCE_TOKEN) return false;
    if (context.url.searchParams.get('maintenance_token') === MAINTENANCE_TOKEN) return true;
    return context.cookies.get('maintenance_token')?.value === MAINTENANCE_TOKEN;
}

function shouldBlock(pathname: string): boolean {
    // Always allow assets, API/webhook endpoints and the maintenance page itself
    if (pathname.startsWith('/_astro/')) return false;
    if (pathname.startsWith('/api/')) return false;
    if (pathname === '/maintenance' || pathname.startsWith('/maintenance/')) return false;
    // Static files (e.g. /favicon.svg, /robots.txt, /images/...) end with a file extension
    if (/\.\w+$/.test(pathname)) return false;
    return true;
}

function buildCSP(): string {
    const supabase = SUPABASE_URL.replace(/\/+$/, '');
    return [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        `img-src 'self' https: data: blob: ${supabase}`,
        `connect-src 'self' ${supabase} wss://${new URL(supabase).host} https://www.google-analytics.com`,
        "frame-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
    ].join('; ');
}

export const onRequest = defineMiddleware((context, next) => {
    if (MAINTENANCE_MODE && !isMaintenanceBypassed(context) && shouldBlock(context.url.pathname)) {
        const maintenanceResponse = context.rewrite(MAINTENANCE_PAGE);
        const headers = new Headers(maintenanceResponse.headers);
        headers.set('retry-after', '3600');
        headers.set('cache-control', 'no-store, must-revalidate');
        return new Response(maintenanceResponse.body, {
            status: 503,
            statusText: 'Service Unavailable',
            headers,
        });
    }

    const response = next();

    if (response instanceof Response) {
        const headers = new Headers(response.headers);

        // Only set security headers on HTML responses
        const contentType = headers.get('content-type') || '';
        if (contentType.includes('text/html') || !headers.has('content-security-policy')) {
            if (!headers.has('content-security-policy')) {
                headers.set('content-security-policy', buildCSP());
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
