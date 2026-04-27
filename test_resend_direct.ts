import { Resend } from 'resend';
import 'dotenv/config';

// Manual test since import.meta.env is not available in raw Node
const resendApiKey = 're_F2FyShLv_3Dw15yqF2vodneMUzdZcPBv9';
const resend = new Resend(resendApiKey);

async function test() {
    console.log("Sending direct test email via Resend API...");
    try {
        const result = await resend.emails.send({
            from: 'Vamos Jacó Tours <vamosjacotours2024@gmail.com>',
            to: 'kendollcastrom@gmail.com',
            subject: 'Test Email from Antigravity',
            html: '<h1>Test Successful</h1><p>This is a test email to verify the Resend configuration.</p>'
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
