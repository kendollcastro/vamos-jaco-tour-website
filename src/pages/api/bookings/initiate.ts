import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { createPaymentSession } from '../../../lib/tilopay';
import { calculateServerPrice, validatePrice } from '../../../lib/price-calculator';

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
            adults,
            children,
            totalAmount,
            extraPassengers,
            paymentMethod = 'card',
            language = 'en',
            variationId,
            pricePerAdult
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

        // 5. Create PENDING booking in Supabase
        if (supabaseAdmin) {
            const { error: dbError } = await supabaseAdmin.from('bookings').insert({
                id: orderId,
                customer_name: `${sanitizedName.split(' ')[0]} ${sanitizedName.split(' ').slice(1).join(' ') || 'Customer'}`,
                customer_email: sanitizedEmail,
                customer_phone: sanitizedPhone,
                tour_id: tourUuid,
                tour_name: tourName || tourId,
                booking_date: new Date(date).toISOString().split('T')[0],
                adults: adults || 1,
                children: children || 0,
                total_amount: priceResult.total,
                status: 'pending',
                language: language
            });

            if (dbError) {
                console.error('Failed to create pending booking:', dbError);
                // We'll continue anyway, but the callback might have issues
            }
        }

        // 6. Handle TiloPay Gateway for Card Payments
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
                        formattedDate: new Date(date).toISOString().split('T')[0],
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