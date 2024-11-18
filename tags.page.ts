export const renderOrder = 1;

export default function* (
  { search, comp }: Lume.Data,
  _helpers: Lume.Helpers,
) {
  const tags = search.values<string[]>("tags", "post").flat();
  for (const tag of new Set(tags)) {
    if (tag === "post") continue;
    const url = `/t/${tag}/`;
    const title = `#${tag}`;
    const posts = search.pages(`post ${tag}`, "date=desc");
    const content = comp.pages.tag({ title, posts });

    yield { url, title, content };
  }
}
