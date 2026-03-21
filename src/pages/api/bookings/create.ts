import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            tourId,
            tourName,
            date,
            adults,
            children,
            totalAmount,
            status = 'pending'
        } = body;

        // 1. Validation
        if (!customerName || !customerEmail || !tourName || !date) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }

        // Format date to YYYY-MM-DD safely
        const formattedDate = new Date(date).toISOString().split('T')[0];

        let bookingId = null;

        // 2. Insert into Supabase
        if (supabaseAdmin) {
            const { data, error } = await supabaseAdmin
                .from('bookings')
                .insert([{
                    tour_id: tourId,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone || '',
                    tour_name: tourName,
                    booking_date: formattedDate,
                    total_amount: totalAmount,
                    status: status,
                    adults: adults || 1,
                    children: children || 0,
                }]);

            if (error) {
                console.error('Supabase booking error:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint
                });
                return new Response(JSON.stringify({ 
                    success: false, 
                    message: `Database error: ${error.message}`,
                    error: error
                }), { status: 500 });
            }
            // bookingId will be null but the insert succeeded
        }

        // 3. Send Email Notifications
        let emailSent = false;
        try {
            const emailResult = await sendBookingNotifications({
                customerName,
                customerEmail,
                customerPhone: customerPhone || 'N/A',
                tourName,
                tourDate: formattedDate,
                adults: adults || 1,
                children: children || 0,
                totalAmount
            });
            emailSent = !!emailResult?.success;
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
            // We don't return 500 here because the booking was already created in DB
        }

        return new Response(JSON.stringify({
            success: true,
            bookingId,
            emailSent
        }), { status: 200 });

    } catch (error: any) {
        console.error('Booking creation fatal error:', error);
        return new Response(JSON.stringify({ message: error.message || 'Internal server error' }), { status: 500 });
    }
}
