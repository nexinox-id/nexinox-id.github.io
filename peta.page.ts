const files = await Array.fromAsync(Deno.readDir("nex_inox"));

const locations = files.filter((f) => f.isFile && f.name.endsWith(".json"))
  .map(f => {
    const text = Deno.readTextFileSync("nex_inox/" + f.name);
    const json = JSON.parse(text);
    const location = json["node"]["iphone_struct"]?.["location"];
    if (!location) return null;
    return [f.name.replace("_UTC.json", ""), location]
  })
  .filter(Boolean)

export const title = "Peta Kuliner"

export default () => /*html*/ `
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
  for (const [url,  {lat, lng}] of locations) {
    const popup = new maplibregl.Popup({anchor: 'left'}).setHTML('<a href="/'+ url + '"><img src="/'+ url + '/media-400w.jpg" /></a>')
    new maplibregl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);
  }
</script>
`