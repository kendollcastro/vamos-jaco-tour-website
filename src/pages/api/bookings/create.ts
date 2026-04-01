import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';
import { createPaymentSession } from '../../../lib/tilopay';
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit';
import { calculateServerPrice, validatePrice } from '../../../lib/price-calculator';

export const POST: APIRoute = async ({ request }) => {
    // Rate limiting: 10 requests per minute per IP
    const ip = getClientIP(request);
    const { limited, resetIn } = checkRateLimit(ip, { windowMs: 60000, max: 10 });
    
    if (limited) {
        return new Response(JSON.stringify({ 
            success: false,
            message: 'Too many requests. Please try again later.' 
        }), { 
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil(resetIn / 1000).toString()
            }
        });
    }

    try {
        const body = await request.json();
        console.log('BOOKING_DEBUG:', JSON.stringify(body));
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
            language = 'en'
        } = body;


        // 1. Validation
        if (!customerName || !customerEmail || !tourId || !date) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate email format
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
            extraPassengers: extraPassengers || 0
        });

        if (!priceResult.isValid) {
            console.error(`PRICE_FAIL: tourId="${tourId}" adults=${adults} children=${children}`);
            return new Response(JSON.stringify({ 
                success: false,
                message: 'Unable to verify tour pricing',
                tourId, adults, children
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!validatePrice(totalAmount, priceResult.total)) {
            console.warn(`Price mismatch: provided=${totalAmount}, expected=${priceResult.total}`);
            return new Response(JSON.stringify({ 
                success: false,
                message: 'Price verification failed' 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Format date to YYYY-MM-DD safely
        const formattedDate = new Date(date).toISOString().split('T')[0];

        // Generate UUID on the server
        const generatedBookingId = crypto.randomUUID();

        // 3. Insert into Supabase
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
                    customer_name: sanitizedName,
                    customer_email: sanitizedEmail,
                    customer_phone: sanitizedPhone,
                    tour_name: tourName || tourId,
                    booking_date: formattedDate,
                    total_amount: priceResult.total, // Use server-calculated price
                    status: 'pending',
                    adults: adults || 1,
                    children: children || 0,
                }]);

            if (error) {
                console.error('Supabase booking error:', error.code);
                return new Response(JSON.stringify({ 
                    success: false, 
                    message: 'Failed to create booking'
                }), { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // 4. Handle TiloPay Gateway for Card Payments
        if (paymentMethod === 'card') {
            try {
                const paymentUrl = await createPaymentSession({
                    amount: priceResult.total,
                    orderNumber: generatedBookingId,
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
                    bookingId: generatedBookingId,
                    paymentUrl,
                    requiresRedirect: true
                }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (paymentError: any) {
                console.error('TiloPay Integration Error');
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
            success: true,
            bookingId: generatedBookingId,
            requiresRedirect: false
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Booking creation error');
        return new Response(JSON.stringify({ message: 'Internal server error' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
