import lume from "lume/mod.ts";
import metas from "lume/plugins/metas.ts";

export default lume()
  .use(metas())
  .copy("nex_inox", ".")
  .copy("pico.min.css")
  .copy("fslightbox.js");
