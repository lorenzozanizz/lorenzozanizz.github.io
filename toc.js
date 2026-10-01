
document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector("article");

  if (!article) {
    console.warn("TOC: No <article> found.");
    return;
  }

  // Find all article section headings.
  const headings = [...article.querySelectorAll("h2, h3")];

  // Ignore the References heading and anything inside the references section.
  const filteredHeadings = headings.filter((heading) => {
    return !heading.closest(".references");
  });

  if (filteredHeadings.length === 0) {
    console.warn("TOC: No headings found.");
    return;
  }

  // Create the TOC.
  const toc = document.createElement("aside");
  toc.className = "toc";
  toc.setAttribute("aria-label", "Table of contents");

  toc.innerHTML = `
    <div class="toc-title">Table of Contents</div>
    <nav>
      <ul></ul>
    </nav>
  `;

  const list = toc.querySelector("ul");

  // Generate a URL-friendly ID.
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const usedIds = new Set();

  function makeUniqueId(text) {
    const base = slugify(text) || "section";
    let id = base;
    let counter = 2;

    while (usedIds.has(id) || document.getElementById(id)) {
      id = `${base}-${counter}`;
      counter++;
    }

    usedIds.add(id);
    return id;
  }

let currentSublist = null;
let sectionNumber = 0;
let subsectionNumber = 0;

filteredHeadings.forEach((heading) => {
  if (!heading.id) {
    heading.id = makeUniqueId(heading.textContent);
  } else {
    usedIds.add(heading.id);
  }

  const isSection = heading.tagName === "H2";

  // Skip H3 headings that appear before the first H2.
  if (!isSection && !currentSublist) return;

  let number;

  if (isSection) {
    sectionNumber++;
    subsectionNumber = 0;
    number = `${sectionNumber}.`;
  } else {
    subsectionNumber++;
    number = `${sectionNumber}.${subsectionNumber}`;
  }

  const link = document.createElement("a");
  link.href = `#${heading.id}`;
  link.textContent = `${number} ${heading.textContent.trim()}`;

  const item = document.createElement("li");
  item.appendChild(link);

  if (isSection) {
    list.appendChild(item);

    currentSublist = document.createElement("ul");
    item.appendChild(currentSublist);
  } else {
    currentSublist.appendChild(item);
  }
});

  // Remove empty sub-lists.
  toc.querySelectorAll("ul").forEach((ul) => {
    if (ul.children.length === 0) {
      ul.remove();
    }
  });

  // Put the TOC immediately before the article.
  const title = article.querySelector("h1");

if (title) {
  title.insertAdjacentElement("afterend", toc);
} else {
  article.prepend(toc);
}

});
