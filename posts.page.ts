import type { VideoObject, WithContext } from "npm:schema-dts@1.1.2";

export const tags = ["post"];
export const layout = "pages/post.vto";

export default function* (
  {}: Lume.Data,
  { slugify, url: urlHelper }: Lume.Helpers,
) {
  let datas = Array.from(Deno.readDirSync("nex_inox"))
    .filter((f) => f.isFile && f.name.endsWith(".json"))
    .map(({ name }) => {
      try {
        const oldUrl = `/${name.replace("_UTC.json", "")}/`;
        const image = `/images/${name.replace(".json", ".jpg")}`;
        const video = `/videos/${name.replace(".json", ".mp4")}`;
        const json = JSON.parse(Deno.readTextFileSync(`nex_inox/${name}`));
        const { id, date, caption, comments, shortcode } = json.node;
        const { like_count, location } = json.node.iphone_struct;
        const { width, height } = json.node.iphone_struct.video_versions[0];
        const text = caption as string;
        const [_, title, description] = text.match(/(.+?)\n(.+)\n#/s)!
          .map((s) => s.trim());
        const keywords = text.matchAll(/#([\w-]+)/g).map((v) => v[1])
          .toArray();
        const url = slugify(`/p/${title}/`);
        return {
          url,
          oldUrl,
          image,
          video,
          title,
          description,
          keywords,
          id: id as string,
          shortcode: shortcode as string,
          date: new Date(date * 1000),
          caption: caption as string,
          comment_count: comments as number,
          like_count: like_count as number,
          location: location as { lat: number; lng: number; name: string },
          width: width as number,
          height: height as number,
        };
      } catch {
        return;
      }
    })
    .filter((data) => data != undefined);
  datas = new Map(datas.map((d) => [d.url, d]))
    .values()
    .toArray()
    .toSorted((d1, d2) => d1.date < d2.date ? 1 : -1);
  for (const [index, data] of datas.entries()) {
    try {
      const {
        url,
        oldUrl,
        title,
        description,
        keywords,
        shortcode,
        date,
        caption,
        image,
        video,
        like_count,
        comment_count,
        location,
        width,
        height,
      } = data;
      const tags = keywords.map((s) => s.toLowerCase());
      /* Generate JSON-LD */
      const jsonLd: WithContext<VideoObject> = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        description,
        thumbnailUrl: ["avif", "webp", "jpg"]
          .map((f) => image.replace(".jpg", "-400w." + f)),
        contentUrl: video,
        uploadDate: date.toISOString(),
        width: `${width}`,
        height: `${height}`,
      };
      /* Generate content */
      const nextUrl = (index ? datas[index - 1] : undefined)?.url;
      const prevUrl = datas.at(index + 1)?.url;

      yield {
        url,
        oldUrl,
        tags,
        title,
        image,
        video,
        width,
        height,
        metas: {
          image: image.replace(".jpg", "-400w.jpg"),
          description,
          keywords,
          type: "video.other",
          "og:video": urlHelper(video, true),
          "og:video:type": "video/mp4",
          "og:video:width": `${width}`,
          "og:video:height": `${height}`,
        },
        jsonLd,
        date,
        shortcode,
        location,
        like_count,
        comment_count,
        caption,
        nextUrl,
        prevUrl,
      };
    } catch (error) {
      console.warn(`${error}`);
    }
  }
}
