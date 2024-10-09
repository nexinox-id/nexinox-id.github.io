const files = await Array.fromAsync(Deno.readDir("nex_inox"));

const posts = files.filter((f) => f.isFile && f.name.endsWith(".mp4"))
  .toSorted((f1, f2) => f1.name < f2.name ? 1 : -1)
  .map((f) => f.name);

const getText = (path: string) =>
  Deno.readTextFile("nex_inox/" + path.replace(".mp4", ".txt"));

export const tags = ["post"];

export default async function* (_data: Lume.Data, _helpers: Lume.Helpers) {
  for (const post of posts) {
    const path = post.replace("_UTC.mp4", "");
    const url = `/${path}/`;
    const image = `/${path}/media-400w.jpg`;
    const text = await getText(post);
    const title = text.substring(0, text.indexOf("\n")).trim();
    const description = text.substring(title.length, text.indexOf("#")).trim();
    const keywords = text.split(/(\s+)/).filter(t => t.startsWith("#")).map(t => t.substring(1));
    const content = /*html*/ `
<article class="post">
  <div><video src="./media.mp4" controls autoplay loop /></div>
  <div><p>${text.replaceAll("\n", "<br />")}</p></div>
</article>
`;

    yield {
      url,
      title,
      description,
      keywords,
      image,
      content,
    };
  }
}
