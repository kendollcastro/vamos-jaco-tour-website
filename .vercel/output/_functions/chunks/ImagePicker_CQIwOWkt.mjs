import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { s as supabase } from './supabase_oFwH5q6M.mjs';

function ImagePicker({ isOpen, onClose, onSelect, multiple = false, onSelectMultiple }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("all");
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setSelectedPaths([]);
    }
  }, [isOpen]);
  async function fetchImages() {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/media", {
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
    setLoading(false);
  }
  async function handleUpload(files) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "activities");
      try {
        if (!supabase) continue;
        const { data: { session } } = await supabase.auth.getSession();
        await fetch("/api/media", {
          method: "POST",
          headers: { "Authorization": `Bearer ${session?.access_token}` },
          body: formData
        });
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
    setUploading(false);
    fetchImages();
  }
  function toggleSelect(path) {
    if (multiple) {
      setSelectedPaths(
        (prev) => prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
      );
    } else {
      setSelectedPaths([path]);
    }
  }
  function handleConfirm() {
    if (multiple && onSelectMultiple) {
      onSelectMultiple(selectedPaths);
    } else if (selectedPaths.length > 0) {
      onSelect(selectedPaths[0]);
    }
    onClose();
  }
  if (!isOpen) return null;
  const folders = ["all", ...new Set(images.map((img) => img.folder))];
  const filtered = folder === "all" ? images : images.filter((img) => img.folder === folder);
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-[20px] w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl transition-colors duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5 transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-brand-teal", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-gray-900 dark:text-white font-bold text-sm", children: multiple ? "Select Images" : "Select Image" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[11px]", children: multiple ? "Click to select multiple" : "Click an image to select it" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/5 transition-colors", children: [
        /* @__PURE__ */ jsx(
          "select",
          {
            value: folder,
            onChange: (e) => setFolder(e.target.value),
            className: "bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:border-primary outline-none transition-colors",
            children: folders.map((f) => /* @__PURE__ */ jsx("option", { value: f, children: f === "all" ? "All Folders" : `📁 ${f}` }, f))
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => fileInputRef.current?.click(),
            disabled: uploading,
            className: "flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 text-xs font-medium rounded-lg dark:hover:bg-white/10 transition disabled:opacity-50",
            children: [
              uploading ? /* @__PURE__ */ jsxs("svg", { className: "w-3.5 h-3.5 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
              ] }) : /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }),
              "Upload New"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            multiple: true,
            className: "hidden",
            onChange: (e) => e.target.files && handleUpload(e.target.files)
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto p-4", children: loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2", children: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 text-gray-600 mb-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "No images available" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-xs", children: "Upload some images first" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2", children: filtered.map((img) => {
        const isSelected = selectedPaths.includes(img.path);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => toggleSelect(img.path),
            className: `relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? "border-primary ring-1 ring-primary/30 scale-[0.97]" : "border-transparent hover:border-white/20"}`,
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: img.path,
                  alt: img.name,
                  className: "w-full h-full object-cover",
                  loading: "lazy"
                }
              ),
              isSelected && /* @__PURE__ */ jsx("div", { className: "absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow", children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5", children: /* @__PURE__ */ jsx("p", { className: "text-white text-[9px] truncate", children: img.name }) })
            ]
          },
          img.path
        );
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/5 transition-colors", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-500 text-xs", children: selectedPaths.length > 0 ? `${selectedPaths.length} selected` : `${filtered.length} images available` }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 text-sm dark:hover:text-white transition",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleConfirm,
              disabled: selectedPaths.length === 0,
              className: "px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed",
              children: multiple ? `Add ${selectedPaths.length} Image${selectedPaths.length !== 1 ? "s" : ""}` : "Select Image"
            }
          )
        ] })
      ] })
    ] })
  ] });
}

export { ImagePicker as I };
