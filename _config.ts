import { basename } from "lume/deps/path.ts";
import lume from "lume/mod.ts";
/* Plugins */
import feed from "lume/plugins/feed.ts";
import favicon from "lume/plugins/favicon.ts";
import inline from "lume/plugins/inline.ts";
import jsonLd from "lume/plugins/json_ld.ts";
import metas from "lume/plugins/metas.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import picture from "lume/plugins/picture.ts";
import redirects from "lume/plugins/redirects.ts";
import robots from "lume/plugins/robots.ts";
import sitemap from "lume/plugins/sitemap.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import svgo from "lume/plugins/svgo.ts";
import transformImages from "lume/plugins/transform_images.ts";

const profile = await Array.fromAsync(Deno.readDir("nex_inox"))
  .then((files) => files.find((f) => f.name.includes("profile_pic")))
  .then((file) => "nex_inox/" + file?.name);

export default lume()
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
  .use(inline())
  .use(jsonLd())
  .use(metas())
  .use(redirects())
  .use(robots())
  .use(sitemap())
  .use(slugifyUrls())
  .use(svgo())
  .use(minifyHTML())
  .use(picture())
  .use(transformImages())
  .copy([".mp4"], (f) => "videos/" + basename(f))
  .copy("pico.min.css")
  .copy("style.css");
