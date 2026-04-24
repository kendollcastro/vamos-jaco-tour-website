import { v as verifyAdmin } from '../../../chunks/auth_DCmJjDju.mjs';
import { sendBookingNotifications, sendNewsletterWelcome } from '../../../chunks/email-service_BOo9znAY.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const authResult = await verifyAdmin(request);
  if (!authResult.authorized) {
    return new Response(JSON.stringify({
      success: false,
      message: "Unauthorized"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    const { email, logoOverride, language = "en" } = body;
    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
    }
    const bookingResult = await sendBookingNotifications({
      customerName: "Test User",
      customerEmail: email,
      customerPhone: "+50688888888",
      tourName: "ATV Adventure (Premium Email Test)",
      tourDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      adults: 2,
      children: 0,
      totalAmount: 140,
      language
    }, logoOverride);
    const newsletterResult = await sendNewsletterWelcome(email, logoOverride, language);
    return new Response(JSON.stringify({
      success: true,
      message: "Test emails triggered successfully!",
      details: {
        booking: bookingResult,
        newsletter: newsletterResult
      }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Test email error:", error);
    return new Response(JSON.stringify({ message: "Test email failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
