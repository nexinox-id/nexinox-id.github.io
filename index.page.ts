export const renderOrder = 1;
export const title = "Beranda";
export const layout = "pages/index.vto";

export default function* (
  { profileJson, search }: Lume.Data,
  _helpers: Lume.Helpers,
) {
  const posts = search.pages("post", "date=desc");
  const name = profileJson.full_name;
  const biography = profileJson.biography;
  const followers = profileJson.edge_followed_by.count;
  yield { posts, name, biography, followers };
}
