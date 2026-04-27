import { Resend } from 'resend';

const resendApiKey = 're_F2FyShLv_3Dw15yqF2vodneMUzdZcPBv9';
const resend = new Resend(resendApiKey);

async function test() {
    console.log("Sending test email via Resend onboarding address...");
    try {
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'kendollcastrom@gmail.com',
            subject: 'Test Email from Resend Onboarding',
            html: '<h1>Test Successful</h1><p>This confirms that the API key works, but you need a verified domain in Resend to use your Gmail address.</p>'
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
