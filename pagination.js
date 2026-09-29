const cards = [...document.querySelectorAll(".article-card")];
const filters = document.querySelector("#tag-filters");
const pagination = document.querySelector(".pagination");
const status = document.querySelector("#page-status");
const pageSize = 5;

const tags = [...new Set(
  cards.flatMap(card => card.dataset.tags?.split(/\s+/).filter(Boolean) ?? [])
)].sort();

let currentPage = 1;

function selectedTag() {
  return new URLSearchParams(location.search).get("tag") || "";
}

function linkFor(tag) {
  const url = new URL(location.href);
  if (tag) url.searchParams.set("tag", tag);
  else url.searchParams.delete("tag");
  return url.pathname + url.search + url.hash;
}

function render() {
  const active = selectedTag();
  const matches = cards.filter(card =>
    !active || card.dataset.tags?.split(/\s+/).includes(active)
  );
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);

  cards.forEach(card => { card.hidden = true; });
  matches
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .forEach(card => { card.hidden = false; });

  filters.replaceChildren();
  for (const tag of ["", ...tags]) {
    const link = document.createElement("a");
    link.href = linkFor(tag);
    link.textContent = tag || "All";
    if (tag === active) link.setAttribute("aria-current", "page");
    filters.append(link, " ");
  }

  pagination.replaceChildren();
  pagination.hidden = pageCount <= 1;
  for (let page = 1; page <= pageCount; page++) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(page);
    if (page === currentPage) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => {
      currentPage = page;
      render();
    });
    pagination.append(button);
  }

  status.textContent = `${matches.length} articles${active ? ` tagged ${active}` : ""}`;
}

filters.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link || !filters.contains(link)) return;
  event.preventDefault();
  history.pushState(null, "", link.href);
  currentPage = 1;
  render();
});

addEventListener("popstate", () => {
  currentPage = 1;
  render();
});

render();