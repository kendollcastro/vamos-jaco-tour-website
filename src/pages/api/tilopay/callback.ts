import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

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

        console.log("ALL PARAMS:", JSON.stringify(params));

        // ONLY REQUIREMENT: Payment was successful
        // Accept: status=success, code=1, code=0, description contains "aprobada"
        const desc = (params.description || '').toLowerCase();
        const code = params.code || '';
        
        // Success if: code=1 OR code=0 with success in description OR status=success
        const isSuccess = 
            code === '1' || 
            code === '0' || 
            params.status === 'success' ||
            desc.includes('aprobada') ||
            desc.includes('approved') ||
            desc.includes('transaccion');

        console.log("isSuccess:", isSuccess, "code:", code, "desc:", desc);

        // If no success, go to failed
        if (!isSuccess) {
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=failed` } });
        }

        // Check supabase
        console.log("Has supabase:", !!supabaseAdmin);
        
        if (!supabaseAdmin) {
            console.log("NO SUPABASE - returning error");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        // Extract data
        const order = params.order || params.orderNumber || params.reference || 'unknown';
        const tourName = params.tourName || params.tour_name || 'Tour';
        const customerName = params.customerName || params.customer_name || 'Customer';
        const customerEmail = params.customerEmail || params.customer_email || 'unknown@email.com';
        const customerPhone = params.customerPhone || params.customer_phone || '';
        const bookingDate = params.date || new Date().toISOString().split('T')[0];
        const adults = parseInt(params.adults || '1');
        const children = parseInt(params.children || '0');
        const totalAmount = parseFloat(params.total_amount || params.amount || '50');
        const tpt = params.tpt || params.tilopayTransaction || 'TILOPAY';

        console.log("Creating booking:", { tourName, customerName, totalAmount, order });

        const bookingId = crypto.randomUUID();

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

        console.log("Insert result:", error ? error.message : "OK");

        if (error) {
            console.log("DB ERROR:", error);
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
        }

        console.log("SUCCESS! Booking:", bookingId);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });

    } catch (err) {
        console.log("EXCEPTION:", err);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
    }
}