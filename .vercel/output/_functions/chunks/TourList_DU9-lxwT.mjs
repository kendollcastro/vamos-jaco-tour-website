import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_oFwH5q6M.mjs';
import { I as ImagePicker } from './ImagePicker_CQIwOWkt.mjs';

const CATEGORIES = ["atv", "water", "nature", "extreme", "relax"];
const BADGE_COLORS = ["yellow", "red", "green"];
const EMPTY_TOUR = {
  slug: "",
  name_en: "",
  name_es: "",
  description_en: "",
  description_es: "",
  price_base: 0,
  original_price: null,
  image_url: "",
  location: "Jacó, Costa Rica",
  duration: "",
  category: "nature",
  badge_text: "",
  badge_color: "yellow",
  highlights_en: [],
  highlights_es: [],
  includes_en: [],
  includes_es: [],
  pricing_options: [],
  gallery: [],
  is_active: true
};
function TourEditor({ tour, onClose }) {
  const isNew = !tour;
  const [form, setForm] = useState(tour ? { ...tour } : { ...EMPTY_TOUR });
  const [langTab, setLangTab] = useState("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function addToArray(field) {
    const arr = form[field] || [];
    setForm((prev) => ({ ...prev, [field]: [...arr, ""] }));
  }
  function updateArrayItem(field, index, value) {
    const arr = [...form[field] || []];
    arr[index] = value;
    setForm((prev) => ({ ...prev, [field]: arr }));
  }
  function removeArrayItem(field, index) {
    const arr = [...form[field] || []];
    arr.splice(index, 1);
    setForm((prev) => ({ ...prev, [field]: arr }));
  }
  function addPricingOption() {
    const opts = [...form.pricing_options || [], { duration: "", price: 0 }];
    setForm((prev) => ({ ...prev, pricing_options: opts }));
  }
  function updatePricingOption(index, field, value) {
    const opts = [...form.pricing_options || []];
    opts[index] = { ...opts[index], [field]: field === "price" ? Number(value) : value };
    setForm((prev) => ({ ...prev, pricing_options: opts }));
  }
  function removePricingOption(index) {
    const opts = [...form.pricing_options || []];
    opts.splice(index, 1);
    setForm((prev) => ({ ...prev, pricing_options: opts }));
  }
  async function handleSave() {
    if (!form.name_en || !form.slug) {
      setError("Name (EN) and Slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    if (!supabase) {
      onClose();
      return;
    }
    try {
      if (isNew) {
        const { error: dbError } = await supabase.from("tours").insert(form);
        if (dbError) throw dbError;
      } else {
        const { id, created_at, updated_at, ...updates } = form;
        const { error: dbError } = await supabase.from("tours").update(updates).eq("id", id);
        if (dbError) throw dbError;
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save");
      setSaving(false);
    }
  }
  function ArrayEditor({ field, label }) {
    const items = form[field] || [];
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: label }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => addToArray(field),
            className: "text-xs text-brand-teal hover:text-brand-teal/80 transition flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
              "Add"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: item,
              onChange: (e) => updateArrayItem(field, i, e.target.value),
              className: "flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all",
              placeholder: `Item ${i + 1}`
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeArrayItem(field, i),
              className: "p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }, i)),
        items.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-600 text-xs py-2 italic font-medium", children: "No items yet" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: isNew ? "New Tour" : "Edit Tour" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleSave,
          disabled: saving,
          className: "px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-full transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg hover:-translate-y-0.5 shadow-primary/25 hover:shadow-primary/40 active:scale-95",
          children: [
            saving && /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
            ] }),
            isNew ? "Create Tour" : "Save Changes"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-6", children: ["en", "es"].map((lang) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setLangTab(lang),
              className: `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${langTab === lang ? "bg-primary/10 text-primary border border-primary/30" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent hover:bg-gray-200 dark:hover:bg-white/10"}`,
              children: lang === "en" ? "🇺🇸 English" : "🇨🇷 Español"
            },
            lang
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: [
              "Tour Name (",
              langTab.toUpperCase(),
              ")"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form[`name_${langTab}`] || "",
                onChange: (e) => updateField(`name_${langTab}`, e.target.value),
                className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all",
                placeholder: langTab === "en" ? "ATV Mountain Adventure" : "Aventura en Cuadra"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: [
              "Description (",
              langTab.toUpperCase(),
              ")"
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: form[`description_${langTab}`] || "",
                onChange: (e) => updateField(`description_${langTab}`, e.target.value),
                rows: 4,
                className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none resize-none transition-all",
                placeholder: "Describe the tour experience..."
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            ArrayEditor,
            {
              field: `highlights_${langTab}`,
              label: `Highlights (${langTab.toUpperCase()})`
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
            ArrayEditor,
            {
              field: `includes_${langTab}`,
              label: `Includes (${langTab.toUpperCase()})`
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-sm", children: "Pricing Options" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addPricingOption,
                className: "text-xs text-brand-teal hover:text-brand-teal/80 transition flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                  "Add Option"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            (form.pricing_options || []).map((opt, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: opt.duration,
                  onChange: (e) => updatePricingOption(i, "duration", e.target.value),
                  className: "flex-1 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors",
                  placeholder: "1 Hour"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm", children: "$" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: opt.price,
                    onChange: (e) => updatePricingOption(i, "price", e.target.value),
                    className: "w-24 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removePricingOption(i),
                  className: "p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                }
              )
            ] }, i)),
            (form.pricing_options || []).length === 0 && /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-600 text-xs py-2 italic font-medium", children: 'No pricing options — click "Add Option" above' })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-brand-teal", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
              "Gallery Images"
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowGalleryPicker(true),
                className: "text-xs text-brand-teal hover:text-brand-teal/80 transition flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                  "Add from Gallery"
                ]
              }
            )
          ] }),
          (form.gallery || []).length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: (form.gallery || []).map((url, i) => /* @__PURE__ */ jsxs("div", { className: "relative group aspect-square rounded-xl overflow-hidden border border-white/10", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: url,
                alt: `Gallery ${i + 1}`,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  e.target.src = "https://placehold.co/100/1A1816/666?text=Error";
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => removeArrayItem("gallery", i),
                className: "absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition",
                children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ] }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark rounded-xl py-8 text-center transition-colors", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 text-xs font-medium", children: "No gallery images" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowGalleryPicker(true),
                className: "mt-2 text-xs text-brand-teal hover:underline",
                children: "Select from Gallery"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 space-y-5 shadow-sm transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-sm", children: "Details" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Slug (URL)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.slug || "",
                onChange: (e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")),
                className: "w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all",
                placeholder: "atv-mountain-adventure"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Base Price ($)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: form.price_base || 0,
                  onChange: (e) => updateField("price_base", Number(e.target.value)),
                  className: "w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Original Price" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: form.original_price || "",
                  onChange: (e) => updateField("original_price", e.target.value ? Number(e.target.value) : null),
                  className: "w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors",
                  placeholder: "0"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Location" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.location || "",
                onChange: (e) => updateField("location", e.target.value),
                className: "w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors",
                placeholder: "Jacó, Costa Rica"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Duration" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.duration || "",
                onChange: (e) => updateField("duration", e.target.value),
                className: "w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors",
                placeholder: "1 - 5 Hours"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Category" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: form.category || "nature",
                onChange: (e) => updateField("category", e.target.value),
                className: "w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary outline-none transition-colors",
                children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c.charAt(0).toUpperCase() + c.slice(1) }, c))
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: form.is_active ?? true,
                onChange: (e) => updateField("is_active", e.target.checked),
                className: "w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-dark"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-300", children: "Active" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 space-y-4 shadow-sm transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-sm", children: "Badge" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Badge Text" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.badge_text || "",
                onChange: (e) => updateField("badge_text", e.target.value),
                className: "w-full bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors",
                placeholder: "Best Seller"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Color" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: BADGE_COLORS.map((c) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => updateField("badge_color", c),
                className: `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${form.badge_color === c ? c === "red" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40" : c === "green" ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/40" : "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/40" : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"}`,
                children: c
              },
              c
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 p-6 space-y-4 shadow-sm transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-sm", children: "Featured Image" }),
          form.image_url ? /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: form.image_url,
                alt: "Preview",
                className: "w-full h-32 rounded-xl object-cover border border-white/10",
                onError: (e) => {
                  e.target.src = "https://placehold.co/400x200/1A1816/666?text=Invalid+URL";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowImagePicker(true),
                  className: "px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition",
                  children: "Change"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => updateField("image_url", ""),
                  className: "px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 transition",
                  children: "Remove"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowImagePicker(true),
              className: "w-full border-2 border-dashed border-white/10 rounded-xl py-8 text-center hover:border-primary/30 transition group",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-gray-600 mx-auto mb-2 group-hover:text-primary/50 transition", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs", children: "Click to select from gallery" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.image_url || "",
                onChange: (e) => updateField("image_url", e.target.value),
                className: "flex-1 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary outline-none transition-colors",
                placeholder: "or paste URL manually..."
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowImagePicker(true),
                className: "px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition shrink-0",
                children: "Browse"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ImagePicker,
      {
        isOpen: showImagePicker,
        onClose: () => setShowImagePicker(false),
        onSelect: (path) => updateField("image_url", path)
      }
    ),
    /* @__PURE__ */ jsx(
      ImagePicker,
      {
        isOpen: showGalleryPicker,
        onClose: () => setShowGalleryPicker(false),
        onSelect: () => {
        },
        multiple: true,
        onSelectMultiple: (paths) => {
          const existing = form.gallery || [];
          const newPaths = paths.filter((p) => !existing.includes(p));
          updateField("gallery", [...existing, ...newPaths]);
        }
      }
    )
  ] });
}

const DEMO_TOURS = [];
function TourList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const isDemo = !supabase;
  useEffect(() => {
    fetchTours();
  }, []);
  async function fetchTours() {
    setLoading(true);
    if (!supabase) {
      setTours(DEMO_TOURS);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("tours").select("*").order("created_at", { ascending: true });
    if (error) console.error("Error fetching tours:", error);
    setTours(data || []);
    setLoading(false);
  }
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this tour?")) return;
    if (isDemo) {
      setTours((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    if (!supabase) return;
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (!error) fetchTours();
  }
  function handleEdit(tour) {
    setEditingTour(tour);
    setShowEditor(true);
  }
  function handleAdd() {
    setEditingTour(null);
    setShowEditor(true);
  }
  function handleEditorClose() {
    setShowEditor(false);
    setEditingTour(null);
    fetchTours();
  }
  if (showEditor) {
    return /* @__PURE__ */ jsx(TourEditor, { tour: editingTour, onClose: handleEditorClose });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-gray-500 dark:text-gray-400 text-sm font-medium", children: [
        tours.length,
        " tours"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAdd,
          className: "px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
            "Add Tour"
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 p-5 animate-pulse shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "h-32 bg-gray-100 dark:bg-white/5 rounded-xl mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2" })
    ] }, i)) }) : tours.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 p-12 text-center shadow-sm", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-2 font-medium", children: "No tours yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 dark:text-gray-600 text-sm mb-4", children: "Add your first tour to get started" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleAdd,
          className: "px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-primary/20",
          children: "Create First Tour"
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: tours.map((tour) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white dark:bg-dark-soft rounded-[24px] border border-gray-200 dark:border-white/5 overflow-hidden group hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "h-48 bg-gray-100 dark:bg-dark relative overflow-hidden", children: [
            tour.image_url ? /* @__PURE__ */ jsx(
              "img",
              {
                src: tour.image_url,
                alt: tour.name_en,
                loading: "lazy",
                decoding: "async",
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                onError: (e) => {
                  e.target.src = "https://placehold.co/400x200/1A1816/666?text=No+Image";
                }
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-dark-soft", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 p-4 flex flex-col justify-between pointer-events-none", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                tour.badge_text ? /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md ${tour.badge_color === "red" ? "bg-red-500/90 text-white" : tour.badge_color === "green" ? "bg-green-500/90 text-white" : "bg-yellow-500/90 text-black"}`, children: tour.badge_text }) : /* @__PURE__ */ jsx("div", {}),
                /* @__PURE__ */ jsxs("span", { className: "bg-primary/95 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-primary/20", children: [
                  "Price: $",
                  tour.price_base
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md ${tour.is_active ? "bg-green-500/90 text-white" : "bg-gray-900/90 text-gray-300"}`, children: tour.is_active ? "Active" : "Inactive" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-gray-900 dark:text-white font-bold text-lg mb-2 line-clamp-1", children: tour.name_en }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-500 dark:text-gray-400 text-xs mb-4 flex items-center gap-1.5 font-medium", children: [
              /* @__PURE__ */ jsxs("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
              ] }),
              tour.location,
              " • ",
              tour.duration
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2 w-full", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleEdit(tour),
                  className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-sm transition-all hover:-translate-y-0.5 active:scale-95",
                  title: "Edit Tour",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }),
                    "Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(tour.id),
                  className: "flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all hover:-translate-y-0.5 active:scale-95",
                  title: "Delete Tour",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                }
              )
            ] })
          ] })
        ]
      },
      tour.id
    )) })
  ] });
}

export { TourList as default };
