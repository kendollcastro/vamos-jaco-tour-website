import { e as createAstro, f as createComponent, l as renderComponent, n as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { l as language, $ as $$Layout } from '../../chunks/Layout_DxykCy69.mjs';
import { g as getTourById, a as getAllTours, T as TourCard } from '../../chunks/TourCard_BhMMTNgd.mjs';
import { d as getTourSchema, a as getBreadcrumbSchema } from '../../chunks/seo-schemas_BZJstb5R.mjs';
import { N as NewsletterSection } from '../../chunks/NewsletterSection_srBEqa-A.mjs';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import React, { useState, useMemo, useEffect } from 'react';
import DatePicker from 'react-datepicker';
/* empty css                                   */
import { useStore } from '@nanostores/react';
import { persistentAtom } from '@nanostores/persistent';
import { Calendar, Clock, ChevronUp, ChevronDown, CheckCircle, Info, Users, Minus, Plus, Flag, ShieldCheck } from 'lucide-react';
import { marked } from 'marked';
export { renderers } from '../../renderers.mjs';

const INITIAL_STATE = {
  tourId: null,
  tourTitle: null,
  date: null,
  time: null,
  adults: 1,
  children: 0,
  extraPassengers: 0,
  pricePerAdult: 0,
  pricePerChild: 0,
  ivaAmount: 0,
  totalPrice: 0
};
const bookingStore = persistentAtom("booking_cart", INITIAL_STATE, {
  encode: JSON.stringify,
  decode: JSON.parse
});
function setBookingTour(id, title, adultPrice, childPrice = 0) {
  const current = bookingStore.get();
  bookingStore.set({
    ...current,
    tourId: id,
    tourTitle: title,
    pricePerAdult: adultPrice,
    pricePerChild: childPrice,
    extraPassengers: 0
    // Reset extra passengers when switching tours
  });
  calculateTotal();
}
function setBookingDate(date) {
  const current = bookingStore.get();
  bookingStore.set({
    ...current,
    date: date.toISOString()
  });
}
function setGuests(adults, children) {
  const current = bookingStore.get();
  bookingStore.set({
    ...current,
    adults,
    children
  });
  calculateTotal();
}
function setExtraPassengers(count) {
  const current = bookingStore.get();
  bookingStore.set({
    ...current,
    extraPassengers: count
  });
  calculateTotal();
}
function calculateTotal() {
  const current = bookingStore.get();
  const { tourId, adults, children, pricePerAdult, pricePerChild } = current;
  let total = 0;
  if (tourId === "side-by-side-tour" || tourId === "jet-ski-tour" || tourId === "jaco-atv-adventure") {
    total = adults * pricePerAdult + current.extraPassengers * 20;
  } else {
    total = adults * pricePerAdult + children * pricePerChild;
  }
  const subtotal = total;
  const iva = subtotal * 0.13;
  const finalTotal = subtotal + iva;
  bookingStore.set({
    ...current,
    ivaAmount: iva,
    totalPrice: finalTotal
  });
}

function TranslatedText({ content, fallback = "", className, as: Component = "span" }) {
  const $language = useStore(language);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!content) return /* @__PURE__ */ jsx(Fragment, { children: fallback });
  let text = fallback;
  if (typeof content === "string") {
    text = content;
  } else {
    text = mounted ? content[$language] || content.en : content.en;
  }
  if (!text) text = fallback;
  if (Component === "span" && !className) return /* @__PURE__ */ jsx(Fragment, { children: text });
  return React.createElement(Component, { className }, text);
}

function BookingSidebar({ tourId, tourTitle, price, durationOptions }) {
  const $booking = useStore(bookingStore);
  const $language = useStore(language);
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(0);
  const [durationOpen, setDurationOpen] = useState(false);
  const rawOptions = durationOptions && durationOptions.length > 0 ? durationOptions : [{ duration: "Standard Tour", price: price || 0 }];
  const packages = useMemo(() => {
    const pkgMap = /* @__PURE__ */ new Map();
    rawOptions.forEach((opt) => {
      const rawName = opt.duration;
      let baseName = rawName;
      let isChild = false;
      if (baseName.toLowerCase().includes("child") || baseName.toLowerCase().includes("niño")) {
        isChild = true;
        baseName = baseName.replace(/\s*-\s*child.*$/i, "").replace(/\s*-\s*niño.*$/i, "").replace(/\s*niños.*$/i, "").replace(/\([-+a-z0-9\s]*\)/i, "").trim();
      } else if (baseName.toLowerCase().includes("adult") || baseName.toLowerCase().includes("adulto")) {
        baseName = baseName.replace(/\s*-\s*adult.*$/i, "").replace(/\s*-\s*adulto.*/i, "").trim();
      }
      baseName = baseName.replace(/[-\s]+$/, "");
      if (!pkgMap.has(baseName)) {
        pkgMap.set(baseName, { duration: baseName, adultPrice: opt.price, childPrice: 0, variation_id: opt.variation_id });
      }
      const pkg = pkgMap.get(baseName);
      if (isChild) {
        pkg.childPrice = opt.price;
      } else {
        pkg.adultPrice = opt.price;
        if (opt.variation_id) pkg.variation_id = opt.variation_id;
      }
    });
    return Array.from(pkgMap.values());
  }, [rawOptions]);
  useEffect(() => {
    if (packages && packages.length > 0) {
      setBookingTour(tourId, tourTitle, packages[0].adultPrice, packages[0].childPrice);
    }
  }, [tourId, tourTitle, price, packages]);
  const handleDurationChange = (index) => {
    setSelectedDurationIdx(index);
    setBookingTour(tourId, tourTitle, packages[index].adultPrice, packages[index].childPrice);
  };
  const handleDateChange = (date) => {
    console.log("BookingSidebar: Date changed:", date);
    if (date) {
      setBookingDate(date);
    }
  };
  $booking.totalPrice;
  const Stepper = ({ value, min, max, onChange, label }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-full", children: [
    label && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 shadow-inner text-white h-12", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onChange(Math.max(min, value - 1)),
          disabled: value <= min,
          className: "w-10 h-full flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed",
          children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "font-bold text-lg tabular-nums", children: value }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onChange(Math.min(max, value + 1)),
          disabled: value >= max,
          className: "w-10 h-full flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed",
          children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "bg-dark/60 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden sticky top-28 shadow-2xl", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/20 to-brand-orange/20 px-6 py-4 border-b border-white/10", children: /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-primary" }),
      /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Book Your Adventure", es: "Reserva tu Aventura" } })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
          " ",
          /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Select Duration", es: "Seleccionar Duración" } })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDurationOpen(!durationOpen),
              className: `w-full flex items-center justify-between p-4 rounded-xl border transition-all ${durationOpen ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-white/10 bg-white/5 hover:border-white/20"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start translate-y-[-1px]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-white", children: packages[selectedDurationIdx]?.duration }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-primary font-medium mt-0.5", children: [
                    "$",
                    packages[selectedDurationIdx]?.adultPrice,
                    " ",
                    packages[selectedDurationIdx]?.childPrice > 0 ? `(Child: $${packages[selectedDurationIdx].childPrice})` : ""
                  ] })
                ] }),
                durationOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-5 h-5 text-primary" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5 text-gray-500" })
              ]
            }
          ),
          durationOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200", children: packages.map((pkg, index) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                handleDurationChange(index);
                setDurationOpen(false);
              },
              className: `w-full flex items-center justify-between p-4 transition-colors hover:bg-white/5 text-left ${selectedDurationIdx === index ? "bg-primary/10" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-bold ${selectedDurationIdx === index ? "text-primary" : "text-white"}`, children: pkg.duration }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                    "$",
                    pkg.adultPrice
                  ] })
                ] }),
                selectedDurationIdx === index && /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-primary" })
              ]
            },
            index
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
          " ",
          /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Date", es: "Fecha" } })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
          DatePicker,
          {
            selected: $booking.date ? new Date($booking.date) : null,
            onChange: (date) => {
              handleDateChange(date);
              if (date) setBookingDate(date);
            },
            minDate: /* @__PURE__ */ new Date(),
            placeholderText: "Select a date",
            className: "w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shadow-inner",
            wrapperClassName: "w-full"
          }
        ) }),
        !$booking.date && /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-lg p-2 flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-3 h-3 text-primary" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400", children: "Select a date in the calendar above to enable checkout." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-sm text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
          " ",
          /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Guests", es: "Huéspedes" } })
        ] }),
        tourId === "side-by-side-tour" || tourId === "jet-ski-tour" || tourId === "jaco-atv-adventure" ? (
          /* Machine-Based Selection */
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(
              Stepper,
              {
                label: tourId === "side-by-side-tour" ? $language === "en" ? "Buggies (up to 2pax)" : "Buggies (hasta 2p)" : tourId === "jet-ski-tour" ? $language === "en" ? "Jet Skis (Solo)" : "Jet Skis (Solo)" : $language === "en" ? "ATVs (Solo)" : "ATVs (Solo)",
                value: $booking.adults,
                min: 1,
                max: 10,
                onChange: (val) => setGuests(val, 0)
              }
            ),
            /* @__PURE__ */ jsx(
              Stepper,
              {
                label: tourId === "side-by-side-tour" ? $language === "en" ? "Extra Pax (3rd/4th)" : "Pax Extra (3ro/4to)" : $language === "en" ? "Shared Pax (2nd)" : "Acompañante (2do)",
                value: $booking.extraPassengers,
                min: 0,
                max: tourId === "side-by-side-tour" ? $booking.adults * 2 : $booking.adults,
                onChange: (val) => setExtraPassengers(val)
              }
            )
          ] })
        ) : (
          /* Standard Selection */
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(
              Stepper,
              {
                label: $language === "en" ? "Adults" : "Adultos",
                value: $booking.adults,
                min: 1,
                max: 20,
                onChange: (val) => setGuests(val, $booking.children)
              }
            ),
            packages[selectedDurationIdx]?.childPrice > 0 && /* @__PURE__ */ jsx(
              Stepper,
              {
                label: $language === "en" ? "Children" : "Niños",
                value: $booking.children,
                min: 0,
                max: 20,
                onChange: (val) => setGuests($booking.adults, val)
              }
            )
          ] })
        )
      ] }),
      (tourId === "side-by-side-tour" || tourId === "jet-ski-tour" || tourId === "jaco-atv-adventure") && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-3 text-[10px] text-gray-400", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-3.5 h-3.5 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-white mb-0.5", children: $language === "en" ? "Occupancy" : "Capacidad" }),
            /* @__PURE__ */ jsx("p", { className: "leading-tight", children: tourId === "side-by-side-tour" ? $language === "en" ? "Base covers 2pax. Extra pax (max 4) $20 ea." : "Base incluye 2p. Pax extra (máx 4) $20 c/u." : $language === "en" ? "Base covers 1px. 2nd pax costs $20." : "Base incluye 1p. 2do pax cuesta $20." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 text-[10px] text-gray-400", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-white mb-0.5", children: $language === "en" ? "Security Hold" : "Depósito" }),
            /* @__PURE__ */ jsx("p", { className: "leading-tight", children: $language === "en" ? "$1000 credit card hold. Released in 24h as per bank policy." : "Hold de $1000 en tarjeta. Liberación en 24h según banco." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-white/10 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Total Price", es: "Precio Total" } }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-3xl font-black text-white block leading-none", children: [
              "$",
              $booking.totalPrice > 0 ? ($booking.totalPrice - $booking.ivaAmount).toFixed(0) : packages[selectedDurationIdx] ? packages[selectedDurationIdx].adultPrice : price
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-brand-orange font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Best Price Guaranteed", es: "Mejor Precio Garantizado" } }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/checkout?product_id=${tourId}&variation_id=${packages[selectedDurationIdx]?.variation_id || ""}&date=${$booking.date || ""}&adults=${$booking.adults}&children=${$booking.children}&extra_pax=${$booking.extraPassengers}`,
            className: `w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/20 ${!$booking.date ? "opacity-50 cursor-not-allowed" : ""}`,
            onClick: (e) => {
              if (!$booking.date) {
                e.preventDefault();
                alert($language === "en" ? "Please select a date first!" : "¡Por favor selecciona una fecha primero!");
              }
            },
            children: [
              /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Proceed to Checkout", es: "Proceder al Pago" } }),
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" })
            ]
          }
        ),
        !$booking.date && /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-red-400/80", children: /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Please select a date to continue", es: "Por favor selecciona una fecha para continuar" } }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 pt-1 pb-1", children: [
          /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
            /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-brand-orange" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: "text-white", children: /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Hot tour!", es: "¡Tour Popular!" } }) }),
            " 14 ",
            /* @__PURE__ */ jsx(TranslatedText, { content: { en: "people viewed this today", es: "personas vieron esto hoy" } })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-gray-500", children: /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Instant confirmation • Secure Payment", es: "Confirmación instantánea • Pago seguro" } }) })
      ] })
    ] })
  ] });
}

function TranslatedMarkdown({ content, fallback = "", className, inline = false }) {
  const $language = useStore(language);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!content) return null;
  let text = fallback;
  if (typeof content === "string") {
    text = content;
  } else {
    text = mounted ? content[$language] || content.en : content.en;
  }
  if (!text) text = fallback;
  if (!text) return null;
  const html = inline ? marked.parseInline(text) : marked.parse(text);
  if (inline) {
    return /* @__PURE__ */ jsx("span", { className, dangerouslySetInnerHTML: { __html: html } });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className,
      dangerouslySetInnerHTML: { __html: html }
    }
  );
}

const getIcon = (name) => {
  switch (name) {
    case "info":
      return /* @__PURE__ */ jsx(Info, { className: "w-5 h-5" });
    case "shield":
      return /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" });
    case "flag":
      return /* @__PURE__ */ jsx(Flag, { className: "w-5 h-5" });
    default:
      return /* @__PURE__ */ jsx(Info, { className: "w-5 h-5" });
  }
};
function TourAccordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id || "");
  const toggleItem = (id) => {
    setOpenId(openId === id ? "" : id);
  };
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: items.map((item) => {
    const isOpen = openId === item.id;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-light-soft/5 border-primary/30 shadow-[0_0_15px_rgba(255,87,34,0.1)]" : "bg-dark-soft/50 border-white/5 hover:border-white/20"}`,
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => toggleItem(item.id),
              className: "w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: `p-2 rounded-xl transition-colors ${isOpen ? "bg-primary/20 text-primary" : "bg-white/5 text-gray-400 group-hover:text-white"}`, children: getIcon(item.iconName) }),
                  /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold transition-colors ${isOpen ? "text-white" : "text-gray-300 group-hover:text-white"}`, children: /* @__PURE__ */ jsx(TranslatedText, { content: item.title }) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `p-1.5 rounded-full transition-all duration-300 ${isOpen ? "bg-primary text-white rotate-180" : "bg-white/10 text-gray-400 group-hover:bg-white/20"}`, children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `transition-all duration-500 ease-in-out px-6 overflow-hidden ${isOpen ? "max-h-[1000px] pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"}`,
              children: /* @__PURE__ */ jsx(
                TranslatedMarkdown,
                {
                  className: "pt-2 text-gray-300 text-base md:text-lg leading-[1.8] font-light pl-[3.25rem] pb-4 [&>p]:mb-6 last:[&>p]:mb-0 [&_strong]:text-white [&_strong]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>ul>li]:mb-3 [&>ul>li::marker]:text-brand-orange [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-6 [&>ol>li]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mb-4 [&>h3]:mt-8 first:[&>h3]:mt-0",
                  content: item.content
                }
              )
            }
          )
        ]
      },
      item.id
    );
  }) });
}

function TourInfoList({ type, data }) {
  const $language = useStore(language);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const listEn = data?.en || [];
  if (listEn.length === 0) return null;
  const list = mounted && data?.[$language] && data[$language].length > 0 ? data[$language] : listEn;
  if (type === "highlights") {
    return /* @__PURE__ */ jsxs("div", { className: "relative bg-dark-soft rounded-3xl p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden mt-8", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" }),
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tight italic relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "w-10 h-1 bg-gradient-to-r from-brand-orange to-primary rounded-full shadow-[0_0_15px_rgba(242,127,27,0.5)]" }),
        /* @__PURE__ */ jsx(TranslatedText, { content: { en: "Important Info", es: "Información Importante" } })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10", children: list.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-5 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl group hover:bg-brand-orange/5 hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center flex-shrink-0 text-brand-orange shadow-[0_0_15px_rgba(242,127,27,0.2)] group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
        /* @__PURE__ */ jsx(
          TranslatedMarkdown,
          {
            content: item,
            inline: true,
            className: "text-gray-300 text-sm md:text-base font-medium leading-relaxed pt-1"
          }
        )
      ] }, idx)) })
    ] });
  }
  if (type === "includes") {
    return /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tight italic", children: [
        /* @__PURE__ */ jsx("span", { className: "w-10 h-1 bg-gradient-to-r from-brand-teal to-primary rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" }),
        /* @__PURE__ */ jsx(TranslatedText, { content: { en: "What's Included", es: "Qué Incluye" } })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: list.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-brand-teal/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)] group", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center flex-shrink-0 text-brand-teal group-hover:scale-110 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsx(
          TranslatedMarkdown,
          {
            content: item,
            inline: true,
            className: "text-sm md:text-base font-bold text-gray-200"
          }
        )
      ] }, idx)) })
    ] });
  }
  return null;
}

const $$Astro = createAstro("https://vamosjacotoursdev.com");
async function getStaticPaths() {
  const tours = await getAllTours();
  return tours.map((tour) => ({
    params: { id: tour.slug },
    props: { tour }
  }));
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const tour = Astro2.props.tour || (id ? await getTourById(id) : null);
  if (!tour) {
    return Astro2.redirect("/404");
  }
  const allTours = await getAllTours();
  const relatedTours = allTours.filter((t) => t.category === tour.category && t.id !== tour.id).slice(0, 3);
  const tourSchema = getTourSchema({
    name: tour.title.en,
    description: tour.description.en.substring(0, 200),
    image: tour.image_url,
    price: tour.price,
    duration: tour.duration,
    location: tour.location,
    url: `https://vamosjacotoursdev.com/tours/${tour.slug}`,
    category: tour.category
  });
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tours", url: "/tours" },
    { name: tour.title.en, url: `/tours/${tour.slug}` }
  ]);
  const schemas = [tourSchema, breadcrumbs];
  const leadDescription = {
    en: tour.description?.en ? tour.description.en.split("\n\n")[0] : "",
    es: tour.description?.es ? tour.description.es.split("\n\n")[0] : ""
  };
  const remainingDescription = {
    en: tour.description?.en ? tour.description.en.split("\n\n").slice(1).join("\n\n") : "",
    es: tour.description?.es ? tour.description.es.split("\n\n").slice(1).join("\n\n") : ""
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": tour.seo?.title || `${tour.title.en} | Vamos Jac\xF3 Tours`, "description": tour.seo?.description || tour.description.en.substring(0, 160), "image": tour.seo?.image || tour.image_url, "keywords": `${tour.title.en}, ${tour.category} tour Jac\xF3, adventure tour Costa Rica, ${tour.location}`, "jsonLd": schemas, "preloadImage": tour.image_url }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- Tour Hero --> <section class="relative h-[55vh] min-h-[450px] flex items-end overflow-hidden"> <div class="absolute inset-0 z-0 overflow-hidden bg-dark"> <img${addAttribute(tour.image_url, "src")}${addAttribute(tour.title.en, "alt")} class="w-full h-full object-cover animate-ken-burns origin-center" fetchpriority="high" decoding="sync"> <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-dark/20"></div> <div class="absolute inset-0 bg-gradient-to-r from-dark/30 via-transparent to-dark/30"></div> </div> <!-- Glowing Orbs --> <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden"> <div class="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[120px] animate-pulse"></div> <div class="absolute top-1/3 right-0 w-72 h-72 bg-brand-teal/8 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s;"></div> </div> <!-- Hero Content --> <div class="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12"> <div class="flex flex-wrap items-end justify-between gap-6"> <div> <!-- Back Link --> <a href="/tours" class="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-4 transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "Back to Tours", es: "Volver a los Tours" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </a> <!-- Badge --> ${tour.badge && renderTemplate`<div class="mb-3"> <span${addAttribute([
    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
    tour.badge.color === "red" && "bg-red-500 text-white",
    tour.badge.color === "yellow" && "bg-yellow-400 text-gray-900",
    tour.badge.color === "green" && "bg-green-500 text-white"
  ], "class:list")}> ${tour.badge.text} </span> </div>`} <!-- Title --> <h1 class="text-4xl md:text-6xl font-black text-white uppercase tracking-tight italic drop-shadow-2xl leading-[0.95]"> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": tour.title, "fallback": tour.title.en, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </h1> <!-- Meta --> <div class="flex flex-wrap items-center gap-4 mt-6 text-white/80 text-sm"> <div class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"> <svg class="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> ${tour.location} </div> <div class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"> <svg class="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> ${tour.duration} </div> </div> </div> <!-- Price Badge --> <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[140px] shadow-2xl"> <p class="text-xs text-white/80 font-medium mb-1 uppercase tracking-wider"> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "Starting From", es: "Desde" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </p> <p class="text-4xl font-black text-white flex justify-center items-center gap-1" id="hero-price">
$${tour.price} <span class="text-lg text-white/50 font-normal">/pp</span> </p> <div class="mt-2 inline-flex items-center gap-1.5 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest animate-pulse"> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "Selling Fast", es: "Se agota r\xE1pido" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </div> </div> </div> </div> <!-- Scroll Indicator --> <div class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-70 hidden md:flex flex-col items-center gap-2"> <span class="text-[10px] uppercase tracking-[0.2em] text-white font-bold">${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "Scroll", es: "Deslizar" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })}</span> <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path> </svg> </div> </section> <!-- Main Content --> <section class="relative py-16 md:py-20"> <div class="max-w-7xl mx-auto px-6"> <div class="flex flex-col lg:flex-row gap-12 justify-between"> <!-- Left: Tour Details --> <div class="flex-1 space-y-12 min-w-0 md:max-w-3xl">  ${tour.gallery && tour.gallery.length > 0 && renderTemplate`${renderComponent($$result2, "TourGallery", null, { "client:only": "react", "images": tour.gallery, "title": tour.title.en, "client:component-hydration": "only", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TourGallery", "client:component-export": "default" })}`}  <div class="mt-8 md:mt-12"> <h2 class="text-3xl font-black text-white mb-6 flex items-center gap-3 italic uppercase tracking-tight"> <span class="w-8 h-1 bg-gradient-to-r from-primary to-brand-orange rounded-full"></span> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "About This Tour", es: "Acerca de este Tour" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </h2> <div class="space-y-8">  ${renderComponent($$result2, "TranslatedMarkdown", TranslatedMarkdown, { "client:load": true, "content": leadDescription, "className": "text-gray-300 text-lg md:text-xl leading-[1.8] font-light [&>p]:mb-6 last:[&>p]:mb-0 [&_strong]:text-white [&_strong]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>ul>li]:mb-3 [&>ul>li::marker]:text-brand-orange [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-6 [&>ol>li]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mb-4 [&>h3]:mt-8 first:[&>h3]:mt-0", "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedMarkdown", "client:component-export": "default" })}  ${tour.description.en.split("\n\n").length > 1 && renderTemplate`${renderComponent($$result2, "TourAccordion", TourAccordion, { "client:visible": true, "items": [
    {
      id: "details",
      title: { en: "The Experience", es: "La Experiencia" },
      content: remainingDescription,
      iconName: "info"
    }
  ], "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TourAccordion", "client:component-export": "default" })}`} </div> </div> <!-- Highlights --> ${renderComponent($$result2, "TourInfoList", TourInfoList, { "client:visible": true, "type": "highlights", "data": tour.highlights, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TourInfoList", "client:component-export": "default" })} <!-- What's Included --> ${renderComponent($$result2, "TourInfoList", TourInfoList, { "client:visible": true, "type": "includes", "data": tour.includes, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TourInfoList", "client:component-export": "default" })} </div> <!-- Right: Pricing Sidebar --> <div id="booking-sidebar-container" class="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 border-t lg:border-t-0 border-white/10 pt-10 lg:pt-0"> <div class="sticky top-28"> ${renderComponent($$result2, "BookingSidebar", BookingSidebar, { "client:load": true, "tourId": tour.id, "tourTitle": tour.title.en, "price": tour.price, "durationOptions": tour.pricing_options, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/BookingSidebar", "client:component-export": "default" })} </div> </div> </div> </div> </section> <!-- Related Tours --> ${relatedTours.length > 0 && renderTemplate`<section class="py-16 md:py-20 relative overflow-hidden border-t border-white/5"> <div class="absolute top-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div> <div class="max-w-7xl mx-auto px-6"> <div class="text-center mb-12"> <span class="text-primary font-bold text-sm tracking-[0.2em] uppercase"> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "More Adventures", es: "M\xE1s Aventuras" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </span> <h2 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tight italic mt-2"> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "Similar", es: "Tours" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })}${" "} <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-orange"> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "Tours", es: "Similares" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </span> </h2> </div> <div class="flex flex-wrap justify-center gap-8"> ${relatedTours.map((t) => renderTemplate`<a${addAttribute(`/tours/${t.slug}`, "href")} class="block hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,127,27,0.15)] rounded-[25px]"> ${renderComponent($$result2, "TourCard", TourCard, { "client:visible": true, "id": t.id, "title": t.title, "price": t.price, "originalPrice": t.originalPrice, "image_url": t.image_url, "location": t.location, "duration": t.duration, "badge": t.badge, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TourCard", "client:component-export": "default" })} </a>`)} </div> </div> </section>`} <!-- Newsletter --> ${renderComponent($$result2, "NewsletterSection", NewsletterSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/NewsletterSection", "client:component-export": "default" })} </main>  <div class="md:hidden fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"> <div class="bg-dark/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between pointer-events-auto"> <div class="flex flex-col"> <span class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "From", es: "Desde" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })}</span> <span class="text-xl font-black text-white">$${tour.price}</span> </div> <button onclick="document.getElementById('booking-sidebar-container').scrollIntoView({behavior: 'smooth', block: 'center'})" class="bg-brand-orange text-white font-bold py-3 px-6 rounded-xl text-sm uppercase tracking-wide hover:bg-brand-orange/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(242,127,27,0.3)]"> ${renderComponent($$result2, "TranslatedText", TranslatedText, { "client:load": true, "content": { en: "Book Now", es: "Reservar" }, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TranslatedText", "client:component-export": "default" })} </button> </div> </div> ` })} ${renderScript($$result, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/tours/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/tours/[id].astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/tours/[id].astro";
const $$url = "/tours/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    getStaticPaths,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
