import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_oFwH5q6M.mjs';

const DEMO_SUBSCRIBERS = [
  { id: "1", email: "traveler1@example.com", is_active: true, created_at: new Date(Date.now() - 864e5).toISOString() },
  { id: "2", email: "adventure.fan@gmail.com", is_active: true, created_at: new Date(Date.now() - 1728e5).toISOString() },
  { id: "3", email: "jaco.lover@outlook.com", is_active: false, created_at: new Date(Date.now() - 2592e5).toISOString() }
];
function SubscribersTable() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isDemo = !supabase;
  useEffect(() => {
    fetchSubscribers();
    if (!supabase) return;
    const channel = supabase.channel("subscribers-changes").on("postgres_changes", { event: "*", schema: "public", table: "subscribers" }, () => {
      fetchSubscribers();
    }).subscribe();
    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);
  async function fetchSubscribers() {
    setLoading(true);
    if (!supabase) {
      setSubscribers(DEMO_SUBSCRIBERS);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching subscribers:", error);
    }
    setSubscribers(data || []);
    setLoading(false);
  }
  async function toggleActive(id, currentStatus) {
    if (isDemo) {
      setSubscribers((prev) => prev.map((s) => s.id === id ? { ...s, is_active: !currentStatus } : s));
      return;
    }
    if (!supabase) return;
    const { error } = await supabase.from("subscribers").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) fetchSubscribers();
  }
  const filtered = subscribers.filter(
    (s) => !searchQuery || s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-96", children: [
        /* @__PURE__ */ jsx("svg", { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "Search by email...",
            className: "w-full bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors shadow-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold border border-primary/20", children: [
        "Total: ",
        subscribers.length,
        " Subscribers"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-8 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-16 text-center", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium", children: "No subscribers found" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]", children: "Email Address" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]", children: "Joined Date" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em]", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4 text-gray-800 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em] text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100 dark:divide-white/5", children: filtered.map((sub) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-gray-900 dark:text-white", children: sub.email }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-600 dark:text-gray-300 font-medium", children: new Date(sub.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.is_active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`, children: sub.is_active ? "Active" : "Unsubscribed" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => toggleActive(sub.id, sub.is_active),
            className: `p-2 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 inline-block ${sub.is_active ? "bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"}`,
            title: sub.is_active ? "Unsubscribe" : "Re-subscribe",
            children: sub.is_active ? /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" }) }) : /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })
          }
        ) })
      ] }, sub.id)) })
    ] }) }) })
  ] });
}

export { SubscribersTable as default };
