import { a as supabaseAdmin } from '../../../chunks/supabase_oFwH5q6M.mjs';
import { g as getClientIP, c as checkRateLimit } from '../../../chunks/rate-limit_Cb_sQvs7.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const ip = getClientIP(request);
  const { limited, resetIn } = checkRateLimit(ip, { windowMs: 6e4, max: 3 });
  if (limited) {
    return new Response(JSON.stringify({
      success: false,
      message: "Too many requests. Please try again later."
    }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil(resetIn / 1e3).toString()
      }
    });
  }
  try {
    const body = await request.json();
    const { email, language = "en" } = body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid email address"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);
    if (!supabaseAdmin) {
      return new Response(JSON.stringify({
        success: false,
        message: "Service temporarily unavailable"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { error } = await supabaseAdmin.from("subscribers").insert([{ email: sanitizedEmail }]);
    if (error) {
      if (error.code === "23505") {
        return new Response(JSON.stringify({
          success: true,
          alreadySubscribed: true,
          message: "You are already subscribed to our newsletter!"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      console.error("Newsletter subscription error:", error.code);
      return new Response(JSON.stringify({
        success: false,
        message: "Failed to subscribe. Please try again later."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { sendNewsletterWelcome } = await import('../../../chunks/email-service_BOo9znAY.mjs');
    sendNewsletterWelcome(sanitizedEmail, void 0, language).catch((err) => console.error("Error sending welcome email:", err));
    return new Response(JSON.stringify({
      success: true,
      message: "Successfully subscribed to our newsletter!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Newsletter API error");
    return new Response(JSON.stringify({
      success: false,
      message: "Internal server error"
    }), {
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
