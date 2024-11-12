import type { VideoObject, WithContext } from "npm:schema-dts@1.1.2";

export const tags = ["post"];

export default async function* ({ comp }: Lume.Data, helpers: Lume.Helpers) {
  const files = await Array.fromAsync(Deno.readDir("nex_inox"));
  const videos = files.filter((f) => f.isFile && f.name.endsWith(".mp4"))
    .map((f) => f.name)
    .toSorted()
    .toReversed();

  for (const video of videos) {
    const url = `/${video.replace("_UTC.mp4", "")}/`;
    const image = url + "/media-400w.jpg";
    const txtFile = "nex_inox/" + video.replace(".mp4", ".txt");
    const text = await Deno.readTextFile(txtFile);
    const title = text.substring(0, text.indexOf("\n")).trim();
    const description = text.substring(title.length, text.indexOf("#")).trim();
    const keywords = text.split(/\s+/).filter((t) => t.startsWith("#"))
      .map((t) => t.substring(1));
    const tags = ["post", ...keywords.map((s) => s.toLowerCase())];
    const jsonLd: WithContext<VideoObject> = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: title,
      description,
      thumbnailUrl: [
        helpers.url(url + "media-400.avif"),
        helpers.url(url + "media-400.webp"),
        helpers.url(url + "media-400.jpg"),
      ],
      contentUrl: helpers.url(url + "media.mp4"),
    };
    const content = /*html*/ `
<article class="post">
  <div><video src="./media.mp4" controls autoplay loop /></div>
  <div>${comp.caption({ text })}</div>
</article>
`;

    yield {
      url,
      title,
      metas: {
        image,
        description,
        keywords,
      },
      tags,
      content,
      jsonLd,
    };
  }
}
