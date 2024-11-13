export const title = "Beranda";
export const renderOrder = 1;

export default ({ search, comp }: Lume.Data, _helpers: Lume.Helpers) => {
  const posts = search.pages("post", "date=desc")
    .map(comp.item)
    .join("");
  return /*html*/ `<article class="home" transform-images="avif webp jpg 400">${posts}</article>`;
};
