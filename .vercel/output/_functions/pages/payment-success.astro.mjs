import { f as createComponent, l as renderComponent, n as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DvTG7lIH.mjs';
export { renderers } from '../renderers.mjs';

const $$PaymentSuccess = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Payment Successful | Vamos Jac\xF3 Tours", "robots": "noindex, nofollow" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden"> <!-- Background Elements --> <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div> <div class="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div> <div class="max-w-md w-full mx-auto px-6 relative z-10 text-center"> <div class="bg-dark-soft border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"> <!-- Success Icon --> <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-green-500/50"> <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path> </svg> </div> <h1 id="success-title" class="text-3xl font-black text-white italic uppercase tracking-tight mb-4">
Payment <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-orange">Successful!</span> </h1> <p id="success-message-1" class="text-gray-400 mb-2">
Your booking has been confirmed!
</p> <p id="success-message-2" class="text-gray-400 mb-8">
A confirmation email with all the details of your adventure has been sent to your inbox. Please check your spam folder if you don't see it.
</p> <div class="space-y-4"> <a href="/tours" id="btn-another" class="block w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20">
Book Another Adventure
</a> <a href="/" id="btn-home" class="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-colors">
Return Home
</a> </div> </div> <p class="mt-8 text-xs text-gray-500"> <span id="order-label">Order Reference:</span> <span id="order-ref" class="font-mono text-gray-400">--</span> </p> </div> </div> ` })} ${renderScript($$result, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/payment-success.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/payment-success.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/payment-success.astro";
const $$url = "/payment-success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$PaymentSuccess,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
