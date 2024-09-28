const files = await Array.fromAsync(Deno.readDir("nex_inox"))
  .then((files) => files.filter((f) => f.isFile))
  .then((files) => files.toSorted((f1, f2) => f1.name < f2.name ? 1 : -1));

const videos = files.filter((f) => f.name.endsWith(".mp4"))
  .map((f) => (`<div><a data-fslightbox="reels" href="${f.name}">
    <img src="${f.name.replace(".mp4", ".jpg")}" alt="${f.name}"/></a></div>`))
  .join('');

export default (_data: Lume.Data, _helpers: Lume.Helpers) => `
  <style>
    .grid {
      max-width: 1080px;
      margin: auto;
      grid-template-columns: repeat(3, 1fr);
    }
  </style>
    <article>
      <h1>NexInox</h1>
    </article>
    <hr />
    <div class="grid">
      ${videos}
    </div>
    <script src="fslightbox.js" />
`;
