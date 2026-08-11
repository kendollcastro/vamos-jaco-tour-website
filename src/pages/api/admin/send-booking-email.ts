import type { APIRoute } from 'astro';
import { verifyAdmin } from '../../../lib/auth';
import { sendBookingNotifications } from '../../../lib/email-service';

export const POST: APIRoute = async ({ request }) => {
    const authResult = await verifyAdmin(request);
    if (!authResult.authorized) {
        return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            tourName,
            bookingDate,
            adults,
            children,
            totalAmount,
            language = 'en'
        } = body;

        if (!customerEmail) {
            return new Response(JSON.stringify({ success: false, message: 'Customer email is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await sendBookingNotifications({
            customerName: customerName || 'Guest',
            customerEmail,
            customerPhone: customerPhone || 'N/A',
            tourName: tourName || 'Tour',
            tourDate: bookingDate || new Date().toISOString().split('T')[0],
            adults: adults || 1,
            children: children || 0,
            totalAmount: totalAmount || 0,
            language: language as 'en' | 'es'
        });

        return new Response(JSON.stringify({ success: result.success, error: result.error || null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('send-booking-email error:', error?.message);
        return new Response(JSON.stringify({ success: false, message: 'Failed to send booking emails' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};