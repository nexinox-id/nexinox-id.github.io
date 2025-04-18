import * as ci from "ci";
import { id } from "date-fns/locale/id";
import { basename } from "lume/deps/path.ts";
import lume from "lume/mod.ts";
/* Plugins */
import checkUrls from "lume/plugins/check_urls.ts";
import date from "lume/plugins/date.ts";
import esbuild from "lume/plugins/esbuild.ts";
import feed from "lume/plugins/feed.ts";
import favicon from "lume/plugins/favicon.ts";
import icons from "lume/plugins/icons.ts";
import inline from "lume/plugins/inline.ts";
import jsonLd from "lume/plugins/json_ld.ts";
import lightningCss from "lume/plugins/lightningcss.ts";
import metas from "lume/plugins/metas.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import pagefind from "lume/plugins/pagefind.ts";
import picture from "lume/plugins/picture.ts";
import purgecss from "lume/plugins/purgecss.ts";
import robots from "lume/plugins/robots.ts";
import redirects from "lume/plugins/redirects.ts";
import sitemap from "lume/plugins/sitemap.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import transformImages from "lume/plugins/transform_images.ts";

import {
  paragraphFilterFn,
  prettyUrlManifestTransformFn,
  redirectOutputFn,
} from "./_functions.ts";
import serwist from "./_serwist.ts";

export default lume()
  .data("ci", ci)
  .use(date({ locales: { id } }))
  .use(esbuild({ options: { external: ["/pagefind/*"] } }))
  .use(favicon({
    input: await Array.fromAsync(Deno.readDir("nex_inox"))
      .then((files) => files.find((f) => f.name.includes("profile_pic")))
      .then((file) => "nex_inox/" + file?.name),
    favicons: [
      { url: "/favicon.ico", size: [48], rel: "icon", format: "ico" },
      {
        url: "/apple-touch-icon.png",
        size: [180],
        rel: "apple-touch-icon",
        format: "png",
      },
      {
        url: "/android-chrome-192x192.png",
        size: [192],
        format: "png",
        rel: "icon",
      },
      {
        url: "/android-chrome-512x512.png",
        size: [512],
        format: "png",
        rel: "icon",
      },
    ],
  }))
  .use(feed({
    output: ["/posts.rss", "/posts.json"],
    query: "post",
    info: { title: "NexInox Posts", description: "All NexInox posts feed." },
    items: {
      description: "=metas.description",
      image: "=metas.image",
    },
  }))
  .use(icons())
  .use(inline())
  .use(jsonLd())
  .use(lightningCss())
  .use(metas())
  .use(minifyHTML())
  .use(pagefind({ ui: false }))
  .use(picture())
  .use(purgecss())
  .use(redirects({ output: redirectOutputFn }))
  .use(robots())
  .use(
    serwist({
      additionalPrecacheEntries: ["/manifest.json"],
      globIgnores: ["t\/**\/*", "pagefind\/**\/*"],
      manifestTransforms: [prettyUrlManifestTransformFn],
    }),
  )
  .use(sitemap())
  .use(slugifyUrls())
  .use(transformImages())
  .copy([".mp4"], (f) => "videos/" + basename(f))
  .copy("manifest.json")
  .filter("paragraph", paragraphFilterFn)
  .use(checkUrls({ strict: true }));
