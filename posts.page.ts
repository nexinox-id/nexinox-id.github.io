import type { VideoObject, WithContext } from "npm:schema-dts@1.1.2";

export const tags = ["post"];

export default function* ({ comp }: Lume.Data, helpers: Lume.Helpers) {
  const videos = Array.from(Deno.readDirSync("nex_inox"))
    .filter((f) => f.isFile && f.name.endsWith(".mp4"))
    .map((f) => f.name)
    .toSorted()
    .toReversed();

  for (const [index, video] of videos.entries()) {
    const url = `/${video.replace("_UTC.mp4", "")}/`;
    const image = url + "media-400w.jpg";
    const txtFile = "nex_inox/" + video.replace(".mp4", ".txt");
    const text = Deno.readTextFileSync(txtFile);
    const title = text.substring(0, text.indexOf("\n")).trim();
    const description = text.substring(title.length, text.indexOf("#")).trim();
    const keywords = text.split(/\s+/).filter((t) => t.startsWith("#"))
      .map((t) => t.substring(1));
    const tags = keywords.map((s) => s.toLowerCase());
    const jsonLd: WithContext<VideoObject> = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: title,
      description,
      thumbnailUrl: [
        url + "media-400.avif",
        url + "media-400.webp",
        url + "media-400.jpg",
      ],
      contentUrl: url + "media.mp4",
    };
    const nextUrl = (index ? videos[index - 1] : undefined)
      ?.replace("_UTC.mp4", "");
    const prevUrl = videos.at(index + 1)?.replace("_UTC.mp4", "");
    const content = /*html*/ `
<article class="post">
  <div><video src="./media.mp4" poster="./media-400w.jpg" controls autoplay loop /></div>
  <div>${comp.caption({ text })}</div>
  <nav class="grid">
    ${
      prevUrl
        ? `<a href="/${prevUrl}/" role="button" rel="prev">&leftarrow; Sebelumnya</a>`
        : "<button disabled>&leftarrow; Sebelumnya</button>"
    }
    ${
      nextUrl
        ? `<a href="/${nextUrl}/" role="button" rel="next">Selanjutnya &rightarrow;</a>`
        : "<button disabled>Selanjutnya &rightarrow;</button>"
    }
  </nav>
</article>
`;

    yield {
      url,
      title,
      metas: {
        image,
        description,
        keywords,
        type: "video",
        "og:video": helpers.url(url + "media.mp4", true),
      },
      tags,
      content,
      jsonLd,
    };
  }
}
