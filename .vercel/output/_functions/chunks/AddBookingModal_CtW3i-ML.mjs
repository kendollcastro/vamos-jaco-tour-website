import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as supabase } from './supabase_oFwH5q6M.mjs';
import { Tag, X, User, Mail } from 'lucide-react';

function AddBookingModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    tour_name: "Jaco ATV Off-Road Adventure",
    booking_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    total_amount: 0,
    status: "confirmed",
    adults: 1,
    children: 0
  });
  if (!isOpen) return null;
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!supabase) {
        alert("Supabase not connected. This is a demo.");
        onSuccess();
        onClose();
        return;
      }
      const { error } = await supabase.from("bookings").insert([{
        ...formData,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }]);
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding booking:", err);
      alert("Error adding booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-white/5 animate-in zoom-in-95 duration-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-black/20", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-gray-900 dark:text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5 text-primary" }),
        "Add New Booking"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Customer Name" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                required: true,
                className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all",
                value: formData.customer_name,
                onChange: (e) => setFormData({ ...formData, customer_name: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Email" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all",
                value: formData.customer_email,
                onChange: (e) => setFormData({ ...formData, customer_email: e.target.value })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Tour Name" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all appearance-none",
            value: formData.tour_name,
            onChange: (e) => setFormData({ ...formData, tour_name: e.target.value }),
            children: [
              /* @__PURE__ */ jsx("option", { value: "Jaco ATV Off-Road Adventure", children: "Jaco ATV Off-Road Adventure" }),
              /* @__PURE__ */ jsx("option", { value: "Jet Ski Ocean Adventure", children: "Jet Ski Ocean Adventure" }),
              /* @__PURE__ */ jsx("option", { value: "Side by Side Buggy Tour", children: "Side by Side Buggy Tour" }),
              /* @__PURE__ */ jsx("option", { value: "Canopy Zipline Tour", children: "Canopy Zipline Tour" }),
              /* @__PURE__ */ jsx("option", { value: "Surf Lessons", children: "Surf Lessons" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all",
              value: formData.booking_date,
              onChange: (e) => setFormData({ ...formData, booking_date: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Amount ($)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all",
              value: formData.total_amount,
              onChange: (e) => setFormData({ ...formData, total_amount: Number(e.target.value) })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "flex-[2] px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50",
            children: loading ? "Adding..." : "Confirm Booking"
          }
        )
      ] })
    ] })
  ] }) });
}

export { AddBookingModal as A };
