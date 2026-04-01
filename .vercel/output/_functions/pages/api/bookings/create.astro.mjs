import { a as supabaseAdmin } from '../../../chunks/supabase_oFwH5q6M.mjs';
import { sendBookingNotifications } from '../../../chunks/email-service_B0pUzxu9.mjs';
import { g as getClientIP, c as checkRateLimit } from '../../../chunks/rate-limit_Cb_sQvs7.mjs';
export { renderers } from '../../../renderers.mjs';

const TILOPAY_API_URL = "https://app.tilopay.com/api/v1";
const TILOPAY_API_USER = "x3JXvq";
const TILOPAY_API_PASSWORD = "xLYTyw";
const TILOPAY_API_KEY = "2984-1437-7314-8673-3325";
const PUBLIC_DOMAIN = "https://vamos-jaco-tour-website.vercel.app";
async function getAccessToken() {
  try {
    const response = await fetch(`${TILOPAY_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        apiuser: TILOPAY_API_USER,
        password: TILOPAY_API_PASSWORD
      })
    });
    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`Tilopay Auth Error: ${response.status} - ${errData}`);
    }
    const data = await response.json();
    if (!data.access_token) {
      throw new Error("Invalid response from Tilopay: Missing access_token.");
    }
    return data.access_token;
  } catch (error) {
    console.error("Error authenticating with Tilopay:", error);
    throw error;
  }
}
async function createPaymentSession(params) {
  const token = await getAccessToken();
  const lang = params.language || "en";
  const redirectUrl = `${PUBLIC_DOMAIN}/api/tilopay/callback?order=${params.orderNumber}&lang=${lang}`;
  const payload = {
    redirect: redirectUrl,
    key: TILOPAY_API_KEY,
    amount: params.amount.toFixed(2).toString(),
    currency: "USD",
    billToFirstName: params.customer.firstName || "Customer",
    billToLastName: params.customer.lastName || "VamosJaco",
    billToEmail: params.customer.email,
    billToTelephone: params.customer.phone || "00000000",
    // Fallbacks for generic required fields if our checkout doesn't ask for them
    billToAddress: "Vamos Jacó",
    billToAddress2: "N/A",
    billToCity: "Jacó",
    billToState: "Puntarenas",
    billToZipPostCode: "61101",
    billToCountry: "CR",
    orderNumber: params.orderNumber,
    capture: "1",
    // Capture immediately (Sale)
    subscription: "0",
    platform: "api",
    hashVersion: "V2"
  };
  try {
    const response = await fetch(`${TILOPAY_API_URL}/processPayment`, {
      method: "POST",
      headers: {
        "Authorization": `bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`Tilopay Payment Creation Error: ${response.status} - ${errData}`);
    }
    const data = await response.json();
    if (!data.url) {
      console.error("Tilopay Response missing redirect URL:", data);
      throw new Error("Tilopay failed to generate a checkout URL.");
    }
    return data.url;
  } catch (error) {
    console.error("Error creating Tilopay payment session:", error);
    throw error;
  }
}

const TOUR_PRICES = {
  "jaco-atv-adventure": { adultPrice: 75, childPrice: 45 },
  "side-by-side-tour": { adultPrice: 150, childPrice: 0 },
  "jet-ski-tour": { adultPrice: 135, childPrice: 0 },
  "zipline-canopy": { adultPrice: 65, childPrice: 45 },
  "surf-class": { adultPrice: 75, childPrice: 55 },
  "costa-cat-cruise": { adultPrice: 85, childPrice: 50 },
  "sport-fishing": { adultPrice: 150, childPrice: 100 }
};
async function calculateServerPrice(params) {
  const { tourId, adults, children, extraPassengers = 0 } = params;
  let adultPrice = 0;
  let childPrice = 0;
  if (supabaseAdmin) {
    try {
      let { data: tour, error } = await supabaseAdmin.from("tours").select("price_base, pricing_options").eq("slug", tourId).single();
      if (error || !tour) {
        const result = await supabaseAdmin.from("tours").select("price_base, pricing_options").eq("id", tourId).single();
        tour = result.data;
      }
      if (tour) {
        adultPrice = tour.price_base || 0;
        if (Array.isArray(tour.pricing_options)) {
          const childOpt = tour.pricing_options.find(
            (o) => o.duration?.toLowerCase().includes("child") || o.duration?.toLowerCase().includes("niño")
          );
          if (childOpt) childPrice = childOpt.price;
        }
      }
    } catch (err) {
      console.error("Failed to fetch tour price from DB:", err);
    }
  }
  if (adultPrice === 0 && TOUR_PRICES[tourId]) {
    adultPrice = TOUR_PRICES[tourId].adultPrice;
    childPrice = TOUR_PRICES[tourId].childPrice;
  }
  let subtotal = 0;
  const isVehicleTour = ["side-by-side-tour", "jet-ski-tour", "jaco-atv-adventure"].includes(tourId);
  if (isVehicleTour) {
    subtotal = adults * adultPrice + extraPassengers * 20;
  } else {
    subtotal = adults * adultPrice + children * childPrice;
  }
  const iva = Math.round(subtotal * 0.13 * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;
  return {
    subtotal,
    iva,
    total,
    isValid: adultPrice > 0
  };
}
function validatePrice(providedAmount, expectedTotal) {
  const tolerance = 0.01;
  return Math.abs(providedAmount - expectedTotal) <= tolerance;
}

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
      language = "en"
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
      extraPassengers: extraPassengers || 0
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
    console.error("Booking creation error");
    return new Response(JSON.stringify({ message: "Internal server error" }), {
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
