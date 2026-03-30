import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { s as supabase } from './supabase_oFwH5q6M.mjs';

function MediaGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadFolder, setUploadFolder] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetchImages();
  }, []);
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
      if (uploadFolder) formData.append("folder", uploadFolder);
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
  function handleDelete(img) {
    setImageToDelete(img);
  }
  async function confirmDelete() {
    if (!imageToDelete) return;
    setIsDeleting(true);
    try {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      await fetch("/api/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ path: imageToDelete.path })
      });
      if (selectedImage?.path === imageToDelete.path) {
        setSelectedImage(null);
      }
      setImageToDelete(null);
      fetchImages();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  }
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }
  function copyPath(path) {
    navigator.clipboard.writeText(path);
  }
  const folders = ["all", ...new Set(images.map((img) => img.folder))];
  const filtered = selectedFolder === "all" ? images : images.filter((img) => img.folder === selectedFolder);
  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "select",
          {
            value: selectedFolder,
            onChange: (e) => setSelectedFolder(e.target.value),
            className: "bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:border-primary outline-none transition-colors",
            children: folders.map((f) => /* @__PURE__ */ jsx("option", { value: f, children: f === "all" ? "All Folders" : `📁 ${f}` }, f))
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex border border-gray-200 dark:border-white/10 rounded-full overflow-hidden bg-white dark:bg-transparent transition-colors shadow-sm", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setViewMode("grid"),
              className: `p-2 transition ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"}`,
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setViewMode("list"),
              className: `p-2 transition ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"}`,
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 10h16M4 14h16M4 18h16" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-sm", children: [
          filtered.length,
          " images"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: uploadFolder,
            onChange: (e) => setUploadFolder(e.target.value.replace(/[^a-zA-Z0-9-_]/g, "")),
            placeholder: "folder (optional)",
            className: "w-36 bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary outline-none transition-colors"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => fileInputRef.current?.click(),
            disabled: uploading,
            className: "px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-full transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-primary/40 shrink-0",
            children: [
              uploading ? /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
              ] }) : /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }),
              "Upload"
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
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        onDragOver: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        onDrop: handleDrop,
        className: "min-h-[400px]",
        children: loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gray-100 dark:bg-dark-soft rounded-[20px] border border-gray-200 dark:border-white/5 animate-pulse" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-dark-soft rounded-[20px] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center py-20 px-6 text-center transition-colors", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-gray-400 dark:text-gray-600 mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-900 dark:text-gray-400 font-medium mb-1", children: "No images found" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-600 text-sm mb-4", children: "Drop images here or click Upload" })
        ] }) : viewMode === "grid" ? (
          /* Grid View */
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: filtered.map((img) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setSelectedImage(img),
              className: `group relative aspect-square rounded-[16px] overflow-hidden border cursor-pointer bg-gray-50 dark:bg-dark-soft transition-all ${selectedImage?.path === img.path ? "border-primary ring-2 ring-primary/30" : "border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: img.path,
                    alt: img.name,
                    className: "w-full h-full object-cover",
                    loading: "lazy",
                    onError: (e) => {
                      e.target.src = "https://placehold.co/200x200/1A1816/666?text=Error";
                    }
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-2.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-white text-[11px] font-medium truncate", children: img.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[10px]", children: formatSize(img.size) })
                ] }) }),
                selectedImage?.path === img.path && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) })
              ]
            },
            img.path
          )) })
        ) : (
          /* List View */
          /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-dark-soft rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5", children: [
              /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs", children: "Preview" }),
              /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs", children: "Name" }),
              /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs hidden md:table-cell", children: "Folder" }),
              /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs", children: "Size" }),
              /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: filtered.map((img) => /* @__PURE__ */ jsxs(
              "tr",
              {
                onClick: () => setSelectedImage(img),
                className: `border-b border-gray-100 dark:border-white/5 cursor-pointer transition-colors ${selectedImage?.path === img.path ? "bg-primary/5" : "hover:bg-gray-50 dark:hover:bg-white/[0.02]"}`,
                children: [
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsx("img", { src: img.path, alt: img.name, loading: "lazy", decoding: "async", className: "w-10 h-10 rounded-lg object-cover" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-gray-900 dark:text-white text-sm", children: img.name }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell", children: img.folder }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-gray-600 dark:text-gray-400 text-xs", children: formatSize(img.size) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          copyPath(img.path);
                        },
                        className: "p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-brand-teal hover:bg-brand-teal/10 transition",
                        title: "Copy path",
                        children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" }) })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDelete(img);
                        },
                        className: "p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition",
                        title: "Delete",
                        children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                      }
                    )
                  ] }) })
                ]
              },
              img.path
            )) })
          ] }) })
        )
      }
    ),
    "            ",
    selectedImage && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity",
        onClick: () => setSelectedImage(null)
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-y-0 right-0 w-full md:w-80 bg-white dark:bg-dark-soft shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-white/10 flex flex-col ${selectedImage ? "translate-x-0" : "translate-x-full"}`,
        children: selectedImage && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-gray-900 dark:text-white font-bold text-sm", children: "Asset Details" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedImage(null),
                className: "p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition",
                children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: selectedImage.path,
                alt: selectedImage.name,
                className: "w-full object-contain",
                style: { maxHeight: "200px" }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-primary font-bold text-[10px] uppercase tracking-wider block mb-1", children: "File Name" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-medium text-sm break-all", children: selectedImage.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-primary font-bold text-[10px] uppercase tracking-wider block mb-1", children: "Size" }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-medium text-sm", children: formatSize(selectedImage.size) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-primary font-bold text-[10px] uppercase tracking-wider block mb-1", children: "Folder" }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-medium text-sm", children: selectedImage.folder })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-primary font-bold text-[10px] uppercase tracking-wider block mb-1", children: "Upload Date" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white font-medium text-sm", children: new Date(selectedImage.modified).toLocaleString() })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 space-y-2 border-t border-gray-100 dark:border-white/5", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => copyPath(selectedImage.path),
                  className: "w-full py-2.5 px-4 bg-transparent border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
                    "Copy Image Path"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => window.open(selectedImage.path, "_blank"),
                  className: "w-full py-2.5 px-4 bg-brand-teal/10 text-brand-teal text-sm font-medium rounded-xl hover:bg-brand-teal/20 transition flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
                    "View Full Res"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleDelete(selectedImage),
                  className: "w-full py-2.5 px-4 mt-4 bg-transparent border border-red-500/20 text-red-500 text-sm font-medium rounded-xl hover:bg-red-500/10 transition flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
                    "Remove from Gallery"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    imageToDelete && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
          onClick: () => !isDeleting && setImageToDelete(null)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-3xl p-6 md:p-8 max-w-sm w-full relative z-10 shadow-2xl transform scale-100 transition-transform animate-zoom-in border border-gray-100 dark:border-white/10 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-2", children: "Eliminar Imagen" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-500 dark:text-gray-400 text-sm mb-6", children: [
          "¿Estás seguro de que deseas eliminar permanentemente la imagen ",
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-gray-700 dark:text-gray-300", children: [
            '"',
            imageToDelete.name,
            '"'
          ] }),
          "? Esta acción no se puede deshacer."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setImageToDelete(null),
              disabled: isDeleting,
              className: "flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition disabled:opacity-50",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: confirmDelete,
              disabled: isDeleting,
              className: "flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50",
              children: isDeleting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                  /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                ] }),
                "Eliminando..."
              ] }) : "Sí, eliminar"
            }
          )
        ] })
      ] })
    ] })
  ] });
}

export { MediaGallery as default };
