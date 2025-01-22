import { basename } from "lume/deps/path.ts";
import lume from "lume/mod.ts";
/* Plugins */
import checkUrls from "lume/plugins/check_urls.ts";
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
import redirects from "lume/plugins/redirects.ts";
import robots from "lume/plugins/robots.ts";
import sitemap from "lume/plugins/sitemap.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import transformImages from "lume/plugins/transform_images.ts";

const profile = await Array.fromAsync(Deno.readDir("nex_inox"))
  .then((files) => files.find((f) => f.name.includes("profile_pic")))
  .then((file) => "nex_inox/" + file?.name);

const paragraphFn = (value: string) =>
  value
    .trim()
    .replaceAll("\n", "<br />")
    .replaceAll(
      /@([\w.]+)/g,
      '<a href="https://instagram.com/$1" target="_blank" rel="noreferrer noopener">@$1</a>',
    )
    .replaceAll(
      /#([\w-]+)/g,
      (_, t) =>
        `<a href="/t/${t.toLowerCase().replaceAll("_", "-")}/">#${t}</a>`,
    );

export default lume()
  .use(esbuild({ options: { external: ["/pagefind/*"] } }))
  .use(favicon({ input: profile }))
  .use(feed({
    output: ["/posts.rss", "/posts.json"],
    query: "post",
    info: { title: "NexInox Posts" },
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
  .use(redirects())
  .use(robots())
  .use(sitemap({ query: "date!=undefined" }))
  .use(slugifyUrls())
  .use(transformImages())
  .copy([".mp4"], (f) => "videos/" + basename(f))
  .filter("paragraph", paragraphFn)
  .use(checkUrls({ strict: true }));
