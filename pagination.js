const cards = [...document.querySelectorAll(".article-card")];
const filters = document.querySelector("#tag-filters");
const pagination = document.querySelector(".pagination");
const status = document.querySelector("#page-status");

const pageSize = 5;

const tags = [...new Set(
  cards.flatMap(card =>
    card.dataset.tags?.split(/\s+/).filter(Boolean) ?? []
  )
)].sort();

function selectedTag() {
  return new URLSearchParams(location.search).get("tag") || "";
}

function tagsFor(card) {
  const ordinary = (card.dataset.tags || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const language = (card.getAttribute("lang-tag") || "")
    .trim()
    .toLowerCase();

  return language ? [...ordinary, language] : ordinary;
}

function currentPageFromURL() {
  const params = new URLSearchParams(location.search);
  const page = parseInt(params.get("page"), 10);

  return Number.isInteger(page) && page >= 1 ? page : 1;
}

function linkFor(tag) {
  const url = new URL(location.href);

  if (tag) {
    url.searchParams.set("tag", tag);
  } else {
    url.searchParams.delete("tag");
  }

  // Changing filter always returns to page 1.
  url.searchParams.delete("page");

  return url.pathname + url.search + url.hash;
}

function setPage(page) {
  const url = new URL(location.href);

  if (page <= 1) {
    url.searchParams.delete("page");
  } else {
    url.searchParams.set("page", page);
  }

  history.pushState(null, "", url);

  render();
}

function render() {
  const active = selectedTag();

  const matches = cards.filter(card =>
    !active || tagsFor(card).includes(active)
  );

  const pageCount = Math.max(
    1,
    Math.ceil(matches.length / pageSize)
  );

  let currentPage = currentPageFromURL();

  // Clamp invalid/out-of-range URLs.
  currentPage = Math.max(
    1,
    Math.min(currentPage, pageCount)
  );

  cards.forEach(card => {
    card.hidden = true;
  });

  matches
    .slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
    .forEach(card => {
      card.hidden = false;
    });

  // Tag filters
  filters.replaceChildren();

  for (const tag of ["", ...tags]) {
    const link = document.createElement("a");

    link.href = linkFor(tag);
    link.textContent = tag || "All";

    if (tag === active) {
      link.setAttribute("aria-current", "page");
    }

    filters.append(link, " ");
  }

  // Pagination
  pagination.replaceChildren();
  pagination.hidden = pageCount <= 1;

  for (let page = 1; page <= pageCount; page++) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = String(page);

    if (page === currentPage) {
      button.setAttribute("aria-current", "page");
    }

    button.addEventListener("click", () => {
      setPage(page);
    });

    pagination.append(button);
  }

  status.textContent =
    `${matches.length} articles` +
    (active ? ` tagged ${active}` : "");
}

filters.addEventListener("click", event => {
  const link = event.target.closest("a");

  if (!link || !filters.contains(link)) return;

  event.preventDefault();

  history.pushState(null, "", link.href);

  render();
});

window.addEventListener("popstate", () => {
  render();
});

render();