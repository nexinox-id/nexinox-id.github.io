import { basename } from "lume/deps/path.ts";
import lume from "lume/mod.ts";
import feed from "lume/plugins/feed.ts";
import favicon from "lume/plugins/favicon.ts";
import metas from "lume/plugins/metas.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import robots from "lume/plugins/robots.ts";
import sitemap from "lume/plugins/sitemap.ts";

const profile = await Array.fromAsync(Deno.readDir("nex_inox"))
  .then((files) => files.find((f) => f.name.includes("profile_pic")))
  .then((file) => "nex_inox/" + file?.name);

export default lume()
  .use(favicon({
    input: profile,
  }))
  .use(feed({
    output: ["/posts.rss", "/posts.json"],
    query: "post",
    info: {
      title: "NexInox Posts",
    },
  }))
  .use(metas())
  .use(robots())
  .use(sitemap())
  .use(minifyHTML())
  .copy(
    [".jpg", ".mp4"],
    (f) => basename(f).replace("_UTC", "/media"),
  )
  .ignore((f) => f.includes("profile_pic"))
  .copy("pico.min.css")
  .copy("style.css");
