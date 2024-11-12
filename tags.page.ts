import type { Data } from "lume/core/file.ts";

export const renderOrder = 1;

const postItem = ({ url, title }: Data) => {
  const caption = title?.slice(0, 40);
  return /*html*/ `<div><a href="${url}" data-tooltip="${caption}&hellip;" aria-label="${caption}"><img src="${url}media.jpg" alt="${caption}" /></a></div>`;
};

export default async function* ({ search }: Lume.Data, _helpers: Lume.Helpers) {
  const tags = search.values<string[]>("keywords", "post")
    .flat()
    .map((s) => s.toLowerCase());
  for (const tag of new Set(tags)) {
    const url = `/tag/${tag}/`;
    const title = `#${tag}`;
    const posts = search.pages(`post ${tag}`)
      .map(postItem)
      .join("\n");
    const content =
      /*html*/ `<article class="tag" transform-images="avif webp jpg 400"><h2>#${tag}</h2>${posts}</article>`;

    yield {
      url,
      title,
      content,
    };
  }
}
