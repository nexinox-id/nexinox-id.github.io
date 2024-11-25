export const renderOrder = 1;
export const layout = "pages/tag.vto"

export default function* (
  { search }: Lume.Data,
  _helpers: Lume.Helpers,
) {
  const tags = search.values<string[]>("tags", "post").flat();
  for (const tag of new Set(tags)) {
    if (tag === "post") continue;
    const url = `/t/${tag}/`;
    const title = `#${tag}`;
    const posts = search.pages(`post ${tag}`, "date=desc");

    yield { url, title, posts };
  }
}
