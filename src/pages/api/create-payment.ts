import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const TILOPAY_API_URL = import.meta.env.TILOPAY_API_URL || 'https://app.tilopay.com/api/v1';
const TILOPAY_API_USER = import.meta.env.TILOPAY_API_USER || '';
const TILOPAY_API_PASSWORD = import.meta.env.TILOPAY_API_PASSWORD || '';
const TILOPAY_MERCHANT_ID = import.meta.env.TILOPAY_MERCHANT_ID || '';

/**
 * POST /api/create-payment
 * 
 * Connects the checkout frontend to the Tilopay API:
 * 1. Creates a booking record in Supabase with status 'pending'
 * 2. Authenticates with Tilopay to get a session token
 * 3. Creates a payment order on Tilopay
 * 4. Returns the Tilopay redirect URL for the frontend
 */
export const POST: APIRoute = async ({ request, url }) => {
    try {
        const body = await request.json();
        const {
            tourId,
            tourName,
            amount,
            date,
            adults = 1,
            children = 0,
            extraPassengers = 0,
            customerName,
            customerEmail,
            customerPhone,
        } = body;

        // ── Validate ──
        if (!tourId || !amount || !customerName || !customerEmail) {
            return jsonResponse({ message: 'Missing required fields: tourId, amount, customerName, customerEmail' }, 400);
        }

        // ── 1. Create booking in Supabase ──
        let bookingId: string | null = null;

        if (supabaseAdmin) {
            const { data: booking, error: bookingError } = await supabaseAdmin
                .from('bookings')
                .insert({
                    tour_id: null, // Will be linked if tour exists in Supabase
                    tour_name: tourName || tourId,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone || '',
                    booking_date: date || new Date().toISOString().split('T')[0],
                    adults,
                    children,
                    extra_passengers: extraPassengers,
                    total_amount: amount,
                    status: 'pending',
                })
                .select('id')
                .single();

            if (bookingError) {
                console.error('Supabase booking insert error:', bookingError);
            } else {
                bookingId = booking?.id;
                
                // Notify of pending booking (initial attempt)
                const { sendBookingNotifications } = await import('../../lib/email-service');
                await sendBookingNotifications({
                    customerName,
                    customerEmail,
                    customerPhone: customerPhone || 'N/A',
                    tourName: tourName || tourId,
                    tourDate: date || new Date().toISOString().split('T')[0],
                    adults,
                    children,
                    totalAmount: amount
                });
            }
        }

        // ── 2. Authenticate with Tilopay ──
        if (!TILOPAY_API_USER || !TILOPAY_API_PASSWORD || !TILOPAY_MERCHANT_ID) {
            // No Tilopay credentials — return mock redirect
            console.warn('Tilopay credentials not configured, using mock redirect.');
            return jsonResponse({
                success: true,
                bookingId,
                redirectUrl: `/payment-success?mock=true&tourId=${tourId}&bookingId=${bookingId || ''}`,
                message: 'TiloPay integration pending credentials. Mock payment created.',
            });
        }

        // Get Tilopay auth token
        const authRes = await fetch(`${TILOPAY_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiuser: TILOPAY_API_USER,
                password: TILOPAY_API_PASSWORD,
            }),
        });

        if (!authRes.ok) {
            const errorText = await authRes.text();
            console.error('Tilopay auth failed:', errorText);
            return jsonResponse({ message: 'Payment service authentication failed' }, 502);
        }

        const authData = await authRes.json();
        const token = authData.access_token || authData.token;

        if (!token) {
            return jsonResponse({ message: 'Failed to obtain payment token' }, 502);
        }

        // ── 3. Create payment order ──
        const siteOrigin = url.origin || 'https://vamosjaco.com';
        const orderRef = bookingId || `VJT-${Date.now()}`;

        const paymentRes = await fetch(`${TILOPAY_API_URL}/processPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                redirect: `${siteOrigin}/payment-success?bookingId=${orderRef}`,
                key: TILOPAY_MERCHANT_ID,
                amount: Number(amount).toFixed(2),
                currency: 'USD',
                orderNumber: orderRef,
                capture: true,
                billToFirstName: customerName.split(' ')[0] || customerName,
                billToLastName: customerName.split(' ').slice(1).join(' ') || '',
                billToEmail: customerEmail,
                billToPhone: customerPhone || '',
                description: `Vamos Jacó Tours — ${tourName || tourId}`,
                returnUrl: `${siteOrigin}/payment-success?bookingId=${orderRef}`,
                cancelUrl: `${siteOrigin}/payment-failure?bookingId=${orderRef}`,
                callbackUrl: `${siteOrigin}/api/tilopay-webhook`,
            }),
        });

        if (!paymentRes.ok) {
            const errorText = await paymentRes.text();
            console.error('Tilopay payment creation failed:', errorText);
            return jsonResponse({ message: 'Failed to create payment session' }, 502);
        }

        const paymentData = await paymentRes.json();
        const redirectUrl = paymentData.url || paymentData.redirect_url || paymentData.redirectUrl;

        // Update booking with Tilopay order ID
        if (bookingId && supabaseAdmin) {
            await supabaseAdmin
                .from('bookings')
                .update({
                    tilopay_order_id: paymentData.order_id || orderRef,
                    tilopay_response: paymentData,
                })
                .eq('id', bookingId);
        }

        if (!redirectUrl) {
            return jsonResponse({
                success: true,
                bookingId,
                redirectUrl: `/payment-success?bookingId=${orderRef}`,
                message: 'Payment created (no redirect URL from Tilopay).',
                tilopayResponse: paymentData,
            });
        }

        return jsonResponse({
            success: true,
            bookingId,
            redirectUrl,
        });

    } catch (error: any) {
        console.error('Payment error:', error);
        return jsonResponse({ message: error.message || 'Internal server error' }, 500);
    }
};

function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}
