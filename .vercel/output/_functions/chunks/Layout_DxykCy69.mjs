import { e as createAstro, f as createComponent, h as addAttribute, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead, k as renderHead, l as renderComponent, o as renderSlot } from './astro/server_DYRfXif5.mjs';
import 'piccolore';
/* empty css                         */
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import { Globe, X, Menu, MessageCircle, Mail, Phone, Facebook, Instagram } from 'lucide-react';
import { clsx } from 'clsx';
/* empty css                         */

const language = atom("en");
const toggleLanguage = () => {
  const newLang = language.get() === "en" ? "es" : "en";
  language.set(newLang);
  if (typeof window !== "undefined") {
    localStorage.setItem("language", newLang);
  }
};
const initLanguage = () => {
  if (typeof window !== "undefined") {
    const storedLang = localStorage.getItem("language");
    if (storedLang === "en" || storedLang === "es") {
      language.set(storedLang);
    }
  }
};
const theme = atom("dark");
const toggleTheme = () => {
  const newTheme = theme.get() === "dark" ? "light" : "dark";
  theme.set(newTheme);
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};
const initTheme = () => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme || "dark";
    theme.set(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

function Header() {
  const $language = useStore(language);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    initLanguage();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);
  const navLinks = [
    { href: "/", label: $language === "en" ? "Home" : "Inicio" },
    { href: "/tours", label: "Tours" },
    { href: "/about", label: $language === "en" ? "About" : "Nosotros" },
    { href: "/contact", label: $language === "en" ? "Contact" : "Contacto" }
  ];
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: clsx(
        "fixed w-full top-0 z-50 transition-premium",
        isScrolled || isMobileMenuOpen ? "glass py-2" : "bg-gradient-to-b from-black/60 to-transparent py-4"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-50", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("a", { href: "/", className: "flex items-center gap-2 transition-transform hover:scale-105", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/logo-optimized.png",
              alt: "Vamos Jacó Tours Logo",
              width: "600",
              height: "301",
              fetchPriority: "high",
              className: "h-14 md:h-16 w-auto object-contain",
              onError: (e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement?.classList.add("text-2xl", "font-bold", isScrolled || isMobileMenuOpen ? "text-primary" : "text-white", "drop-shadow-md");
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML = "Vamos Jacó";
                }
              }
            }
          ) }) }),
          /* @__PURE__ */ jsx("div", { className: clsx(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-8 px-8 py-3 rounded-full transition-premium border text-xs font-bold tracking-widest uppercase",
            isScrolled ? "bg-white/5 border-white/10 text-white/90" : "bg-white/10 border-white/20 text-white backdrop-blur-sm shadow-xl shadow-black/20"
          ), children: navLinks.map((link) => /* @__PURE__ */ jsx("a", { href: link.href, className: "hover:text-primary transition-premium transform hover:scale-105 active:scale-95", children: link.label }, link.href)) }),
          /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: toggleLanguage,
                className: clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full transition-premium border text-xs font-bold tracking-widest uppercase",
                  isScrolled || isMobileMenuOpen ? "glass hover:bg-white/10 border-white/10 text-white" : "bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                ),
                children: [
                  /* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-primary" }),
                  /* @__PURE__ */ jsx("span", { children: $language === "en" ? "EN" : "ES" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "lg:hidden p-2 text-white transition-colors",
                onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
                "aria-label": "Toggle menu",
                children: isMobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: clsx(
          "fixed inset-0 top-0 left-0 w-full h-screen lg:hidden flex flex-col items-center justify-center pt-20 pb-10 transition-all duration-500 ease-in-out",
          isMobileMenuOpen ? "bg-dark opacity-100 pointer-events-auto z-[45]" : "bg-transparent opacity-0 pointer-events-none -translate-y-full z-[45]"
        ), children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-8 text-3xl font-black tracking-wider text-white uppercase", children: navLinks.map((link) => /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              onClick: () => setIsMobileMenuOpen(false),
              className: "hover:text-primary transition-all duration-200 transform hover:scale-110",
              children: link.label
            },
            link.href
          )) }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://wa.me/50687747250",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "mt-12 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300",
              onClick: () => setIsMobileMenuOpen(false),
              children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" }),
                  /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.478-.677-6.309-1.834l-.452-.274-2.645.887.887-2.645-.274-.452A9.955 9.955 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" })
                ] }),
                "WhatsApp"
              ]
            }
          )
        ] })
      ]
    }
  );
}

function Footer() {
  const $language = useStore(language);
  const t = {
    en: {
      inquiry: { title: "More Inquiry?", subtitle: "Don't hesitate to contact Vamos Jacó Tours." },
      whatsapp: { title: "WhatsApp", subtitle: "+506 8774-7250" },
      mail: { title: "Mail Us", subtitle: "info@vamosjacotours.com" },
      call: { title: "Call Us", subtitle: "+506 8774-7250" },
      brand: { address: "Jacó, Puntarenas, Costa Rica" },
      cols: {
        destinations: "Top Destinations",
        search: "Popular Activities",
        resources: "Quick Links"
      },
      rights: "All Rights Reserved.",
      payment: "Accepted Payment Methods:",
      newsletter: {
        title: "Subscribe to our Newsletter",
        subtitle: "Get the best deals and adventure news directly in your inbox.",
        placeholder: "Enter your email address",
        button: "Join Now",
        success: "Thanks for subscribing!",
        alreadySubscribed: "You are already subscribed to our newsletter!",
        error: "Something went wrong. Please try again."
      }
    },
    es: {
      inquiry: { title: "¿Más Información?", subtitle: "No dudes en contactar a Vamos Jacó Tours." },
      whatsapp: { title: "WhatsApp", subtitle: "+506 8774-7250" },
      mail: { title: "Escríbenos", subtitle: "info@vamosjacotours.com" },
      call: { title: "Llámanos", subtitle: "+506 8774-7250" },
      brand: { address: "Jacó, Puntarenas, Costa Rica" },
      cols: {
        destinations: "Destinos Top",
        search: "Actividades Populares",
        resources: "Enlaces Rápidos"
      },
      rights: "Todos los derechos reservados.",
      payment: "Métodos de Pago Aceptados:",
      newsletter: {
        title: "Suscríbete a nuestro boletín",
        subtitle: "Recibe las mejores ofertas y noticias de aventuras directamente en tu correo.",
        placeholder: "Ingresa tu correo electrónico",
        button: "Unirse",
        success: "¡Gracias por suscribirte!",
        alreadySubscribed: "Usted ya se ha suscrito a nuestro boletín.",
        error: "Algo salió mal. Por favor intenta de nuevo."
      }
    }
  };
  const content = $language === "en" ? t.en : t.es;
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        if (data.alreadySubscribed) {
          setMessage(content.newsletter.alreadySubscribed);
        } else {
          setMessage(content.newsletter.success);
        }
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || content.newsletter.error);
      }
    } catch (error) {
      setStatus("error");
      setMessage(content.newsletter.error);
    }
  };
  return /* @__PURE__ */ jsxs("footer", { className: "bg-[#0B0F19] text-white relative overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] pointer-events-none", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/images/world-map.svg",
        alt: "World Map",
        className: "w-full h-full object-cover grayscale invert"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-gray-800 py-12", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-primary", children: /* @__PURE__ */ jsx(MessageCircle, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: content.inquiry.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: content.inquiry.subtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-green-500", children: /* @__PURE__ */ jsx(MessageCircle, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: content.whatsapp.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: content.whatsapp.subtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-blue-400", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: content.mail.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: content.mail.subtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-yellow-400", children: /* @__PURE__ */ jsx(Phone, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: content.call.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: content.call.subtitle })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "py-12 border-b border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-center justify-between gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center lg:text-left", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: content.newsletter.title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: content.newsletter.subtitle })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubscribe, className: "w-full max-w-md relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex bg-gray-800/50 rounded-full p-1 border border-gray-700 focus-within:border-primary transition-all", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                placeholder: content.newsletter.placeholder,
                className: "bg-transparent border-none outline-none px-6 py-3 text-sm flex-1 placeholder:text-gray-500",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                disabled: status === "loading" || status === "success",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: status === "loading" || status === "success",
                className: "bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full text-sm font-bold transition-all disabled:opacity-50",
                children: status === "loading" ? "..." : content.newsletter.button
              }
            )
          ] }),
          status === "success" && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-xs mt-3 ml-4 font-medium animate-fade-in-up", children: message }),
          status === "error" && /* @__PURE__ */ jsx("p", { className: "text-primary text-xs mt-3 ml-4 font-medium animate-fade-in-up", children: message })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("a", { href: "/", className: "mb-6 block", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/logo-optimized.png",
              alt: "Vamos Jacó Tours Logo",
              width: "600",
              height: "301",
              className: "h-16 md:h-20 w-auto object-contain",
              onError: (e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML = `<span class="text-3xl font-bold font-['Inter'] text-white"><span class="text-primary">V</span>amos Jacó</span>`;
                }
              }
            }
          ) }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-2 font-bold", children: "Vamos Jacó Tours Agency" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-6 leading-relaxed", children: content.brand.address }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-8", children: [
            /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com", target: "_blank", rel: "noreferrer", className: "w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white", "aria-label": "Facebook", children: /* @__PURE__ */ jsx(Facebook, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/vamosjacotours", target: "_blank", rel: "noreferrer", className: "w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white", "aria-label": "Instagram", children: /* @__PURE__ */ jsx(Instagram, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("a", { href: "https://wa.me/50687747250", target: "_blank", rel: "noreferrer", className: "w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors text-white", "aria-label": "WhatsApp", children: /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-8", children: content.cols.destinations }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-gray-400 text-sm", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Jacó Beach" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Herradura" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Los Sueños" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Hermosa Beach" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-8", children: content.cols.search }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-gray-400 text-sm", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "ATV Tours" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Side by Side (Buggy)" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Jet Ski" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Zipline Canopy" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Surfing Lessons" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-8", children: content.cols.resources }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-gray-400 text-sm", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/", className: "hover:text-primary transition-colors", children: $language === "en" ? "Home" : "Inicio" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/tours", className: "hover:text-primary transition-colors", children: "Tours & Adventures" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/about", className: "hover:text-primary transition-colors", children: $language === "en" ? "About Us" : "Nosotros" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/contact", className: "hover:text-primary transition-colors", children: $language === "en" ? "Contact" : "Contacto" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-800 py-8 flex flex-col md:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-sm", children: [
          "Copyright ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Vamos Jacó. ",
          content.rights
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-sm hidden md:block", children: content.payment }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-white px-2 py-1 rounded h-6 flex items-center", children: /* @__PURE__ */ jsx("img", { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", className: "h-4", alt: "Mastercard" }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-white px-2 py-1 rounded h-6 flex items-center", children: /* @__PURE__ */ jsx("img", { src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg", className: "h-3", alt: "Visa" }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-white px-2 py-1 rounded h-6 flex items-center", children: /* @__PURE__ */ jsx("img", { src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", className: "h-3", alt: "PayPal" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://vamosjacotoursdev.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Vamos Jac\xF3 Tours | Costa Rica Adventures",
    description = "Explore the best adventure tours in Jac\xF3, Costa Rica. ATV rides, jet ski, surfing, flyboard, and more. Book your unforgettable experience today!",
    image = "/og-image.png",
    keywords = "Costa Rica tours, Jac\xF3 tours, ATV tours Jac\xF3, jet ski Costa Rica, surfing Jac\xF3, adventure tours, flyboard, zipline, Vamos Jac\xF3",
    robots = "index, follow",
    jsonLd,
    preloadImage,
    hideChrome = false
  } = Astro2.props;
  const canonicalURL = new URL(
    Astro2.url.pathname,
    Astro2.site || "https://vamosjacotoursdev.com"
  );
  const ogImage = image?.startsWith("http") ? image : `${Astro2.site || "https://vamosjacotoursdev.com"}${image}`;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  return renderTemplate`<html lang="en" class="dark"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" href="/logo-optimized.png"><meta name="theme-color" content="#dc3522"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- SEO --><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="keywords"${addAttribute(keywords, "content")}><meta name="robots"${addAttribute(robots, "content")}><link rel="canonical"${addAttribute(canonicalURL.href, "href")}><!-- LCP Image Preload -->${preloadImage && renderTemplate`<link rel="preload" as="image"${addAttribute(preloadImage, "href")} fetchpriority="high">`}<!-- Open Graph / Social --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Vamos Jacó Tours Adventure Preview"><meta property="og:url"${addAttribute(canonicalURL.href, "content")}><meta property="og:site_name" content="Vamos Jacó Tours"><meta property="og:locale" content="en_US"><meta property="og:locale:alternate" content="es_CR"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><!-- Geo --><meta name="geo.region" content="CR-P"><meta name="geo.placename" content="Jacó"><meta name="geo.position" content="9.6151;-84.6368"><meta name="ICBM" content="9.6151, -84.6368"><!-- Security --><meta http-equiv="X-Content-Type-Options" content="nosniff"><meta name="referrer" content="strict-origin-when-cross-origin"><!-- JSON-LD Structured Data -->${schemas.map((schema) => renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(schema))))}<!-- Resource Hints --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"><link rel="preconnect" href="https://images.unsplash.com"><link rel="preconnect" href="https://yebtzzqngiurwddrvhry.supabase.co"><!-- Google Fonts: Preloaded for performance --><link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">${maybeRenderHead()}<noscript><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"></noscript>${renderHead()}</head> <body class="font-sans antialiased"> <div class="relative z-10"> ${!hideChrome && renderTemplate`${renderComponent($$result, "Header", Header, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/Header", "client:component-export": "default" })}`} ${renderSlot($$result, $$slots["default"])} ${!hideChrome && renderTemplate`${renderComponent($$result, "Footer", Footer, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/Footer", "client:component-export": "default" })}`} </div>  </body> </html>`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/layouts/Layout.astro", void 0);

export { $$Layout as $, toggleTheme as a, initTheme as i, language as l, theme as t };
