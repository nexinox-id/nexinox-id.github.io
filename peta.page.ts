export const title = "Peta Kuliner";

export default ({ search }: Lume.Data) => {
  const locations = search.pages("post")
    .filter(d => d.location)
    .map((d) => ({
      url: d.url,
      image: (d.image as string).replace(".jpg", "-400w.jpg"),
      lat: d.location.lat as number,
      lng: d.location.lng as number,
    }));
  return /*html*/ `
<script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
<article class="map">
  <div id="map"></div>
</article>
<script>
  const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [106.8419351,-6.170513],
    zoom: 12.5,
    container: 'map',
  });
  const locations = ${JSON.stringify(locations)};
  for (const {url, image, lat, lng} of locations) {
    const popup = new maplibregl.Popup({anchor: 'left'}).setHTML('<a href="' + url + '"><img src="'+ image +'" /></a>')
    new maplibregl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);
  }
</script>
`;
};
