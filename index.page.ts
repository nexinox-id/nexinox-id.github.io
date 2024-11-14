export const title = "Beranda";
export const renderOrder = 1;

export default (
  { profileJson, search, comp }: Lume.Data,
  _helpers: Lume.Helpers,
) => {
  const posts = search.pages("post", "date=desc");
  return /*html*/ `
    <article class="profile grid">
      <div>
        <img
          class="avatar"
          src="/images/profile_pic.jpg"
          transform-images="avif webp jpg 320@2"
          alt="NexInox's icon"
        />
      </div>
      <div>
        <h2>${profileJson.full_name}</h2>
        <p>${profileJson.biography.replaceAll("\n", "<br />")}</p>
        <div class="grid">
          <div role="button" class="outline secondary" data-tooltip="Pengikut" data-placement="top">
            ${profileJson.edge_followed_by.count}
            <img src="/icons/people.svg" inline />
          </div>
          <div role="button" class="outline secondary" data-tooltip="Video" data-placement="top">
            ${posts.length}
            <img src="/icons/film.svg" inline />
          </div>
        </div>
      </div>
    </article>
    <article class="home" transform-images="avif webp jpg 400">
      ${posts.map(comp.item).join("")}
    </article>
    `;
};
