import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendBookingNotifications } from '../../../lib/email-service';
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit';
import { calculateServerPrice, validatePrice } from '../../../lib/price-calculator';
import { sanitize, sanitizeEmail, sanitizePhone } from '../../../lib/sanitize';

export const POST: APIRoute = async ({ request }) => {
    // Rate limiting: 10 requests per minute per IP
    const ip = getClientIP(request);
    const { limited, resetIn } = await checkRateLimit(ip, { windowMs: 60000, max: 10 });
    
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
            language = 'en',
            variationId,
            pricePerAdult,
            tourSlug,
            time,
            duration
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
            console.warn(`Price validation failed for tour: ${tourId}`);
            return new Response(JSON.stringify({ 
                success: false,
                message: 'Unable to verify tour pricing' 
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

            const bookingRow: Record<string, any> = {
                id: generatedBookingId,
                tour_id: resolvedTourId,
                customer_name: sanitizedName,
                customer_email: sanitizedEmail,
                customer_phone: sanitizedPhone,
                tour_name: sanitizedTourName,
                booking_date: formattedDate,
                booking_time: time || null,
                total_amount: priceResult.total,
                status: 'pending',
                adults: adults || 1,
                children: children || 0,
            };
            if (duration) bookingRow.duration = duration;
            if (extraPassengers) bookingRow.extra_passengers = extraPassengers;

            let { error } = await supabaseAdmin
                .from('bookings')
                .insert([bookingRow]);

            // Fallback while migration-extra-passengers.sql has not been applied yet
            if (error && bookingRow.extra_passengers !== undefined) {
                delete bookingRow.extra_passengers;
                ({ error } = await supabaseAdmin
                    .from('bookings')
                    .insert([bookingRow]));
            }

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

        // 4. Booking request created — no online payment (TiloPay removed).
        //    Client pays on arrival or via a payment link sent by the team.
        sendBookingNotifications({
            customerName: sanitizedName,
            customerEmail: sanitizedEmail,
            customerPhone: sanitizedPhone || 'N/A',
            tourName: sanitizedTourName,
            tourDate: formattedDate,
            adults: adults || 1,
            children: children || 0,
            extraPassengers: extraPassengers || 0,
            totalAmount: priceResult.total,
            language: language as 'en' | 'es'
        }).catch(e => console.error('Booking email failed:', e));

        return new Response(JSON.stringify({
            success: true,
            bookingId: generatedBookingId,
            requiresRedirect: false
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Booking creation error:', error?.message, error?.stack);
        return new Response(JSON.stringify({ message: 'Internal server error', error: error?.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
