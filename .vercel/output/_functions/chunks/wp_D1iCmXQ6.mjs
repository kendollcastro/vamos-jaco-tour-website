import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Play, ShieldAlert, Globe, Flame, Trophy, X, ChevronLeft, ChevronRight, Linkedin, Twitter, Instagram, Lock, Star, UserCheck, FileCheck, ShieldCheck, Award, Compass, Heart, Shield, Map, Plane, ChevronDown } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { l as language } from './Layout_DxykCy69.mjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
/* empty css                         */
import clsx from 'clsx';

function AnimatedCounter({
  end,
  suffix = "",
  duration = 2e3,
  className = ""
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    let animationFrame;
    const easeOutExpo = (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      setCount(Math.floor(end * easeOutExpo(percentage)));
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);
  return /* @__PURE__ */ jsxs("span", { ref, className, children: [
    count,
    suffix
  ] });
}

const StatItem = ({ stat }) => {
  const numericValue = parseInt(stat.value.replace(/\D/g, ""));
  const suffix = stat.value.replace(/[0-9]/g, "");
  return /* @__PURE__ */ jsxs("div", { className: "relative bg-[#0d0d0d] p-6 lg:p-8 rounded-3xl border border-white/10 group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]", style: { borderColor: stat.hexColor || "#ff3b3b" }, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent bg-opacity-0 rounded-3xl group-hover:opacity-100 transition-opacity" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-4", children: /* @__PURE__ */ jsx(stat.icon, { className: "w-8 h-8 opacity-80", style: { color: stat.hexColor || "#fff" } }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-4xl font-black text-white italic tracking-tighter drop-shadow-lg", children: /* @__PURE__ */ jsx(AnimatedCounter, { end: numericValue, suffix }) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-2", children: stat.label })
      ] })
    ] })
  ] });
};
function AboutSection() {
  const $language = useStore(language);
  const [showVideoModal, setShowVideoModal] = useState(false);
  useEffect(() => {
    if (showVideoModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showVideoModal]);
  const t = {
    en: {
      subtitle: "Unleash the Adventure",
      title: "THE WILD SIDE OF COSTA RICA",
      description: "Vamos Jacó isn't just a travel agency; we are your adrenaline dealers. We craft raw, heart-pounding adventures and unforgettable extreme experiences. Drop the boring tours and buckle up for the ride of your life.",
      cta: "CHOOSE YOUR ADVENTURE",
      stats: [
        { value: "2k+", label: "Adventures Survived", icon: ShieldAlert, color: "bg-brand-yellow", hexColor: "#ffca28" },
        { value: "50+", label: "Extreme Routes", icon: Globe, color: "bg-brand-orange", hexColor: "#ff7b00" },
        { value: "12k+", label: "Adrenaline Junkies", icon: Flame, color: "bg-primary", hexColor: "#dc3522" },
        { value: "98%", label: "Epic Ratings", icon: Trophy, color: "bg-brand-teal", hexColor: "#00b4d8" }
      ]
    },
    es: {
      subtitle: "Desata la Aventura",
      title: "EL LADO SALVAJE DE COSTA RICA",
      description: "Vamos Jacó no es una simple agencia de viajes; somos tus proveedores de adrenalina. Diseñamos aventuras crudas y emocionantes. Deja de lado los tours aburridos y prepárate para la experiencia de tu vida.",
      cta: "ELIGE TU AVENTURA",
      stats: [
        { value: "2k+", label: "Aventuras Superadas", icon: ShieldAlert, color: "bg-brand-yellow", hexColor: "#ffca28" },
        { value: "50+", label: "Rutas Extremas", icon: Globe, color: "bg-brand-orange", hexColor: "#ff7b00" },
        { value: "12k+", label: "Adictos a la Adrenalina", icon: Flame, color: "bg-primary", hexColor: "#dc3522" },
        { value: "98%", label: "Calificaciones Épicas", icon: Trophy, color: "bg-brand-teal", hexColor: "#00b4d8" }
      ]
    }
  };
  const content = $language === "en" ? t.en : t.es;
  return /* @__PURE__ */ jsxs("section", { className: "py-32 relative bg-dark overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-30 pointer-events-none", style: { backgroundImage: "radial-gradient(circle at 50% 50%, #dc3522 0%, transparent 60%)", filter: "blur(100px)" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] pointer-events-none select-none flex", children: /* @__PURE__ */ jsx("span", { className: "text-[12rem] md:text-[15rem] font-black italic uppercase tracking-tighter text-white", children: "EXTREME VAMOS JACÓ EXTREME VAMOS JACÓ" }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-2 bg-primary mb-8 rounded-full" }),
          /* @__PURE__ */ jsxs("h2", { className: "text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] uppercase italic tracking-tighter drop-shadow-2xl", children: [
            "Vamos Jacó ",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-orange drop-shadow-[0_0_30px_rgba(220,53,34,0.6)] inline-block px-6 -mx-6", children: "#1" }),
            " AGENCY"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-10 block", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-black uppercase tracking-widest text-brand-teal block mb-4", children: content.subtitle }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-bold text-white mb-6 uppercase", children: content.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed text-lg lg:text-xl font-medium border-l-4 border-white/20 pl-6", children: content.description })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "/tours", className: "relative inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-black text-white uppercase tracking-widest bg-gradient-to-r from-primary to-brand-orange hover:shadow-[0_0_25px_rgba(220,53,34,0.4)] transition-all duration-300 hover:scale-105 rounded-full overflow-hidden group", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute inset-0 w-full h-full -mt-1 rounded-full opacity-30 shadow-inset" }),
            /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-3", children: [
              content.cta,
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0" }),
          /* @__PURE__ */ jsxs("div", { className: "relative h-[450px] md:h-[600px] w-full z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter grayscale hover:grayscale-0 transition-all duration-700", children: [
            /* @__PURE__ */ jsx(
              "video",
              {
                src: "/vamos-jaco-tour-home-hero-video.mp4",
                autoPlay: true,
                muted: true,
                loop: true,
                playsInline: true,
                className: "w-full h-full object-cover"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-30", style: { backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)", backgroundSize: "15px 15px" } }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowVideoModal(true),
                "aria-label": $language === "en" ? "Play video" : "Ver video",
                className: "pointer-events-auto relative flex items-center justify-center w-24 h-24 rounded-full bg-black/60 backdrop-blur-md border-2 border-white text-white hover:bg-primary hover:border-primary transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                children: [
                  /* @__PURE__ */ jsx(Play, { className: "w-10 h-10 fill-current ml-2 group-hover:scale-110 transition-transform" }),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:animate-ping" })
                ]
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: content.stats.map((stat, index) => /* @__PURE__ */ jsx(StatItem, { stat }, index)) })
    ] }),
    showVideoModal && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8",
        onClick: () => setShowVideoModal(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] ring-1 ring-white/20 relative z-10",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowVideoModal(false),
                  className: "absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/40 hover:bg-black/80 rounded-full p-2.5 z-50 flex items-center justify-center backdrop-blur-md group",
                  title: "Close Video",
                  children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 group-hover:scale-110 transition-transform" })
                }
              ),
              /* @__PURE__ */ jsx(
                "video",
                {
                  src: "/vamos-jaco-tour-home-hero-video.mp4",
                  autoPlay: true,
                  controls: true,
                  className: "w-full h-full object-contain"
                }
              )
            ]
          }
        )
      }
    )
  ] });
}

const fallbackTeamMembers = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    position_en: "CEO & Founder",
    position_es: "CEO y Fundador",
    position: "CEO & Founder",
    image: "/images/team/carlos-rodriguez.png",
    social: { instagram: "https://www.instagram.com/vamosjacotours" }
  },
  {
    id: 2,
    name: "María Fernández",
    position_en: "Tour Operations Manager",
    position_es: "Gerente de Operaciones",
    position: "Tour Operations Manager",
    image: "/images/team/maria-fernandez.png",
    social: { instagram: "https://www.instagram.com/vamosjacotours" }
  },
  {
    id: 3,
    name: "José Herrera",
    position_en: "Lead Adventure Guide",
    position_es: "Guía de Aventura Principal",
    position: "Lead Adventure Guide",
    image: "/images/team/jose-herrera.png",
    social: { instagram: "https://www.instagram.com/vamosjacotours" }
  },
  {
    id: 4,
    name: "Andrea Mora",
    position_en: "Customer Experience",
    position_es: "Experiencia del Cliente",
    position: "Customer Experience",
    image: "/images/team/andrea-mora.png",
    social: { instagram: "https://www.instagram.com/vamosjacotours" }
  }
];
function TeamSection({ members }) {
  const $language = useStore(language);
  const displayMembers = members && members.length > 0 ? members : fallbackTeamMembers;
  const t = {
    en: {
      tagline: "Our Guides",
      title: "Meet our team",
      description: "Dedicated professionals passionate about sharing the best of Costa Rica with you."
    },
    es: {
      tagline: "Nuestros Guías",
      title: "Conoce al equipo",
      description: "Profesionales dedicados y apasionados por compartir lo mejor de Costa Rica contigo."
    }
  };
  const content = $language === "en" ? t.en : t.es;
  return /* @__PURE__ */ jsx("section", { className: "py-24 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 md:px-12 lg:px-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-end justify-between mb-12 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
        /* @__PURE__ */ jsx("span", { className: "text-primary font-bold uppercase tracking-wider text-sm block mb-2", children: content.tagline }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: content.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg", children: content.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "swiper-button-prev-custom w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300",
            "aria-label": $language === "en" ? "Previous slide" : "Diapositiva anterior",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "swiper-button-next-custom w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300",
            "aria-label": $language === "en" ? "Next slide" : "Siguiente diapositiva",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Navigation, Pagination, Autoplay],
          spaceBetween: 24,
          slidesPerView: 1,
          navigation: {
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom"
          },
          pagination: {
            clickable: true,
            el: ".swiper-pagination-custom",
            renderBullet: function(index, className) {
              return '<span class="' + className + ' ring-1 ring-white/50"></span>';
            }
          },
          autoplay: { delay: 5e3, disableOnInteraction: false },
          breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3.5 }
            // Peeking effect
          },
          className: "!pb-16",
          children: displayMembers.map((member) => {
            const displayPosition = $language === "en" ? member.position_en || member.position : member.position_es || member.position;
            return /* @__PURE__ */ jsx(SwiperSlide, { className: "h-auto", children: /* @__PURE__ */ jsxs("div", { className: "group relative h-[400px] rounded-[2rem] overflow-hidden shadow-soft cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: member.image,
                  alt: member.name,
                  loading: "lazy",
                  decoding: "async",
                  className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
              /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 right-4 bg-dark-soft/90 backdrop-blur-md p-6 rounded-[1.5rem] shadow-lg ring-1 ring-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-1", children: member.name }),
                /* @__PURE__ */ jsx("p", { className: "text-primary font-medium text-sm mb-3", children: displayPosition }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-gray-400", children: [
                  member.social?.linkedin && /* @__PURE__ */ jsx(Linkedin, { className: "w-4 h-4 hover:text-primary transition-colors hover:scale-110" }),
                  member.social?.twitter && /* @__PURE__ */ jsx(Twitter, { className: "w-4 h-4 hover:text-brand-teal transition-colors hover:scale-110" }),
                  member.social?.instagram && /* @__PURE__ */ jsx(Instagram, { className: "w-4 h-4 hover:text-brand-orange transition-colors hover:scale-110" })
                ] })
              ] })
            ] }) }, member.id);
          })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "swiper-pagination-custom flex justify-center gap-2 mt-4 md:hidden" })
    ] })
  ] }) });
}

const IconMap = {
  Plane,
  Map,
  Shield,
  Heart,
  Globe,
  Compass,
  Award,
  ShieldCheck,
  FileCheck,
  UserCheck,
  Star,
  Lock
};
function TrustBar({ items }) {
  const $language = useStore(language);
  const partners = items && items.length > 0 ? items.map((item, i) => ({
    id: item.id || i,
    name: $language === "es" ? item.name_es || item.name : item.name,
    icon: item.icon && IconMap[item.icon] ? IconMap[item.icon] : Shield,
    color: item.color || "text-primary",
    image: item.image || null
  })) : [];
  if (partners.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("section", { className: "py-12 border-b border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-center text-gray-400 font-medium tracking-wide text-sm mb-8 px-4 leading-relaxed max-w-3xl mx-auto", children: $language === "en" ? "YOUR SAFETY IS OUR PRIORITY. WE OPERATE WITH ALL REQUIRED PERMITS, INSURANCE, AND RISK POLICIES IN COSTA RICA." : "TU SEGURIDAD ES NUESTRA PRIORIDAD. OPERAMOS CON TODOS LOS PERMISOS, SEGUROS Y PÓLIZAS DE RIESGO DE LEY EN COSTA RICA." }),
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay],
        spaceBetween: 30,
        slidesPerView: 2,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        breakpoints: {
          640: {
            slidesPerView: 3
          },
          768: {
            slidesPerView: 4
          },
          1024: {
            slidesPerView: 5
          }
        },
        className: "w-full",
        children: partners.map((partner) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default group py-4 text-center", children: [
          partner.image ? /* @__PURE__ */ jsx("img", { src: partner.image, alt: partner.name, className: "h-10 md:h-12 w-auto object-contain group-hover:scale-110 transition-transform" }) : /* @__PURE__ */ jsx(partner.icon, { className: `w-10 h-10 md:w-12 md:h-12 ${partner.color} group-hover:scale-110 transition-transform`, strokeWidth: 1.5 }),
          /* @__PURE__ */ jsx("span", { className: "text-sm md:text-base font-bold text-gray-300 group-hover:text-white leading-tight", children: partner.name })
        ] }) }, partner.id))
      }
    )
  ] }) });
}

const faqs = {
  en: [
    {
      question: "How far in advance should I book my tour?",
      answer: "We recommend booking at least 2-3 days in advance, especially during the high season (December to April) to ensure availability for your preferred dates."
    },
    {
      question: "Is round-trip transportation included?",
      answer: "Yes! Many of our tours include free round-trip transportation from hotels and rentals within the Jaco and Herradura areas. Please check the specific details of your chosen tour."
    },
    {
      question: "Are the tours suitable for children?",
      answer: "Most tours are family-friendly. For example, the Crocodile Safari and Banana Boat have very low minimum ages. However, ATV and Jet Ski driving is strictly for adults (18+)."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We offer a full refund for cancellations made at least 48 hours prior to the tour start time. Cancellations within 48 hours are non-refundable. Please note that deposit refunds take approximately 24 hours to process due to bank policies."
    },
    {
      question: "Do I need prior experience for the ATV or Jet Ski tours?",
      answer: "No prior experience is necessary. Our professional guides provide a full safety briefing and operational instructions before every tour begins."
    },
    {
      question: "What should I bring to the tours?",
      answer: "It depends on the tour, but generally we highly recommend sunscreen, insect repellent, comfortable clothes, closed-toe shoes (for ATV/Zipline), and a swimsuit/towel for water tours."
    },
    {
      question: "Do tours operate if it rains?",
      answer: "Yes, we operate rain or shine. In fact, ATV and Rafting tours are even more fun in the rain! We only cancel in case of extreme weather conditions that compromise safety."
    },
    {
      question: "Do you offer options for large groups or corporate events?",
      answer: "Absolutely! We can organize unforgettable experiences for groups, weddings, or corporate events. Contact us directly for special rates and custom packages."
    }
  ],
  es: [
    {
      question: "¿Con cuánta anticipación debo reservar mi tour?",
      answer: "Recomendamos reservar con al menos 2 o 3 días de anticipación, especialmente durante la temporada alta (diciembre a abril) para asegurar su lugar."
    },
    {
      question: "¿Está incluido el transporte de ida y vuelta?",
      answer: "¡Sí! Muchos de nuestros tours incluyen transporte gratuito desde hoteles en Jacó y Herradura. Por favor revise los detalles específicos del tour elegido."
    },
    {
      question: "¿Los tours son aptos para niños?",
      answer: "La mayoría son ideales para familias, como el Safari de Cocodrilos o Banana Boat. Sin embargo, manejar ATV y Jet Ski es estrictamente para adultos (18+)."
    },
    {
      question: "¿Cuál es su política de cancelación?",
      answer: "Ofrecemos reembolso completo para cancelaciones realizadas al menos 48 horas antes del inicio del tour. Cancelaciones en menos de 48 horas no son reembolsables. Tome en cuenta que el reembolso del depósito tiene una duración de 24 horas después del trámite por políticas bancarias."
    },
    {
      question: "¿Necesito experiencia previa para los ATV o Jet Ski?",
      answer: "No se requiere experiencia previa. Nuestros guías profesionales brindan una sesión completa de seguridad y manejo antes de iniciar cada recorrido."
    },
    {
      question: "¿Qué debo llevar a los tours?",
      answer: "Depende del tour, pero en general recomendamos: protector solar, repelente de insectos, ropa cómoda, zapatos cerrados (para ATV/Zipline) y traje de baño/toalla para tours acuáticos."
    },
    {
      question: "¿Los tours se realizan si llueve?",
      answer: "Sí, operamos bajo lluvia o sol. De hecho, ¡los tours de ATV y Rafting son aún más divertidos con lluvia! Solo cancelamos en caso de condiciones climáticas extremas que comprometan la seguridad."
    },
    {
      question: "¿Ofrecen opciones para grupos grandes o eventos corporativos?",
      answer: "¡Por supuesto! Podemos organizar experiencias inolvidables para grupos, bodas o eventos corporativos. Contáctenos directamente para tarifas y paquetes especiales."
    }
  ]
};
function FaqSection({ faqs: wpFaqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  const $language = useStore(language);
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const t = {
    en: {
      bannerTitle: "Need Answers?",
      bannerSubtitle: "Frequently Asked Questions",
      title: "Questions & Answers",
      subtitle: "We're committed to offering more than just tours—we provide secure, exceptional experiences."
    },
    es: {
      bannerTitle: "¿Dudas?",
      bannerSubtitle: "Preguntas Frecuentes",
      title: "Preguntas y Respuestas",
      subtitle: "Estamos comprometidos a ofrecer más que tours: brindamos experiencias seguras y excepcionales."
    }
  };
  const fallbackContent = $language === "en" ? t.en : t.es;
  const bannerTitle = fallbackContent.bannerTitle;
  const bannerSubtitle = fallbackContent.bannerSubtitle;
  const title = fallbackContent.title;
  const subtitle = fallbackContent.subtitle;
  const currentLanguageFaqs = $language === "en" ? faqs.en : faqs.es;
  const faqsToDisplay = wpFaqs && wpFaqs.length > 0 ? wpFaqs : currentLanguageFaqs;
  return /* @__PURE__ */ jsxs("section", { className: "relative pb-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-[400px] md:h-[500px] w-full overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/40 to-dark/90 z-10" }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/images/Sidebyside/sidebyside-vamos-jaco-tours-001.webp",
          alt: "Adventure Background",
          className: "w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white pb-32", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-['Inter'] text-5xl md:text-7xl mb-2 drop-shadow-lg", children: bannerTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base font-bold uppercase tracking-widest opacity-90 mb-6", children: bannerSubtitle })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-6 relative z-30 -mt-32 md:-mt-40", children: /* @__PURE__ */ jsxs("div", { className: "bg-dark-soft rounded-[2rem] shadow-xl p-8 md:p-12 ring-1 ring-white/10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-white mb-4", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 max-w-xl mx-auto text-sm md:text-base", children: subtitle })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: faqsToDisplay.map((faq, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: clsx(
            "border transition-all duration-300 rounded-2xl overflow-hidden",
            openIndex === index ? "border-primary/20 bg-white/5 shadow-sm" : "border-white/10 bg-dark"
          ),
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => toggleFaq(index),
                className: "w-full flex items-center justify-between p-6 text-left",
                children: [
                  /* @__PURE__ */ jsx("span", { className: clsx(
                    "font-bold text-sm md:text-base transition-colors",
                    openIndex === index ? "text-primary" : "text-white"
                  ), children: faq.question }),
                  /* @__PURE__ */ jsx("div", { className: clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center bg-white/10 text-gray-400 transition-all duration-300",
                    openIndex === index ? "bg-primary text-white rotate-180" : ""
                  ), children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: clsx(
                  "px-6 transition-all duration-300 ease-in-out overflow-hidden",
                  openIndex === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                ),
                children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm leading-relaxed", children: faq.answer })
              }
            )
          ]
        },
        index
      )) })
    ] }) })
  ] });
}

const WP_URL = "https://api.vamosjacotours.com/wp-json";
async function fetchWPAPI(endpoint) {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/${endpoint}`);
    if (!res.ok) {
      console.error(`Error fetching WP API [${endpoint}]:`, res.statusText);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Fetch exception WP API [${endpoint}]:`, error);
    return null;
  }
}

export { AboutSection as A, FaqSection as F, TeamSection as T, TrustBar as a, fetchWPAPI as f };
