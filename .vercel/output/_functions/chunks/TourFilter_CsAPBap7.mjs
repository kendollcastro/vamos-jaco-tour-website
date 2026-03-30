import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { T as TourCard } from './TourCard_BhMMTNgd.mjs';
import './supabase_oFwH5q6M.mjs';
import { useStore } from '@nanostores/react';
import { l as language } from './Layout_DxykCy69.mjs';
import { clsx } from 'clsx';
import { Search, X, Filter, ChevronRight } from 'lucide-react';

function TourFilter({
  initialTours,
  defaultLimit = 8,
  hideLoadMore = false,
  hideFilter = false,
  featuredSlugs,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  title,
  subtitle
}) {
  const $language = useStore(language);
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(defaultLimit);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, []);
  const categories = [
    { id: "all", label: { en: "All Tours", es: "Todos los Tours" } },
    { id: "atv", label: { en: "ATV & Buggy", es: "ATV y Buggy" } },
    { id: "water", label: { en: "Water Sports", es: "Aventura en el Mar" } },
    { id: "canopy", label: { en: "Canopy & Zip", es: "Canopy y Tirolesa" } },
    { id: "extreme", label: { en: "Extreme", es: "Extremo" } },
    { id: "nature", label: { en: "Nature & Eco", es: "Naturaleza y Eco" } },
    { id: "relax", label: { en: "Relax", es: "Relax" } },
    { id: "combos", label: { en: "Combos", es: "Combos" } }
  ];
  const filteredTours = useMemo(() => {
    let sortedTours = [...initialTours].sort((a, b) => {
      return 0;
    });
    if (activeCategory !== "all") {
      sortedTours = sortedTours.filter((tour) => tour.category === activeCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      sortedTours = sortedTours.filter((tour) => {
        const titleMatch = tour.title?.en?.toLowerCase().includes(query) || tour.title?.es?.toLowerCase().includes(query);
        const locMatch = tour.location?.toLowerCase().includes(query);
        return titleMatch || locMatch;
      });
    }
    if (featuredSlugs && featuredSlugs.length > 0) {
      sortedTours = sortedTours.filter((tour) => featuredSlugs.includes(tour.id) || featuredSlugs.includes(tour.slug || ""));
    }
    return sortedTours;
  }, [initialTours, activeCategory, searchQuery, featuredSlugs]);
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[400px]" });
  }
  const displayedTours = filteredTours.slice(0, displayLimit);
  const hasMore = displayLimit < filteredTours.length;
  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setDisplayLimit(8);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    !hideFilter && /* @__PURE__ */ jsxs("div", { className: "space-y-12 mb-16", children: [
      (title || subtitle) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-6 mb-12", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          subtitle && /* @__PURE__ */ jsx("span", { className: "text-brand-orange font-bold tracking-widest uppercase mb-2 block animate-fade-in", children: $language === "en" ? subtitle.en : subtitle.es }),
          title && /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-6xl font-heading font-black text-white leading-[1.1] tracking-tight", children: $language === "en" ? title.en : title.es })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 md:mt-0 md:text-right animate-fade-in", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-400 font-medium whitespace-nowrap bg-white/5 md:bg-transparent px-4 py-2 rounded-full inline-flex items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-primary font-black text-xl mr-2", children: filteredTours.length }),
          /* @__PURE__ */ jsx("span", { className: "text-sm uppercase tracking-wider", children: $language === "en" ? "Experiences Available" : "Experiencias Disponibles" })
        ] }) }, filteredTours.length)
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-primary to-brand-orange blur-2xl rounded-full opacity-0 group-focus-within:opacity-20 transition-premium -z-10" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-center glass border border-white/10 rounded-full p-2 pr-4 focus-within:border-primary/50 transition-premium shadow-2xl", children: [
          /* @__PURE__ */ jsx("div", { className: "pl-6 pr-4 border-r border-white/5 hidden md:block", children: /* @__PURE__ */ jsx(Search, { className: "w-6 h-6 text-primary animate-pulse-slow" }) }),
          /* @__PURE__ */ jsx("div", { className: "pl-5 pr-3 md:hidden", children: /* @__PURE__ */ jsx(Search, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: $language === "en" ? "Search for tours, activities..." : "Busca tours, actividades...",
              className: "w-full bg-transparent py-4 px-4 text-white text-lg placeholder-gray-500 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            searchQuery && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSearchQuery(""),
                className: "p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all",
                "aria-label": "Clear search",
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsx("button", { className: "bg-primary text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hidden md:block hover:bg-primary-dark transition-premium shadow-lg shadow-primary/20 active:scale-95", children: $language === "en" ? "Search" : "Buscar" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-6 md:justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-px w-8 bg-white/10 hidden md:block" }),
          /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-primary" }),
          /* @__PURE__ */ jsx("span", { children: $language === "en" ? "Filter by Category" : "Filtrar por Categoría" }),
          /* @__PURE__ */ jsx("div", { className: "h-px w-8 bg-white/10 hidden md:block" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none md:hidden" }),
          /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none md:hidden" }),
          /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto pb-4 gap-3 no-scrollbar md:justify-center md:flex-wrap px-4", children: categories.map((cat) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleCategoryChange(cat.id),
              className: clsx(
                "whitespace-nowrap px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-premium border shrink-0",
                activeCategory === cat.id ? "bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-110 active:scale-105" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 active:scale-95"
              ),
              children: $language === "en" ? cat.label.en : cat.label.es
            },
            cat.id
          )) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `grid ${gridCols} gap-6 md:gap-8`, children: displayedTours.map((tour) => /* @__PURE__ */ jsx("div", { className: "h-full animate-fade-in-up", children: /* @__PURE__ */ jsx(
      TourCard,
      {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        price: tour.price,
        image_url: tour.image_url,
        location: tour.location,
        duration: tour.duration,
        badge: tour.badge
      }
    ) }, tour.id)) }),
    filteredTours.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-400", children: /* @__PURE__ */ jsx("p", { children: $language === "en" ? "No tours found in this category." : "No se encontraron tours en esta categoría." }) }),
    hasMore && !hideLoadMore && /* @__PURE__ */ jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setDisplayLimit((prev) => prev + 8),
        className: "inline-flex items-center gap-3 px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 hover:border-primary/50 transition-premium shadow-xl active:scale-95",
        children: [
          $language === "en" ? "Explore More Tours" : "Explorar Más Tours",
          /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-primary" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("style", { children: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            ` })
  ] });
}

export { TourFilter as T };
