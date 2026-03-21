import { sendBookingNotifications, sendNewsletterWelcome } from './.test_email.ts';

async function main() {
    process.env.RESEND_API_KEY = "re_F2FyShLv_3Dw15yqF2vodneMUzdZcPBv9";
    
    console.log("Sending booking confirmation...");
    try {
        const result1 = await sendBookingNotifications({
            customerName: "Kendoll Castro",
            customerEmail: "vamosjacotoursdev@gmail.com",
            customerPhone: "+50688888888",
            tourName: "ATV Adventure (Premium Email Test)",
            tourDate: "2026-10-15",
            adults: 2,
            children: 0,
            totalAmount: 140
        });
        console.log("Booking result:", result1);
    } catch (e) {
        console.error(e);
    }

    console.log("\nSending newsletter welcome...");
    try {
        const result2 = await sendNewsletterWelcome("vamosjacotoursdev@gmail.com");
        console.log("Newsletter result:", result2);
    } catch (e) {
        console.error(e);
    }
}
main();
