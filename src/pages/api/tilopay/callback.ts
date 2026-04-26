import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => handleCallback(request);
export const POST: APIRoute = async ({ request }) => handleCallback(request);

async function handleCallback(request: Request): Promise<Response> {
    console.log("=== TILOPAY CALLBACK START ===");
    const requestUrl = new URL(request.url);
    const SITE_URL = `${requestUrl.protocol}//${requestUrl.host}`;
    
    try {
        const params: Record<string, any> = {};
        
        // 1. Get parameters from URL
        requestUrl.searchParams.forEach((value, key) => { params[key] = value; });

        // 2. Get parameters from Body (TiloPay often POSTs back)
        if (request.method === 'POST') {
            const contentType = request.headers.get('content-type') || '';
            console.log("POST Content-Type:", contentType);
            
            try {
                if (contentType.includes('application/json')) {
                    const jsonBody = await request.json();
                    Object.assign(params, jsonBody);
                } else {
                    const formData = await request.formData();
                    formData.forEach((value, key) => { params[key] = String(value); });
                }
            } catch (bodyErr) {
                console.error("Error parsing body:", bodyErr);
            }
        }

        console.log("RECEIVED PARAMS:", JSON.stringify(params, null, 2));

        // 3. Identify the booking
        const bookingId = params.order || params.orderNumber || params.reference || params.order_id;
        
        if (!bookingId || bookingId === 'unknown') {
            console.error("NO ORDER ID FOUND");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=InvalidSession` } });
        }

        // 4. Success check (TiloPay V2 uses response_code=1 for success)
        const responseCode = params.response_code || params.code;
        const hasTransactionId = params.tpt || params.auth || params.tilopayTransaction || params.transactionId;
        const isSuccess = responseCode === 1 || responseCode === '1' || hasTransactionId;

        console.log(`Success check: code=${responseCode}, hasTx=${!!hasTransactionId}, isSuccess=${isSuccess}`);

        if (!supabaseAdmin) {
            console.error("SUPABASE NOT CONFIGURED");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        // 5. Lookup the booking
        const { data: booking, error: fetchError } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking) {
            console.warn(`Booking ${bookingId} not found in DB. Error:`, fetchError?.message);
            // Fallback: This might be an old flow or someone missed the initiate step
            // We'll create a new one if it's successful, but it's not ideal
            if (isSuccess) {
                console.log("Creating fallback booking for missing ID...");
                const newBookingId = crypto.randomUUID();
                await supabaseAdmin.from('bookings').insert({
                    id: newBookingId,
                    customer_name: params.customerName || 'Customer',
                    customer_email: params.customerEmail || 'unknown@email.com',
                    tour_name: params.tourName || 'Tour',
                    booking_date: params.date || new Date().toISOString().split('T')[0],
                    total_amount: parseFloat(params.total_amount || params.amount || '0'),
                    status: 'paid',
                    tilopay_order_id: params.tpt || params.auth || 'TILOPAY'
                });
                return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${newBookingId}` } });
            }
        }

        // 6. Update booking status
        if (isSuccess) {
            console.log(`Updating booking ${bookingId} to PAID`);
            await supabaseAdmin.from('bookings').update({
                status: 'paid',
                tilopay_order_id: params.tpt || params.auth,
                tilopay_response: params
            }).eq('id', bookingId);

            // Optional: Send confirmation emails here (they are also handled by webhook usually)
            
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });
        } else {
            console.log(`Updating booking ${bookingId} to FAILED/CANCELLED`);
            await supabaseAdmin.from('bookings').update({
                status: 'failed',
                tilopay_response: params
            }).eq('id', bookingId);

            const msg = params.message || 'Payment Declined';
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=${encodeURIComponent(msg)}` } });
        }

    } catch (err) {
        console.error("CALLBACK EXCEPTION:", err);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
    }
}