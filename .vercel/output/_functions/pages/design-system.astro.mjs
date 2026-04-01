import { f as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_USHaZkbm.mjs';
export { renderers } from '../renderers.mjs';

const $$DesignSystem = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Design System | Vamos Jac\xF3 Tours" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="py-20 bg-white min-h-screen"> <div class="max-w-7xl mx-auto px-6"> <h1 class="text-5xl font-bold text-dark mb-12">
Design System Check
</h1>  <section className="mb-20"> <h2 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
1. Color Palette
</h2> <div class="grid grid-cols-2 md:grid-cols-4 gap-6">  <div class="space-y-2"> <div class="h-32 rounded-2xl bg-primary shadow-lg flex items-center justify-center"> <span class="text-white font-bold">bg-primary</span> </div> <p class="font-mono text-sm text-gray-600">#D92818</p> </div>  <div class="space-y-2"> <div class="h-32 rounded-2xl bg-primary-dark shadow-lg flex items-center justify-center"> <span class="text-white font-bold">bg-primary-dark</span> </div> <p class="font-mono text-sm text-gray-600">#B02113</p> </div>  <div class="space-y-2"> <div class="h-32 rounded-2xl bg-brand-teal shadow-lg flex items-center justify-center"> <span class="text-white font-bold">bg-brand-teal</span> </div> <p class="font-mono text-sm text-gray-600">#03A696</p> </div>  <div class="space-y-2"> <div class="h-32 rounded-2xl bg-brand-orange shadow-lg flex items-center justify-center"> <span class="text-white font-bold">bg-brand-orange</span> </div> <p class="font-mono text-sm text-gray-600">#F27F1B</p> </div>  <div class="space-y-2"> <div class="h-32 rounded-2xl bg-brand-yellow shadow-lg flex items-center justify-center"> <span class="text-white font-bold">bg-brand-yellow</span> </div> <p class="font-mono text-sm text-gray-600">#F2AB27</p> </div>  <div class="space-y-2"> <div class="h-32 rounded-2xl bg-dark shadow-lg flex items-center justify-center"> <span class="text-white font-bold">bg-dark</span> </div> <p class="font-mono text-sm text-gray-600">#0D0B08</p> </div> </div> </section>  <section className="mb-20"> <h2 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
2. Typography
</h2> <div class="space-y-6"> <div> <p class="text-sm text-gray-400 mb-2">
Heading 1 (Outfit)
</p> <h1 class="text-6xl font-black text-dark">
Adventure Awaits
</h1> </div> <div> <p class="text-sm text-gray-400 mb-2">
Heading 2 (Outfit)
</p> <h2 class="text-4xl font-bold text-primary">
Discover Costa Rica
</h2> </div> <div> <p class="text-sm text-gray-400 mb-2">Script Font</p> <p class="text-4xl font-script text-brand-teal">
Pure Vida Experience
</p> </div> </div> </section>  <section className="mb-20"> <h2 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
3. Components
</h2> <div class="flex flex-wrap gap-4"> <button class="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition-colors">
Primary Button
</button> <button class="bg-brand-teal hover:opacity-90 text-white px-8 py-3 rounded-full font-bold shadow-neon transition-all">
Teal (Neon)
</button> <button class="bg-brand-orange text-white px-8 py-3 rounded-full font-bold">
Orange Button
</button> </div> </section>  <section> <h2 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
4. Animations
</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> <div class="p-6 bg-gray-100 rounded-xl text-center"> <div class="w-16 h-16 bg-primary mx-auto mb-4 rounded-lg animate-fade-in-up"></div> <p>animate-fade-in-up</p> </div> <div class="p-6 bg-gray-100 rounded-xl text-center"> <div class="w-16 h-16 bg-brand-teal mx-auto mb-4 rounded-full animate-pulse"></div> <p>animate-pulse (Standard)</p> </div> <div class="p-6 bg-gray-100 rounded-xl text-center"> <div class="w-16 h-16 bg-brand-orange mx-auto mb-4 rounded-lg animate-zoom-in"></div> <p>animate-zoom-in</p> </div> </div> </section> </div> </main> ` })}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/design-system.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/design-system.astro";
const $$url = "/design-system";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$DesignSystem,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
