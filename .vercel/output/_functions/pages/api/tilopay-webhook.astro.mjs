import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const SUPABASE_URL = "https://ddukdjdiqjvfjywuhnpn.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdWtkamRpcWp2Zmp5d3VobnBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ4MDg3NywiZXhwIjoyMDg4MDU2ODc3fQ.3OB-4S95pqTcGAawXb3XYF4LyFOMHK35Vxt_fBJdtZQ";
const TILOPAY_WEBHOOK_SECRET = "";
const POST = async ({ request }) => {
  try {
    if (TILOPAY_WEBHOOK_SECRET) ;
    const body = await request.json();
    const {
      orderNumber,
      order_id,
      status,
      code,
      auth,
      description
    } = body;
    const bookingId = orderNumber || order_id;
    if (!bookingId) {
      return new Response(JSON.stringify({ message: "Missing orderNumber" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) ;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const isSuccess = code === 1 || code === "1" || status === "paid" || status === "success" || status === "approved";
    const newStatus = isSuccess ? "confirmed" : "cancelled";
    let updated = false;
    const { data: directMatch, error: directError } = await supabase.from("bookings").update({
      status: newStatus,
      tilopay_order_id: order_id || bookingId,
      tilopay_response: body
    }).eq("id", bookingId).select("id");
    if (!directError && directMatch && directMatch.length > 0) {
      updated = true;
    }
    if (!updated) {
      const { data: fallbackMatch, error: fallbackError } = await supabase.from("bookings").update({
        status: newStatus,
        tilopay_response: body
      }).eq("tilopay_order_id", bookingId).select("id");
      if (!fallbackError && fallbackMatch && fallbackMatch.length > 0) {
        updated = true;
      }
    }
    if (isSuccess && updated) {
      const { data: booking } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
      if (booking) {
        const { sendBookingNotifications } = await import('../../chunks/email-service_BOo9znAY.mjs');
        sendBookingNotifications({
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone || "N/A",
          tourName: booking.tour_name,
          tourDate: booking.booking_date,
          adults: booking.adults,
          children: booking.children,
          totalAmount: booking.total_amount,
          language: "en"
        }).catch((e) => console.error("Post-payment email failed:", e));
      }
    }
    return new Response(JSON.stringify({
      success: true,
      status: newStatus,
      bookingId,
      updated
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Tilopay webhook error");
    return new Response(JSON.stringify({ message: "Internal error" }), {
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
