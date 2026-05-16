import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async (context) => handleCallback(context);
export const POST: APIRoute = async (context) => handleCallback(context);

async function handleCallback(context: any): Promise<Response> {
    const { request, url: contextUrl } = context;
    console.log("=== TILOPAY CALLBACK START ===");
    
    // Determine the public URL of the site
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || contextUrl.host;
    const protocol = request.headers.get('x-forwarded-proto') || contextUrl.protocol.replace(':', '') || 'https';
    // If host is localhost but we are not in dev, fallback to production
    const publicHost = (host.includes('localhost') && !import.meta.env.DEV) ? 'www.vamosjacotours.com' : host;
    const SITE_URL = `${protocol}://${publicHost}`;
    
    console.log(`Detected SITE_URL: ${SITE_URL} (Original host: ${host})`);

    try {
        const params: Record<string, any> = {};
        
        // 1. Get parameters from URL (Prioritize contextUrl which is more reliable in Astro)
        contextUrl.searchParams.forEach((value: string, key: string) => { params[key] = value; });

        // 2. Get parameters from Body (TiloPay often POSTs back)
        const contentType = request.headers.get('content-type') || '';
        if (request.method === 'POST') {
            console.log("POST Content-Type:", contentType);
            
            try {
                if (contentType.includes('application/json')) {
                    const jsonBody = await request.json();
                    Object.assign(params, jsonBody);
                } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
                    const formData = await request.formData();
                    formData.forEach((value: FormDataEntryValue, key: string) => { 
                        params[key] = String(value); 
                    });
                } else {
                    const text = await request.clone().text();
                    console.log("Raw body text:", text);
                    // Try to parse as query string if it looks like one
                    if (text.includes('=') && !text.includes('{')) {
                        const searchParams = new URLSearchParams(text);
                        searchParams.forEach((v, k) => { params[k] = v; });
                    }
                }
            } catch (bodyErr: any) {
                console.error("Error parsing body:", bodyErr);
            }
        }

        console.log("RECEIVED PARAMS:", JSON.stringify(params, null, 2));

        // 3. Identify the booking
        const bookingId = params.order || params.orderNumber || params.reference || params.order_id || params.order_number;
        
        if (!bookingId || bookingId === 'unknown') {
            console.error("NO ORDER ID FOUND");
            const debug = encodeURIComponent(JSON.stringify({
                url: request.url,
                contextUrl: contextUrl.toString(),
                method: request.method,
                contentType,
                params,
                headers: Object.fromEntries(request.headers.entries())
            }));
            return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=InvalidSession&debug=${debug}` } });
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
                    status: 'confirmed',
                    tilopay_order_id: params.tpt || params.auth || 'TILOPAY'
                });
                return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${newBookingId}` } });
            }
        }

        // 6. Check for overbooking before confirming
        if (isSuccess && booking) {
            // Get tour capacity
            const { data: tourData } = await supabaseAdmin
                .from('tours')
                .select('max_participants, name_en')
                .eq('id', booking.tour_id)
                .single();
            
            const maxParticipants = tourData?.max_participants || 10;
            const requestedGuests = (booking.adults || 1) + (booking.children || 0);
            
            // Get all bookings for that date/tour
            const { data: existingBookings } = await supabaseAdmin
                .from('bookings')
                .select('adults, children, status')
                .eq('tour_id', booking.tour_id)
                .eq('booking_date', booking.booking_date)
                .in('status', ['confirmed', 'paid', 'pending', 'office'])
                .neq('id', bookingId); // Exclude current booking
            
            const totalBooked = (existingBookings || []).reduce((sum: number, b: any) => {
                return sum + (b.adults || 0) + (b.children || 0);
            }, 0);
            
            if ((totalBooked + requestedGuests) > maxParticipants) {
                console.warn(`OVERBOOKING PREVENTED for booking ${bookingId}: ${totalBooked} already booked, ${requestedGuests} requested, max is ${maxParticipants}`);
                // Mark as overbooked instead of confirmed
                await supabaseAdmin.from('bookings').update({
                    status: 'overbooked',
                    tilopay_order_id: params.tpt || params.auth,
                    tilopay_response: { ...params, overbooked: true, reason: 'Capacity exceeded' }
                }).eq('id', bookingId);
                
                // TODO: Send overbooking alert to admin
                return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}&overbooked=true` } });
            }
            
            console.log(`Updating booking ${bookingId} to CONFIRMED`);
            await supabaseAdmin.from('bookings').update({
                status: 'confirmed',
                tilopay_order_id: params.tpt || params.auth,
                tilopay_response: params
            }).eq('id', bookingId);

            // 7. Send confirmation emails immediately
            if (booking) {
                try {
                    const { sendBookingNotifications } = await import('../../../lib/email-service');
                    console.log(`Triggering email notification for booking ${bookingId}`);
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
                    console.log("Email notification sent successfully");
                } catch (emailErr) {
                    console.error('Failed to send confirmation email in callback:', emailErr);
                }
            }
            
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