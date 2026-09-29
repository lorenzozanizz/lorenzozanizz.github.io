/*
 * Build article tag labels from each card's data-tags attribute.
 * Include with <script defer src="tags.js"></script> on the blog index page.
 * Example: <article class="article-card" data-tags="cardiac mechanics c++">
 */
(() => {
  const STYLE_ID = "article-tag-label-styles";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin: 0.5rem 0 0.8rem;
      }
      .article-tag {
        display: inline-block;
        padding: 0.2rem 0.55rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1.4;
        text-decoration: none;
      }
      .article-tag:hover,
      .article-tag:focus-visible {
        text-decoration: underline;
      }
    `;
    document.head.append(style);
  }

  // FNV-1a gives the same hue for the same tag across page loads.
  function hueFor(tag) {
    let hash = 2166136261;
    for (const char of tag.toLowerCase()) {
      hash ^= char.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % 360;
  }

  function addTags() {
    for (const card of document.querySelectorAll(".article-card[data-tags]")) {
      const title = card.querySelector(".article-content h3");
      if (!title || card.querySelector(".article-tags")) continue;

      // Match the space-separated format used by pagination.js.
      const tags = [...new Set(card.dataset.tags.trim().split(/\s+/).filter(Boolean))];
      if (!tags.length) continue;

      const row = document.createElement("div");
      row.className = "article-tags";
      row.setAttribute("aria-label", "Article tags");

      for (const tag of tags) {
        const link = document.createElement("a");
        const url = new URL(window.location.href);
        url.searchParams.set("tag", tag);
        const hue = hueFor(tag);

        link.className = "article-tag";
        link.href = `${url.pathname}${url.search}${url.hash}`;
        link.textContent = tag;
        link.style.backgroundColor = `hsl(${hue} 65% 90%)`;
        link.style.color = `hsl(${hue} 55% 26%)`;
        row.append(link);
      }
      title.insertAdjacentElement("afterend", row);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addTags, { once: true });
  } else {
    addTags();
  }
})();