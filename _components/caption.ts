export default ({ text }: { text: string }) => {
  const title = text.substring(0, text.indexOf("\n")).trim();
  const paragraph = text
    .substring(title.length)
    .trim()
    .replaceAll("\n", "<br />")
    .replaceAll(
      /@([\w.]+)/g,
      '<a href="https://instagram.com/$1" target="_blank" rel="noreferrer noopener">@$1</a>',
    )
    .replaceAll(
      /#([\w-]+)/g,
      (_, t) => `<a href="/t/${t.toLowerCase()}">#${t}</a>`,
    );
  return /*html*/ `<h2>${title}</h2><p>${paragraph}</p>`;
};