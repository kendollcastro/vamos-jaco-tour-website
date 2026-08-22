import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';

const resendApiKey = import.meta.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = 'vamosjacotours2024@gmail.com';
const FROM_EMAIL = 'Vamos Jacó Tours <bookings@vamosjacotours.com>';
const REPLY_TO_EMAIL = 'vamosjacotours2024@gmail.com';

const BRAND_COLOR = '#D92818';
const ACCENT_COLOR = '#03A696';
const LOGO_URL = 'https://www.vamosjacotours.com/logo.png';

interface BookingEmailData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    tourName: string;
    tourDate: string;
    adults: number;
    children: number;
    extraPassengers?: number;
    totalAmount: number;
    language?: 'en' | 'es';
}

async function getGlobalSetting(key: string, fallback: string): Promise<string> {
    if (!supabaseAdmin) return fallback;
    try {
        const { data, error } = await supabaseAdmin
            .from('settings').select('value').eq('key', key).single();
        if (error || !data) return fallback;
        return data.value;
    } catch (e) {
        console.error(`Error fetching setting ${key}:`, e);
        return fallback;
    }
}

export async function sendBookingNotifications(data: BookingEmailData, logoOverride?: string) {
    if (!resend) {
        console.warn('Resend API key not configured. Skipping emails.');
        return { success: false, error: 'Resend not configured' };
    }

    const { customerName, customerEmail, tourName, tourDate, adults, children, totalAmount, language = 'en' } = data;
    const isEs = language === 'es';
    const resolvedLogo = logoOverride || await getGlobalSetting('email_logo_url', LOGO_URL);

    // Safe date format — add noon to avoid timezone-off-by-one
    const formattedDate = new Date(tourDate + 'T12:00:00').toLocaleDateString(
        isEs ? 'es-ES' : 'en-US',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    );

    const extrasSuffix = data.extraPassengers && data.extraPassengers > 0
        ? (isEs ? `, ${data.extraPassengers} pax extra` : `, ${data.extraPassengers} extra pax`)
        : '';
    const guestsStr = isEs
        ? `${adults} Adulto${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Niño${children !== 1 ? 's' : ''}` : ''}${extrasSuffix}`
        : `${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children !== 1 ? 'ren' : ''}` : ''}${extrasSuffix}`;

    try {
        // ── Customer confirmation email ──────────────────────────────
        await resend.emails.send({
            from: FROM_EMAIL,
            replyTo: REPLY_TO_EMAIL,
            to: customerEmail,
            subject: isEs
                ? `¡Tu aventura te espera! Confirmación: ${tourName}`
                : `Your Adventure Awaits! Confirmation: ${tourName}`,
            html: `<!DOCTYPE html>
<html lang="${isEs ? 'es' : 'en'}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${isEs ? 'Confirmación de Reserva' : 'Booking Confirmation'} – Vamos Jacó Tours</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .outer { width: 100% !important; }
      .hero-title { font-size: 26px !important; }
      .body-pad { padding: 28px 18px !important; }
      .card-pad { padding: 22px 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4f6">
  <tr><td align="center" style="padding:24px 12px;">

    <!-- Card wrapper -->
    <table class="outer" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.12);">

      <!-- DARK HEADER -->
      <tr>
        <td align="center" style="background:#0B0F19;padding:44px 24px 40px;border-bottom:3px solid ${BRAND_COLOR};">
          <img src="${resolvedLogo}" alt="Vamos Jacó Tours" width="200" style="max-width:200px;height:auto;display:block;margin:0 auto;" />
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td class="body-pad" bgcolor="#ffffff" style="padding:44px 36px;">

          <!-- Headline -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding-bottom:6px;">
              <h1 class="hero-title" style="margin:0;font-size:30px;font-weight:800;color:#111827;letter-spacing:-0.5px;line-height:1.2;">
                ${isEs ? '¡Costa Rica te espera!' : 'Costa Rica is Calling!'}
              </h1>
            </td></tr>
            <tr><td align="center" style="padding-bottom:6px;">
              <p style="margin:0;font-size:17px;color:#4b5563;">
                ${isEs ? '¡Pura Vida' : 'Pura Vida'}, <strong>${customerName}</strong>!
              </p>
            </td></tr>
            <tr><td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#4b5563;line-height:1.6;">
                ${isEs
                    ? 'Hemos recibido tu reserva en <strong>Vamos Jacó Tours</strong>.<br />Prepárate para una experiencia inolvidable en el paraíso.'
                    : 'We\'ve received your booking at <strong>Vamos Jacó Tours</strong>.<br />Prepare yourself for an unforgettable experience in paradise.'}
              </p>
            </td></tr>
          </table>

          <!-- ADVENTURE SUMMARY CARD -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #fee2e2;border-radius:14px;background:#fff8f8;margin-bottom:28px;">
            <tr>
              <td class="card-pad" style="padding:26px 28px;">
                <!-- Card heading -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td align="center" style="padding-bottom:14px;border-bottom:1px solid #fee2e2;">
                    <p style="margin:0;color:${BRAND_COLOR};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:3px;">
                      ${isEs ? 'Resumen de la Aventura' : 'Adventure Summary'}
                    </p>
                  </td></tr>
                </table>
                <!-- Data rows — table only, no flex -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;font-size:15px;">${isEs ? 'Tour' : 'Tour'}</td>
                    <td style="padding:10px 0;font-weight:700;font-size:15px;color:#111827;text-align:right;">${tourName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;font-size:15px;border-top:1px solid #fee2e2;">${isEs ? 'Fecha' : 'Date'}</td>
                    <td style="padding:10px 0;font-weight:700;font-size:15px;color:#111827;text-align:right;border-top:1px solid #fee2e2;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;font-size:15px;border-top:1px solid #fee2e2;">${isEs ? 'Invitados' : 'Guests'}</td>
                    <td style="padding:10px 0;font-weight:700;font-size:15px;color:#111827;text-align:right;border-top:1px solid #fee2e2;">${guestsStr}</td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0 4px;font-weight:800;font-size:17px;color:${BRAND_COLOR};border-top:2px solid #fee2e2;">${isEs ? 'Total a Pagar' : 'Total to Pay'}</td>
                    <td style="padding:16px 0 4px;font-weight:800;font-size:22px;color:${BRAND_COLOR};text-align:right;border-top:2px solid #fee2e2;">$${totalAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding:6px 0 0;color:#6b7280;font-size:12px;text-align:right;">${isEs ? 'Se paga al llegar al tour' : 'Due on arrival at the tour'}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- WHAT'S NEXT — table layout, NO flexbox -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffbeb;border-radius:12px;margin-bottom:32px;">
            <tr>
              <td valign="top" width="52" style="padding:18px 0 18px 18px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:#fef3c7;border-radius:8px;">
                  <tr><td style="padding:9px;font-size:20px;line-height:1;">📞</td></tr>
                </table>
              </td>
              <td valign="top" style="padding:18px 18px 18px 10px;">
                <p style="margin:0;font-size:14px;color:#92400e;line-height:1.5;">
                  <strong>${isEs ? '¿Qué sigue?' : "What's Next?"}</strong><br />
                  ${isEs
                      ? 'Nuestro equipo se pondrá en contacto por WhatsApp para coordinar la hora de recogida y el punto de encuentro. No necesitas pagar ahora: puedes pagar al llegar o pedirnos un link de pago seguro por WhatsApp.'
                      : 'Our concierge team will reach out via WhatsApp to finalize your pickup time and meeting point. No payment is needed now — you can pay on arrival or request a secure payment link via WhatsApp.'}
                </p>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center">
              <a href="https://wa.me/50687747250" style="display:inline-block;background-color:${ACCENT_COLOR};color:#ffffff;padding:18px 44px;text-decoration:none;border-radius:100px;font-weight:800;font-size:14px;text-transform:uppercase;letter-spacing:2px;">
                ${isEs ? 'Habla con nuestro Concierge' : 'Chat with our Concierge'}
              </a>
            </td></tr>
          </table>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td align="center" bgcolor="#0B0F19" style="padding:36px 24px;border-top:1px solid rgba(255,255,255,0.07);">
          <p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">Vamos Jacó Tours Agency</p>
          <p style="margin:0 0 14px;color:#9ca3af;font-size:13px;">Calle de Surfistas, Jacó Beach, Puntarenas, Costa Rica</p>
          <a href="https://wa.me/50687747250" style="color:${ACCENT_COLOR};text-decoration:none;font-weight:700;font-size:13px;">Chat on WhatsApp</a>
          <p style="margin:24px 0 0;color:#4b5563;font-size:10px;text-transform:uppercase;letter-spacing:2px;">
            © ${new Date().getFullYear()} VAMOS JACÓ TOURS • ADVENTURE IS WAITING
          </p>
        </td>
      </tr>

    </table>
    <!-- /Card wrapper -->

  </td></tr>
</table>
</body>
</html>`,
        });

        // ── Admin notification email ─────────────────────────────────
        await resend.emails.send({
            from: FROM_EMAIL,
            replyTo: customerEmail,
            to: ADMIN_EMAIL,
            subject: `🕐 BOOKING REQUEST: ${customerName} - ${tourName} (UNPAID)`,
            html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Booking – Admin</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4f6">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;background:#ffffff;">
      <tr>
        <td align="center" bgcolor="${ACCENT_COLOR}" style="padding:26px 24px;">
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.8);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;">Internal Notification</p>
          <h2 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;">New Booking Request ⏳</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb;border-radius:10px;margin-bottom:20px;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 3px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Customer</p>
              <p style="margin:0 0 3px;font-size:19px;font-weight:800;color:#111827;">${customerName}</p>
              <p style="margin:0;color:#4b5563;font-size:13px;">${customerEmail} • ${data.customerPhone}</p>
            </td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f3f4f6;">Activity</td>
              <td style="padding:10px 0;font-weight:700;font-size:14px;color:#111827;text-align:right;border-bottom:1px solid #f3f4f6;">${tourName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f3f4f6;">Date</td>
              <td style="padding:10px 0;font-weight:700;font-size:14px;color:#111827;text-align:right;border-bottom:1px solid #f3f4f6;">${tourDate}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f3f4f6;">Guests</td>
              <td style="padding:10px 0;font-weight:700;font-size:14px;color:#111827;text-align:right;border-bottom:1px solid #f3f4f6;">${adults + children}</td>
            </tr>
            <tr>
              <td style="padding:16px 0 0;font-weight:900;font-size:16px;color:${BRAND_COLOR};">Value (UNPAID)</td>
              <td style="padding:16px 0 0;font-weight:900;font-size:22px;color:${BRAND_COLOR};text-align:right;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
            <tr><td style="padding:0 0 20px;color:#6b7280;font-size:13px;line-height:1.5;">
              <strong>Payment not received.</strong> Contact the customer via WhatsApp to confirm the tour and arrange payment on arrival or send a payment link.
            </td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
            <tr><td align="center">
              <a href="https://www.vamosjacotours.com/admin" style="display:inline-block;background:#111827;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:10px;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:1px;">
                View in Dashboard
              </a>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
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
    const resolvedLogo = logoOverride || await getGlobalSetting('email_logo_url', LOGO_URL);

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            replyTo: REPLY_TO_EMAIL,
            to: email,
            subject: isEs
                ? '¡Bienvenido al Club de Aventuras de Vamos Jacó! 🌴'
                : 'Welcome to the Vamos Jacó Adventures Club! 🌴',
            html: `<!DOCTYPE html>
<html lang="${isEs ? 'es' : 'en'}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${isEs ? 'Bienvenido' : 'Welcome'} – Vamos Jacó Tours</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4f6">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
      <tr>
        <td align="center" style="background:#0B0F19;padding:44px 24px 40px;border-bottom:3px solid ${BRAND_COLOR};">
          <img src="${resolvedLogo}" alt="Vamos Jacó Tours" width="200" style="max-width:200px;height:auto;display:block;margin:0 auto;" />
        </td>
      </tr>
      <tr>
        <td align="center" bgcolor="#ffffff" style="padding:44px 36px;">
          <h2 style="margin:0 0 14px;color:#111827;font-size:26px;font-weight:900;">${isEs ? '¡Ya eres parte del Club!' : "You're in the Club!"}</h2>
          <p style="margin:0 0 28px;font-size:16px;color:#4b5563;line-height:1.6;max-width:420px;">
            ${isEs
                ? 'Gracias por unirte a nuestro boletín exclusivo de aventuras. Serás el primero en enterarte de lugares ocultos, nuevos tours y ofertas secretas.'
                : "Thanks for joining our exclusive adventures newsletter. You'll be the first to know about hidden spots, new tours, and secret deals."}
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:14px;border:1px solid #fde68a;margin-bottom:28px;">
            <tr><td style="padding:28px 30px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:#92400e;">${isEs ? 'Privilegio de Miembro' : 'Member Privilege'}</p>
              <p style="margin:0 0 10px;font-size:20px;font-weight:900;color:#111827;">${isEs ? '¡Desbloquea una Mejora Sorpresa!' : 'Unlock a Surprise Upgrade!'}</p>
              <p style="margin:0;color:#92400e;font-size:14px;line-height:1.5;">
                ${isEs
                    ? 'Simplemente menciona este correo al reservar tu primera aventura vía WhatsApp.'
                    : 'Simply mention this email when booking your first adventure via WhatsApp.'}
              </p>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#9ca3af;font-style:italic;">
            ${isEs ? 'Próxima historia de aventuras pronto en tu bandeja de entrada.' : 'Next adventure story coming soon to your inbox.'}
          </p>
        </td>
      </tr>
      <tr>
        <td align="center" bgcolor="#0B0F19" style="padding:36px 24px;border-top:1px solid rgba(255,255,255,0.07);">
          <p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">Vamos Jacó Tours Agency</p>
          <p style="margin:0 0 14px;color:#9ca3af;font-size:13px;">Calle de Surfistas, Jacó Beach, Puntarenas, Costa Rica</p>
          <a href="https://wa.me/50687747250" style="color:${ACCENT_COLOR};text-decoration:none;font-weight:700;font-size:13px;">Chat on WhatsApp</a>
          <p style="margin:24px 0 0;color:#4b5563;font-size:10px;text-transform:uppercase;letter-spacing:2px;">© ${new Date().getFullYear()} VAMOS JACÓ TOURS • ADVENTURE IS WAITING</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending newsletter email:', error);
        return { success: false, error };
    }
}
