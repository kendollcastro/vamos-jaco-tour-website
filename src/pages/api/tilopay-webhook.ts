import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';
const TILOPAY_WEBHOOK_SECRET = import.meta.env.TILOPAY_WEBHOOK_SECRET || '';

/**
 * Verify the webhook payload using HMAC-SHA256.
 * Checks common signature headers:
 *   - x-tilopay-signature
 *   - x-signature
 *   - x-webhook-signature
 * Falls back to Bearer token / secret comparison if no signature header is found.
 */
function verifySignature(rawBody: string, headers: Headers): boolean {
    if (!TILOPAY_WEBHOOK_SECRET) return true;

    const signatureHeader =
        headers.get('x-tilopay-signature') ||
        headers.get('x-signature') ||
        headers.get('x-webhook-signature');

    if (signatureHeader) {
        try {
            const expected = crypto
                .createHmac('sha256', TILOPAY_WEBHOOK_SECRET)
                .update(rawBody)
                .digest('hex');

            if (expected.length !== signatureHeader.length) return false;
            return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
        } catch {
            return false;
        }
    }

    // Fallback: legacy token-based check
    const authHeader = headers.get('Authorization') || headers.get('x-webhook-secret');
    if (authHeader !== `Bearer ${TILOPAY_WEBHOOK_SECRET}` && authHeader !== TILOPAY_WEBHOOK_SECRET) {
        console.warn('Webhook: Invalid or missing secret');
        return false;
    }

    return true;
}

/**
 * POST /api/tilopay-webhook
 *
 * Receives payment confirmation/cancellation callbacks from Tilopay.
 * Updates the booking status in Supabase accordingly.
 */
export const POST: APIRoute = async ({ request }) => {
    try {
        const rawBody = await request.text();

        // Verify webhook secret if configured
        if (TILOPAY_WEBHOOK_SECRET) {
            if (!verifySignature(rawBody, request.headers)) {
                return new Response(JSON.stringify({ message: 'Unauthorized' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        const body = JSON.parse(rawBody);

        const {
            orderNumber,
            order_id,
            status,
            code,
            auth,
            description,
        } = body;

        const bookingId = orderNumber || order_id;

        if (!bookingId) {
            return new Response(JSON.stringify({ message: 'Missing orderNumber' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
            console.warn('Supabase not configured');
            return new Response(JSON.stringify({ message: 'OK' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // Determine new status from Tilopay response
        const isSuccess = code === 1 || code === '1' || status === 'paid' || status === 'success' || status === 'approved';
        const newStatus = isSuccess ? 'confirmed' : 'cancelled';

        // Try matching by booking UUID first, then by tilopay_order_id
        let updated = false;

        // Try direct UUID match
        const { data: directMatch, error: directError } = await supabase
            .from('bookings')
            .update({
                status: newStatus,
                tilopay_order_id: order_id || bookingId,
                tilopay_response: body,
            })
            .eq('id', bookingId)
            .select('id');

        if (!directError && directMatch && directMatch.length > 0) {
            updated = true;
        }

        // Fallback: match by tilopay_order_id
        if (!updated) {
            const { data: fallbackMatch, error: fallbackError } = await supabase
                .from('bookings')
                .update({
                    status: newStatus,
                    tilopay_response: body,
                })
                .eq('tilopay_order_id', bookingId)
                .select('id');

            if (!fallbackError && fallbackMatch && fallbackMatch.length > 0) {
                updated = true;
            }
        }

        // Send confirmation email on success
        if (isSuccess && updated) {
            const { data: booking } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', bookingId)
                .single();

            if (booking) {
                const { sendBookingNotifications } = await import('../../lib/email-service');
                sendBookingNotifications({
                    customerName: booking.customer_name,
                    customerEmail: booking.customer_email,
                    customerPhone: booking.customer_phone || 'N/A',
                    tourName: booking.tour_name,
                    tourDate: booking.booking_date,
                    adults: booking.adults,
                    children: booking.children,
                    totalAmount: booking.total_amount,
                    language: 'en'
                }).catch(e => console.error('Post-payment email failed:', e));
            }
        }

        return new Response(JSON.stringify({
            success: true,
            status: newStatus,
            bookingId,
            updated,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Tilopay webhook error');
        return new Response(JSON.stringify({ message: 'Internal error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
