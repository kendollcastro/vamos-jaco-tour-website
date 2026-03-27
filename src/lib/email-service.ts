import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';

const resendApiKey = import.meta.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = 'kendollcastro@gmail.com'; 
const FROM_EMAIL = 'onboarding@resend.dev'; // Replace with verified domain when ready (e.g., info@vamosjacotours.com)

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
const LOGO_URL = 'https://vamosjt.com/logo.png'; // Production Logo Fallback

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
    <div style="background: linear-gradient(135deg, #0B0F19 0%, #151b2b 100%); padding: 60px 20px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 2px solid ${BRAND_COLOR};">
        <img src="${logoUrl}" alt="Vamos Jacó Tours" style="max-width: 250px; height: auto; display: block; margin: 0 auto; filter: drop-shadow(0 0 10px rgba(217, 40, 24, 0.3));" />
    </div>
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
            to: customerEmail,
            subject: isEs 
                ? `¡Tu aventura te espera! Confirmación: ${tourName}`
                : `Your Adventure Awaits! Confirmation: ${tourName}`,
            html: `
                <div style="font-family: 'Inter', 'Poppins', 'Helvetica Neue', sans-serif; max-width: 650px; margin: 0 auto; color: #1f2937; line-height: 1.6; background-color: #f9fafb; padding: 20px;">
                    <div style="box-shadow: 0 20px 50px rgba(0,0,0,0.1); border-radius: 16px; overflow: hidden;">
                        ${getEmailHeader(resolvedLogo)}
                        <div style="padding: 50px 40px; background: white;">
                            <h2 style="color: #111827; margin-top: 0; font-size: 32px; text-align: center; font-weight: 800; letter-spacing: -1px;">
                                ${isEs ? '¡Costa Rica te espera!' : 'Costa Rica is Calling!'}
                            </h2>
                            <p style="font-size: 18px; text-align: center; color: #4b5563;">
                                ${isEs ? '¡Pura Vida' : 'Pura Vida'}, <strong>${customerName}</strong>!
                            </p>
                            <p style="font-size: 16px; text-align: center; margin-bottom: 40px;">
                                ${isEs 
                                    ? `Hemos recibido tu reserva en <strong>Vamos Jacó Tours</strong>. Prepárate para una experiencia inolvidable en el paraíso.`
                                    : `We've received your booking at <strong>Vamos Jacó Tours</strong>. Prepare yourself for an unforgettable experience in paradise.`}
                            </p>
                            
                            <div style="background: linear-gradient(to bottom right, #ffffff, #fdf2f2); border: 1px solid #fee2e2; padding: 35px; border-radius: 20px; margin: 40px 0; box-shadow: 0 4px 12px rgba(217, 40, 24, 0.05);">
                                <h3 style="margin-top: 0; color: ${BRAND_COLOR}; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #fee2e2; padding-bottom: 15px; margin-bottom: 20px; text-align: center;">
                                    ${isEs ? 'Resumen de la Aventura' : 'Adventure Summary'}
                                </h3>
                                <table style="width: 100%; font-size: 16px; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 12px 0; color: #6b7280;">${isEs ? 'Tour' : 'Tour'}</td>
                                        <td style="padding: 12px 0; font-weight: 700; text-align: right; color: #111827;">${tourName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #6b7280;">${isEs ? 'Fecha' : 'Date'}</td>
                                        <td style="padding: 12px 0; font-weight: 700; text-align: right; color: #111827;">
                                            ${new Date(tourDate).toLocaleDateString(isEs ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #6b7280;">${isEs ? 'Invitados' : 'Guests'}</td>
                                        <td style="padding: 12px 0; font-weight: 700; text-align: right; color: #111827;">
                                            ${isEs 
                                                ? `${adults} Adultos${children > 0 ? `, ${children} Niños` : ''}`
                                                : `${adults} Adults${children > 0 ? `, ${children} Children` : ''}`}
                                        </td>
                                    </tr>
                                    <tr style="border-top: 2px solid #fee2e2;">
                                        <td style="padding: 20px 0 0 0; font-weight: 800; font-size: 20px; color: ${BRAND_COLOR};">
                                            ${isEs ? 'Total Pagado' : 'Total Paid'}
                                        </td>
                                        <td style="padding: 20px 0 0 0; font-weight: 800; font-size: 24px; text-align: right; color: ${BRAND_COLOR};">$${totalAmount.toFixed(2)}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background: #fffbeb; border-radius: 16px; padding: 25px; display: flex; align-items: flex-start; gap: 15px; margin-bottom: 40px;">
                                <div style="background: #fef3c7; padding: 10px; border-radius: 10px;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <p style="margin: 0; font-size: 15px; color: #92400e; line-height: 1.5;">
                                    <strong>${isEs ? '¿Qué sigue?' : "What's Next?"}</strong><br />
                                    ${isEs 
                                        ? 'Nuestro equipo de conserjería se pondrá en contacto por WhatsApp para coordinar la hora de recogida y el punto de encuentro.'
                                        : 'Our concierge team will reach out via WhatsApp to finalize your pickup time and meeting point.'}
                                </p>
                            </div>

                            <div style="text-align: center;">
                                <a href="https://wa.me/50687747250" style="display: inline-block; background-color: ${ACCENT_COLOR}; color: white; padding: 22px 45px; text-decoration: none; border-radius: 100px; font-weight: 800; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 15px 30px rgba(3, 166, 150, 0.3); transition: all 0.3s ease;">
                                    ${isEs ? 'Habla con nuestro Concierge' : 'Chat with our Concierge'}
                                </a>
                            </div>
                        </div>
                        ${emailFooter}
                    </div>
                </div>
            `,
        });

        // 2. Send Notification to Admin
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `🚨 NEW BOOKING: ${customerName} - ${tourName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 20px auto; color: #111827; background: #f3f4f6; padding: 20px;">
                    <div style="background: white; border-radius: 20px; overflow: hidden; border: 1px solid #e5e7eb;">
                        <div style="background-color: ${ACCENT_COLOR}; padding: 30px; color: white; text-align: center;">
                            <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 12px; margin-bottom: 10px; opacity: 0.8;">Internal Notification</p>
                            <h2 style="margin: 0; font-size: 28px; font-weight: 900;">New Sale! 💰</h2>
                        </div>
                        <div style="padding: 40px;">
                            <div style="background: #f9fafb; padding: 25px; border-radius: 16px; margin-bottom: 30px;">
                                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase;">Customer</p>
                                <p style="margin: 0; font-size: 20px; font-weight: 800;">${customerName}</p>
                                <p style="margin: 5px 0 0 0; color: #4b5563;">${customerEmail} • ${data.customerPhone}</p>
                            </div>
                            
                            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                                <tr><td style="padding: 12px 0; color: #6b7280;">Activity</td><td style="padding: 12px 0; font-weight: 700; text-align: right;">${tourName}</td></tr>
                                <tr><td style="padding: 12px 0; color: #6b7280;">Date</td><td style="padding: 12px 0; font-weight: 700; text-align: right;">${tourDate}</td></tr>
                                <tr><td style="padding: 12px 0; color: #6b7280;">Guests</td><td style="padding: 12px 0; font-weight: 700; text-align: right;">${adults + children}</td></tr>
                                <tr style="border-top: 1px solid #e5e7eb;"><td style="padding: 20px 0 0 0; font-weight: 900; font-size: 18px; color: ${BRAND_COLOR};">Value</td><td style="padding: 20px 0 0 0; font-weight: 900; font-size: 24px; text-align: right; color: ${BRAND_COLOR};">$${totalAmount.toFixed(2)}</td></tr>
                            </table>

                            <div style="margin-top: 40px; text-align: center;">
                                <a href="https://vamosjt.com/admin" style="background: #111827; color: white; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 800; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">View in Dashboard</a>
                            </div>
                        </div>
                    </div>
                </div>
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
