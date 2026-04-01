import { f as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_USHaZkbm.mjs';
export { renderers } from '../renderers.mjs';

const $$PaymentFailure = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Payment Failed | Vamos Jac\xF3 Tours", "robots": "noindex, nofollow" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden"> <div class="max-w-md w-full mx-auto px-6 relative z-10 text-center"> <div class="bg-dark-soft border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"> <!-- Failure Icon --> <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-red-500/50"> <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path> </svg> </div> <h1 class="text-3xl font-black text-white italic uppercase tracking-tight mb-4">
Payment <span class="text-red-500">Failed</span> </h1> <p class="text-gray-400 mb-8">
Something went wrong with the transaction. No charges were
                    made. Please try again or contact us.
</p> <div class="space-y-4"> <a href="/checkout" class="block w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20">
Try Again
</a> <a href="/contact" class="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-colors">
Contact Support
</a> </div> </div> </div> </div> ` })}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/payment-failure.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/payment-failure.astro";
const $$url = "/payment-failure";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$PaymentFailure,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
