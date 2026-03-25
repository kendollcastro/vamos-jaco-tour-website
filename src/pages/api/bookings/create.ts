import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';
import { createPaymentSession } from '../../../lib/tilopay';

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
            paymentMethod = 'cash' // 'cash' or 'card'
        } = body;

        // 1. Validation
        if (!customerName || !customerEmail || !tourName || !date) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }

        // Format date to YYYY-MM-DD safely
        const formattedDate = new Date(date).toISOString().split('T')[0];

        // Define initial status based on payment method
        const initialStatus = 'pending';
        let bookingId: string | null = null;
        let paymentUrl: string | null = null;

        // Generate UUID on the server to bypass RLS Select restrictions on insert
        const generatedBookingId = crypto.randomUUID();

        // 2. Insert into Supabase
        if (supabaseAdmin) {
            // Resolve Tour UUID from Slug
            let resolvedTourId = tourId;
            const { data: tourData } = await supabaseAdmin
                .from('tours')
                .select('id')
                .eq('slug', tourId)
                .single();
                
            if (tourData?.id) {
                resolvedTourId = tourData.id;
            }

            const { error } = await supabaseAdmin
                .from('bookings')
                .insert([{
                    id: generatedBookingId,
                    tour_id: resolvedTourId,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone || '',
                    tour_name: tourName,
                    booking_date: formattedDate,
                    total_amount: totalAmount,
                    status: initialStatus,
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
            
            bookingId = generatedBookingId;
        }

        // 3. Handle Tilopay Gateway for Card Payments
        if (paymentMethod === 'card' && bookingId) {
            try {
                paymentUrl = await createPaymentSession({
                    amount: totalAmount,
                    orderNumber: bookingId, // Use the DB UUID as the unique order reference
                    customer: {
                        firstName: customerName.split(' ')[0] || customerName,
                        lastName: customerName.split(' ').slice(1).join(' ') || 'Customer',
                        email: customerEmail,
                        phone: customerPhone || '00000000'
                    }
                });
                
                // Return early, the email will be sent by the webhook after successful payment
                return new Response(JSON.stringify({
                    success: true,
                    bookingId,
                    paymentUrl,
                    requiresRedirect: true
                }), { status: 200 });

            } catch (paymentError: any) {
                console.error('Tilopay Integration Error:', paymentError);
                return new Response(JSON.stringify({
                    success: false,
                    message: `Payment Gateway Error: ${paymentError.message}`
                }), { status: 502 }); // Bad Gateway
            }
        }

        // 4. Send Email Notifications for Cash Payments
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
            emailSent,
            requiresRedirect: false
        }), { status: 200 });

    } catch (error: any) {
        console.error('Booking creation fatal error:', error);
        return new Response(JSON.stringify({ message: error.message || 'Internal server error' }), { status: 500 });
    }
}
