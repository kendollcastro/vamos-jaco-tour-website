import { f as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DxykCy69.mjs';
import { a as getAllTours } from '../chunks/TourCard_-8PE7gJ-.mjs';
import { a as getBreadcrumbSchema } from '../chunks/seo-schemas_BZJstb5R.mjs';
import { T as TourFilter } from '../chunks/TourFilter_DvU4cDFS.mjs';
export { renderers } from '../renderers.mjs';

const $$Tours = createComponent(async ($$result, $$props, $$slots) => {
  const tours = await getAllTours();
  const HERO_IMAGE = "/images/Jetski/jetski-vamos-jaco-tours-003.webp";
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tours & Adventures", url: "/tours" }
  ]);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tours & Adventures | Vamos Jac\xF3 Tours \u2014 Costa Rica", "description": "Browse all adventure tours in Jac\xF3, Costa Rica. ATV mountain rides, side by side buggies, jet ski rentals and tours, surfing lessons, flyboard, zipline canopy and more.", "keywords": "adventure tours Jac\xF3, Costa Rica tours, ATV tour Jac\xF3, side by side Jaco, buggy tour Costa Rica, jet ski rental, jet ski tour Jaco, surf lessons Costa Rica, zipline Jac\xF3, activities Costa Rica", "jsonLd": breadcrumbs, "preloadImage": HERO_IMAGE }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<section class="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"> <div class="absolute inset-0"> <img${addAttribute(HERO_IMAGE, "src")} alt="Adventure tours in Jacó Costa Rica" class="w-full h-full object-cover opacity-60" fetchpriority="high" decoding="sync"> <div class="absolute inset-0 bg-gradient-to-b from-dark/30 via-dark/60 to-dark"></div> </div> <div class="relative z-10 text-center px-6 max-w-5xl mx-auto animate-zoom-in"> <h1 class="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-2xl">
Explore Our
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-orange to-brand-yellow">
Adventures
</span> </h1> <p class="text-xl md:text-2xl text-gray-200 font-bold max-w-3xl mx-auto tracking-wide">
Discover the best activities in Jacó, from adrenaline-pumping
                ATV rides to relaxing ocean tours.
</p> </div> </section> <main class="py-20 relative min-h-screen">  <div class="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-teal/10 blur-[100px] rounded-full pointer-events-none"></div> <div class="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div> <div class="max-w-7xl mx-auto px-6">  ${renderComponent($$result2, "TourFilter", TourFilter, { "client:load": true, "initialTours": tours, "defaultLimit": 100, "title": { en: "Choose Your Next Experience", es: "Elige Tu Pr\xF3xima Experiencia" }, "subtitle": { en: "Best Sellers", es: "Los M\xE1s Vendidos" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TourFilter", "client:component-export": "default" })} </div> </main> ` })}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/tours.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/tours.astro";
const $$url = "/tours";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Tours,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
