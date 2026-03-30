import { a as supabaseAdmin } from '../../../chunks/supabase_oFwH5q6M.mjs';
import { sendBookingNotifications } from '../../../chunks/email-service_B0pUzxu9.mjs';
export { renderers } from '../../../renderers.mjs';

const ALL = async ({ request, redirect }) => {
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
  console.log("=== TiloPay Callback ===");
  console.log("Method:", request.method);
  console.log("URL:", request.url);
  console.log("Payload:", JSON.stringify(data, null, 2));
  const orderNumber = data.order || data.orderNumber || data.reference || data.order_number || data.Orden || data.orderId || url.searchParams.get("order");
  const statusCode = String(data.status || data.responseCode || data.ResponseCode || data.response_code || data.code || data.result || data.paymentStatus || data.PaymentStatus || "").toLowerCase().trim();
  const isSuccess = statusCode === "success" || statusCode === "1" || statusCode === "approved" || statusCode === "completed" || statusCode === "accepted" || statusCode === "ok" || statusCode === "true";
  console.log("Extracted orderNumber:", orderNumber);
  console.log("Status code found:", statusCode, "-> isSuccess:", isSuccess);
  if (!orderNumber) {
    console.error("Missing order reference. Full payload:", data);
    return redirect("/?payment=error&reason=missing_order");
  }
  const hasTransactionId = data.transactionId || data.authCode || data.transaction_id || data.AuthorizationCode || data.reference;
  if (!isSuccess && hasTransactionId) {
    console.log("No clear success status, but transaction ID present. Treating as success.");
  }
  const paymentSucceeded = isSuccess || !!hasTransactionId && !statusCode.includes("cancel") && !statusCode.includes("fail");
  if (paymentSucceeded && supabaseAdmin) {
    try {
      const { data: booking, error: fetchError } = await supabaseAdmin.from("bookings").select("*").eq("id", orderNumber).single();
      if (fetchError || !booking) {
        console.error("Booking not found for order:", orderNumber, fetchError);
        return redirect(`/?payment=error&reason=booking_not_found&order=${orderNumber}`);
      }
      if (booking.status === "confirmed") {
        console.log("Booking already confirmed, redirecting to success page");
        return redirect(`/payment-success?order=${orderNumber}`);
      }
      const { error: updateError } = await supabaseAdmin.from("bookings").update({
        status: "confirmed",
        tilopay_order_id: data.transactionId || data.authCode || data.transaction_id || data.AuthorizationCode || "TILOPAY_SUCCESS",
        tilopay_response: data
      }).eq("id", orderNumber);
      if (updateError) {
        console.error("Failed to update booking:", updateError);
        throw updateError;
      }
      const userLanguage = data.lang || "en";
      sendBookingNotifications({
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone || "N/A",
        tourName: booking.tour_name,
        tourDate: booking.booking_date,
        adults: booking.adults,
        children: booking.children,
        totalAmount: booking.total_amount,
        language: userLanguage
      }).catch((e) => console.error("Post-payment email failed:", e));
      console.log("Payment successful! Redirecting to success page:", `/payment-success?order=${orderNumber}`);
      return redirect(`/payment-success?order=${orderNumber}`);
    } catch (error) {
      console.error("Webhook processing error:", error);
      return redirect(`/?payment=error&reason=processing_error&order=${orderNumber}`);
    }
  } else {
    console.warn("Payment failed or cancelled. Status:", statusCode, "Data:", data);
    if (supabaseAdmin && orderNumber) {
      try {
        await supabaseAdmin.from("bookings").update({ status: "cancelled" }).eq("id", orderNumber);
      } catch (e) {
        console.error("Failed to cancel booking:", e);
      }
    }
    return redirect("/?payment=failed");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
