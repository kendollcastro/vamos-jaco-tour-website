const store = /* @__PURE__ */ new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1e3);
function checkRateLimit(identifier, options = {}) {
  const { windowMs = 6e4, max = 10 } = options;
  const now = Date.now();
  const entry = store.get(identifier);
  if (!entry || now > entry.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { limited: false, remaining: max - 1, resetIn: windowMs };
  }
  if (entry.count >= max) {
    return { limited: true, remaining: 0, resetIn: entry.resetTime - now };
  }
  entry.count++;
  return { limited: false, remaining: max - entry.count, resetIn: entry.resetTime - now };
}
function getClientIP(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown";
}

export { checkRateLimit as c, getClientIP as g };
