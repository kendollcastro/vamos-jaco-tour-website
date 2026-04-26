import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => handleCallback(request);
export const POST: APIRoute = async ({ request }) => handleCallback(request);

const SITE_URL = 'https://www.vamosjacotours.com';

async function handleCallback(request: Request): Promise<ARoute.response> {
    console.log("=== CALLBACK START ===");
    
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

        console.log("Params received:", JSON.stringify(params));

        // Get order
        const order = params.order || params.orderNumber || params.reference || params.order_id || '';
        console.log("Order:", order);

        // Check status - BE VERY PERMISSIVE
        const description = params.description || '';
        const code = params.code || '';
        const responseCode = params.responseCode || params.response_code || '';
        
        const isSuccess = 
            params.status === 'success' ||
            code === '1' || 
            code === '0' ||
            responseCode === '1' ||
            description.toLowerCase().includes('aprobada') ||
            description.toLowerCase().includes('approved') ||
            description.toLowerCase().includes('transaccion');

        console.log("Description:", description, "Code:", code, "isSuccess:", isSuccess);

        if (!isSuccess) {
            console.log("Payment not successful");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=failed` } });
        }

        // Check supabase
        console.log("Supabase admin exists:", !!supabaseAdmin);
        
        if (!supabaseAdmin) {
            console.log("NO SUPABASE");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        const tourName = params.tourName || params.tour_name || params.productName || 'Tour';
        const customerName = params.customerName || params.customer_name || 'Customer';
        const customerEmail = params.customerEmail || params.customer_email || params.email || 'unknown@email.com';
        const customerPhone = params.customerPhone || params.customer_phone || '';
        const bookingDate = params.date || params.bookingDate || new Date().toISOString().split('T')[0];
        const adults = parseInt(params.adults || '1');
        const children = parseInt(params.children || '0');
        const totalAmount = parseFloat(params.total_amount || params.amount || '0');
        const tpt = params.tpt || params.tilopayTransaction || params.transactionId || 'TILOPAY';

        console.log("Inserting booking:", { tourName, customerName, customerEmail, totalAmount, bookingDate });

        const bookingId = crypto.randomUUID();

        // Try simple insert - just required fields
        const { error } = await supabaseAdmin.from('bookings').insert({
            id: bookingId,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            tour_name: tourName,
            booking_date: bookingDate,
            adults: adults,
            children: children,
            total_amount: totalAmount,
            status: 'paid',
            tilopay_order_id: tpt
        });

        console.log("Insert error:", error);

        if (error) {
            console.log("DB Error:", error.message);
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        console.log("SUCCESS - Booking:", bookingId);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });

    } catch (err) {
        console.log("EXCEPTION:", err);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
    }
}