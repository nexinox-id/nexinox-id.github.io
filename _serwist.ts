import type Site from "lume/core/site.ts";
import { getManifest, type GetManifestOptions } from "@serwist/build";
import { merge } from "lume/core/utils/object.ts";

export interface Options extends Omit<GetManifestOptions, "globDirectory"> {
  swDest?: string;
}

export const defaultOptions: Options = {
  globPatterns: ["**/*.{js,css,html,png,jpg,avif,webp}"],
  swDest: "sw.js",
};

export default function serwist(userOptions?: Options) {
  const options = merge(defaultOptions, userOptions);

  return (site: Site) => {
    async function buildSw() {
      const manifest = await getManifest({ globDirectory: site.dest() });
      const sw = await site.getOrCreatePage(options.swDest);
      sw.content = (sw.content as string).replace(
        "self.__SW_MANIFEST",
        JSON.stringify(manifest.manifestEntries),
      );
      await site.writer.savePages([sw]);
    }
    site.addEventListener("afterBuild", buildSw);
    site.addEventListener("afterUpdate", buildSw);
  };
}
