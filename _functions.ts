import { Page } from "lume/core/file.ts";
import type Site from "lume/core/site.ts";
import type { ManifestTransform } from "@serwist/build";

type Status = 301 | 302 | 307 | 308;
type Redirect = [string, string, Status];

export const redirectOutputFn = (redirects: Redirect[], site: Site) => {
  for (const [url, to, statusCode] of redirects) {
    const timeout = (statusCode === 301 || statusCode === 308) ? 0 : 1;
    const content = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <title>Mengarahkan... | NexInox</title>
  <meta http-equiv="refresh" content="${timeout}; url=${to}">
  <link rel="canonical" href="${site.url(to, true)}">
  <link rel="preload" as="style" href="/style.css" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main class="container">
    <h1>Mengarahkan...</h1>
    <a href="${to}">Klik di sini jika peramban tidak mengarahkan otomatis.</a>
  </main>
</body>
</html>`;
    const page = Page.create({ url, content });
    site.pages.push(page);
  }
};

export const paragraphFilterFn = (value: string) =>
  value
    .trim()
    .replaceAll("\n", "<br />")
    .replaceAll(
      /@([\w.]+)/g,
      '<a href="https://instagram.com/$1" target="_blank" rel="noreferrer noopener">@$1</a>',
    )
    .replaceAll(
      /#([\w-]+)/g,
      (_, t) =>
        `<a href="/t/${t.toLowerCase().replaceAll("_", "-")}/">#${t}</a>`,
    );

export const prettyUrlManifestTransformFn: ManifestTransform = (manifest) => ({
  manifest: manifest.map((entry) => ({
    ...entry,
    url: (entry.url.startsWith("/") ? "" : "/") +
      entry.url.replace("index.html", ""),
  })),
});
