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
                    <meta name="color-scheme" content="light dark" />
                    <meta name="supported-color-schemes" content="light dark" />
                    <title>${tourName}</title>
                    <style type="text/css">
                        :root { color-scheme: light dark; supported-color-schemes: light dark; }
                        @media (prefers-color-scheme: dark) {
                            .email-bg { background-color: #1a1a1a !important; }
                            .content-bg { background-color: #242424 !important; }
                            .text-main { color: #f0f0f0 !important; }
                            .text-sec { color: #bbbbbb !important; }
                            .box-bg { background-color: #2d2d2d !important; border-color: #444444 !important; }
                            .cta-btn { background-color: #03A696 !important; color: #ffffff !important; }
                        }
                    </style>
                    <!--[if mso]>
                    <style type="text/css">
                        body, table, td {font-family: Arial, sans-serif !important;}
                    </style>
                    <![endif]-->
                </head>
                <body style="margin: 0; padding: 0; background-color: #e5e5e5;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #e5e5e5;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table role="presentation" width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #fafafa; border-radius: 16px; overflow: hidden; border: 1px solid #cccccc;">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: #0B0F19; padding: 40px 20px; text-align: center;">
                                            <img src="${resolvedLogo}" alt="Vamos Jacó Tours" width="180" style="display: inline-block; max-width: 180px; height: auto; border: 0; background: #0B0F19; border-radius: 8px; padding: 10px;" />
                                        </td>
                                    </tr>
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 28px; font-weight: 800; text-align: center; font-family: Arial, sans-serif;">
                                                ${isEs ? '¡Costa Rica te espera!' : 'Costa Rica is Calling!'}
                                            </h2>
                                            <p style="margin: 0 0 20px 0; font-size: 18px; color: #444444; text-align: center; font-family: Arial, sans-serif;">
                                                ${isEs ? '¡Pura Vida' : 'Pura Vida'}, <strong style="color: #1a1a1a;">${customerName}</strong>!
                                            </p>
                                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #666666; text-align: center; font-family: Arial, sans-serif; line-height: 1.5;">
                                                ${isEs 
                                                    ? 'Hemos recibido tu reserva en <strong>Vamos Jacó Tours</strong>. Prepárate para una experiencia inolvidable en el paraíso.'
                                                    : "We've received your booking at <strong>Vamos Jacó Tours</strong>. Prepare yourself for an unforgettable experience in paradise."}
                                            </p>
                                            
                                            <!-- Booking Details Box - Dark box for visibility in both modes -->
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #1a1a1a; border-radius: 12px; margin: 0 0 30px 0; border: 1px solid #333333;">
                                                <tr>
                                                    <td style="padding: 25px;">
                                                        <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; font-family: Arial, sans-serif; text-align: center;">
                                                            ${isEs ? 'Detalles de tu Reserva' : 'Booking Details'}
                                                        </h3>
                                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td style="padding: 8px 0; color: #aaaaaa; font-size: 14px; font-family: Arial, sans-serif;">${isEs ? 'Tour' : 'Tour'}</td>
                                                                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #ffffff; font-size: 14px; font-family: Arial, sans-serif;">${tourName}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 8px 0; color: #aaaaaa; font-size: 14px; font-family: Arial, sans-serif;">${isEs ? 'Fecha' : 'Date'}</td>
                                                                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #ffffff; font-size: 14px; font-family: Arial, sans-serif;">${new Date(tourDate).toLocaleDateString(isEs ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 8px 0; color: #aaaaaa; font-size: 14px; font-family: Arial, sans-serif;">${isEs ? 'Invitados' : 'Guests'}</td>
                                                                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #ffffff; font-size: 14px; font-family: Arial, sans-serif;">
                                                                    ${isEs 
                                                                        ? `${adults} Adultos${children > 0 ? ', ' + children + ' Niños' : ''}`
                                                                        : `${adults} Adults${children > 0 ? ', ' + children + ' Children' : ''}`}
                                                                </td>
                                                            </tr>
                                                            <tr style="border-top: 2px solid #444444;">
                                                                <td style="padding: 15px 0 0 0; font-weight: bold; color: #ff6b6b; font-size: 16px; font-family: Arial, sans-serif;">${isEs ? 'Total' : 'Total'}</td>
                                                                <td style="padding: 15px 0 0 0; text-align: right; font-weight: bold; color: #ff6b6b; font-size: 20px; font-family: Arial, sans-serif;">$${totalAmount.toFixed(2)}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- What's Next Box -->
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff8e6; border-radius: 12px; margin: 0 0 30px 0;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <p style="margin: 0; font-size: 15px; color: #664d03; font-family: Arial, sans-serif; line-height: 1.5;">
                                                            <strong>${isEs ? '¿Qué sigue?' : "What's Next?"}</strong><br />
                                                            ${isEs 
                                                                ? 'Nuestro equipo te contactará por WhatsApp para coordinar la hora de recogida.'
                                                                : 'Our team will reach out via WhatsApp to finalize your pickup time.'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- CTA Button -->
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center">
                                                        <a href="https://wa.me/50687747250" class="cta-btn" style="display: inline-block; background-color: ${ACCENT_COLOR}; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; font-family: Arial, sans-serif; text-transform: uppercase;">
                                                            ${isEs ? 'Chatea con Nosotros' : 'Chat with Us'}
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #2a2a2a; padding: 30px 20px; text-align: center;">
                                            <p style="margin: 0 0 10px 0; color: #cccccc; font-size: 13px; font-family: Arial, sans-serif;">
                                                <strong style="color: #ffffff;">Vamos Jacó Tours</strong><br />
                                                ${isEs ? 'Jacó Beach, Puntarenas, Costa Rica' : 'Jacó Beach, Puntarenas, Costa Rica'}
                                            </p>
                                            <a href="https://wa.me/50687747250" style="color: ${ACCENT_COLOR}; text-decoration: none; font-size: 13px; font-family: Arial, sans-serif;">WhatsApp</a>
                                            <p style="margin: 20px 0 0 0; color: #999999; font-size: 11px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                                                © ${new Date().getFullYear()} Vamos Jacó Tours
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
                    <meta name="color-scheme" content="light dark" />
                    <meta name="supported-color-schemes" content="light dark" />
                </head>
                <body style="margin: 0; padding: 0; background-color: #e5e5e5;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #e5e5e5;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table role="presentation" width="100%" max-width="550" cellpadding="0" cellspacing="0" style="max-width: 550px; background-color: #fafafa; border-radius: 16px; overflow: hidden; border: 1px solid #cccccc;">
                                    <tr>
                                        <td style="background-color: ${ACCENT_COLOR}; padding: 30px; color: white; text-align: center;">
                                            <p style="margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; opacity: 0.9;">New Booking</p>
                                            <h2 style="margin: 0; font-size: 26px; font-weight: 900;">💰 Nueva Reserva</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 30px;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f0f0f0; border-radius: 12px; margin-bottom: 25px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 11px; font-weight: bold; text-transform: uppercase;">Cliente</p>
                                                        <p style="margin: 0; font-size: 18px; font-weight: 800; color: #1a1a1a;">${customerName}</p>
                                                        <p style="margin: 5px 0 0 0; color: #555555; font-size: 14px;">${customerEmail} • ${data.customerPhone}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding: 10px 0; color: #555555; font-size: 14px;">Tour</td>
                                                    <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #1a1a1a; font-size: 14px;">${tourName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; color: #555555; font-size: 14px;">Fecha</td>
                                                    <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #1a1a1a; font-size: 14px;">${tourDate}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; color: #555555; font-size: 14px;">Personas</td>
                                                    <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #1a1a1a; font-size: 14px;">${adults + children}</td>
                                                </tr>
                                                <tr style="border-top: 1px solid #bbbbbb;">
                                                    <td style="padding: 15px 0 0 0; font-weight: 900; color: ${BRAND_COLOR}; font-size: 16px;">Total</td>
                                                    <td style="padding: 15px 0 0 0; font-weight: 900; text-align: right; color: ${BRAND_COLOR}; font-size: 22px;">$${totalAmount.toFixed(2)}</td>
                                                </tr>
                                            </table>

                                            <div style="margin-top: 30px; text-align: center;">
                                                <a href="https://www.vamosjacotours.com/admin" style="background: #111111; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">Ver en Dashboard</a>
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
