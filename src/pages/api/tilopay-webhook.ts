import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * POST /api/tilopay-webhook
 * 
 * Receives payment confirmation/cancellation callbacks from Tilopay.
 * Updates the booking status in Supabase accordingly.
 */
export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        console.log('Tilopay Webhook Payload:', JSON.stringify(body, null, 2));

        const {
            orderNumber,
            order_id,
            status,
            code,       // Tilopay response code
            auth,       // Authorization code
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
            console.warn('Supabase not configured — cannot update booking.');
            return new Response(JSON.stringify({ message: 'OK (no DB)' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // Determine new status from Tilopay response
        // Tilopay typically sends: code=1 for success, other codes for failure
        const isSuccess = code === 1 || code === '1' || status === 'paid' || status === 'success';
        const newStatus = isSuccess ? 'confirmed' : 'cancelled';

        // Try matching by booking UUID first, then by tilopay_order_id
        let updated = false;

        // Try direct UUID match (orderNumber was set to our booking.id)
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

        console.log(`Tilopay webhook: booking ${bookingId} → ${newStatus} (updated: ${updated})`);

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
        console.error('Tilopay webhook error:', error);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
