// Where you import this depends on your stack.
import { CacheFirst, type PrecacheEntry, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({ precacheEntries: self.__SW_MANIFEST });

serwist.registerCapture(({ request, sameOrigin }) => {
  switch (request.destination) {
    case "document":
    case "style":
    case "script":
    case "image":
      return sameOrigin;
    default:
      return false;
  }
}, new CacheFirst());

serwist.addEventListeners();
