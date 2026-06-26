import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { createPaymentSession } from '../../../lib/tilopay';
import { calculateServerPrice, validatePrice, isVehicleTour } from '../../../lib/price-calculator';

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
            paymentMethod = 'card',
            language = 'en',
            variationId,
            pricePerAdult,
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

        // Sanitize inputs
        const sanitizedName = customerName.trim().slice(0, 100);
        const sanitizedEmail = customerEmail.trim().toLowerCase().slice(0, 254);
        const sanitizedPhone = (customerPhone || '').trim().slice(0, 20);

        // 2. Server-side price calculation and validation
        const priceResult = await calculateServerPrice({
            tourId,
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
            const requestedGuests = vehicleTour ? (adults || 1) : (adults || 1) + (children || 0);
            
            const { data: existingBookings } = await supabaseAdmin
                .from('bookings')
                .select('adults, children, status')
                .eq('tour_id', tourUuid)
                .eq('booking_date', new Date(date).toISOString().split('T')[0])
                .in('status', ['confirmed', 'paid', 'pending']);
            
            const totalBooked = (existingBookings || []).reduce((sum: number, b: any) => {
                return vehicleTour ? (b.adults || 0) : (b.adults || 0) + (b.children || 0);
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
            tour_name: tourName || tourId,
            customer_name: sanitizedName,
            customer_email: sanitizedEmail,
            customer_phone: sanitizedPhone,
            booking_date: formattedDate,
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

        // 7. Handle TiloPay Gateway for Card Payments
        if (paymentMethod === 'card') {
            try {
                const paymentUrl = await createPaymentSession({
                    amount: priceResult.total,
                    orderNumber: orderId,
                    language: language as 'en' | 'es',
                    customer: {
                        firstName: sanitizedName.split(' ')[0],
                        lastName: sanitizedName.split(' ').slice(1).join(' ') || 'Customer',
                        email: sanitizedEmail,
                        phone: sanitizedPhone || '00000000'
                    }
                });

                return new Response(JSON.stringify({
                    success: true,
                    pendingId: orderId,
                    paymentData: {
                        customerName: sanitizedName,
                        customerEmail: sanitizedEmail,
                        customerPhone: sanitizedPhone,
                        tourId: tourUuid,
                        tourName: tourName || tourId,
                        date,
                        formattedDate,
                        adults: adults || 1,
                        children: children || 0,
                        extraPassengers: extraPassengers || 0,
                        totalAmount: priceResult.total,
                        language
                    },
                    paymentUrl,
                    requiresRedirect: true
                }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (paymentError: any) {
                console.error('TiloPay Integration Error:', paymentError);
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Payment service unavailable'
                }), { 
                    status: 502,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response(JSON.stringify({
            success: false,
            message: 'Cash payments not supported in this flow'
        }), { 
            status: 400,
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