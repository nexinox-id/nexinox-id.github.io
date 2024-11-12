
export const renderOrder = 1;

export default async function* ({ search, comp }: Lume.Data, _helpers: Lume.Helpers) {
  const tags = search.values<string[]>("keywords", "post")
    .flat()
    .map((s) => s.toLowerCase());
  for (const tag of new Set(tags)) {
    const url = `/tag/${tag}/`; 
    const title = `#${tag}`;
    const posts = search.pages(`post ${tag}`)
      .map(comp.post)
      .join("");
    const content =
      /*html*/ `<article class="tag" transform-images="avif webp jpg 400"><h2>#${tag}</h2>${posts}</article>`;

    yield {
      url,
      title,
      content,
    };
  }
}
