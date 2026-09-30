
(() => {
const article = document.querySelector('article');
const tocNav = document.querySelector('#toc-nav');

if (!article || !tocNav) return;

// Change these if you want different heading levels.
const headings = [...article.querySelectorAll('h2, h3')]
    .filter(heading => !heading.closest('.references'));

if (!headings.length) {
    document.querySelector('.toc')?.remove();
    return;
}

// Turn heading text into a URL-friendly ID.
function slugify(text) {
    return text
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Make IDs unique, even if two headings have the same text.
const usedIds = new Set();

function uniqueId(text) {
    const base = slugify(text) || 'section';
    let id = base;
    let n = 2;

    while (usedIds.has(id) || document.getElementById(id)) {
    id = `${base}-${n++}`;
    }

    usedIds.add(id);
    return id;
}

headings.forEach(heading => {
    if (!heading.id) {
    heading.id = uniqueId(heading.textContent);
    } else {
    usedIds.add(heading.id);
    }
});

const root = document.createElement('ul');
let currentH2List = root;

headings.forEach(heading => {
    if (heading.tagName === 'H2') {
    const li = document.createElement('li');
    const link = document.createElement('a');

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();

    li.appendChild(link);

    const subList = document.createElement('ul');
    li.appendChild(subList);

    root.appendChild(li);
    currentH2List = subList;
    } else {
    // Don't create a top-level h3 if there was no preceding h2.
    if (currentH2List === root) return;

    const li = document.createElement('li');
    const link = document.createElement('a');

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();

    li.appendChild(link);
    currentH2List.appendChild(li);
    }
});

// Remove empty h3 lists.
root.querySelectorAll('ul').forEach(ul => {
    if (!ul.children.length) ul.remove();
});

tocNav.appendChild(root);
})();


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
    <div class="toc-title">Contents</div>
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

  filteredHeadings.forEach((heading) => {
    // Give the heading an ID if it doesn't already have one.
    if (!heading.id) {
      heading.id = makeUniqueId(heading.textContent);
    } else {
      usedIds.add(heading.id);
    }

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();

    const item = document.createElement("li");
    item.appendChild(link);

    if (heading.tagName === "H2") {
      list.appendChild(item);

      // Create a sub-list for following H3s.
      currentSublist = document.createElement("ul");
      item.appendChild(currentSublist);
    } else if (heading.tagName === "H3" && currentSublist) {
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
