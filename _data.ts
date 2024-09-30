import { basename } from "lume/deps/path.ts";

export const url = ({ sourcePath, outputPath }: Lume.Page) => {
  if (sourcePath.startsWith("/nex_inox/") && sourcePath.endsWith(".jpg")) {
    return "/" + basename(sourcePath).replace("_UTC", "/media");
  }
  return outputPath;
};

export const layout = "layout.ts";
export const metas = {
  site: "NexInox",
  title: "=title",
  image: "=image",
  description: "=description",
  icon: "/profile.jpg",
  lang: "id",
  twitter: "@mblonyox",
};
