import { sendBookingNotifications } from './src/lib/email-service';

async function test() {
    console.log("Sending test email...");
    const result = await sendBookingNotifications({
        customerName: 'Kendoll Castro',
        customerEmail: 'kendollcastrom@gmail.com',
        customerPhone: '+506 8888 8888',
        tourName: 'Premium ATV Test',
        tourDate: '2026-05-01',
        adults: 2,
        children: 1,
        totalAmount: 150.00,
        language: 'es'
    });
    console.log("Result:", result);
}

test();
