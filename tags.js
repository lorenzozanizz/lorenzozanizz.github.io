/*
 * Build labels from data-tags and a special C++ badge from lang-tag="cpp".
 * Include with <script defer src="tags.js"></script> on the blog index page.
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
      .article-lang-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.18rem 0.55rem 0.18rem 0.22rem;
        border: 1px solid #7da4c8;
        border-radius: 0.4rem;
        background: #e8f3fc;
        color: #174c78;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1.4;
        text-decoration: none;
      }
      .article-lang-tag svg {
        width: 1.35rem;
        height: 1.35rem;
        flex: none;
      }
      .article-lang-tag:hover,
      .article-lang-tag:focus-visible {
        text-decoration: underline;
      }
    `;
    document.head.append(style);
  }

  function hueFor(tag) {
    let hash = 2166136261;
    for (const char of tag.toLowerCase()) {
      hash ^= char.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % 360;
  }

  function addTags() {
    for (const card of document.querySelectorAll(".article-card")) {
      const title = card.querySelector(".article-content h3");
      if (!title || card.querySelector(".article-tags")) continue;

      const tags = [...new Set(
        (card.dataset.tags || "").trim().split(/\s+/).filter(Boolean)
      )];
      const language = (card.getAttribute("lang-tag") || "")
        .trim()
        .toLowerCase();

      if (!tags.length && !language) continue;

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

      if (language === "cpp") {
        const link = document.createElement("a");
        const url = new URL(window.location.href);
        url.searchParams.set("tag", "cpp");

        link.className = "article-lang-tag";
        link.href = `${url.pathname}${url.search}${url.hash}`;
        link.setAttribute("aria-label", "Filter by C++");
        link.innerHTML = `
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path fill="#00599C" d="M16 1 30 9v14L16 31 2 23V9z"/>
            <text x="16" y="20" text-anchor="middle"
                  fill="white" font-family="Arial,sans-serif"
                  font-size="10" font-weight="bold">C++</text>
          </svg>
          <span>C++</span>
        `;
        row.append(link);
    } else if (language === "python") {
    const link = document.createElement("a");
    const url = new URL(window.location.href);
    url.searchParams.set("tag", "python");

    link.className = "article-lang-tag article-lang-tag--python";
    link.href = `${url.pathname}${url.search}${url.hash}`;
    link.setAttribute("aria-label", "Filter by Python");

    const icon = document.createElement("img");
    icon.src = "articles/resources/python_logo.webp";
    icon.alt = ""; // The adjacent text already names the language.

    const label = document.createElement("span");
    label.textContent = "Python";

    link.append(icon, label);
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