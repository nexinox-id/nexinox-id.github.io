import type { VideoObject, WithContext } from "npm:schema-dts@1.1.2";

const files = await Array.fromAsync(Deno.readDir("nex_inox"));

const videos = files.filter((f) => f.isFile && f.name.endsWith(".mp4"))
  .map((f) => f.name)
  .toSorted()
  .toReversed();

const getText = (path: string) =>
  Deno.readTextFile("nex_inox/" + path.replace(".mp4", ".txt"));

export const tags = ["post"];

const paragraph = (text: string) =>
  text
    .replaceAll("\n", "<br />")
    .replaceAll(
      /@([\w-]+)/g,
      `<a href="https://instagram.com/$1" target="_blank" rel="noreferrer noopener">@$1</a>`,
    )
    .replaceAll(/#([\w-]+)/g, `<a href="/tag/$1">#$1</a>`);

export default async function* (_data: Lume.Data, helpers: Lume.Helpers) {
  for (const video of videos) {
    const path = video.replace("_UTC.mp4", "");
    const url = `/${path}/`;
    const image = `/${path}/media-400w.jpg`;
    const text = await getText(video);
    const title = text.substring(0, text.indexOf("\n")).trim();
    const description = text.substring(title.length, text.indexOf("#")).trim();
    const keywords = text.split(/\s+/)
      .filter((t) => t.startsWith("#"))
      .map((t) => t.substring(1));
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
  <div>
    <h6>${title}</h6>
    <p>${paragraph(text.substring(title.length).trim())}</p>
  </div>
</article>
`;

    yield {
      url,
      title,
      description,
      keywords,
      image,
      tags: keywords,
      content,
      jsonLd,
    };
  }
}
