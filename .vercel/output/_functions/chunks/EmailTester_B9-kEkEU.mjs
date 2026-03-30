import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Mail, AlertCircle, Send, CheckCircle } from 'lucide-react';

function EmailTester() {
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/admin/settings").then((res) => res.json()).then((data) => {
      if (data.success && data.settings?.email_logo_url) {
        setLogoUrl(data.settings.email_logo_url);
      }
    }).catch((err) => console.error("Error fetching settings:", err));
  }, []);
  const handleSaveGlobalLogo = async () => {
    if (!logoUrl) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "email_logo_url", value: logoUrl })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("success");
        setMessage("Global email logo updated successfully!");
        setTimeout(() => setStatus("idle"), 5e3);
      } else {
        throw new Error(data.message || "Failed to save setting");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "Failed to save global logo. Ensure the settings table exists.");
    }
  };
  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          logoOverride: logoUrl || void 0,
          language: selectedLang
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("success");
        setMessage("Test emails sent successfully! Check your inbox.");
        setTimeout(() => setStatus("idle"), 5e3);
      } else {
        throw new Error(data.message || "Failed to send emails");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "An unexpected error occurred (Check Resend verify domain rules).");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-dark-soft rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-6 md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Email Tester" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Send the premium booking confirmation and newsletter welcome templates to any email address." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-4 mb-6 flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-yellow-800 dark:text-yellow-400", children: [
        /* @__PURE__ */ jsx("strong", { children: "Resend Free Tier Limitation:" }),
        " If you have not verified your domain in Resend, you can ",
        /* @__PURE__ */ jsx("em", { children: "only" }),
        " send test emails to the exact email address you used to register the Resend account."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSendTest, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "testEmail", className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1", children: "Recipient Email Address" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              id: "testEmail",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "e.g. your-resend-email@gmail.com",
              className: "flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm",
              required: true,
              disabled: status === "loading"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: status === "loading" || !email,
              className: "flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50",
              children: status === "loading" ? /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: "Sending..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }),
                "Send Test"
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "logoUrl", className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1", children: "Brand Logo Override URL (Optional)" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              id: "logoUrl",
              value: logoUrl,
              onChange: (e) => setLogoUrl(e.target.value),
              placeholder: "https://example.com/custom-logo.png",
              className: "flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm",
              disabled: status === "loading"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleSaveGlobalLogo,
              disabled: status === "loading" || !logoUrl,
              className: "bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 hover:border-primary/50 text-gray-700 dark:text-gray-300 px-5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 text-xs uppercase tracking-wider",
              children: status === "loading" ? "Saving..." : "Save as Global Default"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-2 font-medium", children: "Leave blank to use the default Vamos Jacó Tours brand logo." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "Email Language" }),
        /* @__PURE__ */ jsxs("div", { className: "flex p-1 bg-gray-100 dark:bg-black/20 rounded-xl max-w-fit border border-gray-200 dark:border-white/5", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelectedLang("en"),
              className: `px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedLang === "en" ? "bg-white dark:bg-dark shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`,
              children: "English"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelectedLang("es"),
              className: `px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedLang === "es" ? "bg-white dark:bg-dark shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`,
              children: "Spanish"
            }
          )
        ] })
      ] }),
      status === "success" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
        message
      ] }),
      status === "error" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium animate-fade-in", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }),
        message
      ] })
    ] })
  ] });
}

export { EmailTester as default };
