const files = await Array.fromAsync(Deno.readDir("nex_inox"));

const videos = files.filter((f) => f.isFile && f.name.endsWith(".mp4"))
  .toSorted((f1, f2) => f1.name < f2.name ? 1 : -1)
  .map((f) => {
    const path = f.name.replace("_UTC.mp4", "/");
    const image = path + "media.jpg";
    const txt = "nex_inox/" + f.name.replace(".mp4", ".txt");
    const caption = Deno.readTextFileSync(txt).slice(0, 40);

    return /*html*/ `<div><a href="${path}" data-tooltip="${caption}&hellip;" aria-label="${caption}"><img src="${image}" alt="${caption}" /></a></div>`;
  })
  .join("\n");

export const title = "Beranda";

export default (_data: Lume.Data, _helpers: Lume.Helpers) =>
  /*html*/ `<article class="home" transform-images="avif webp jpg 400">${videos}</article>`;
