import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_oFwH5q6M.mjs';
import { A as AddBookingModal } from './AddBookingModal_CtW3i-ML.mjs';

const DEMO_DATA = [
  { label: "Wed", revenue: 420, count: 3 },
  { label: "Thu", revenue: 180, count: 1 },
  { label: "Fri", revenue: 650, count: 4 },
  { label: "Sat", revenue: 890, count: 6 },
  { label: "Sun", revenue: 720, count: 5 },
  { label: "Mon", revenue: 340, count: 2 },
  { label: "Tue", revenue: 510, count: 3 }
];
function SalesChart({ onToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchWeeklyData();
  }, []);
  async function fetchWeeklyData() {
    setLoading(true);
    if (!supabase) {
      setData(DEMO_DATA);
      setLoading(false);
      return;
    }
    const days = [];
    const today = /* @__PURE__ */ new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = date.toLocaleDateString("en", { weekday: "short" });
      try {
        const { data: bookings } = await supabase.from("bookings").select("total_amount").gte("created_at", `${dateStr}T00:00:00`).lte("created_at", `${dateStr}T23:59:59`).eq("status", "confirmed");
        const revenue = (bookings || []).reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
        days.push({ label: dayLabel, revenue, count: bookings?.length || 0 });
      } catch {
        days.push({ label: dayLabel, revenue: 0, count: 0 });
      }
    }
    setData(days);
    setLoading(false);
  }
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100);
  const getSvgPath = () => {
    if (data.length === 0) return "";
    const w = 100;
    const h = 100;
    const pts = data.map((d, i) => [
      i / (data.length - 1) * w,
      h - d.revenue / maxRevenue * h
    ]);
    let path = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx1 = pts[i][0] + (pts[i + 1][0] - pts[i][0]) / 2.5;
      const cy1 = pts[i][1];
      const cx2 = pts[i + 1][0] - (pts[i + 1][0] - pts[i][0]) / 2.5;
      const cy2 = pts[i + 1][1];
      path += ` C ${cx1},${cy1} ${cx2},${cy2} ${pts[i + 1][0]},${pts[i + 1][1]}`;
    }
    return path;
  };
  const getGradientPath = () => {
    if (data.length === 0) return "";
    const w = 100;
    const h = 100;
    const line = getSvgPath();
    return `${line} L ${w},${h} L 0,${h} Z`;
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 p-6 animate-pulse shadow-sm transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 dark:bg-white/10 rounded w-40 mb-6" }),
      /* @__PURE__ */ jsx("div", { className: "flex items-end gap-3 h-40", children: [1, 2, 3, 4, 5, 6, 7].map((i) => /* @__PURE__ */ jsx("div", { className: "flex-1 bg-gray-100 dark:bg-white/5 rounded-lg", style: { height: `${20 + Math.random() * 80}%` } }, i)) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-lg", children: "Revenue Trends" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs mt-1", children: "Weekly overview of sales performance" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex p-1 bg-gray-100 dark:bg-black/20 rounded-xl max-w-fit border border-gray-200 dark:border-white/5", children: [
        /* @__PURE__ */ jsx("button", { className: "px-4 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-dark shadow-sm text-gray-900 dark:text-white transition-colors", children: "Week" }),
        /* @__PURE__ */ jsx("button", { onClick: () => onToast ? onToast("Monthly charting requires Pro Analytics.") : alert("Pro Add-on Required"), className: "px-4 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors", children: "Month" }),
        /* @__PURE__ */ jsx("button", { onClick: () => onToast ? onToast("Yearly charting requires Pro Analytics.") : alert("Pro Add-on Required"), className: "px-4 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors", children: "Year" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[220px]", children: [
      /* @__PURE__ */ jsxs("svg", { className: "w-full h-full overflow-visible", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "gradientRed", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#D92818", stopOpacity: "0.4" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#D92818", stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: getGradientPath(),
            fill: "url(#gradientRed)",
            className: "transition-all duration-700 ease-in-out"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: getSvgPath(),
            fill: "none",
            stroke: "#D92818",
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            className: "transition-all duration-700 ease-in-out drop-shadow-[0_2px_4px_rgba(217,40,24,0.3)]"
          }
        ),
        data.map((day, i) => {
          const x = i / (data.length - 1) * 100;
          const y = 100 - day.revenue / maxRevenue * 100;
          return /* @__PURE__ */ jsx(
            "circle",
            {
              cx: x,
              cy: y,
              r: "1.5",
              fill: "#fff",
              stroke: "#D92818",
              strokeWidth: "0.8",
              vectorEffect: "non-scaling-stroke"
            },
            i
          );
        })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-6 left-0 right-0 flex justify-between", children: data.map((day, i) => /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 font-medium uppercase tracking-wider", children: day.label }, i)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-6" })
  ] });
}

const DEMO_BOOKINGS = [
  { id: "1", customer_name: "Sarah Johnson", tour_name: "ATV Mountain Adventure", total_amount: 180, status: "confirmed", created_at: (/* @__PURE__ */ new Date()).toISOString() },
  { id: "2", customer_name: "Mike Chen", tour_name: "Jet Ski Ocean Thrill", total_amount: 240, status: "pending", created_at: (/* @__PURE__ */ new Date()).toISOString() },
  { id: "3", customer_name: "Ana García", tour_name: "Side by Side Buggy Tour", total_amount: 300, status: "confirmed", created_at: new Date(Date.now() - 864e5).toISOString() },
  { id: "4", customer_name: "James Wilson", tour_name: "Surf Lessons", total_amount: 70, status: "pending", created_at: new Date(Date.now() - 864e5).toISOString() },
  { id: "5", customer_name: "Laura Rodríguez", tour_name: "Flyboard Experience", total_amount: 150, status: "cancelled", created_at: new Date(Date.now() - 1728e5).toISOString() }
];
function DashboardStats({ onNavigate, onToast }) {
  const [stats, setStats] = useState({
    todayBookings: 0,
    todayRevenue: 0,
    pendingCount: 0,
    confirmedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentTours, setRecentTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDemo = !supabase;
  useEffect(() => {
    fetchStats();
  }, []);
  async function fetchStats() {
    setLoading(true);
    if (!supabase) {
      setStats({ todayBookings: 3, todayRevenue: 720, pendingCount: 2, confirmedCount: 5 });
      setRecentBookings(DEMO_BOOKINGS);
      setRecentTours([]);
      setLoading(false);
      return;
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    try {
      const { data: todayData } = await supabase.from("bookings").select("*").gte("created_at", `${today}T00:00:00`).lte("created_at", `${today}T23:59:59`);
      const todayBookings = todayData || [];
      const todayRevenue = todayBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
      const { count: pendingCount } = await supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending");
      const { count: confirmedCount } = await supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed");
      setStats({
        todayBookings: todayBookings.length,
        todayRevenue,
        pendingCount: pendingCount || 0,
        confirmedCount: confirmedCount || 0
      });
      const { data: recent } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5);
      setRecentBookings(recent || []);
      const { data: tours } = await supabase.from("tours").select("*").order("created_at", { ascending: false }).limit(2);
      setRecentTours(tours || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
    setLoading(false);
  }
  const statCards = [
    {
      label: "Today's Bookings",
      value: stats.todayBookings,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-[#1A1F2C]",
      percentage: "+15%"
    },
    {
      label: "Total Revenue",
      value: `$${stats.todayRevenue.toLocaleString()}`,
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-orange-500 dark:text-[#F97316]",
      bg: "bg-orange-50 dark:bg-[#2C1A1A]",
      percentage: "+8.4%"
    },
    {
      label: "Pending Requests",
      value: stats.pendingCount,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-purple-500 dark:text-[#A855F7]",
      bg: "bg-purple-50 dark:bg-[#1E1A2C]",
      percentage: "Low priority"
    },
    {
      label: "Confirmed Sales",
      value: stats.confirmedCount,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-emerald-500 dark:text-[#10B981]",
      bg: "bg-emerald-50 dark:bg-[#0F291E]",
      percentage: "98% Success"
    }
  ];
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#111111] rounded-[24px] border border-gray-200 dark:border-white/5 p-6 animate-pulse shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3 mb-3" }),
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 dark:bg-white/10 rounded w-1/2" })
    ] }, i)) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-1", children: "Welcome back, Admin! 👋" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm font-bold uppercase tracking-widest", children: "Insights & Analytics for Vamos Jacó Tours" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm",
            onClick: () => fetchStats(),
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
              "Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20",
            onClick: () => setIsModalOpen(true),
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
              "Add Booking"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      AddBookingModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        onSuccess: () => fetchStats()
      }
    ),
    isDemo && /* @__PURE__ */ jsxs("div", { className: "bg-brand-teal/5 border border-brand-teal/20 dark:border-brand-teal/10 rounded-[20px] px-5 py-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-xl bg-brand-teal/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-brand-teal", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-brand-teal font-semibold text-sm leading-tight dark:text-emerald-400", children: "Demo Mode Active" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 text-xs mt-0.5", children: "Showing sample data. Login with Supabase for real-time tracking." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: statCards.map((card) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white dark:bg-[#111111] rounded-[24px] border border-gray-200 dark:border-white/5 p-6 shadow-sm hover:border-primary/50 transition-all duration-300 group",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center transition-premium group-hover:scale-110 group-hover:rotate-3`, children: /* @__PURE__ */ jsx("svg", { className: `w-6 h-6 ${card.color}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: card.icon }) }) }),
                card.percentage.includes("%") ? /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-3 py-1.5 rounded-xl ${card.percentage.startsWith("+") || card.percentage.includes("Success") ? "bg-green-100 dark:bg-[#0F291E] text-green-600 dark:text-[#10B981]" : "bg-primary/10 text-primary"}`, children: card.percentage }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-500 dark:text-gray-400 font-bold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5", children: card.percentage })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "block text-gray-500 dark:text-gray-400 text-base font-medium", children: card.label }),
                /* @__PURE__ */ jsx("p", { className: "text-[32px] font-sans font-bold tracking-tight text-gray-900 dark:text-white leading-none", children: card.value })
              ] })
            ]
          },
          card.label
        )) }),
        /* @__PURE__ */ jsx(SalesChart, { onToast })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#111111] rounded-[24px] border border-gray-200 dark:border-white/5 p-8 shadow-sm h-full max-h-[600px] flex flex-col transition-all duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-heading font-black text-xl tracking-tight uppercase", children: "Recent Activity" }),
          /* @__PURE__ */ jsx("button", { onClick: () => onNavigate?.("bookings"), className: "text-primary text-[10px] font-black uppercase tracking-widest hover:underline", children: "View All" })
        ] }),
        recentBookings.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm py-4 text-center", children: "No bookings yet. They will appear here in real time." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recentBookings.map((booking) => /* @__PURE__ */ jsxs("div", { className: "group relative flex items-center justify-between p-3 border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] transition-all rounded-2xl cursor-pointer", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm transition-transform group-hover:scale-110 ${booking.status === "confirmed" ? "bg-green-500/10 text-green-600" : booking.status === "cancelled" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`, children: booking.customer_name?.charAt(0)?.toUpperCase() || "?" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-gray-900 dark:text-white leading-tight text-sm font-black group-hover:text-primary transition-colors", children: booking.customer_name }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 text-[11px] font-bold mt-0.5", children: booking.tour_name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-gray-900 dark:text-white text-sm font-black tracking-tighter", children: [
              "$",
              Number(booking.total_amount).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5 mt-1", children: [
              /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full animate-pulse ${booking.status === "confirmed" ? "bg-green-500" : booking.status === "cancelled" ? "bg-red-500" : "bg-amber-500"}` }),
              /* @__PURE__ */ jsx("span", { className: `text-[9px] font-black uppercase tracking-widest ${booking.status === "confirmed" ? "text-green-500" : booking.status === "cancelled" ? "text-red-500" : "text-amber-500"}`, children: booking.status })
            ] })
          ] })
        ] }, booking.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-heading font-black text-gray-900 dark:text-white tracking-tight", children: "Manage Tours" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { className: "px-4 py-2 rounded-full text-[11px] font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all", children: "All Categories" }),
          /* @__PURE__ */ jsx("button", { className: "px-4 py-2 rounded-full text-[11px] font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all", children: "Filter" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        recentTours.map((tour) => /* @__PURE__ */ jsxs("div", { className: "group cursor-pointer bg-white dark:bg-[#111111] rounded-[24px] border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm hover:border-primary/50 transition-all duration-300 flex flex-col h-64", children: [
          /* @__PURE__ */ jsxs("div", { className: "h-40 relative overflow-hidden bg-gray-100 dark:bg-[#1A1A1A]", children: [
            tour.image_url ? /* @__PURE__ */ jsx("img", { src: tour.image_url, alt: tour.name_en, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: "No Image" }),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsx("span", { className: "bg-primary/90 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md", children: "Popular" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between text-white", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-lg", children: [
                  "$",
                  tour.price_base
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-yellow-400", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 fill-current", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xs", children: tour.rating || "4.9" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-4 flex-1 flex items-center", children: /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-sm line-clamp-1", children: tour.name_en }) })
        ] }, tour.id)),
        /* @__PURE__ */ jsxs("div", { onClick: () => onNavigate?.("tours"), className: "group cursor-pointer bg-transparent border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-primary dark:hover:border-primary/50 rounded-[24px] flex flex-col items-center justify-center h-64 transition-all duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full border border-gray-300 dark:border-white/10 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 text-gray-400 flex items-center justify-center mb-3 transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-500 dark:text-gray-400 font-bold text-sm tracking-wide", children: "Add New Tour" })
        ] })
      ] })
    ] })
  ] });
}

export { DashboardStats as default };
