import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';

const resendApiKey = import.meta.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = 'vamosjacotours2024@gmail.com'; 
const FROM_EMAIL = 'Vamos Jacó Tours <bookings@vamosjacotours.com>';
const REPLY_TO_EMAIL = 'vamosjacotours2024@gmail.com';

interface BookingEmailData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    tourName: string;
    tourDate: string;
    adults: number;
    children: number;
    totalAmount: number;
    language?: 'en' | 'es';
}

// ─── High-Fidelity Email Templates ───────────────────────────

const BRAND_COLOR = '#D92818';
const ACCENT_COLOR = '#03A696';
const LOGO_URL = 'https://www.vamosjacotours.com/logo.png'; // Production Logo Fallback

/**
 * Fetches a setting from the database with a local fallback
 */
async function getGlobalSetting(key: string, fallback: string): Promise<string> {
    if (!supabaseAdmin) return fallback;
    try {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('value')
            .eq('key', key)
            .single();
        
        if (error || !data) return fallback;
        return data.value;
    } catch (e) {
        console.error(`Error fetching setting ${key}:`, e);
        return fallback;
    }
}

const getEmailHeader = (logoUrl: string) => `
    <!--[if mso]>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#0B0F19">
    <tr><td align="center" style="padding: 40px 20px;"><img src="${logoUrl}" alt="Vamos Jacó Tours" width="200" style="display:block;" /></td></tr>
    </table>
    <![endif]-->
    <!--[if !mso]><!-- -->
    <div style="background: linear-gradient(135deg, #0B0F19 0%, #151b2b 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 3px solid ${BRAND_COLOR};">
        <img src="${logoUrl}" alt="Vamos Jacó Tours" width="200" style="max-width: 200px; height: auto; display: inline-block; margin: 0 auto; border: 0;" />
    </div>
    <!--<![endif]-->
`;

const emailFooter = `
    <div style="background-color: #0B0F19; padding: 40px 20px; text-align: center; border-radius: 0 0 16px 16px; margin-top: 0; border-top: 1px solid rgba(255,255,255,0.05);">
        <p style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.6;">
            <strong style="color: white; font-size: 16px;">Vamos Jacó Tours Agency</strong><br />
            Calle de Surfistas, Jacó Beach, Puntarenas, Costa Rica<br />
            <a href="https://wa.me/50687747250" style="color: ${ACCENT_COLOR}; text-decoration: none; font-weight: bold; border-bottom: 1px solid ${ACCENT_COLOR};">Chat on WhatsApp</a>
        </p>
        <p style="margin-top: 30px; color: #4b5563; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
            © ${new Date().getFullYear()} VAMOS JACÓ TOURS • ADVENTURE IS WAITING
        </p>
    </div>
`;

// ─── Service Functions ───────────────────────────────────────

export async function sendBookingNotifications(data: BookingEmailData, logoOverride?: string) {
    if (!resend) {
        console.warn('Resend API key not configured. Skipping emails.');
        return { success: false, error: 'Resend not configured' };
    }

    const { customerName, customerEmail, tourName, tourDate, adults, children, totalAmount, language = 'en' } = data;
    const isEs = language === 'es';

    // Resolve Logo: Priority 1: Manual Override, Priority 2: DB Global Setting, Priority 3: Hardcoded Fallback
    const resolvedLogo = logoOverride || await getGlobalSetting('email_logo_url', LOGO_URL);

    try {
        // 1. Send Confirmation to Customer
        await resend.emails.send({
            from: FROM_EMAIL,
            replyTo: REPLY_TO_EMAIL,
            to: customerEmail,
            subject: isEs 
                ? `¡Tu aventura te espera! Confirmación: ${tourName}`
                : `Your Adventure Awaits! Confirmation: ${tourName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
                        <tr>
                            <td style="padding: 20px;">
                                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                                    <!-- Logo -->
                                    <tr>
                                        <td style="text-align: center; padding: 20px 0;">
                                            <img src="${resolvedLogo}" alt="Vamos Jacó Tours" width="160" style="display: inline-block; max-width: 160px; height: auto;" />
                                        </td>
                                    </tr>
                                    <!-- Titulo -->
                                    <tr>
                                        <td style="text-align: center; padding: 20px 0;">
                                            <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #111111;">
                                                ${isEs ? '¡Tu aventura está confirmada!' : 'Your Adventure is Confirmed!'}
                                            </h1>
                                        </td>
                                    </tr>
                                    <!-- Saludo -->
                                    <tr>
                                        <td style="padding: 10px 0;">
                                            <p style="margin: 0;">${isEs ? 'Hola' : 'Hello'} <strong>${customerName}</strong>!</p>
                                            <p style="margin: 10px 0 0 0;">
                                                ${isEs 
                                                    ? 'Tu reserva en Vamos Jacó Tours ha sido confirmada. Nos vemos pronto en Jacó Beach!'
                                                    : 'Your booking at Vamos Jacó Tours is confirmed. See you soon at Jacó Beach!'}
                                            </p>
                                        </td>
                                    </tr>
                                    <!-- Detalles -->
                                    <tr>
                                        <td style="padding: 20px 0;">
                                            <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #dddddd;">
                                                <tr style="background-color: #f9f9f9;">
                                                    <td style="font-weight: bold; border-bottom: 1px solid #dddddd;">${isEs ? 'Tour' : 'Tour'}</td>
                                                    <td style="text-align: right; border-bottom: 1px solid #dddddd;">${tourName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight: bold; border-bottom: 1px solid #dddddd;">${isEs ? 'Fecha' : 'Date'}</td>
                                                    <td style="text-align: right; border-bottom: 1px solid #dddddd;">${new Date(tourDate).toLocaleDateString(isEs ? 'es-ES' : 'en-US')}</td>
                                                </tr>
                                                <tr style="background-color: #f9f9f9;">
                                                    <td style="font-weight: bold; border-bottom: 1px solid #dddddd;">${isEs ? 'Personas' : 'Guests'}</td>
                                                    <td style="text-align: right; border-bottom: 1px solid #dddddd;">${adults + children}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight: bold;">${isEs ? 'Total' : 'Total'}</td>
                                                    <td style="text-align: right; font-weight: bold; font-size: 18px;">$${totalAmount.toFixed(2)}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Contacto -->
                                    <tr>
                                        <td style="padding: 20px 0; text-align: center;">
                                            <p style="margin: 0 0 10px 0;">
                                                ${isEs ? '¿Tienes preguntas? Chatea con nosotros:' : 'Have questions? Chat with us:'}
                                            </p>
                                            <a href="https://wa.me/50687747250" style="display: inline-block; padding: 12px 24px; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                                                WhatsApp
                                            </a>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 30px 0; text-align: center; border-top: 1px solid #eeeeee;">
                                            <p style="margin: 0; font-size: 12px; color: #888888;">
                                                <strong>Vamos Jacó Tours</strong><br />
                                                ${isEs ? 'Jacó Beach, Costa Rica' : 'Jacó Beach, Costa Rica'}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        // 2. Send Notification to Admin
        await resend.emails.send({
            from: FROM_EMAIL,
            replyTo: customerEmail,
            to: ADMIN_EMAIL,
            subject: `🚨 NEW BOOKING: ${customerName} - ${tourName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
                        <tr>
                            <td style="padding: 20px;">
                                <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="max-width: 500px; margin: 0 auto;">
                                    <tr>
                                        <td style="background-color: #03A696; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                                            <h2 style="margin: 0; color: #ffffff; font-size: 22px;">💰 Nueva Reserva</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 20px; border: 1px solid #dddddd; border-top: none;">
                                            <table width="100%" cellpadding="8" cellspacing="0">
                                                <tr>
                                                    <td style="font-weight: bold; color: #333333;">Cliente</td>
                                                    <td style="text-align: right;">${customerName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666;">Email / Tel</td>
                                                    <td style="text-align: right;">${customerEmail} / ${data.customerPhone}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight: bold; color: #333333;">Tour</td>
                                                    <td style="text-align: right;">${tourName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666;">Fecha</td>
                                                    <td style="text-align: right;">${tourDate}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #666666;">Personas</td>
                                                    <td style="text-align: right;">${adults + children}</td>
                                                </tr>
                                                <tr style="border-top: 2px solid #dddddd;">
                                                    <td style="font-weight: bold; font-size: 18px; padding-top: 10px;">Total</td>
                                                    <td style="text-align: right; font-weight: bold; font-size: 18px; color: #D92818; padding-top: 10px;">$${totalAmount.toFixed(2)}</td>
                                                </tr>
                                            </table>
                                            <div style="text-align: center; margin-top: 20px;">
                                                <a href="https://www.vamosjacotours.com/admin" style="display: inline-block; padding: 12px 24px; background-color: #111111; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">Ver en Dashboard</a>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending booking emails:', error);
        return { success: false, error };
    }
}

export async function sendNewsletterWelcome(email: string, logoOverride?: string, language: 'en' | 'es' = 'en') {
    if (!resend) return { success: false };

    const isEs = language === 'es';

    // Resolve Logo
    const resolvedLogo = logoOverride || await getGlobalSetting('email_logo_url', LOGO_URL);

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            replyTo: REPLY_TO_EMAIL,
            to: email,
            subject: isEs
                ? '¡Bienvenido al Club de Aventuras de Vamos Jacó! 🌴'
                : 'Welcome to the Vamos Jacó Adventures Club! 🌴',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 40px auto; border-radius: 20px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                    ${getEmailHeader(resolvedLogo)}
                    <div style="padding: 50px 40px; text-align: center; background: white;">
                        <h2 style="color: #111827; margin-top: 0; font-size: 28px; font-weight: 900;">
                            ${isEs ? '¡Ya eres parte del Club!' : "You're in the Club!"}
                        </h2>
                        <p style="font-size: 17px; color: #4b5563; line-height: 1.6;">
                            ${isEs 
                                ? 'Gracias por unirte a nuestro boletín exclusivo de aventuras. Serás el primero en enterarte de lugares ocultos, nuevos tours y ofertas secretas.'
                                : "Thanks for joining our exclusive adventures newsletter. You'll be the first to know about hidden spots, new tours, and secret deals."}
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 20px; padding: 35px; margin: 35px 0; border: 1px solid #fde68a;">
                            <h4 style="margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px; color: #92400e; font-size: 12px;">
                                ${isEs ? 'Privilegio de Miembro' : 'Member Privilege'}
                            </h4>
                            <p style="font-size: 22px; font-weight: 900; margin: 0; color: #111827; letter-spacing: -0.5px;">
                                ${isEs ? '¡Desbloquea una Mejora Sorpresa!' : 'Unlock a Surprise Upgrade!'}
                            </p>
                            <p style="margin: 15px 0 0 0; color: #92400e; font-size: 14px;">
                                ${isEs 
                                    ? 'Simplemente menciona este correo al reservar tu primera aventura vía WhatsApp.'
                                    : 'Simply mention this email when booking your first adventure via WhatsApp.'}
                            </p>
                        </div>

                        <p style="font-size: 14px; color: #9ca3af; font-style: italic;">
                            ${isEs ? 'Próxima historia de aventuras pronto en tu bandeja de entrada.' : 'Next adventure story coming soon to your inbox.'}
                        </p>
                    </div>
                    ${emailFooter}
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending newsletter email:', error);
        return { success: false, error };
    }
}
