import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isVehicleTour } from '../../../lib/price-calculator';

export const prerender = false;

const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://www.vamosjacotours.com';

const SANE_STATUSES = ['pending'];

const isSuccessResponse = (params: Record<string, any>): boolean => {
    const responseCode = params.response_code || params.code;
    const hasTransactionId = params.tpt || params.auth || params.tilopayTransaction || params.transactionId;
    return (responseCode === 1 || responseCode === '1') && !!hasTransactionId;
};

export const GET: APIRoute = async (context) => handleCallback(context);
export const POST: APIRoute = async (context) => handleCallback(context);

async function handleCallback(context: any): Promise<Response> {
    const { request, url: contextUrl } = context;
    console.log("=== TILOPAY CALLBACK START ===");

    try {
        const params: Record<string, any> = {};

        // 1. Get parameters from URL
        contextUrl.searchParams.forEach((value: string, key: string) => { params[key] = value; });

        // 2. Get parameters from Body (TiloPay often POSTs back)
        const contentType = request.headers.get('content-type') || '';
        if (request.method === 'POST') {
            try {
                if (contentType.includes('application/json')) {
                    const jsonBody = await request.json();
                    Object.assign(params, jsonBody);
                } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
                    const formData = await request.formData();
                    formData.forEach((value: FormDataEntryValue, key: string) => {
                        params[key] = String(value);
                    });
                }
            } catch (bodyErr: any) {
                console.error("Error parsing body:", bodyErr);
            }
        }

        // 3. Identify the booking
        const bookingId = params.order || params.orderNumber || params.reference || params.order_id || params.order_number;

        if (!bookingId || bookingId === 'unknown') {
            console.error("NO ORDER ID FOUND");
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=InvalidSession` } });
        }

        // 4. Check success
        const isSuccess = isSuccessResponse(params);
        const transactionId = params.tpt || params.auth || '';

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
            console.warn(`Booking ${bookingId} not found in DB. No fallback booking created.`);
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=BookingNotFound` } });
        }

        // Only allow confirming bookings that are in a sane pending state
        if (!SANE_STATUSES.includes(booking.status)) {
            console.warn(`Booking ${bookingId} has status "${booking.status}" — not updating.`);
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });
        }

        // 6. Handle success
        if (isSuccess) {
            // Check for overbooking before confirming
            const { data: tourData } = await supabaseAdmin
                .from('tours')
                .select('max_participants, name_en, slug')
                .eq('id', booking.tour_id)
                .single();

            const maxParticipants = tourData?.max_participants || 10;
            const vehicleTour = isVehicleTour(tourData?.slug || '');
            const requestedGuests = vehicleTour ? (booking.adults || 1) : (booking.adults || 1) + (booking.children || 0);

            const { data: existingBookings } = await supabaseAdmin
                .from('bookings')
                .select('adults, children, status')
                .eq('tour_id', booking.tour_id)
                .eq('booking_date', booking.booking_date)
                .in('status', ['confirmed', 'paid', 'pending', 'office'])
                .neq('id', bookingId);

            const totalBooked = (existingBookings || []).reduce((sum: number, b: any) => {
                return vehicleTour ? (b.adults || 0) : (b.adults || 0) + (b.children || 0);
            }, 0);

            if ((totalBooked + requestedGuests) > maxParticipants) {
                console.warn(`OVERBOOKING PREVENTED for booking ${bookingId}: ${totalBooked} already booked, ${requestedGuests} requested, max is ${maxParticipants}`);
                await supabaseAdmin.from('bookings').update({
                    status: 'overbooked',
                    tilopay_order_id: transactionId,
                    tilopay_response: { overbooked: true, reason: 'Capacity exceeded' }
                }).eq('id', bookingId);

                return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}&overbooked=true` } });
            }

            console.log(`Updating booking ${bookingId} to CONFIRMED`);
            await supabaseAdmin.from('bookings').update({
                status: 'confirmed',
                tilopay_order_id: transactionId,
                tilopay_response: { confirmed_at: new Date().toISOString(), transaction_id: transactionId }
            }).eq('id', bookingId);

            // 7. Send confirmation emails
            try {
                const { sendBookingNotifications } = await import('../../../lib/email-service');
                await sendBookingNotifications({
                    customerName: booking.customer_name,
                    customerEmail: booking.customer_email,
                    customerPhone: booking.customer_phone || 'N/A',
                    tourName: booking.tour_name,
                    tourDate: booking.booking_date,
                    adults: booking.adults,
                    children: booking.children,
                    totalAmount: booking.total_amount,
                    language: params.language || 'en'
                });
            } catch (emailErr) {
                console.error('Failed to send confirmation email in callback:', emailErr);
            }

            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });
        }

        // 8. Handle failure
        console.log(`Updating booking ${bookingId} to FAILED`);
        await supabaseAdmin.from('bookings').update({
            status: 'failed',
            tilopay_response: { failed_at: new Date().toISOString() }
        }).eq('id', bookingId);

        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=${encodeURIComponent(params.message || 'Payment Declined')}` } });

    } catch (err) {
        console.error("CALLBACK EXCEPTION:", err);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
    }
}