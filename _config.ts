import { basename } from "lume/deps/path.ts";
import lume from "lume/mod.ts";
import feed from "lume/plugins/feed.ts";
import favicon from "lume/plugins/favicon.ts";
import inline from "lume/plugins/inline.ts";
import jsonLd from "lume/plugins/json_ld.ts";
import metas from "lume/plugins/metas.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import robots from "lume/plugins/robots.ts";
import sitemap from "lume/plugins/sitemap.ts";
import svgo from "lume/plugins/svgo.ts";
import picture from "lume/plugins/picture.ts";
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
  }))
  .use(inline())
  .use(jsonLd())
  .use(metas())
  .use(robots())
  .use(sitemap())
  .use(svgo())
  .use(minifyHTML())
  .use(picture())
  .use(transformImages())
  .copy([".mp4"], (f) => basename(f).replace("_UTC", "/media"))
  .copy(profile, "/profile.jpg")
  .copy("pico.min.css")
  .copy("style.css");
