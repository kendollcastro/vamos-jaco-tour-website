import { a as supabaseAdmin } from '../../../chunks/supabase_oFwH5q6M.mjs';
import { v as verifyAdmin } from '../../../chunks/auth_DCmJjDju.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
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
  if (!supabaseAdmin) return new Response(JSON.stringify({ message: "Supabase not configured" }), { status: 500 });
  try {
    const { data, error } = await supabaseAdmin.from("settings").select("key, value");
    if (error) throw error;
    const settings = data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to fetch settings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
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
  if (!supabaseAdmin) return new Response(JSON.stringify({ message: "Supabase not configured" }), { status: 500 });
  try {
    const { key, value } = await request.json();
    if (!key || value === void 0) {
      return new Response(JSON.stringify({ message: "Key and Value are required" }), { status: 400 });
    }
    const allowedKeys = ["site_name", "contact_email", "whatsapp_number", "currency", "tax_rate"];
    if (!allowedKeys.includes(key)) {
      return new Response(JSON.stringify({ message: "Invalid setting key" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { error } = await supabaseAdmin.from("settings").upsert({ key, value, updated_at: (/* @__PURE__ */ new Date()).toISOString() }, { onConflict: "key" });
    if (error) throw error;
    return new Response(JSON.stringify({ success: true, message: `Setting ${key} updated` }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update setting" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
