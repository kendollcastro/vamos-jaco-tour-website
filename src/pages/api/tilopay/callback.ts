import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';

export const ALL: APIRoute = async ({ request, redirect }) => {
    // Handle both GET (redirect) and POST (webhook) safely
    let data: any = {};
    
    const url = new URL(request.url);
    
    if (request.method === 'POST') {
        try {
            const formData = await request.formData();
            formData.forEach((value, key) => { data[key] = value; });
        } catch {
            try {
                data = await request.json();
            } catch {
                // Ignore parsing errors, fallback to URL params
            }
        }
    }
    
    // Also merge URL parameters, they might contain the payload
    url.searchParams.forEach((value, key) => {
        if (!data[key]) data[key] = value;
    });

    console.log("Tilopay Callback payload:", data);

    // Extract Order Number (Booking ID) and Status
    const orderNumber = data.order || data.orderNumber || data.reference;
    // Tilopay usually sends a 'status' or 'responseCode'
    const isSuccess = data.status === 'success' || data.status === '1' || data.responseCode === '1' || data.ResponseCode === '1';

    if (!orderNumber) {
        return new Response("Missing order reference", { status: 400 });
    }

    if (isSuccess && supabaseAdmin) {
        try {
            // 1. Get Booking
            const { data: booking, error: fetchError } = await supabaseAdmin
                .from('bookings')
                .select('*')
                .eq('id', orderNumber)
                .single();
                
            if (fetchError || !booking) {
                console.error("Booking not found for order:", orderNumber);
                return redirect('/?payment=error');
            }

            // 2. Prevent Double Processing
            if (booking.status === 'confirmed') {
                return redirect(`/payment/success?order=${orderNumber}`);
            }

            // 3. Update Status
            const { error: updateError } = await supabaseAdmin
                .from('bookings')
                .update({ 
                    status: 'confirmed', 
                    tilopay_order_id: data.transactionId || data.authCode || 'TILOPAY_SUCCESS',
                    tilopay_response: data
                })
                .eq('id', orderNumber);

            if (updateError) throw updateError;

            // 4. Send Confirmation Email asynchronously
            sendBookingNotifications({
                customerName: booking.customer_name,
                customerEmail: booking.customer_email,
                customerPhone: booking.customer_phone || 'N/A',
                tourName: booking.tour_name,
                tourDate: booking.booking_date,
                adults: booking.adults,
                children: booking.children,
                totalAmount: booking.total_amount
            }).catch(e => console.error("Post-payment email failed:", e));

            // 5. Redirect User to premium success page
            return redirect(`/payment/success?order=${orderNumber}`);

        } catch (error) {
            console.error("Webhook processing error:", error);
            return redirect('/?payment=error');
        }
    } else {
        // Payment failed or was cancelled
        console.warn("Payment failed or cancelled:", data);
        if (supabaseAdmin) {
            await supabaseAdmin.from('bookings').update({ status: 'cancelled' }).eq('id', orderNumber);
        }
        return redirect('/?payment=failed');
    }
}
