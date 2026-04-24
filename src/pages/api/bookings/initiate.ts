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

        // 3. Generate a pending booking ID (NOT saved yet - will be created on payment success)
        const generatedPendingId = `pending-${crypto.randomUUID()}`;

        // 4. Handle TiloPay Gateway for Card Payments
        if (paymentMethod === 'card') {
            try {
                const paymentUrl = await createPaymentSession({
                    amount: priceResult.total,
                    orderNumber: generatedPendingId,
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
                    pendingId: generatedPendingId,
                    paymentData: {
                        customerName: sanitizedName,
                        customerEmail: sanitizedEmail,
                        customerPhone: sanitizedPhone,
                        tourId,
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