import { basename } from "lume/deps/path.ts";

export const url = ({ sourcePath, outputPath }: Lume.Page) => {
  if (sourcePath.startsWith("/nex_inox/") && sourcePath.endsWith(".jpg")) {
    if (sourcePath.includes("profile_pic")) {
      sourcePath = "profile_pic.jpg";
    }
    return "/images/" + basename(sourcePath);
  }
  return outputPath;
};

export const year = new Date().getFullYear();

export const profileJson = await Array.fromAsync(Deno.readDir("nex_inox"))
  .then((files) =>
    files.find((f) =>
      f.isFile && f.name.startsWith("nex_inox") && f.name.endsWith(".json")
    )
  )
  .then((file) => Deno.readTextFile("nex_inox/" + file?.name))
  .then((text) => JSON.parse(text)["node"]);

export const description = profileJson.biography;

export const layout = "layout.vto";

export const metas = {
  site: "NexInox",
  title: "=title",
  description,
  icon: "/images/profile_pic-400w.jpg",
  lang: "id",
  twitter: "@mblonyox",
};
