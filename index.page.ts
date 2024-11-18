export const title = "Beranda";
export const renderOrder = 1;

export default (
  { profileJson, search, comp }: Lume.Data,
  _helpers: Lume.Helpers,
) => {
  const posts = search.pages("post", "date=desc");
  const name = profileJson.full_name;
  const biography = profileJson.biography;
  const followers = profileJson.edge_followed_by.count;
  return comp.pages.index({ posts, name, biography, followers });
};
