import { f as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { l as language, $ as $$Layout } from '../chunks/Layout_DxykCy69.mjs';
import { a as getAllTours } from '../chunks/TourCard_COpSl_xu.mjs';
import { f as fetchWPAPI, a as TrustBar, A as AboutSection, T as TeamSection, F as FaqSection } from '../chunks/wp_DJMzJKTt.mjs';
import { g as getTeamMembers } from '../chunks/supabase-team_Dc6PVDSG.mjs';
import { g as getWebsiteComponent } from '../chunks/supabase-components_CFZRylM8.mjs';
import { g as getOrganizationSchema, e as getWebsiteSchema, b as getFAQSchema } from '../chunks/seo-schemas_BZJstb5R.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { MapPin, Calendar, Users, Search, Play, ChevronDown, Flame, Mountain, Shield, Zap, ArrowRight, Star, ChevronLeft, ChevronRight, ShieldAlert, Route, AlertTriangle, Hand, FileText } from 'lucide-react';
import { T as TourFilter } from '../chunks/TourFilter_BNdq5c0l.mjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
/* empty css                                 */
import { N as NewsletterSection } from '../chunks/NewsletterSection_srBEqa-A.mjs';
import { S as ScrollReveal } from '../chunks/ScrollReveal_CEJ16IzC.mjs';
export { renderers } from '../renderers.mjs';

function HeroSearch() {
  const $language = useStore(language);
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const translations = {
    en: {
      activity: "Activity",
      activityPlaceholder: "Find your next thrill...",
      date: "Date",
      people: "People",
      peoplePlaceholder: "Add adventurers",
      search: "Search"
    },
    es: {
      activity: "Actividad",
      activityPlaceholder: "Encuentra tu aventura...",
      date: "Fecha",
      people: "Personas",
      peoplePlaceholder: "Agregar aventureros",
      search: "Buscar"
    }
  };
  const t = translations[$language];
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activity) params.append("q", activity);
    if (date) params.append("date", date);
    if (people) params.append("guests", people);
    window.location.href = `/tours?${params.toString()}`;
  };
  return /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-dark-soft/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-black/20 p-2 md:p-3 flex flex-col md:flex-row items-center gap-1 md:gap-2 ring-1 ring-white/10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "hero-activity", className: "block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors", children: t.activity }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 md:w-5 md:h-5 text-primary/70" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "hero-activity",
            type: "text",
            value: activity,
            onChange: (e) => setActivity(e.target.value),
            placeholder: t.activityPlaceholder,
            className: "w-full bg-transparent border-none outline-none text-sm md:text-base placeholder-gray-500 font-medium text-white"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block w-px h-10 bg-white/10" }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "hero-date", className: "block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors", children: t.date }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 md:w-5 md:h-5 text-primary/70" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "hero-date",
            type: "date",
            value: date,
            onChange: (e) => setDate(e.target.value),
            className: "w-full bg-transparent border-none outline-none text-sm md:text-base font-medium text-white [&::-webkit-calendar-picker-indicator]:hidden"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block w-px h-10 bg-white/10" }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "hero-people", className: "block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors", children: t.people }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 md:w-5 md:h-5 text-primary/70" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "hero-people",
            type: "number",
            min: "1",
            value: people,
            onChange: (e) => setPeople(e.target.value),
            placeholder: t.peoplePlaceholder,
            className: "w-full bg-transparent border-none outline-none text-sm md:text-base placeholder-gray-500 font-medium text-white"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-1 w-full md:w-auto mt-1 md:mt-0", children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "submit",
        "aria-label": t.search,
        className: "bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto md:aspect-square",
        children: [
          /* @__PURE__ */ jsx(Search, { className: "w-6 h-6" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden font-bold", children: t.search })
        ]
      }
    ) })
  ] }) });
}

function HeroSlider() {
  const $language = useStore(language);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video.paused) {
            video.play().catch(() => {
            });
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  const HERO_VIDEO = "/vamos-jaco-tour-home-hero-video.mp4";
  const HERO_POSTER = "/hero-slider-img-vamos-jaco-tours-optimized.jpg";
  const content = {
    en: {
      tagline: "COSTA RICA'S #1 ADVENTURE COMPANY",
      titleLine1: "UNLEASH YOUR",
      titleAccent: "WILD SIDE",
      subtitle: "ATV trails through the jungle • Zipline over the canopy • Surf the Pacific waves",
      cta: "Explore Adventures",
      scrollText: "Scroll to discover"
    },
    es: {
      tagline: "LA #1 EMPRESA DE AVENTURA EN COSTA RICA",
      titleLine1: "LIBERA TU",
      titleAccent: "LADO SALVAJE",
      subtitle: "Senderos ATV por la jungla • Tirolesa sobre el dosel • Surfing en el Pacífico",
      cta: "Explorar Aventuras",
      scrollText: "Desliza para descubrir"
    }
  };
  const t = content[$language];
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full min-h-[100svh] md:h-screen overflow-hidden flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 bg-dark", children: [
      /* @__PURE__ */ jsx(
        "video",
        {
          ref: videoRef,
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          poster: HERO_POSTER,
          className: "w-full h-full object-cover scale-105",
          fetchPriority: "high",
          children: /* @__PURE__ */ jsx("source", { src: HERO_VIDEO, type: "video/mp4" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-dark/50 via-transparent to-dark/50" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-[1] pointer-events-none overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 -left-20 w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/3 -right-20 w-80 h-80 bg-brand-teal/8 rounded-full blur-[100px] animate-pulse", style: { animationDelay: "2s" } }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] animate-pulse", style: { animationDelay: "4s" } })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 md:pt-0 pb-32 md:pb-96 lg:pb-80 xl:pb-48 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 md:mb-8", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm font-bold tracking-[0.2em] text-white/90 uppercase", children: [
        /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }),
        t.tagline
      ] }) }),
      /* @__PURE__ */ jsxs("h1", { className: "mb-6 md:mb-8", children: [
        /* @__PURE__ */ jsx("span", { className: "block text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl leading-[1.1] pb-1", children: t.titleLine1 }),
        /* @__PURE__ */ jsx("span", { className: "block text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter italic drop-shadow-2xl leading-[1.1] pt-1 text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-orange to-brand-yellow animate-gradient-text", children: t.titleAccent })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base md:text-xl text-gray-300 font-medium max-w-3xl mx-auto mb-10 md:mb-12 tracking-wide", children: t.subtitle }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/tours",
          className: "group relative inline-flex items-center gap-3 bg-primary hover:bg-primary text-white text-lg md:text-xl font-bold py-4 px-10 md:py-5 md:px-14 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(220,53,34,0.4)] hover:shadow-[0_0_50px_rgba(220,53,34,0.6)]",
          children: [
            /* @__PURE__ */ jsx(Play, { className: "w-5 h-5 md:w-6 md:h-6 fill-white" }),
            t.cta,
            /* @__PURE__ */ jsx("span", { className: "group-hover:translate-x-1 transition-transform", children: "→" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-20 w-full px-6 flex justify-center pb-24 md:pb-0 md:absolute md:bottom-28 md:left-0 md:right-0", children: /* @__PURE__ */ jsx(HeroSearch, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce", children: [
      /* @__PURE__ */ jsx("span", { className: "text-white/50 text-xs font-medium tracking-wider uppercase hidden md:block", children: t.scrollText }),
      /* @__PURE__ */ jsx(ChevronDown, { className: "w-6 h-6 text-white/50" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-[5]" })
  ] });
}

const FALLBACK_ACTIVITIES = [
  {
    nameEn: "ATV Tours",
    nameEs: "Tours ATV",
    badge: "EXTREME",
    image: "/images/activities/atv-activity-optimized.jpg",
    rotation: "-rotate-6",
    link: "/tours",
    width: 800,
    height: 1422,
    ringColor: "hover:ring-primary/50",
    shadowColor: "hover:shadow-[0_0_30px_rgba(220,53,34,0.2)]",
    badgeColor: "bg-primary/90"
  },
  {
    nameEn: "Zipline",
    nameEs: "Tirolesa",
    badge: "THRILL",
    image: "/images/Zipline/zipline-vamos-jaco-tours-001.jpg",
    rotation: "-rotate-3",
    link: "/tours",
    width: 800,
    height: 769,
    ringColor: "hover:ring-brand-orange/50",
    shadowColor: "hover:shadow-[0_0_30px_rgba(255,152,0,0.2)]",
    badgeColor: "bg-brand-orange/90"
  },
  {
    nameEn: "Surfing",
    nameEs: "Surf",
    badge: "WATER SPORT",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop",
    rotation: "rotate-3",
    link: "/tours",
    width: void 0,
    height: void 0,
    ringColor: "hover:ring-brand-teal/50",
    shadowColor: "hover:shadow-[0_0_30px_rgba(0,150,136,0.2)]",
    badgeColor: "bg-brand-teal/90"
  },
  {
    nameEn: "Sport Fishing",
    nameEs: "Pesca Deportiva",
    badge: "OCEAN",
    image: "/images/activities/sport-fishing.png",
    rotation: "rotate-6",
    link: "/tours",
    width: void 0,
    height: void 0,
    ringColor: "hover:ring-brand-yellow/50",
    shadowColor: "hover:shadow-[0_0_30px_rgba(255,193,7,0.2)]",
    badgeColor: "bg-brand-yellow/90",
    badgeTextDark: true
  }
];
function findTourByCategory(tours, category, titleKeywords) {
  const categoryTours = tours.filter((t) => t.category === category);
  return categoryTours[0];
}
function PopularActivities({ tours = [] }) {
  const $language = useStore(language);
  const content = {
    en: {
      tagline: "WHAT WE OFFER",
      title: "Feel the",
      titleAccent: "Rush"
    },
    es: {
      tagline: "LO QUE OFRECEMOS",
      title: "Siente la",
      titleAccent: "Adrenalina"
    }
  };
  const fallbackContent = content[$language];
  const tagline = fallbackContent.tagline;
  const titleText = fallbackContent.title;
  const titleAccent = fallbackContent.titleAccent;
  const activities = FALLBACK_ACTIVITIES.map((fallback, i) => {
    let tour;
    switch (i) {
      case 0:
        tour = findTourByCategory(tours, "atv") || tours.find((t) => t.slug.includes("atv"));
        break;
      case 1:
        tour = findTourByCategory(tours, "canopy") || tours.find((t) => t.slug.includes("zipline") || t.slug.includes("canopy"));
        break;
      case 2:
        tour = tours.find((t) => t.slug.includes("surf")) || findTourByCategory(tours, "water");
        break;
      case 3:
        tour = tours.find((t) => t.slug.includes("fish") || t.slug.includes("fishing")) || tours.find((t) => t.title.en.toLowerCase().includes("fish"));
        break;
    }
    return {
      name: $language === "en" ? fallback.nameEn : fallback.nameEs,
      badge: fallback.badge,
      image: tour?.image_url || fallback.image,
      rotation: fallback.rotation,
      link: tour ? `/tours/${tour.slug}` : fallback.link,
      width: fallback.width,
      height: fallback.height,
      ringColor: fallback.ringColor,
      shadowColor: fallback.shadowColor,
      badgeColor: fallback.badgeColor,
      badgeTextDark: fallback.badgeTextDark
    };
  });
  const gridRef = useRef(null);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "py-20 md:py-28 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-80 h-80 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10 md:mb-16", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-primary font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-4", children: [
          /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4" }),
          tagline,
          /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter md:tracking-tight", children: [
          titleText,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-brand-orange to-brand-yellow italic animate-gradient-text block md:inline mt-2 md:mt-0", children: titleAccent })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: gridRef, className: "grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px] stagger-children", children: [
        /* @__PURE__ */ jsxs("a", { href: activities[0].link, className: `md:col-span-1 relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 ${activities[0].ringColor} transition-all duration-500 ${activities[0].shadowColor} block`, children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: activities[0].image,
              alt: activities[0].name,
              loading: "lazy",
              decoding: "async",
              width: activities[0].width,
              height: activities[0].height,
              className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full ${activities[0].badgeColor} text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm`, children: activities[0].badge }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-end p-6 md:p-8 pb-8", children: /* @__PURE__ */ jsx("span", { className: `text-white text-3xl font-black drop-shadow-xl transform ${activities[0].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`, children: activities[0].name }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full md:h-full", children: [
          /* @__PURE__ */ jsxs("a", { href: activities[1].link, className: `relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 ${activities[1].ringColor} transition-all duration-500 ${activities[1].shadowColor} block`, children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: activities[1].image,
                alt: activities[1].name,
                loading: "lazy",
                decoding: "async",
                width: activities[1].width,
                height: activities[1].height,
                className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full ${activities[1].badgeColor} text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm`, children: activities[1].badge }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-end p-6 md:p-8 pb-8", children: /* @__PURE__ */ jsx("span", { className: `text-white text-3xl font-black drop-shadow-xl transform ${activities[1].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`, children: activities[1].name }) })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: activities[2].link, className: `relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 ${activities[2].ringColor} transition-all duration-500 ${activities[2].shadowColor} block`, children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: activities[2].image,
                alt: activities[2].name,
                loading: "lazy",
                decoding: "async",
                className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full ${activities[2].badgeColor} text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm`, children: activities[2].badge }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-end p-6 md:p-8 pb-8", children: /* @__PURE__ */ jsx("span", { className: `text-white text-3xl font-black drop-shadow-xl transform ${activities[2].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`, children: activities[2].name }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("a", { href: activities[3].link, className: `md:col-span-1 relative h-[350px] md:h-full rounded-[2rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 ${activities[3].ringColor} transition-all duration-500 ${activities[3].shadowColor} block`, children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: activities[3].image,
              alt: activities[3].name,
              loading: "lazy",
              decoding: "async",
              className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full ${activities[3].badgeColor} ${activities[3].badgeTextDark ? "text-dark" : "text-white"} text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm`, children: activities[3].badge }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-end p-6 md:p-8 pb-8", children: /* @__PURE__ */ jsx("span", { className: `text-white text-3xl font-black drop-shadow-xl transform ${activities[3].rotation} group-hover:scale-110 transition-transform duration-300 leading-none`, children: activities[3].name }) })
        ] })
      ] })
    ] })
  ] });
}

const IconMap = {
  Zap,
  Shield,
  Mountain
};
function ServicesBanner() {
  const $language = useStore(language);
  const t = {
    en: {
      titleBold: "Your Adventure,",
      titleScript: "our expertise.",
      feature1Title: "Instant Adrenaline",
      feature1Desc: "Book your rush in seconds — seamless online booking for every extreme experience.",
      feature2Title: "Best Price Guarantee",
      feature2Desc: "Unbeatable deals on the most thrilling adventures in Costa Rica.",
      feature3Title: "Expert Local Guides",
      feature3Desc: "Certified pros who know every trail, wave, and hidden waterfall.",
      ctaText: "Ready to build your ultimate adventure package?",
      ctaButton: "Build Your Adventure"
    },
    es: {
      titleBold: "Tu Aventura,",
      titleScript: "nuestra experiencia.",
      feature1Title: "Adrenalina Instantánea",
      feature1Desc: "Reserva tu dosis de emoción en segundos — reserva en línea para cada experiencia extrema.",
      feature2Title: "Mejor Precio Garantizado",
      feature2Desc: "Ofertas inmejorables en las aventuras más emocionantes de Costa Rica.",
      feature3Title: "Guías Locales Expertos",
      feature3Desc: "Profesionales certificados que conocen cada sendero, ola y cascada oculta.",
      ctaText: "¿Listo para crear tu paquete de aventura definitivo?",
      ctaButton: "Crea Tu Aventura"
    }
  };
  const fallbackContent = $language === "en" ? t.en : t.es;
  const titleBold = fallbackContent.titleBold;
  const titleScript = fallbackContent.titleScript;
  const ctaText = fallbackContent.ctaText;
  const ctaButton = fallbackContent.ctaButton;
  const features = [
    { title: fallbackContent.feature1Title, description: fallbackContent.feature1Desc, icon: "Zap" },
    { title: fallbackContent.feature2Title, description: fallbackContent.feature2Desc, icon: "Shield" },
    { title: fallbackContent.feature3Title, description: fallbackContent.feature3Desc, icon: "Mountain" }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-24 px-4 relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto bg-dark-soft rounded-[2.5rem] md:rounded-[4rem] px-6 py-12 md:py-20 relative overflow-hidden ring-1 ring-white/10", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/images/jetski-vamos-jaco-tours-005.webp",
        alt: "Extreme adventure",
        className: "w-full h-full object-cover filter contrast-125"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[100px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-teal/5 blur-[80px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 md:mb-20 relative z-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-2", children: titleBold }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl md:text-5xl font-['Inter'] text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-teal/70", children: titleScript })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 mb-16 md:mb-24 px-4 md:px-12", children: features.map((feature, i) => {
      const IconComponent = IconMap[feature.icon] || Zap;
      const bgColors = ["bg-primary", "bg-brand-orange", "bg-brand-teal"];
      const shadowColors = ["shadow-primary/30", "shadow-brand-orange/30", "shadow-brand-teal/30"];
      const bgColor = bgColors[i % bgColors.length];
      const shadowColor = shadowColors[i % shadowColors.length];
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center md:items-start text-center md:text-left gap-4 group", children: [
        /* @__PURE__ */ jsx("div", { className: `w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mb-2 shadow-lg ${shadowColor} group-hover:scale-110 transition-transform duration-300`, children: /* @__PURE__ */ jsx(IconComponent, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: feature.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 leading-relaxed text-sm md:text-base", children: feature.description })
      ] }, i);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-dark/80 backdrop-blur-sm rounded-[2rem] md:rounded-full p-4 md:p-3 shadow-lg ring-1 ring-white/10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4 relative z-10 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "px-2 md:px-6 py-2 text-center md:text-left w-full", children: /* @__PURE__ */ jsx("p", { className: "text-gray-300 font-medium text-sm md:text-base", children: ctaText }) }),
      /* @__PURE__ */ jsxs("a", { href: "/tours", className: "relative inline-flex items-center justify-center px-4 md:px-8 py-4 text-sm md:text-lg font-black text-white uppercase tracking-wider md:tracking-widest bg-gradient-to-r from-primary to-brand-orange hover:shadow-[0_0_25px_rgba(220,53,34,0.4)] transition-all duration-300 hover:scale-105 rounded-full overflow-hidden group w-full md:w-auto shrink-0", children: [
        /* @__PURE__ */ jsx("span", { className: "absolute inset-0 w-full h-full -mt-1 rounded-full opacity-30 shadow-inset" }),
        /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-2 md:gap-3 text-center", children: [
          ctaButton,
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-2 transition-transform duration-300" })
        ] })
      ] })
    ] })
  ] }) });
}

const testimonials = [
  {
    id: 1,
    name: "James Bonde",
    role: "Vamos Jacó Traveler",
    image: "/images/testimonials/testimonial-1.webp",
    quote: "The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael D Linda",
    role: "Vamos Jacó Traveler",
    image: "/images/testimonials/testimonial-2.webp",
    quote: "An absolute dream come true. The zip-lining tour was exhilarating and safely managed. The team at Vamos Jacó knows exactly how to create unforgettable moments.",
    rating: 5
  },
  {
    id: 3,
    name: "Amber Lashley",
    role: "Vamos Jacó Traveler",
    image: "/images/testimonials/testimonial-3.webp",
    quote: "Traveling with kids can be stressful, but Vamos Jacó made it a breeze. They found family-friendly activities that we all enjoyed. We will definitely be coming back!",
    rating: 5
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Solo Traveler",
    image: "/images/testimonials/testimonial-4.webp",
    quote: "As a solo traveler, I felt safe and welcomed. The guides were friendly and very knowledgeable. It was the perfect mix of relaxation and adventure.",
    rating: 5
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Nature Lover",
    image: "/images/testimonials/testimonial-5.webp",
    quote: "The wildlife tours were incredible. Seeing monkeys and sloths in their natural habitat was a highlight. Thank you for an amazing value experience.",
    rating: 5
  }
];
function TestimonialsSection() {
  const $language = useStore(language);
  const displayReviews = testimonials;
  const t = {
    en: {
      title: "Stories of Adrenaline & Wonder",
      subtitle: "Don't just take our word for it. Read the raw, unfiltered experiences of travelers who discovered their wild side with us.",
      avg: "Average Experience",
      reviews: "Reviews"
    },
    es: {
      title: "Historias de Adrenalina y Asombro",
      subtitle: "No confíes solo en nuestra palabra. Lee las experiencias crudas y reales de viajeros que descubrieron su lado salvaje con nosotros.",
      avg: "Experiencia Promedio",
      reviews: "Reseñas"
    }
  };
  const content = $language === "en" ? t.en : t.es;
  return /* @__PURE__ */ jsxs("section", { className: "py-24 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-[0.03] pointer-events-none",
        style: { backgroundImage: "radial-gradient(#444 1px, transparent 1px)", backgroundSize: "30px 30px" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-6", children: content.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 leading-relaxed text-lg", children: content.subtitle })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-20", children: /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Navigation, Autoplay],
          spaceBetween: 24,
          slidesPerView: 1,
          navigation: {
            prevEl: ".testi-prev",
            nextEl: ".testi-next"
          },
          autoplay: { delay: 6e3, disableOnInteraction: false },
          breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          },
          className: "!pb-4",
          children: displayReviews.map((item) => /* @__PURE__ */ jsx(SwiperSlide, { className: "h-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-dark-soft p-8 rounded-[2rem] h-full flex flex-col shadow-sm ring-1 ring-white/10 hover:ring-white/20 transition-all", children: [
            /* @__PURE__ */ jsx("div", { className: "flex gap-0.5 mb-3", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "bg-[#00B67A] p-[2px] rounded-[2px] mr-[1px]", children: /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 text-white fill-current" }) }, i)) }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-white text-sm mb-4", children: content.avg }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-400 leading-relaxed mb-6 flex-grow", children: [
              '"',
              item.quote,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-auto", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full overflow-hidden shrink-0", children: /* @__PURE__ */ jsx("img", { src: item.image, alt: item.name, width: "48", height: "48", loading: "lazy", decoding: "async", className: "w-full h-full object-cover" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-white", children: item.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: item.role })
              ] })
            ] })
          ] }) }, item.id))
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-white", children: "4.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mb-1", children: [
              /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 text-[#00B67A] fill-current" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-white text-sm", children: "Trustpilot" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-0.5", children: [
              [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "bg-[#00B67A] p-[2px] rounded-[1px]", children: /* @__PURE__ */ jsx(Star, { className: "w-2.5 h-2.5 text-white fill-current" }) }, i)),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 ml-1", children: content.reviews })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "testi-prev w-12 h-12 rounded-full bg-dark-soft shadow-soft ring-1 ring-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300",
              "aria-label": $language === "en" ? "Previous testimonial" : "Testimonio anterior",
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "testi-next w-12 h-12 rounded-full bg-dark-soft shadow-soft ring-1 ring-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300",
              "aria-label": $language === "en" ? "Next testimonial" : "Siguiente testimonio",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-white", children: "4.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mb-1", children: [
              /* @__PURE__ */ jsx("div", { className: "w-5 h-5 bg-[#34E0A1] rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-black rounded-full" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-white text-sm", children: "Tripadvisor" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-0.5 items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 mr-1", children: content.reviews }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: `w-2.5 h-2.5 rounded-full ${i === 4 ? "border border-[#34E0A1]" : "bg-[#34E0A1]"}` }, i)) })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

function AtvRulesFaq() {
  const $language = useStore(language);
  const [openIndex, setOpenIndex] = useState(null);
  const rules = [
    {
      icon: /* @__PURE__ */ jsx(ShieldAlert, { className: "w-6 h-6 text-brand-orange" }),
      title: {
        en: "Helmet Policy & Minimum Age",
        es: "Uso de Casco y Edad Mínima"
      },
      content: {
        en: "Wearing a helmet is a must! It is Costa Rica's law. For the ATV tour, only adults 18+ are allowed to drive.",
        es: "Utilizar casco es obligatorio por ley en Costa Rica. Para manejar ATV, solo se permiten adultos mayores de 18 años."
      }
    },
    {
      icon: /* @__PURE__ */ jsx(Route, { className: "w-6 h-6 text-brand-teal" }),
      title: {
        en: "Tour Formation / Route",
        es: "Formación del Recorrido"
      },
      content: {
        en: "Once the tour starts, stay in a single line. Passing other riders is strictly forbidden. The guide always goes in front—please follow all their instructions.",
        es: "Una vez que el tour comience, manténgase en una sola fila. Está prohibido rebasar a otros pasajeros. El guía siempre va al frente—por favor siga todas sus indicaciones."
      }
    },
    {
      icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-6 h-6 text-primary" }),
      title: {
        en: "Safety & Prohibited Maneuvers",
        es: "Seguridad y Maniobras Prohibidas"
      },
      content: {
        en: "Any kind of trick is forbidden (wheelies, power slides, fishtails, & jumps). You must keep a safe distance between vehicles at all times.",
        es: "Prohibido hacer cualquier tipo de truco (derrapes, saltos, levantar la moto). Debe mantener una distancia prudente entre los vehículos en todo momento."
      }
    },
    {
      icon: /* @__PURE__ */ jsx(Hand, { className: "w-6 h-6 text-brand-yellow" }),
      title: {
        en: "Driving Instructions",
        es: "Instrucciones de Manejo"
      },
      content: {
        en: "When stopping, always use both the front and rear brakes. Pay close attention to all instructions on how to operate the vehicle. Do not put your feet on the fenders, as you could break them!",
        es: "Al detenerse, use siempre ambos frenos (delantero y trasero). Preste mucha atención a cómo operar el vehículo. ¡No ponga los pies en los guardabarros, podría quebrarlos!"
      }
    },
    {
      icon: /* @__PURE__ */ jsx(FileText, { className: "w-6 h-6 text-gray-400" }),
      title: {
        en: "Vehicle Responsibility",
        es: "Responsabilidad del Vehículo"
      },
      content: {
        en: "You differ any doubts? Ask! We are pleased to answer them. Remember! You are fully responsible for the vehicle, and any damage occurred will be charged to you.",
        es: "¿Dudas? ¡Pregunte! Con gusto le atenderemos. ¡Recuerde! Usted es totalmente responsable por su vehículo, cualquier daño ocurrido será cargado a su cuenta."
      }
    }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "py-20 bg-dark relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4", children: $language === "en" ? "Important Rules" : "Reglas Importantes" }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4", children: [
          $language === "en" ? "ATV & Buggy" : "Reglas ATV & Buggy",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-primary italic", children: $language === "en" ? "Safety Rules" : "Seguridad" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: $language === "en" ? "Please read these rules carefully before your off-road adventure." : "Por favor lea estas reglas cuidadosamente antes de su aventura todoterreno." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: rules.map((rule, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setOpenIndex(openIndex === idx ? null : idx),
                className: "w-full flex items-center justify-between p-6 text-left focus:outline-none",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-3 bg-dark-soft rounded-xl shadow-inner border border-white/5", children: rule.icon }),
                    /* @__PURE__ */ jsx("h3", { className: "text-white font-bold md:text-lg", children: rule.title[$language] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${openIndex === idx ? "rotate-180 bg-brand-orange/20 text-brand-orange" : "text-gray-400"}`, children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`,
                children: /* @__PURE__ */ jsx("div", { className: "p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 ml-[88px] mr-6", children: rule.content[$language] })
              }
            )
          ]
        },
        idx
      )) })
    ] })
  ] });
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const [toursData, membersData, rawFaqsData, trustBarData] = await Promise.all([
    getAllTours().catch((e) => {
      console.error("Failed to load Tours:", e);
      return [];
    }),
    getTeamMembers().catch((e) => {
      console.error("Failed to load Team Members:", e);
      return null;
    }),
    fetchWPAPI("faq").catch((e) => {
      console.error("Failed to load WP FAQs:", e);
      return null;
    }),
    getWebsiteComponent("trust_bar").catch((e) => {
      console.error("Failed to load Trust Bar:", e);
      return null;
    })
  ]);
  const tours = toursData;
  let teamMembers = [];
  if (membersData && membersData.length > 0) {
    teamMembers = membersData.map((m) => ({
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
  let wpFaqs = [];
  if (rawFaqsData && Array.isArray(rawFaqsData)) {
    wpFaqs = rawFaqsData.map((f) => ({
      question: f.title.rendered,
      answer: f.excerpt.rendered.replace(/<\/?p>/g, "").trim()
    }));
  }
  let trustBarItems = [];
  if (trustBarData && trustBarData.data) {
    trustBarItems = trustBarData.data;
  }
  const seo = {
    title: "Vamos Jac\xF3 Tours | Best Adventure Tours in Costa Rica",
    description: "Book the best adventure tours in Jac\xF3, Costa Rica: ATV, jet ski, surfing, zipline and more. Top-rated local guides and best prices guaranteed. Book your adventure today!",
    keywords: "Jac\xF3 tours, Costa Rica adventures, ATV Jac\xF3, side by side tour Costa Rica, buggy tour Jaco, jet ski Costa Rica, surfing lessons Jac\xF3, flyboard, zipline canopy, adventure tours Costa Rica, things to do in Jac\xF3, Vamos Jac\xF3 Tours"
  };
  const schemas = [
    getOrganizationSchema(),
    getWebsiteSchema(),
    ...wpFaqs.length > 0 ? [getFAQSchema(wpFaqs)] : []
  ].filter(Boolean);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": seo.title, "description": seo.description, "keywords": seo.keywords, "jsonLd": schemas, "preloadImage": "/hero-slider-img-vamos-jaco-tours-optimized.jpg" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSlider", HeroSlider, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/HeroSlider", "client:component-export": "default" })} ${maybeRenderHead()}<main class="py-20 relative min-h-screen">  <div class="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-teal/10 blur-[100px] rounded-full pointer-events-none"></div> <div class="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TrustBar", TrustBar, { "client:visible": true, "items": trustBarItems, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TrustBar", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "PopularActivities", PopularActivities, { "client:visible": true, "tours": tours, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/PopularActivities", "client:component-export": "default" })} ` })} <div class="max-w-7xl mx-auto px-6 py-12"> <div class="flex items-end justify-between mb-16 border-b border-white/10 pb-6"> <div> <span class="text-brand-orange font-bold tracking-widest uppercase mb-2 block">
Best Sellers
</span> <h2 class="text-4xl md:text-5xl font-bold text-white">
Choose Your Next Experience
</h2> </div> <div class="hidden md:block text-right"> <p class="text-gray-400 font-medium">Top Experiences</p> </div> </div>  ${renderComponent($$result2, "TourFilter", TourFilter, { "client:visible": true, "initialTours": tours, "defaultLimit": 6, "hideLoadMore": true, "hideFilter": true, "gridCols": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", "featuredSlugs": [
    "side-by-side-tour",
    "jet-ski-tour",
    "surf-class",
    "flyboard",
    "banana",
    "jaco-atv-adventure"
  ], "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TourFilter", "client:component-export": "default" })} ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "delay": 300, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` <div class="mt-14 text-center"> <a href="/tours" class="inline-flex items-center gap-3 text-white bg-gradient-to-r from-primary to-brand-orange hover:shadow-[0_0_30px_rgba(220,53,34,0.4)] px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 animate-pulse-glow">
View All Adventures <span class="text-xl">→</span> </a> </div> ` })} </div>  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "scale-in", "delay": 100, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "ServicesBanner", ServicesBanner, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ServicesBanner", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-left", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "AboutSection", AboutSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/AboutSection", "client:component-export": "default" })} ` })}   ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "AtvRulesFaq", AtvRulesFaq, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/AtvRulesFaq", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TeamSection", TeamSection, { "client:visible": true, "members": teamMembers, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TeamSection", "client:component-export": "default" })} ` })} ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "scale-in", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TestimonialsSection", TestimonialsSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/TestimonialsSection", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "blur-in", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "FaqSection", FaqSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/FaqSection", "client:component-export": "default" })} ` })}  ${renderComponent($$result2, "ScrollReveal", ScrollReveal, { "client:visible": true, "animation": "fade-up", "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/ScrollReveal", "client:component-export": "default" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "NewsletterSection", NewsletterSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/NewsletterSection", "client:component-export": "default" })} ` })} </main> ` })}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/index.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
