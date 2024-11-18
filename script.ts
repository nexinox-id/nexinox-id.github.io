// deno-lint-ignore-file no-window no-explicit-any
const pagefindModule = "/pagefind/pagefind.js";
const pagefind = await import(pagefindModule);

const searchInput = document.getElementById("search-input") as
  | HTMLInputElement
  | null;
const searchResult = document.getElementById("search-result") as
  | HTMLDialogElement
  | null;

searchInput?.addEventListener(
  "keydown",
  async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value;
      const search = await pagefind.search(value);
      const datas = search.results.map((r: any) => r.data());
      if (!searchResult) return;
      const uList = searchResult.querySelector("ul");
      if (!uList) return;
      uList.innerHTML = "";
      for await (const data of datas) {
        const li = document.createElement("li");
        li.innerHTML =
          `<a href="${data.url}"><strong>${data.meta.title}</strong></a><br/><small>${data.excerpt}</small>`;
        uList.appendChild(li);
      }
      openModal(searchResult);
    }
  },
);

searchResult?.querySelector("article > header > button")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal(searchResult);
  });

/*
 * Modal
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2024 - Licensed under MIT
 */

// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 400; // ms
let visibleModal: HTMLDialogElement | null = null;

// Open modal
const openModal = (modal: HTMLDialogElement) => {
  const { documentElement: html } = document;
  const scrollbarWidth = getScrollbarWidth();
  if (scrollbarWidth) {
    html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
  }
  html.classList.add(isOpenClass, openingClass);
  setTimeout(() => {
    visibleModal = modal;
    html.classList.remove(openingClass);
  }, animationDuration);
  modal.showModal();
};

// Close modal
const closeModal = (modal: HTMLDialogElement) => {
  visibleModal = null;
  const { documentElement: html } = document;
  html.classList.add(closingClass);
  setTimeout(() => {
    html.classList.remove(closingClass, isOpenClass);
    html.style.removeProperty(scrollbarWidthCssVar);
    modal.close();
  }, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
  if (visibleModal === null) return;
  const modalContent = visibleModal.querySelector("article");
  const isClickInside = modalContent?.contains(event.target as HTMLElement);
  !isClickInside && closeModal(visibleModal);
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && visibleModal) {
    closeModal(visibleModal);
  }
});

// Get scrollbar width
const getScrollbarWidth = () => {
  const scrollbarWidth = window.innerWidth -
    document.documentElement.clientWidth;
  return scrollbarWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
  return document.body.scrollHeight > screen.height;
};
