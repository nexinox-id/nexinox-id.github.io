export const renderOrder = 1;

export default function* (
  { search, comp }: Lume.Data,
  _helpers: Lume.Helpers,
) {
  const tags = search.values<string[]>("tags", "post").flat();
  for (const tag of new Set(tags)) {
    if (tag === "post") continue;
    const url = `/tag/${tag}/`;
    const title = `#${tag}`;
    const posts = search.pages(`post ${tag}`)
      .map(comp.post)
      .join("");
    const content = /*html*/ `
<article class="tag" transform-images="avif webp jpg 400">
  <h2>#${tag}</h2>
  ${posts}
</article>
`;

    yield {
      url,
      title,
      content,
    };
  }
}
