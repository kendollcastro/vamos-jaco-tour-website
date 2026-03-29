import type { APIRoute } from 'astro';
import { verifyAdmin } from '../../../lib/auth';
import { sendBookingNotifications, sendNewsletterWelcome } from '../../../lib/email-service';

export const POST: APIRoute = async ({ request }) => {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.authorized) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'Unauthorized' 
        }), { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { email, logoOverride, language = 'en' } = body;

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
            totalAmount: 140,
            language: language as 'en' | 'es'
        }, logoOverride);

        // Test Newsletter Email
        const newsletterResult = await sendNewsletterWelcome(email, logoOverride, language as 'en' | 'es');

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
        return new Response(JSON.stringify({ message: 'Test email failed' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
