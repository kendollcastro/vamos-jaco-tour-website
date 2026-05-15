import { a as supabaseAdmin } from '../../../chunks/supabase_oFwH5q6M.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (context) => handleCallback(context);
const POST = async (context) => handleCallback(context);
async function handleCallback(context) {
  const { request, url: contextUrl } = context;
  console.log("=== TILOPAY CALLBACK START ===");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || contextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") || contextUrl.protocol.replace(":", "") || "https";
  const publicHost = host.includes("localhost") && true ? "www.vamosjacotours.com" : host;
  const SITE_URL = `${protocol}://${publicHost}`;
  console.log(`Detected SITE_URL: ${SITE_URL} (Original host: ${host})`);
  try {
    const params = {};
    contextUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    const contentType = request.headers.get("content-type") || "";
    if (request.method === "POST") {
      console.log("POST Content-Type:", contentType);
      try {
        if (contentType.includes("application/json")) {
          const jsonBody = await request.json();
          Object.assign(params, jsonBody);
        } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
          const formData = await request.formData();
          formData.forEach((value, key) => {
            params[key] = String(value);
          });
        } else {
          const text = await request.clone().text();
          console.log("Raw body text:", text);
          if (text.includes("=") && !text.includes("{")) {
            const searchParams = new URLSearchParams(text);
            searchParams.forEach((v, k) => {
              params[k] = v;
            });
          }
        }
      } catch (bodyErr) {
        console.error("Error parsing body:", bodyErr);
      }
    }
    console.log("RECEIVED PARAMS:", JSON.stringify(params, null, 2));
    const bookingId = params.order || params.orderNumber || params.reference || params.order_id || params.order_number;
    if (!bookingId || bookingId === "unknown") {
      console.error("NO ORDER ID FOUND");
      const debug = encodeURIComponent(JSON.stringify({
        url: request.url,
        contextUrl: contextUrl.toString(),
        method: request.method,
        contentType,
        params,
        headers: Object.fromEntries(request.headers.entries())
      }));
      return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=InvalidSession&debug=${debug}` } });
    }
    const responseCode = params.response_code || params.code;
    const hasTransactionId = params.tpt || params.auth || params.tilopayTransaction || params.transactionId;
    const isSuccess = responseCode === 1 || responseCode === "1" || hasTransactionId;
    console.log(`Success check: code=${responseCode}, hasTx=${!!hasTransactionId}, isSuccess=${isSuccess}`);
    if (!supabaseAdmin) {
      console.error("SUPABASE NOT CONFIGURED");
      return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
    }
    const { data: booking, error: fetchError } = await supabaseAdmin.from("bookings").select("*").eq("id", bookingId).single();
    if (fetchError || !booking) {
      console.warn(`Booking ${bookingId} not found in DB. Error:`, fetchError?.message);
      if (isSuccess) {
        console.log("Creating fallback booking for missing ID...");
        const newBookingId = crypto.randomUUID();
        await supabaseAdmin.from("bookings").insert({
          id: newBookingId,
          customer_name: params.customerName || "Customer",
          customer_email: params.customerEmail || "unknown@email.com",
          tour_name: params.tourName || "Tour",
          booking_date: params.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          total_amount: parseFloat(params.total_amount || params.amount || "0"),
          status: "confirmed",
          tilopay_order_id: params.tpt || params.auth || "TILOPAY"
        });
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${newBookingId}` } });
      }
    }
    if (isSuccess && booking) {
      const { data: tourData } = await supabaseAdmin.from("tours").select("max_participants, name_en").eq("id", booking.tour_id).single();
      const maxParticipants = tourData?.max_participants || 10;
      const requestedGuests = (booking.adults || 1) + (booking.children || 0);
      const { data: existingBookings } = await supabaseAdmin.from("bookings").select("adults, children, status").eq("tour_id", booking.tour_id).eq("booking_date", booking.booking_date).in("status", ["confirmed", "paid", "pending"]).neq("id", bookingId);
      const totalBooked = (existingBookings || []).reduce((sum, b) => {
        return sum + (b.adults || 0) + (b.children || 0);
      }, 0);
      if (totalBooked + requestedGuests > maxParticipants) {
        console.warn(`OVERBOOKING PREVENTED for booking ${bookingId}: ${totalBooked} already booked, ${requestedGuests} requested, max is ${maxParticipants}`);
        await supabaseAdmin.from("bookings").update({
          status: "overbooked",
          tilopay_order_id: params.tpt || params.auth,
          tilopay_response: { ...params, overbooked: true, reason: "Capacity exceeded" }
        }).eq("id", bookingId);
        return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}&overbooked=true` } });
      }
      console.log(`Updating booking ${bookingId} to CONFIRMED`);
      await supabaseAdmin.from("bookings").update({
        status: "confirmed",
        tilopay_order_id: params.tpt || params.auth,
        tilopay_response: params
      }).eq("id", bookingId);
      if (booking) {
        try {
          const { sendBookingNotifications } = await import('../../../chunks/email-service_C4_kf4wL.mjs');
          console.log(`Triggering email notification for booking ${bookingId}`);
          await sendBookingNotifications({
            customerName: booking.customer_name,
            customerEmail: booking.customer_email,
            customerPhone: booking.customer_phone || "N/A",
            tourName: booking.tour_name,
            tourDate: booking.booking_date,
            adults: booking.adults,
            children: booking.children,
            totalAmount: booking.total_amount,
            language: params.language || "en"
          });
          console.log("Email notification sent successfully");
        } catch (emailErr) {
          console.error("Failed to send confirmation email in callback:", emailErr);
        }
      }
      return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/payment-success?order=${bookingId}` } });
    } else {
      console.log(`Updating booking ${bookingId} to FAILED/CANCELLED`);
      await supabaseAdmin.from("bookings").update({
        status: "failed",
        tilopay_response: params
      }).eq("id", bookingId);
      const msg = params.message || "Payment Declined";
      return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/checkout?error=${encodeURIComponent(msg)}` } });
    }
  } catch (err) {
    console.error("CALLBACK EXCEPTION:", err);
    return new Response(null, { status: 302, headers: { Location: `${SITE_URL}/?payment=error` } });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
