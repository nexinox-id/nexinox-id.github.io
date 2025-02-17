// Where you import this depends on your stack.
import {
  CacheFirst,
  ExpirationPlugin,
  type PrecacheEntry,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === "document",
      handler: new StaleWhileRevalidate(),
    },
    {
      matcher: ({ request }) =>
        request.destination === "image" ||
        request.destination === "style" ||
        request.destination === "script",
      handler: new CacheFirst({ cacheName: "static" }),
    },
    {
      matcher: ({ request }) => request.destination === "video",
      handler: new CacheFirst({
        cacheName: "video",
        plugins: [new ExpirationPlugin({ purgeOnQuotaError: true })],
      }),
    },
  ],
});

serwist.addEventListeners();
