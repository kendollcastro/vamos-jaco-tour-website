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
        
        // Collect ALL params from URL and form data
        const params: Record<string, string> = {};
        
        // URL params
        url.searchParams.forEach((value, key) => { params[key] = value; });

        // Form data (POST)
        if (request.method === 'POST') {
            try {
                const formData = await request.formData();
                formData.forEach((value, key) => { params[key] = String(value); });
            } catch {}
        }

        console.log("=== TILO PAY CALLBACK ===");
        console.log("Full URL:", request.url);
        console.log("All params:", JSON.stringify(params));

        // Get order from any possible field
        const order = params.order || params.orderNumber || params.reference || 
                     params.pending_id || params.order_id || '';
        
        // Check for payment success - be very permissive
        const status = (params.status || params.code || params.responseCode || 
                       params.result || params.description || '').toLowerCase();
        
        const isSuccess = 
            status === 'success' || 
            status === '1' || 
            status === 'approved' ||
            status === 'completed' ||
            status === 'true' ||
            status.includes('aprobada') ||
            status.includes('approved') ||
            params.code === '1' ||
            params.code === '0' && params.status === 'success';

        console.log("Order:", order, "Status:", status, "isSuccess:", isSuccess);

        // If no order, try to create a new booking anyway if there's payment info
        if (!order) {
            console.log("No order found - checking if payment might have succeeded");
            
            // If there's any transaction ID, assume success
            const hasPayment = params.tpt || params.tilopayTransaction || params.transactionId || params.auth;
            if (hasPayment) {
                console.log("Payment detected but no order - treating as success");
            } else {
                console.log("No payment info - treating as error");
                return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
            }
        }

        if (!isSuccess && !order) {
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=failed` } });
        }

        // Try to create booking
        if (!supabaseAdmin) {
            console.log("NO SUPABASE - redirecting to error");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        // Extract all possible fields
        const tourId = params.tour_id || params.tourId || params.product_id || 'unknown';
        const tourName = params.tourName || params.tour_name || params.productName || 'Tour';
        const customerName = params.customerName || params.customer_name || 
                          (params.firstName && params.lastName ? `${params.firstName} ${params.lastName}` : 'Customer');
        const customerEmail = params.customerEmail || params.customer_email || params.email || 'unknown@email.com';
        const customerPhone = params.customerPhone || params.customer_phone || params.phone || '';
        
        let bookingDate = params.date || params.bookingDate || params.tour_date;
        if (!bookingDate) {
            bookingDate = new Date().toISOString().split('T')[0];
        }
        
        const adults = parseInt(params.adults || '1');
        const children = parseInt(params.children || '0');
        const totalAmount = parseFloat(params.total_amount || params.amount || params.totalAmount || '0');
        
        const tpt = params.tpt || params.tilopayTransaction || params.transactionId || params.auth || 'TILOPAY';
        const language = params.language || params.lang || 'en';

        console.log("Creating booking with:", { tourName, customerName, customerEmail, totalAmount });

        const bookingId = crypto.randomUUID();

        const insertData = {
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
            status: 'paid' as const,
            tilopay_order_id: tpt,
            tilopay_response: params
        };

        console.log("Inserting:", JSON.stringify(insertData));

        const { error } = await supabaseAdmin.from('bookings').insert([insertData]);

        if (error) {
            console.log("INSERT ERROR:", error.message, error.details);
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        console.log("✅ BOOKING CREATED:", bookingId);

        // Send email
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
        }).catch(e => console.log("Email error:", e));

        // Success!
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });

    } catch (err) {
        console.log("Callback error:", err);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
    }
}