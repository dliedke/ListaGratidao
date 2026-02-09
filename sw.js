const CACHE_NAME = "gratitude-v2";
const APP_VERSION = "20260209-1";
const ASSETS = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/firebase-config.js",
    `/favicon.svg?v=${APP_VERSION}`,
    `/manifest.json?v=${APP_VERSION}`,
    `/icon-192x192.png?v=${APP_VERSION}`,
    `/icon-512x512.png?v=${APP_VERSION}`
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return cache.match(request);
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((response) => {
            if (response && response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    return cached || networkPromise;
}

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") return;

    const url = new URL(request.url);
    const isFirebaseRequest =
        url.href.includes("firebasejs") ||
        url.href.includes("googleapis") ||
        url.href.includes("firestore");

    if (isFirebaseRequest) {
        event.respondWith(fetch(request).catch(() => caches.match(request)));
        return;
    }

    const isSameOrigin = url.origin === self.location.origin;
    if (!isSameOrigin) {
        return;
    }

    const isDocument = request.mode === "navigate" || url.pathname === "/" || url.pathname === "/index.html";
    const isManifestOrIcon =
        url.pathname === "/manifest.json" ||
        url.pathname.endsWith(".svg") ||
        url.pathname.endsWith(".png");

    if (isDocument || isManifestOrIcon) {
        event.respondWith(networkFirst(request));
        return;
    }

    event.respondWith(staleWhileRevalidate(request));
});
