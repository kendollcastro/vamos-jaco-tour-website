import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => handleCallback(request);
export const POST: APIRoute = async ({ request }) => handleCallback(request);

const SITE_URL = 'https://www.vamosjacotours.com';

async function handleCallback(request: Request): Promise<ARoute.response> {
    try {
        const url = new URL(request.url);
        const params: Record<string, string> = {};
        
        url.searchParams.forEach((value, key) => { params[key] = value; });

        if (request.method === 'POST') {
            try {
                const formData = await request.formData();
                formData.forEach((value, key) => { params[key] = String(value); });
            } catch {}
        }

        console.log("=== TiloPay Callback ===");
        console.log("All params:", JSON.stringify(params));

        // Extract order number - try multiple fields
        const orderNumber = params.order || 
                           params.orderNumber || 
                           params.reference || 
                           params.pending_id ||
                           url.searchParams.get('order') ||
                           url.searchParams.get('pending_id') || '';

        // Extract status/code - try multiple fields
        const statusRaw = params.status || params.code || params.responseCode || params.result || params.description || '';
        const status = statusRaw.toString().toLowerCase();
        const tpt = params.tpt || params.tilopayTransaction || params.transactionId || params.auth || '';

        // Determine if payment was successful
        // code=1, status=success, description contains "aprobada"/"approved"
        const isSuccess = status === 'success' || 
                          status === '1' || 
                          status === 'approved' ||
                          status === 'completed' ||
                          params.description?.toLowerCase().includes('aprobada') ||
                          params.description?.toLowerCase().includes('approved');

        console.log("Order:", orderNumber, "TPT:", tpt, "Status:", status, "isSuccess:", isSuccess);

        // If no order number, return error
        if (!orderNumber || orderNumber === '') {
            console.error("MISSING ORDER NUMBER - Full params:", JSON.stringify(params));
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        // If payment not successful
        if (!isSuccess) {
            console.log("Payment not successful - status:", status);
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=failed` } });
        }

        // If no supabase
        if (!supabaseAdmin) {
            console.error("NO SUPABASE");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        // Extract booking details from params
        const tourId = params.tour_id || params.tourId || 'unknown';
        const tourName = params.tourName || params.tour_name || params.productName || 'Tour';
        const customerName = params.customerName || params.customer_name || params.firstName || 'Customer';
        const customerEmail = params.customerEmail || params.customer_email || params.email || 'unknown@email.com';
        const customerPhone = params.customerPhone || params.customer_phone || params.phone || '';
        const bookingDate = params.date || params.bookingDate || new Date().toISOString().split('T')[0];
        const adults = parseInt(params.adults || '1');
        const children = parseInt(params.children || '0');
        const totalAmount = parseFloat(params.total_amount || params.amount || params.totalAmount || '0');
        const language = params.language || params.lang || 'en';

        console.log("Creating booking:", { tourId, tourName, customerName, customerEmail, totalAmount, adults, children });

        const bookingId = crypto.randomUUID();
        const tilopayId = tpt || 'TILOPAY_SUCCESS';

        // Insert booking
        const { error } = await supabaseAdmin.from('bookings').insert([{
            id: bookingId,
            tour_id: tourId,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            tour_name: tourName,
            booking_date: bookingDate,
            adults,
            children,
            total_amount: totalAmount,
            status: 'paid',
            tilopay_order_id: tilopayId,
            tilopay_response: params
        }]);

        if (error) {
            console.error("INSERT ERROR:", error.message, error.details);
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        console.log("✅ Booking created:", bookingId);

        // Send email (fire and forget)
        sendBookingNotifications({
            customerName,
            customerEmail,
            customerPhone: customerPhone || 'N/A',
            tourName,
            tourDate: bookingDate,
            adults,
            children,
            totalAmount,
            language: language as 'en' | 'es'
        }).catch(e => console.error("Email error:", e));

        // Redirect to success
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });

    } catch (err) {
        console.error("CALLBACK ERROR:", err);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
    }
}