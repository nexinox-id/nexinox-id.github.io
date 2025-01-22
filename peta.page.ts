export const renderOrder = 1;
export const title = "Peta Kuliner";
export const description = "Peta kuliner NexInox adalah panduan interaktif yang menampilkan lokasi-lokasi makan yang telah dikunjungi oleh komunitas NexInox. Setiap titik di peta mewakili restoran, kafe, warung, atau kedai yang menawarkan pengalaman kuliner unik dan menggugah selera. Peta ini mencakup berbagai jenis masakan, dari hidangan lokal Indonesia hingga makanan internasional, dengan fokus pada kualitas rasa, suasana, dan inovasi kuliner."
export const layout = "pages/peta.vto";

export default function*({ search }: Lume.Data) {
  const locations = search.pages("post")
    .filter(d => d.location)
    .map((d) => ({
      url: d.url,
      image: (d.image as string).replace(".jpg", "-400w.jpg"),
      lat: d.location.lat as number,
      lng: d.location.lng as number,
    }));
  yield { locations };
};
