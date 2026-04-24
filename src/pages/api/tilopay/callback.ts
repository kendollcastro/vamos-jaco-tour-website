import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => handleCallback(request);
export const POST: APIRoute = async ({ request }) => handleCallback(request);

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

        console.log("TiloPay callback params:", JSON.stringify(params));

        const orderNumber = params.order || params.orderNumber || params.pending_id || url.searchParams.get('order') || '';
        const tpt = params.tpt || params.tilopayTransaction || '';
        const status = (params.status || params.code || params.responseCode || '').toLowerCase();
        
        const isSuccess = status === 'success' || status === '1' || status === 'approved' || status === 'completed' || status === 'true';
        
        console.log("Order:", orderNumber, "TPT:", tpt, "Status:", status, "Success:", isSuccess);

        if (!orderNumber) {
            return new Response(null, { status: 302, headers: { Location: '/?payment=error' } });
        }

        if (!isSuccess) {
            return new Response(null, { status: 302, headers: { Location: '/?payment=failed' } });
        }

        if (!supabaseAdmin) {
            console.error("No supabase admin");
            return new Response(null, { status: 302, headers: { Location: '/?payment=error' } });
        }

        // Extract booking data from URL params
        const tourId = params.tour_id || 'unknown';
        const tourName = params.tourName || params.tour_name || 'Tour';
        const customerName = params.customerName || params.customer_name || 'Customer';
        const customerEmail = params.customerEmail || params.customer_email || params.email || 'unknown@email.com';
        const customerPhone = params.customerPhone || params.customer_phone || '';
        const bookingDate = params.date || new Date().toISOString().split('T')[0];
        const adults = parseInt(params.adults || '1');
        const children = parseInt(params.children || '0');
        const totalAmount = parseFloat(params.total_amount || params.amount || '0');
        const language = params.language || 'en';

        console.log("Creating booking:", { tourName, customerName, totalAmount, adults, children });

        const bookingId = crypto.randomUUID();
        const tilopayId = tpt || 'TILOPAY_SUCCESS';

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
            console.error("Insert error:", error);
            return new Response(null, { status: 302, headers: { Location: '/?payment=error' } });
        }

        console.log("Booking created:", bookingId);

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

        return new Response(null, { status: 302, headers: { Location: `/payment-success?order=${bookingId}` } });

    } catch (err) {
        console.error("Callback error:", err);
        return new Response(null, { status: 302, headers: { Location: '/?payment=error' } });
    }
}