import { f as createComponent, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_DYRfXif5.mjs';
import 'piccolore';
import { t as theme, i as initTheme, a as toggleTheme, $ as $$Layout } from '../chunks/Layout_DxykCy69.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from '../chunks/supabase_oFwH5q6M.mjs';
import { useStore } from '@nanostores/react';
export { renderers } from '../renderers.mjs';

function AdminLogin({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!supabase) {
      setError("Supabase not configured. Add SUPABASE_URL and ANON_KEY to .env to enable authentication.");
      setLoading(false);
      return;
    }
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      onAuth();
    }
  }
  const isDemo = !supabase;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark px-4 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Vamos Jacó Admin" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm mt-1", children: "Sign in to manage your tours" })
    ] }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleLogin,
        className: "bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/10 p-8 space-y-5 shadow-xl transition-colors duration-300",
        children: [
          isDemo && /* @__PURE__ */ jsxs("div", { className: "bg-brand-teal/10 border border-brand-teal/30 rounded-xl px-4 py-3 text-brand-teal text-sm flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Demo Mode" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-brand-teal/70 mt-0.5", children: 'Supabase not configured. Click "Enter Demo" to explore the admin panel with sample data.' })
            ] })
          ] }),
          error && /* @__PURE__ */ jsxs("div", { className: "bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
            error
          ] }),
          !isDemo && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Email" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  placeholder: "admin@vamosjaco.com",
                  className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Password" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  required: true,
                  placeholder: "••••••••",
                  className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: isDemo ? "button" : "submit",
              disabled: loading,
              onClick: isDemo ? () => onAuth() : void 0,
              className: "w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
              children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                  /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                  /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
                ] }),
                "Signing in..."
              ] }) : isDemo ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }),
                  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
                ] }),
                "Enter Demo"
              ] }) : "Sign In"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "text-center text-gray-500 dark:text-gray-600 text-xs mt-6", children: [
      "Protected area · Vamos Jacó Tours © ",
      (/* @__PURE__ */ new Date()).getFullYear()
    ] })
  ] }) });
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "tours", label: "Tours", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { id: "bookings", label: "Bookings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { id: "subscribers", label: "Subscribers", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { id: "gallery", label: "Gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "team", label: "Team", icon: "M17 20h5V4H2v16h5m10 0v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5m10 0H7M12 11a4 4 0 100-8 4 4 0 000 8z" },
  { id: "website", label: "Components", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { id: "emails", label: "Email Tests", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
];
function AdminLayout({ children }) {
  const [authenticated, setAuthenticated] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const $theme = useStore(theme);
  useEffect(() => {
    initTheme();
  }, []);
  const [DashboardView, setDashboardView] = useState(null);
  const [ToursView, setToursView] = useState(null);
  const [BookingsView, setBookingsView] = useState(null);
  const [SubscribersView, setSubscribersView] = useState(null);
  const [GalleryView, setGalleryView] = useState(null);
  const [TeamView, setTeamView] = useState(null);
  const [WebsiteComponentsView, setWebsiteComponentsView] = useState(null);
  const [EmailsView, setEmailsView] = useState(null);
  useEffect(() => {
    if (!supabase) {
      setAuthenticated(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      if (session?.user?.email) setUserEmail(session.user.email);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      if (session?.user?.email) setUserEmail(session.user.email);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    import('../chunks/DashboardStats_bR-OXGIn.mjs').then((m) => setDashboardView(() => m.default));
    import('../chunks/TourList_DU9-lxwT.mjs').then((m) => setToursView(() => m.default));
    import('../chunks/BookingsTable_DaaLJj3E.mjs').then((m) => setBookingsView(() => m.default));
    import('../chunks/SubscribersTable_DY1p5PL9.mjs').then((m) => setSubscribersView(() => m.default));
    import('../chunks/MediaGallery_DvG0GM69.mjs').then((m) => setGalleryView(() => m.default));
    import('../chunks/TeamManager_LeIMGsxg.mjs').then((m) => setTeamView(() => m.default));
    import('../chunks/WebsiteComponents_B0x4ZgP6.mjs').then((m) => setWebsiteComponentsView(() => m.default));
    import('../chunks/EmailTester_B9-kEkEU.mjs').then((m) => setEmailsView(() => m.default));
  }, []);
  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthenticated(false);
  }
  if (authenticated === null) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-dark flex items-center justify-center transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }) });
  }
  if (!authenticated) {
    return /* @__PURE__ */ jsx(AdminLogin, { onAuth: () => setAuthenticated(true) });
  }
  const ActiveView = currentView === "dashboard" ? DashboardView : currentView === "tours" ? ToursView : currentView === "bookings" ? BookingsView : currentView === "subscribers" ? SubscribersView : currentView === "team" ? TeamView : currentView === "website" ? WebsiteComponentsView : currentView === "emails" ? EmailsView : GalleryView;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen font-sans text-gray-900 dark:text-white bg-gray-50 dark:bg-dark flex transition-premium", children: [
    sidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/60 z-40 lg:hidden",
        onClick: () => setSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("aside", { className: `
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-white/5
        transform transition-premium
        ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `, children: [
      /* @__PURE__ */ jsx("div", { className: "px-8 py-8 border-b border-gray-200 dark:border-white/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 ring-4 ring-primary/10", children: /* @__PURE__ */ jsx("span", { className: "text-white font-extrabold text-lg", children: "VJ" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-gray-900 dark:text-white font-heading font-extrabold text-lg leading-tight tracking-tight uppercase", children: "Vamos Jacó" }),
          /* @__PURE__ */ jsx("p", { className: "text-primary font-bold text-[10px] uppercase tracking-[0.2em] mt-0.5", children: "Administrator" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("nav", { className: "flex-1 px-4 py-6 space-y-2 overflow-y-auto", children: [
        NAV_ITEMS.filter(
          (item) => item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((item) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setCurrentView(item.id);
              setSidebarOpen(false);
            },
            className: `
                w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium transition-all duration-300
                ${currentView === item.id ? "bg-primary/10 text-primary translate-x-1" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 hover:translate-x-1"}
              `,
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: item.icon }) }),
              item.label
            ]
          },
          item.id
        )),
        NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && /* @__PURE__ */ jsx("div", { className: "px-4 py-2 text-xs text-gray-500 italic", children: "No sections found" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 border-t border-gray-200 dark:border-white/5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-primary/10 to-brand-orange/10 dark:from-primary/20 dark:to-brand-orange/20 rounded-2xl p-4 mb-4 border border-primary/10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider", children: "Quick Note" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium", children: 'Use the "Create Tour" button above to add new adventures instantly.' })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 px-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange/20 to-primary/20 flex items-center justify-center text-brand-orange text-sm font-bold shadow-sm border border-brand-orange/10", children: userEmail?.charAt(0)?.toUpperCase() || "A" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white text-sm font-bold truncate", children: userEmail.split("@")[0] || "Admin" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 dark:text-gray-500 text-[10px] truncate font-bold uppercase tracking-widest", children: "Administrator" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }),
              "Sign Out"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-[#050505]", children: [
      /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-30 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 lg:px-12 py-5 flex items-center justify-between transition-premium", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSidebarOpen(true),
              className: "lg:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition",
              children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center bg-gray-50 dark:bg-[#111111] rounded-full px-5 py-2.5 w-80 border border-gray-200 dark:border-white/5 focus-within:border-primary transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 focus-within:w-96 shadow-sm", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search sections, tours...",
                className: "bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white ml-3 w-full placeholder-gray-400 dark:placeholder-gray-500 font-bold uppercase tracking-widest text-[10px]",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => showToast("You are all caught up! No recent alerts."), className: "hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-primary transition-all", "aria-label": "Notifications", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }) }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentView("tours"), className: "hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-premium shadow-xl hover:-translate-y-0.5 shadow-primary/20 hover:shadow-primary/40 active:scale-95 leading-none", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M12 4v16m8-8H4" }) }),
            "Create Tour"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-200 dark:bg-white/10 hidden sm:block" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: toggleTheme,
              className: `
                                flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-300
                                ${$theme === "dark" ? "bg-primary/20 border-primary/20 text-primary shadow-inner" : "bg-white border-gray-200 text-gray-700 shadow-sm"}
                            `,
              "aria-label": "Toggle Theme",
              title: $theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
              children: [
                /* @__PURE__ */ jsx("div", { className: `w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${$theme === "dark" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`, children: $theme === "dark" ? /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" }) }) : /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" }) }) }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest translate-y-[0.5px]", children: $theme === "dark" ? "Dark" : "Light" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xs text-gray-500 dark:text-gray-500 hover:text-brand-teal transition flex items-center gap-1 font-medium bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
                "View Site"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 lg:p-8 overflow-auto", children: ActiveView ? (
        // @ts-ignore: Dynamic views may or may not accept onNavigate/onToast
        /* @__PURE__ */ jsx(ActiveView, { onNavigate: setCurrentView, onToast: showToast })
      ) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" }) }) }),
      /* @__PURE__ */ jsx("div", { className: `fixed bottom-6 right-6 z-[100] transition-all duration-300 transform ${toast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"}`, children: toast && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-4 bg-gray-900 dark:bg-[#111111] border border-gray-700 dark:border-white/10 shadow-2xl rounded-2xl", children: [
        toast.type === "success" ? /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
        /* @__PURE__ */ jsx("p", { className: "text-white text-sm font-medium tracking-wide", children: toast.message }),
        /* @__PURE__ */ jsx("button", { onClick: () => setToast(null), className: "ml-2 text-gray-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }) })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin | Vamos Jac\xF3 Tours", "robots": "noindex, nofollow", "hideChrome": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(['  <script>\n        (function() {\n            const theme = (() => {\n                const stored = localStorage.getItem("theme");\n                if (stored) return stored;\n                return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";\n            })();\n            \n            if (theme === "dark") {\n                document.documentElement.classList.add("dark");\n            } else {\n                document.documentElement.classList.remove("dark");\n            }\n            localStorage.setItem("theme", theme);\n        })();\n    <\/script> ', " "])), renderComponent($$result2, "AdminLayout", AdminLayout, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/DEV/vamosjt/src/components/admin/AdminLayout", "client:component-export": "default" })) })}`;
}, "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/admin/index.astro", void 0);

const $$file = "/Users/macbookpro/Desktop/DEV/vamosjt/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
