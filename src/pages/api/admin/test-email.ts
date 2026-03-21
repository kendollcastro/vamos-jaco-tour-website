import type { APIRoute } from 'astro';
import { sendBookingNotifications, sendNewsletterWelcome } from '../../../lib/email-service';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
        }

        // Test Booking Email
        const bookingResult = await sendBookingNotifications({
            customerName: "Test User",
            customerEmail: email,
            customerPhone: "+50688888888",
            tourName: "ATV Adventure (Premium Email Test)",
            tourDate: new Date().toISOString().split('T')[0],
            adults: 2,
            children: 0,
            totalAmount: 140
        });

        // Test Newsletter Email
        const newsletterResult = await sendNewsletterWelcome(email);

        return new Response(JSON.stringify({ 
            success: true, 
            message: 'Test emails triggered successfully!',
            details: {
                booking: bookingResult,
                newsletter: newsletterResult
            }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Test email error:', error);
        return new Response(JSON.stringify({ message: 'Test email failed', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
