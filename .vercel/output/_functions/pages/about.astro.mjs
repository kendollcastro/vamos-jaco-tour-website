import { f as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { l as language, $ as $$Layout } from '../chunks/Layout_Bcn6R5AW.mjs';
import { f as fetchWPAPI, A as AboutSection, T as TeamSection, a as TrustBar, F as FaqSection } from '../chunks/wp_1hOXKEGa.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Instagram } from 'lucide-react';
import { N as NewsletterSection } from '../chunks/NewsletterSection_zqh9rP30.mjs';
import { S as ScrollReveal } from '../chunks/ScrollReveal_CEJ16IzC.mjs';
import { g as getTeamMembers } from '../chunks/supabase-team_Dc6PVDSG.mjs';
import { g as getOrganizationSchema, a as getBreadcrumbSchema, b as getFAQSchema } from '../chunks/seo-schemas_BZJstb5R.mjs';
export { renderers } from '../renderers.mjs';

function AboutGallery() {
  const $language = useStore(language);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const title = $language === "en" ? "Our Best Moments" : "Nuestros Mejores Momentos";
  const subtitle = $language === "en" ? "Follow us on Instagram" : "Síguenos en Instagram";
  const images = [
    "/images/Bestmoments/bestmoments-vamos-jaco-tours-004.jpg",
    // Zip Line
    "/images/Bestmoments/bestmoments-vamos-jaco-tours-001.jpg",
    // Surf
    "/images/Tube/tube-vamos-jaco-tours-004.png",
    // ATV
    "/images/Bestmoments/bestmoments-vamos-jaco-tours-003.jpg",
    // Fishing
    "/images/Bestmoments/bestmoments-vamos-jaco-tours-002.jpg"
    // Jet Ski
  ];
  if (!mounted) return /* @__PURE__ */ jsx("div", { className: "min-h-[400px]" });
  return /* @__PURE__ */ jsx("section", { className: "py-20 relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("span", { className: "text-brand-orange font-bold uppercase tracking-wider text-sm block mb-2", children: "@vamosjacotours" }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg uppercase tracking-tight", children: title }),
      /* @__PURE__ */ jsxs("a", { href: "#", className: "inline-flex items-center gap-2 text-gray-400 hover:text-brand-yellow transition-colors group", children: [
        /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5 group-hover:scale-110 transition-transform" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium underline decoration-gray-600 hover:decoration-brand-yellow underline-offset-4", children: subtitle })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden group shadow-2xl ring-1 ring-white/10", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: images[0],
            alt: "Gallery Highlight",
            loading: "lazy",
            decoding: "async",
            className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: images[1],
            alt: "Gallery 1",
            loading: "lazy",
            decoding: "async",
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: images[2],
            alt: "Gallery 2",
            loading: "lazy",
            decoding: "async",
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: images[3],
            alt: "Gallery 3",
            loading: "lazy",
            decoding: "async",
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-lg ring-1 ring-white/10", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: images[4],
            alt: "Gallery 4",
            loading: "lazy",
            decoding: "async",
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors" })
      ] })
    ] })
  ] }) });
}

const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const HERO_IMAGE = "/images/Flyboard/flyboard-vamos-jaco-tours-004.jpg";
  let teamMembers = [];
  try {
    const members = await getTeamMembers();
    if (members && members.length > 0) {
      teamMembers = members.map((m) => ({
        id: m.id,
        name: m.name,
        position: m.position_en || "Team Member",
        position_en: m.position_en || void 0,
        position_es: m.position_es || void 0,
        image: m.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
        social: {
          instagram: m.social_instagram || void 0,
          linkedin: m.social_linkedin || void 0,
          twitter: m.social_twitter || void 0
        }
      }));
    }
  } catch (e) {
    console.error("Failed to load Team Members:", e);
  }
  let wpFaqs = [];
  try {
    const rawFaqs = await fetchWPAPI("faq");
    if (rawFaqs && Array.isArray(rawFaqs)) {
      wpFaqs = rawFaqs.map((f) => ({
        question: f.title.rendered,
        // Remove the <p> tags from the excerpt
        answer: f.excerpt.rendered.replace(/<\/?p>/g, "").trim()
      }));
    }
  } catch (e) {
    console.error("Failed to load WP FAQs:", e);
  }
  const schemas = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "About Us", url: "/about" }
    ]),
    ...wpFaqs.length > 0 ? [getFAQSchema(wpFaqs)] : []
  ].filter(Boolean);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About Us | Vamos Jac\xF3 Tours \u2014 Local Adventure Experts", "description": "Meet the Vamos Jac\xF3 Tours team. Local guides passionate about sharing the best adventures in Costa Rica \u2014 from ATV rides through the jungle to ocean experiences. Family-owned since 2018.", "keywords": "about Vamos Jac\xF3, Costa Rica tour guides, Jac\xF3 local guides, adventure tour company, Costa Rica travel agency", "jsonLd": schemas, "preloadImage": HERO_IMAGE }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<section class="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden"> <div class="absolute inset-0"> <img${addAttribute(HERO_IMAGE, "src")} alt="Costa Rica Rainforest" class="w-full h-full object-cover opacity-60"> <div class="absolute inset-0 bg-gradient-to-b from-dark/30 via-dark/60 to-dark"></div> </div> <div class="relative z-10 text-center px-6 max-w-5xl mx-auto animate-zoom-in"> <span class="inline-block bg-brand-teal/20 backdrop-blur-sm border border-brand-teal/30 text-brand-teal px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-6">Our Story</span> <h1 class="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-2xl">
Passion for
<span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-orange to-brand-yellow animate-gradient-text">
Adventure
</span> </h1> <p class="text-xl md:text-2xl text-gray-200 font-bold max-w-3xl mx-auto tracking-wide">
We are more than a tour agency. We are your local friends
                showing you the hidden gems of Jacó.
</p> </div> </section> <main class="relative">  <div class="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-teal/10 blur-[100px] rounded-full pointer-events-none"></div> <div class="absolute bottom-1/3 left-0 w-1/3 h-1/3 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "AboutSection", AboutSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/AboutSection", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-left", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TeamSection", TeamSection, { "client:visible": true, "members": teamMembers, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TeamSection", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "scale-in", "delay": 100, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "AboutGallery", AboutGallery, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/AboutGallery", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "blur-in", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TrustBar", TrustBar, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TrustBar", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "blur-in", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "FaqSection", FaqSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/FaqSection", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "delay": 200, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "NewsletterSection", NewsletterSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/NewsletterSection", "client:component-export": "default" })} ` })} </main> ` })}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/about.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$About,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
