import { a as supabaseAdmin } from '../../../chunks/supabase_oFwH5q6M.mjs';
import { sendBookingNotifications } from '../../../chunks/email-service_C4_kf4wL.mjs';
import { c as calculateServerPrice, v as validatePrice, a as createPaymentSession } from '../../../chunks/price-calculator_CcJSC-Ot.mjs';
import { g as getClientIP, c as checkRateLimit } from '../../../chunks/rate-limit_Cb_sQvs7.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const ip = getClientIP(request);
  const { limited, resetIn } = checkRateLimit(ip, { windowMs: 6e4, max: 10 });
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
    const {
      customerName,
      customerEmail,
      customerPhone,
      tourId,
      tourName,
      date,
      adults,
      children,
      totalAmount,
      extraPassengers,
      paymentMethod = "card",
      language = "en",
      variationId,
      pricePerAdult
    } = body;
    if (!customerName || !customerEmail || !tourId || !date) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return new Response(JSON.stringify({ message: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sanitizedName = customerName.trim().slice(0, 100);
    const sanitizedEmail = customerEmail.trim().toLowerCase().slice(0, 254);
    const sanitizedPhone = (customerPhone || "").trim().slice(0, 20);
    const priceResult = await calculateServerPrice({
      tourId,
      adults: adults || 1,
      children: children || 0,
      extraPassengers: extraPassengers || 0,
      variationId: variationId || void 0,
      pricePerAdult: pricePerAdult || void 0
    });
    if (!priceResult.isValid) {
      console.warn(`Price validation failed for tour: ${tourId}`);
      return new Response(JSON.stringify({
        success: false,
        message: "Unable to verify tour pricing"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!validatePrice(totalAmount, priceResult.total)) {
      console.warn(`Price mismatch: provided=${totalAmount}, expected=${priceResult.total}`);
      return new Response(JSON.stringify({
        success: false,
        message: "Price verification failed"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const generatedBookingId = crypto.randomUUID();
    if (supabaseAdmin) {
      let resolvedTourId = tourId;
      const { data: tourData } = await supabaseAdmin.from("tours").select("id").eq("slug", tourId).single();
      if (tourData?.id) {
        resolvedTourId = tourData.id;
      }
      const { error } = await supabaseAdmin.from("bookings").insert([{
        id: generatedBookingId,
        tour_id: resolvedTourId,
        customer_name: sanitizedName,
        customer_email: sanitizedEmail,
        customer_phone: sanitizedPhone,
        tour_name: tourName || tourId,
        booking_date: formattedDate,
        total_amount: priceResult.total,
        // Use server-calculated price
        status: "pending",
        adults: adults || 1,
        children: children || 0
      }]);
      if (error) {
        console.error("Supabase booking error:", error.code);
        return new Response(JSON.stringify({
          success: false,
          message: "Failed to create booking"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (paymentMethod === "card") {
      try {
        const paymentUrl = await createPaymentSession({
          amount: priceResult.total,
          orderNumber: generatedBookingId,
          language,
          customer: {
            firstName: sanitizedName.split(" ")[0],
            lastName: sanitizedName.split(" ").slice(1).join(" ") || "Customer",
            email: sanitizedEmail,
            phone: sanitizedPhone || "00000000"
          }
        });
        sendBookingNotifications({
          customerName: sanitizedName,
          customerEmail: sanitizedEmail,
          customerPhone: sanitizedPhone || "N/A",
          tourName: tourName || tourId,
          tourDate: formattedDate,
          adults: adults || 1,
          children: children || 0,
          totalAmount: priceResult.total,
          language
        }).catch((e) => console.error("Booking email failed:", e));
        return new Response(JSON.stringify({
          success: true,
          bookingId: generatedBookingId,
          paymentUrl,
          requiresRedirect: true
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (paymentError) {
        console.error("TiloPay Integration Error");
        return new Response(JSON.stringify({
          success: false,
          message: "Payment service unavailable"
        }), {
          status: 502,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({
      success: true,
      bookingId: generatedBookingId,
      requiresRedirect: false
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Booking creation error:", error?.message, error?.stack);
    return new Response(JSON.stringify({ message: "Internal server error", error: error?.message }), {
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
