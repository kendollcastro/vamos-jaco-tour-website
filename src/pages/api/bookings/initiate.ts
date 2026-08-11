import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';
import { calculateServerPrice, validatePrice, isVehicleTour, getVehicleCapacity } from '../../../lib/price-calculator';
import { sanitize, sanitizeEmail, sanitizePhone } from '../../../lib/sanitize';

export const prerender = false;

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
            time,
            adults,
            children,
            totalAmount,
            extraPassengers,
            language = 'en',
            variationId,
            pricePerAdult,
            tourSlug,
            duration
        } = body;

        // 1. Validation
        if (!customerName || !customerEmail || !tourId || !date) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            return new Response(JSON.stringify({ message: 'Invalid email address' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Sanitize all user inputs
        const sanitizedName = sanitize(customerName, 100);
        const sanitizedEmail = sanitizeEmail(customerEmail);
        const sanitizedPhone = sanitizePhone(customerPhone || '');
        const sanitizedTourName = sanitize(tourName || tourId, 200);

        // 2. Server-side price calculation and validation
        const priceResult = await calculateServerPrice({
            tourId,
            tourSlug,
            adults: adults || 1,
            children: children || 0,
            extraPassengers: extraPassengers || 0,
            variationId: variationId || undefined,
            pricePerAdult: pricePerAdult || undefined
        });

        if (!priceResult.isValid) {
            return new Response(JSON.stringify({ 
                success: false,
                message: 'Unable to verify tour pricing' 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!validatePrice(totalAmount, priceResult.total)) {
            return new Response(JSON.stringify({ 
                success: false,
                message: 'Price verification failed' 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 3. Generate a unique order ID for Tilopay
        const orderId = crypto.randomUUID();

        // 4. Resolve tour UUID if tourId is a slug
        let tourUuid = tourId;
        if (supabaseAdmin && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tourId)) {
            const { data: tourData } = await supabaseAdmin
                .from('tours')
                .select('id')
                .eq('slug', tourId)
                .single();
            if (tourData) tourUuid = tourData.id;
        }

        // 5. Check availability before proceeding (overbooking prevention)
        let maxParticipants = 10;
        let vehicleTour = false;
        if (supabaseAdmin) {
            const { data: tourData } = await supabaseAdmin
                .from('tours')
                .select('max_participants, slug')
                .eq('id', tourUuid)
                .single();
            
            maxParticipants = tourData?.max_participants || 10;
            vehicleTour = isVehicleTour(tourData?.slug || tourId);
            const capacity = vehicleTour ? getVehicleCapacity(tourData?.slug || tourId) : 1;
            const requestedGuests = vehicleTour
                ? Math.max(1, Math.ceil((adults || 1) / capacity))
                : (adults || 1) + (children || 0);

            const { data: existingBookings } = await supabaseAdmin
                .from('bookings')
                .select('adults, children, status')
                .eq('tour_id', tourUuid)
                .eq('booking_date', new Date(date).toISOString().split('T')[0])
                .in('status', ['confirmed', 'paid', 'pending']);

            const totalBooked = (existingBookings || []).reduce((sum: number, b: any) => {
                return vehicleTour
                    ? sum + Math.max(1, Math.ceil((b.adults || 0) / capacity))
                    : sum + (b.adults || 0) + (b.children || 0);
            }, 0);
            
            if ((totalBooked + requestedGuests) > maxParticipants) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Sorry, this tour is fully booked for the selected date. Please choose a different date or time.',
                    code: 'OVERBOOKED'
                }), {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // 6. Create booking BEFORE payment (so callback can find it)
        const formattedDate = new Date(date).toISOString().split('T')[0];
        if (!supabaseAdmin) {
            console.error('Supabase not configured - cannot create booking');
            return new Response(JSON.stringify({
                success: false,
                message: 'Payment service unavailable'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const bookingRow: Record<string, any> = {
            id: orderId,
            tour_id: tourUuid,
            tour_name: sanitizedTourName,
            customer_name: sanitizedName,
            customer_email: sanitizedEmail,
            customer_phone: sanitizedPhone,
            booking_date: formattedDate,
            booking_time: time || null,
            adults: adults || 1,
            children: children || 0,
            total_amount: priceResult.total,
            status: 'pending',
        };
        if (duration) bookingRow.duration = duration;
        const { error: insertError } = await supabaseAdmin.from('bookings').insert([bookingRow]);
        if (insertError) {
            console.error('Error creating booking in initiate:', insertError);
            return new Response(JSON.stringify({
                success: false,
                message: 'Failed to create booking'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 7. Booking request created — no online payment (TiloPay removed).
        //    Client pays on arrival or via a payment link sent by the team.
        sendBookingNotifications({
            customerName: sanitizedName,
            customerEmail: sanitizedEmail,
            customerPhone: sanitizedPhone || 'N/A',
            tourName: sanitizedTourName,
            tourDate: formattedDate,
            adults: adults || 1,
            children: children || 0,
            totalAmount: priceResult.total,
            language: language as 'en' | 'es'
        }).catch(e => console.error('Booking email failed:', e));

        return new Response(JSON.stringify({
            success: true,
            bookingId: orderId,
            requiresRedirect: false,
            requiresManualPayment: true,
            message: 'Booking request saved. We will confirm via WhatsApp.'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Booking init error:', error?.message, error?.stack);
        return new Response(JSON.stringify({ message: 'Internal server error', error: error?.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}