import { basename } from "lume/deps/path.ts";

export const url = ({ sourcePath, outputPath }: Lume.Page) => {
  if (sourcePath.startsWith("/nex_inox/") && sourcePath.endsWith(".jpg")) {
    return "/" + basename(sourcePath).replace("_UTC", "/media");
  }
  return outputPath;
};

export const year = new Date().getFullYear();

export const biography = await Array.fromAsync(Deno.readDir("nex_inox"))
  .then((files) => files.find((f) => f.isFile && f.name.startsWith("nex_inox") && f.name.endsWith(".json")))
  .then((file) => Deno.readTextFile("nex_inox/" + file?.name))
  .then(text => JSON.parse(text)["node"]["biography"]);

export const description = biography;

export const layout = "layout.ts";

export const metas = {
  site: "NexInox",
  title: "=title",
  description,
  icon: "/profile.jpg",
  lang: "id",
  twitter: "@mblonyox",
};
