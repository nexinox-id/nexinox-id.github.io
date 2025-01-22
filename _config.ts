import { id } from "date-fns/locale/id";
import type Site from "lume/core/site.ts";
import { Page } from "lume/core/file.ts";
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

type Status = 301 | 302 | 307 | 308;
type Redirect = [string, string, Status];

const redirectOutputFn = (redirects: Redirect[], site: Site) => {
  for (const [url, to, statusCode] of redirects) {
    const timeout = (statusCode === 301 || statusCode === 308) ? 0 : 1;
    const content = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <title>Mengarahkan... | NexInox</title>
  <meta http-equiv="refresh" content="${timeout}; url=${to}">
  <link rel="canonical" href="${site.url(to, true)}">
  <link rel="preload" as="style" href="/style.css" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main class="container">
    <h1>Mengarahkan...</h1>
    <a href="${to}">Klik di sini jika peramban tidak mengarahkan otomatis.</a>
  </main>
</body>
</html>`;
    const page = Page.create({ url, content });
    site.pages.push(page);
  }
};

export default lume()
  .use(date({ locales: { id } }))
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
  .use(redirects({ output: redirectOutputFn }))
  .use(robots())
  .use(sitemap({ query: "date!=undefined" }))
  .use(slugifyUrls())
  .use(transformImages())
  .copy([".mp4"], (f) => "videos/" + basename(f))
  .filter("paragraph", paragraphFn)
  .use(checkUrls({ strict: true }));
