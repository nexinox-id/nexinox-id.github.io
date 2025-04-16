// Where you import this depends on your stack.
import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  type PrecacheEntry,
  RangeRequestsPlugin,
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
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === "document",
      handler: new StaleWhileRevalidate({ cacheName: "page" }),
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
        plugins: [
          new CacheableResponsePlugin({ statuses: [200] }),
          new RangeRequestsPlugin(),
          new ExpirationPlugin({
            maxAgeSeconds: 31536000,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
