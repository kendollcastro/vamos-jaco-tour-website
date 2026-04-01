import { f as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { l as language, $ as $$Layout } from '../chunks/Layout_BWPnv4y3.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Phone, MapPin, ChevronDown, Mail, MessageSquare, Send } from 'lucide-react';
import { N as NewsletterSection } from '../chunks/NewsletterSection_DNFTLzwv.mjs';
import { c as getLocalBusinessSchema, a as getBreadcrumbSchema } from '../chunks/seo-schemas_BZJstb5R.mjs';
export { renderers } from '../renderers.mjs';

function ContactHero() {
  const $language = useStore(language);
  const [offset, setOffset] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const t = {
    en: {
      tagline: "LET'S CONNECT",
      titleLine1: "PLAN YOUR",
      titleAccent: "ADVENTURE",
      desc: "Ready to hit the trails? Send us a message and we'll craft the perfect adrenaline-packed experience for you."
    },
    es: {
      tagline: "CONTÁCTANOS",
      titleLine1: "PLANEA TU",
      titleAccent: "AVENTURA",
      desc: "¿Listo para la acción? Envíanos un mensaje y crearemos la experiencia perfecta llena de adrenalina para ti."
    }
  };
  const content = $language === "en" ? t.en : t.es;
  return /* @__PURE__ */ jsxs("section", { className: "relative h-[70vh] min-h-[550px] flex items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "absolute inset-0 z-0",
        style: { transform: `translateY(${offset * 0.3}px)` },
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/Sidebyside/sidebyside-vamos-jaco-tours-003.webp",
              alt: "ATV adventure through Costa Rica jungle",
              className: "w-full h-[120%] object-cover",
              onLoad: () => setIsLoaded(true)
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/40 to-dark" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-dark/40 via-transparent to-dark/40" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-[1] pointer-events-none overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 -right-20 w-72 h-72 bg-brand-teal/10 rounded-full blur-[100px] animate-pulse", style: { animationDelay: "2s" } })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `relative z-10 text-center px-6 max-w-4xl mx-auto mt-16 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm font-bold tracking-[0.2em] text-white/90 uppercase", children: [
        /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5" }),
        content.tagline
      ] }) }),
      /* @__PURE__ */ jsxs("h1", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "block text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl leading-[0.9]", children: content.titleLine1 }),
        /* @__PURE__ */ jsx("span", { className: "block text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic drop-shadow-2xl leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-orange to-brand-yellow", children: content.titleAccent })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-8 tracking-wide", children: content.desc }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://wa.me/50687747250",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]",
            children: [
              /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" }),
                /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.478-.677-6.309-1.834l-.452-.274-2.645.887.887-2.645-.274-.452A9.955 9.955 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" })
              ] }),
              "WhatsApp"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-primary" }),
          "Jacó, Costa Rica"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce", children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-6 h-6 text-white/50" }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-[5]" })
  ] });
}

function ContactForm() {
  const $language = useStore(language);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitized = {
      name: formState.name.trim().slice(0, 100),
      email: formState.email.trim().slice(0, 200),
      message: formState.message.trim().slice(0, 2e3)
    };
    if (!sanitized.name || !sanitized.email || !sanitized.message) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSent(true);
    setFormState({ name: "", email: "", message: "" });
    setTimeout(() => setIsSent(false), 3e3);
  };
  const t = {
    en: {
      title: "Send a Message",
      name: "Your Name",
      email: "Email Address",
      message: "How can we help?",
      send: "Send Message",
      sending: "Sending...",
      sent: "Message Sent!",
      infoTitle: "Contact Information",
      call: "Call Us",
      emailLabel: "Email Us",
      visit: "Visit Us",
      address: "Pastor Diaz Avenue, Jacó, Garabito, Puntarenas, Costa Rica"
    },
    es: {
      title: "Envía un Mensaje",
      name: "Tu Nombre",
      email: "Correo Electrónico",
      message: "¿Cómo podemos ayudarte?",
      send: "Enviar Mensaje",
      sending: "Enviando...",
      sent: "¡Mensaje Enviado!",
      infoTitle: "Información de Contacto",
      call: "Llámanos",
      emailLabel: "Escríbenos",
      visit: "Visítanos",
      address: "Avenida Pastor Díaz, Jacó, Garabito, Puntarenas, Costa Rica"
    }
  };
  const content = $language === "en" ? t.en : t.es;
  return /* @__PURE__ */ jsx("section", { className: "py-24 bg-dark relative -mt-20 z-20", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-dark-soft rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col lg:flex-row ring-1 ring-white/10", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:w-2/5 bg-[#1A4D45] p-12 text-white relative overflow-hidden flex flex-col justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 pointer-events-none", style: { backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" } }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold mb-8", children: content.infoTitle }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 hover:translate-x-2 transition-transform duration-300", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm", children: /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-white/60 text-sm font-medium mb-1", children: content.call }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", children: "+506 8774-7250" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 hover:translate-x-2 transition-transform duration-300", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-white/60 text-sm font-medium mb-1", children: content.emailLabel }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", children: "info@vamosjaco.com" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 hover:translate-x-2 transition-transform duration-300", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm", children: /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-white/60 text-sm font-medium mb-1", children: content.visit }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold leading-relaxed max-w-[250px]", children: content.address })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 lg:mt-0 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-32 h-32 bg-brand-yellow rounded-full absolute -bottom-20 -right-20 blur-2xl opacity-50" }),
        /* @__PURE__ */ jsx("div", { className: "w-32 h-32 bg-primary rounded-full absolute -bottom-10 -left-10 blur-3xl opacity-40" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:w-3/5 p-12 lg:p-16", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-bold text-white mb-2 flex items-center gap-3", children: [
        content.title,
        " ",
        /* @__PURE__ */ jsx(MessageSquare, { className: "w-6 h-6 text-primary" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-10", children: $language === "en" ? "Don't hesitate to reach out. We are here to help you plan the perfect trip." : "No dudes en contactarnos. Estamos aquí para ayudarte a planear el viaje perfecto." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "contact-name",
              type: "text",
              required: true,
              maxLength: 100,
              autoComplete: "name",
              value: formState.name,
              onChange: (e) => setFormState({ ...formState, name: e.target.value }),
              placeholder: " ",
              className: "peer w-full bg-white/5 border-2 border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-medium"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "contact-name", className: "absolute left-6 top-4 text-gray-400 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-dark-soft peer-focus:px-2 rounded-full cursor-text pointer-events-none transform -translate-y-1/2 peer-placeholder-shown:translate-y-0 peer-focus:translate-y-0", children: content.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "contact-email",
              type: "email",
              required: true,
              maxLength: 200,
              autoComplete: "email",
              value: formState.email,
              onChange: (e) => setFormState({ ...formState, email: e.target.value }),
              placeholder: " ",
              className: "peer w-full bg-white/5 border-2 border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-medium"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "contact-email", className: "absolute left-6 top-4 text-gray-400 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-dark-soft peer-focus:px-2 rounded-full cursor-text pointer-events-none transform -translate-y-1/2 peer-placeholder-shown:translate-y-0 peer-focus:translate-y-0", children: content.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "contact-message",
              required: true,
              rows: 4,
              maxLength: 2e3,
              value: formState.message,
              onChange: (e) => setFormState({ ...formState, message: e.target.value }),
              placeholder: " ",
              className: "peer w-full bg-white/5 border-2 border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-medium resize-none"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "contact-message", className: "absolute left-6 top-4 text-gray-400 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-dark-soft peer-focus:px-2 rounded-full cursor-text pointer-events-none transform -translate-y-1/2 peer-placeholder-shown:translate-y-0 peer-focus:translate-y-0", children: content.message })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting || isSent,
            className: `w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${isSent ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary-dark hover:-translate-y-1 hover:shadow-xl shadow-primary/30"}`,
            children: isSubmitting ? /* @__PURE__ */ jsx("span", { className: "flex items-center gap-2 animate-pulse", children: content.sending }) : isSent ? /* @__PURE__ */ jsx("span", { className: "flex items-center gap-2", children: content.sent }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              content.send,
              " ",
              /* @__PURE__ */ jsx(Send, { className: "w-5 h-5" })
            ] })
          }
        )
      ] })
    ] })
  ] }) }) });
}

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  const schemas = [
    getLocalBusinessSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" }
    ])
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact Us | Vamos Jac\xF3 Tours \u2014 Book Your Adventure", "description": "Contact Vamos Jac\xF3 Tours to book your Costa Rica adventure. Call us, send a message on WhatsApp, or fill out our form. Located on Avenida Pastor D\xEDaz, Jac\xF3, Puntarenas.", "keywords": "contact Vamos Jac\xF3, book tour Jac\xF3, Costa Rica tour booking, WhatsApp Jac\xF3 tours, Jac\xF3 tour operator contact", "jsonLd": schemas, "preloadImage": "/images/Sidebyside/sidebyside-vamos-jaco-tours-003.webp" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main>  ${renderComponent($$result2, "ContactHero", ContactHero, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ContactHero", "client:component-export": "default" })}  ${renderComponent($$result2, "ContactForm", ContactForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ContactForm", "client:component-export": "default" })}  <section class="min-h-[400px] w-full bg-dark-soft relative grayscale hover:grayscale-0 transition-all duration-700">  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.956415489982!2d-84.62031292409446!3d9.599021479804165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa1c7bad1eecfdb%3A0x168ac8d685b87dea!2sJet%20skis%20tour%20%2CATV%20%2Cside%20by%20side%20vamos%20jaco%20tours!5e0!3m2!1ses!2scr!4v1773493792425!5m2!1ses!2scr" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="w-full h-full min-h-[450px]"></iframe> </section>  ${renderComponent($$result2, "NewsletterSection", NewsletterSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/NewsletterSection", "client:component-export": "default" })} </main> ` })}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/contact.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Contact,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
