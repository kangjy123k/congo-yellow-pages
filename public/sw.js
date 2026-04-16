/* Service worker: stale-while-revalidate for HTML + long cache for static assets. */
const VERSION = "v1";
const RUNTIME = `cyp-runtime-${VERSION}`;
const STATIC = `cyp-static-${VERSION}`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(STATIC));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isStatic(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/videos/") ||
    /\.(?:svg|ico|png|jpe?g|webp|avif|woff2?|css|js)$/i.test(url.pathname)
  );
}

function isHTMLNav(req) {
  if (req.method !== "GET") return false;
  const accept = req.headers.get("accept") || "";
  return req.mode === "navigate" || accept.includes("text/html");
}

function isCacheableRSC(req, url) {
  return req.method === "GET" && url.search.includes("_rsc=");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;
  if (req.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/admin")) return;
  if (url.pathname.startsWith("/merchant")) return;

  if (isStatic(url)) {
    event.respondWith(cacheFirst(req, STATIC));
    return;
  }

  if (isHTMLNav(req) || isCacheableRSC(req, url)) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME));
    return;
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok && res.type === "basic") cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);
  return cached || (await network) || new Response("offline", { status: 503 });
}
