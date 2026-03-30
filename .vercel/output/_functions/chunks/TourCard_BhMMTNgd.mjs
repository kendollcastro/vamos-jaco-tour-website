import { s as supabase } from './supabase_oFwH5q6M.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import React from 'react';
import { useStore } from '@nanostores/react';
import { l as language } from './Layout_DxykCy69.mjs';
import { MapPin, Clock, ArrowUpRight, Info, CircleCheck } from 'lucide-react';
import { clsx } from 'clsx';

function mapRowToTour(row) {
  const validCategories = ["atv", "water", "nature", "extreme", "relax"];
  const category = validCategories.includes(row.category) ? row.category : "nature";
  return {
    id: row.id,
    slug: row.slug,
    title: { en: row.name_en, es: row.name_es },
    price: Number(row.price_base),
    originalPrice: row.original_price ? Number(row.original_price) : void 0,
    image_url: row.image_url || "",
    location: row.location,
    duration: row.duration,
    description: { en: row.description_en, es: row.description_es },
    badge: row.badge_text ? { text: row.badge_text, color: row.badge_color || "yellow" } : void 0,
    pricing_options: Array.isArray(row.pricing_options) ? row.pricing_options : [],
    category,
    highlights: { en: row.highlights_en || [], es: row.highlights_es || [] },
    includes: { en: row.includes_en || [], es: row.includes_es || [] },
    gallery: row.gallery || []
  };
}
async function getAllToursFromSupabase() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("tours").select("id, slug, name_en, name_es, price_base, original_price, image_url, location, duration, category, badge_text, badge_color, is_active, created_at").eq("is_active", true).order("created_at", { ascending: true });
  if (error) {
    console.error("Supabase getAllTours error:", error.message);
    return [];
  }
  return data.map(mapRowToTour);
}
async function getTourBySlug(slug) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).single();
  if (error || !data) {
    console.error("Supabase getTourBySlug error:", error?.message);
    return null;
  }
  return mapRowToTour(data);
}

const tours = [];
async function getAllTours() {
  let supabaseTours = [];
  try {
    supabaseTours = await getAllToursFromSupabase();
    if (supabaseTours.length > 0) {
      console.log(`✅ Loaded ${supabaseTours.length} tours from Supabase`);
    }
  } catch (e) {
    console.warn("Supabase not available, using fallback...", e);
  }
  return supabaseTours;
}
async function getTourById(idOrSlug) {
  try {
    const sbTour = await getTourBySlug(idOrSlug);
    if (sbTour) return sbTour;
  } catch (e) {
    console.warn("Supabase not available for getTourById:", e);
  }
  return tours.find((t) => t.id === idOrSlug);
}

function TourCard({ id, slug, title, price, originalPrice, image_url, location, duration, badge }) {
  const $language = useStore(language);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const getText = (content) => {
    if (!mounted) return typeof content === "string" ? content : content.en;
    if (typeof content === "string") return content;
    return content[$language] || content.en;
  };
  const currentTitle = getText(title);
  const bookText = $language === "en" ? "Book Now" : "Reservar";
  const startingFromText = $language === "en" ? "Starting From" : "Desde";
  const experienceText = $language === "en" ? "Experience" : "Experiencia";
  const inclusionText = $language === "en" ? "Inclusion" : "Incluye";
  const getBadgeColor = (color) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-400 text-gray-900";
      case "red":
        return "bg-red-500 text-white";
      case "green":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  const CardWrapper = ({ children }) => {
    return /* @__PURE__ */ jsx("a", { href: `/tours/${slug}`, className: "block h-full", children });
  };
  return /* @__PURE__ */ jsx(CardWrapper, { children: /* @__PURE__ */ jsxs("div", { className: "group bg-dark-soft rounded-[25px] overflow-hidden shadow-premium hover:shadow-2xl hover:scale-[1.02] transition-premium h-full flex flex-col border border-white/5 hover:border-primary/30 relative", children: [
    /* @__PURE__ */ jsx("div", { className: "relative h-52 md:h-64 overflow-hidden p-2 md:p-3 pb-0", children: /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full rounded-[15px] overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: image_url,
          alt: currentTitle,
          loading: "lazy",
          decoding: "async",
          className: "w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        }
      ),
      badge && /* @__PURE__ */ jsx("div", { className: clsx(
        "absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide z-10",
        getBadgeColor(badge.color)
      ), children: badge.text })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 flex flex-col flex-grow", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-heading font-bold text-white mb-2 line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors", children: currentTitle }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-gray-400 text-xs mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-primary" }),
          /* @__PURE__ */ jsx("span", { children: location })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-gray-600 rounded-full" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-primary" }),
          /* @__PURE__ */ jsx("span", { children: duration })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-4 mt-auto", children: [
        /* @__PURE__ */ jsxs("button", { className: "bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-premium shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-95", children: [
          bookText,
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-0.5", children: startingFromText }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            originalPrice && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 line-through decoration-gray-400", children: [
              "$",
              originalPrice.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-2xl font-heading font-black text-white", children: [
              "$",
              price.toFixed(2)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-white/10 pt-4 mt-2 flex items-center gap-5", children: [
        /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-premium uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-3.5 h-3.5" }),
          experienceText
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-premium uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
          inclusionText
        ] })
      ] })
    ] })
  ] }) });
}

export { TourCard as T, getAllTours as a, getTourById as g };
