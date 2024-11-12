export default ({title, url}: Lume.Data) => {
  const caption = title?.slice(0, 40);
  return /*html*/ `<div><a href="${url}" data-tooltip="${caption}&hellip;" aria-label="${caption}"><img src="${url}media.jpg" alt="${caption}" /></a></div>`;
};
