import { a as supabaseAdmin } from '../../../chunks/supabase_oFwH5q6M.mjs';
import { sendBookingNotifications } from '../../../chunks/email-service_BOo9znAY.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => handleCallback(request);
const POST = async ({ request }) => handleCallback(request);
async function handleCallback(request) {
  let data = {};
  const url = new URL(request.url);
  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        data[key] = value;
      });
    } catch {
      try {
        data = await request.json();
      } catch {
      }
    }
  }
  url.searchParams.forEach((value, key) => {
    if (!data[key]) data[key] = value;
  });
  console.log("=== TiloPay Callback ===", JSON.stringify(data));
  const orderNumber = data.order || data.orderNumber || data.reference || data.order_number || data.Orden || data.orderId || url.searchParams.get("order") || url.searchParams.get("pending_id");
  const statusCode = String(data.status || data.responseCode || data.ResponseCode || data.response_code || data.code || data.result || data.paymentStatus || data.PaymentStatus || "").toLowerCase().trim();
  const isSuccess = statusCode === "success" || statusCode === "1" || statusCode === "approved" || statusCode === "completed" || statusCode === "accepted" || statusCode === "ok" || statusCode === "true";
  if (!orderNumber) {
    console.error("Missing order reference");
    return new Response(null, { status: 302, headers: { Location: "/?payment=error&reason=missing_order" } });
  }
  const hasTransactionId = data.transactionId || data.authCode || data.tpt || data.AuthorizationCode || data.tilopayTransaction;
  const paymentSucceeded = isSuccess || !!hasTransactionId && !statusCode.includes("cancel") && !statusCode.includes("fail");
  if (!paymentSucceeded) {
    console.log("Payment failed/cancelled");
    return new Response(null, { status: 302, headers: { Location: "/?payment=failed" } });
  }
  if (!supabaseAdmin) {
    console.error("Supabase not available");
    return new Response(null, { status: 302, headers: { Location: "/?payment=error&reason=db_unavailable" } });
  }
  try {
    const isNewFlow = orderNumber.startsWith("pending-");
    if (isNewFlow) {
      const tourName = data.tourName || data.tour_name || data.product_name || "Tour";
      const customerName = data.customerName || data.customer_name || data.firstName || "Customer";
      const customerEmail = data.customerEmail || data.customer_email || data.email || "unknown@email.com";
      const customerPhone = data.customerPhone || data.customer_phone || data.phone || "";
      const tourId = url.searchParams.get("tour_id") || data.tourId || "unknown";
      const bookingDate = url.searchParams.get("date") || data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const adults = parseInt(url.searchParams.get("adults") || data.adults || "1");
      const children = parseInt(url.searchParams.get("children") || data.children || "0");
      const totalAmountStr = url.searchParams.get("total_amount") || data.totalAmount || data.amount || "0";
      const totalAmount = parseFloat(totalAmountStr);
      const language = url.searchParams.get("language") || data.lang || "en";
      console.log("Creating booking:", { tourName, customerName, totalAmount });
      const bookingId = crypto.randomUUID();
      const tilopayId2 = data.tpt || data.tilopayTransaction || data.transactionId || data.authCode || "TILOPAY_SUCCESS";
      const { error: insertError } = await supabaseAdmin.from("bookings").insert([{
        id: bookingId,
        tour_id: tourId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        tour_name: tourName,
        booking_date: bookingDate,
        adults,
        children,
        total_amount: totalAmount,
        status: "paid",
        tilopay_order_id: tilopayId2,
        tilopay_response: data
      }]);
      if (insertError) {
        console.error("Failed to create booking:", insertError);
        throw insertError;
      }
      sendBookingNotifications({
        customerName,
        customerEmail,
        customerPhone: customerPhone || "N/A",
        tourName,
        tourDate: bookingDate,
        adults,
        children,
        totalAmount,
        language
      }).catch((e) => console.error("Email failed:", e));
      return new Response(null, { status: 302, headers: { Location: `/payment-success?order=${bookingId}` } });
    }
    const { data: booking, error: fetchError } = await supabaseAdmin.from("bookings").select("*").eq("id", orderNumber).single();
    if (fetchError || !booking) {
      console.error("Booking not found:", orderNumber);
      return new Response(null, { status: 302, headers: { Location: `/?payment=error&reason=booking_not_found` } });
    }
    if (booking.status === "paid" || booking.status === "confirmed") {
      return new Response(null, { status: 302, headers: { Location: `/payment-success?order=${orderNumber}` } });
    }
    const tilopayId = data.tpt || data.tilopayTransaction || data.transactionId || data.authCode || "TILOPAY_SUCCESS";
    const { error: updateError } = await supabaseAdmin.from("bookings").update({
      status: "paid",
      tilopay_order_id: tilopayId,
      tilopay_response: data
    }).eq("id", orderNumber);
    if (updateError) {
      console.error("Update failed:", updateError);
      throw updateError;
    }
    sendBookingNotifications({
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone || "N/A",
      tourName: booking.tour_name,
      tourDate: booking.booking_date,
      adults: booking.adults,
      children: booking.children,
      totalAmount: booking.total_amount,
      language: data.lang || "en"
    }).catch((e) => console.error("Email failed:", e));
    return new Response(null, { status: 302, headers: { Location: `/payment-success?order=${orderNumber}` } });
  } catch (error) {
    console.error("Callback error:", error);
    return new Response(null, { status: 302, headers: { Location: `/?payment=error&reason=processing_error` } });
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
