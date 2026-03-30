import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { Flame, CheckCircle2, Send } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { l as language } from './Layout_DxykCy69.mjs';

function NewsletterSection() {
  const $language = useStore(language);
  const t = {
    en: {
      tagline: "EXCLUSIVE DEALS",
      title: "Get insider access to extreme adventures.",
      placeholder: "Your email address",
      alreadySubscribed: "You are already subscribed to our newsletter!",
      subtext: "Join 2,000+ adventure seekers. Get exclusive deals, new experience alerts & local tips."
    },
    es: {
      tagline: "OFERTAS EXCLUSIVAS",
      title: "Acceso exclusivo a aventuras extremas.",
      placeholder: "Tu correo electrónico",
      alreadySubscribed: "Usted ya se ha suscrito a nuestro boletín.",
      subtext: "Únete a 2,000+ buscadores de aventura. Ofertas exclusivas, alertas y tips locales."
    }
  };
  const fallbackContent = $language === "en" ? t.en : t.es;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language: $language })
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        if (data.alreadySubscribed) {
          setMessage(alreadySubscribedText);
        } else {
          setMessage($language === "en" ? "Thanks for subscribing!" : "¡Gracias por suscribirte!");
        }
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || ($language === "en" ? "Something went wrong. Please try again." : "Algo salió mal. Por favor intenta de nuevo."));
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        $language === "en" ? "Something went wrong. Please try again." : "Algo salió mal. Por favor intenta de nuevo."
      );
    }
  };
  const tagline = fallbackContent.tagline;
  const title = fallbackContent.title;
  const placeholder = fallbackContent.placeholder;
  const subtext = fallbackContent.subtext;
  const alreadySubscribedText = fallbackContent.alreadySubscribed;
  return /* @__PURE__ */ jsx("section", { className: "py-4", children: /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-[#1A4D45] via-[#1A4D45] to-[#0D3B34] w-full p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg",
        alt: "",
        className: "w-full h-full object-cover grayscale invert"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-64 h-64 bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-2xl mx-auto pt-4 pb-4", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-brand-yellow font-bold text-xs tracking-[0.2em] uppercase mb-6", children: [
        /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4" }),
        tagline,
        /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-black text-white mb-10 leading-tight uppercase tracking-tight", children: title }),
      status === "success" ? /* @__PURE__ */ jsxs("div", { className: "bg-brand-teal/20 border border-brand-teal/30 p-4 rounded-3xl flex items-center justify-center gap-3 max-w-xl mx-auto mb-6 text-brand-teal animate-fade-in-up", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-lg", children: message || ($language === "en" ? "Thanks for subscribing!" : "¡Gracias por suscribirte!") })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-dark/40 backdrop-blur-xl p-2 rounded-full flex items-center ring-1 ring-white/20 max-w-xl mx-auto w-full mb-6 hover:ring-white/30 transition-colors focus-within:ring-primary/50", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "newsletter-email",
              type: "email",
              required: true,
              disabled: status === "loading",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder,
              "aria-label": placeholder,
              className: "flex-grow px-6 py-3 rounded-full bg-transparent text-white focus:outline-none placeholder:text-gray-400 font-medium"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: status === "loading",
              "aria-label": $language === "en" ? "Subscribe" : "Suscribirse",
              className: "bg-gradient-to-r from-primary to-brand-orange text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/30 disabled:opacity-50",
              children: status === "loading" ? /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-5 h-5 -ml-0.5 translate-x-0.5" })
            }
          )
        ] }),
        status === "error" && /* @__PURE__ */ jsx("p", { className: "text-primary text-sm mb-6 font-bold animate-pulse", children: message })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300/80 text-sm md:text-base font-medium", children: subtext })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-1/4 w-32 h-32 border-t-2 border-r-2 border-dashed border-yellow-200/20 rounded-tr-full hidden xl:block" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 right-1/4 w-24 h-24 border-b-2 border-l-2 border-dashed border-yellow-200/15 rounded-bl-full hidden xl:block" })
  ] }) }) });
}

export { NewsletterSection as N };
