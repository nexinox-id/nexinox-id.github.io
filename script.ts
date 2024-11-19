// deno-lint-ignore-file no-window no-explicit-any

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

/*!
 * Minimal theme switcher
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2024 - Licensed under MIT
 */

const themeSwitcher = {
  // Config
  _scheme: "auto",
  menuTarget: "details.dropdown",
  buttonsTarget: "a[data-theme-switcher]",
  buttonAttribute: "data-theme-switcher",
  rootAttribute: "data-theme",
  localStorageKey: "picoPreferredColorScheme",

  // Init
  init() {
    this.scheme = this.schemeFromLocalStorage;
    this.initSwitchers();
  },

  // Get color scheme from local storage
  get schemeFromLocalStorage() {
    return window.localStorage?.getItem(this.localStorageKey) ?? this._scheme;
  },

  // Preferred color scheme
  get preferredColorScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },

  // Init switchers
  initSwitchers() {
    const buttons = document.querySelectorAll(this.buttonsTarget);
    buttons.forEach((button) => {
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          // Set scheme
          const scheme = button.getAttribute(this.buttonAttribute)!
          this.scheme = scheme;
          // Close dropdown
          const menuTarget = document.querySelector<HTMLDetailsElement>(this.menuTarget);
          if(menuTarget) {
            menuTarget.removeAttribute("open");
            menuTarget.dataset.schemeActive = scheme;
          }
        },
        false,
      );
    });
  },

  // Set scheme
  set scheme(scheme) {
    if (scheme == "auto") {
      this._scheme = this.preferredColorScheme;
    } else if (scheme == "dark" || scheme == "light") {
      this._scheme = scheme;
    }
    this.applyScheme();
    this.schemeToLocalStorage();
  },

  // Get scheme
  get scheme() {
    return this._scheme;
  },

  // Apply scheme
  applyScheme() {
    document.querySelector("html")?.setAttribute(
      this.rootAttribute,
      this.scheme,
    );
  },

  // Store scheme to local storage
  schemeToLocalStorage() {
    window.localStorage?.setItem(this.localStorageKey, this.scheme);
  },
};

// Init
themeSwitcher.init();

/*!
 * Search
 */

const pagefindModule = "/pagefind/pagefind.js";
const pagefind = await import(pagefindModule);

const searchForm = document.getElementById("search-form") as HTMLFormElement;
const searchResult = document.getElementById(
  "search-result",
) as HTMLDialogElement;

searchForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();
    const div = searchResult.querySelector("div")!;
    div.innerHTML = "";
    div.setAttribute("aria-busy", "true");
    openModal(searchResult);
    const value = new FormData(e.currentTarget as HTMLFormElement)
      .get("search");
    const search = await pagefind.search(value);
    const datas = search.results.map((r: any) => r.data());
    const ul = document.createElement("ul");
    for await (const data of datas) {
      const li = document.createElement("li");
      li.innerHTML =
        `<a href="${data.url}"><strong>${data.meta.title}</strong></a><br/><small>${data.excerpt}</small>`;
      ul.appendChild(li);
    }
    div.removeAttribute("aria-busy");
    div.appendChild(ul);
  },
);

searchResult.querySelector("article > header > button")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal(searchResult);
  });
