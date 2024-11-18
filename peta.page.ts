export const title = "Peta Kuliner";

export default ({ search, comp }: Lume.Data) => {
  const locations = search.pages("post")
    .filter(d => d.location)
    .map((d) => ({
      url: d.url,
      image: (d.image as string).replace(".jpg", "-400w.jpg"),
      lat: d.location.lat as number,
      lng: d.location.lng as number,
    }));
  return comp.pages.peta({ locations });
};
