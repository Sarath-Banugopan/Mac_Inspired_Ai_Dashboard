// scripts/widgets/news.js
// Tech headlines for India via public JSON mirror of NewsAPI

let lastNews = null; // used later by agent.js

async function loadNews(showErrors = true) {
  const sources = [
    "https://saurav.tech/NewsAPI/top-headlines/category/technology/in.json?t=" + Date.now(),
    "https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json?t=" + Date.now()
  ];

  const listEl = document.getElementById("news-list");
  const emptyEl = document.getElementById("news-empty");

  if (!listEl || !emptyEl) return;

  listEl.innerHTML = "";
  emptyEl.style.display = "none";
  setText("news-updated", "Updating...");

  let articles = [];
  let lastError = null;

  for (const url of sources) {
    try {
      const resp = await fetch(url, { cache: "no-store" });
      if (!resp.ok) throw new Error("News API error: " + resp.status);

      const data = await resp.json();
      const items = Array.isArray(data.articles) ? data.articles : [];

      articles = items.filter((a) => a && a.title && a.url);
      if (articles.length) {
        lastNews = data;
        break;
      }
    } catch (err) {
      lastError = err;
      console.error("News source failed:", url, err);
    }
  }

  if (!articles.length) {
    if (showErrors) {
      emptyEl.textContent = "Unable to load tech news right now. Please try again.";
      emptyEl.style.display = "block";
    }
    setText("news-updated", "Update failed");
    return;
  }

  const usefulArticles = articles.slice(0, 10);

  usefulArticles.forEach((a, index) => {
    const li = document.createElement("li");
    li.style.padding = "10px 12px";
    li.style.borderRadius = "10px";
    li.style.background = "rgba(255,255,255,0.55)";
    li.style.border = "1px solid rgba(148,163,184,0.22)";
    li.style.display = "flex";
    li.style.flexDirection = "column";
    li.style.gap = "4px";

    const title = document.createElement("a");
    title.className = "news-item-title news-item-link";
    title.textContent = `${index + 1}. ${a.title}`;
    title.href = a.url;
    title.target = "_blank";
    title.rel = "noopener noreferrer";

    const meta = document.createElement("div");
    meta.className = "news-item-meta";

    const source = a.source?.name || "Unknown source";
    const time = a.publishedAt
      ? new Date(a.publishedAt).toLocaleString()
      : "Time unavailable";

    meta.textContent = `${source} • ${time}`;

    li.appendChild(title);

    if (a.description) {
      const desc = document.createElement("div");
      desc.style.fontSize = "12px";
      desc.style.color = "#475569";
      desc.style.lineHeight = "1.45";
      desc.textContent = a.description;
      li.appendChild(desc);
    }

    li.appendChild(meta);
    listEl.appendChild(li);
  });

  setText("news-updated", "Updated: " + new Date().toLocaleTimeString());
}

// Button handler
document
  .getElementById("news-refresh")
  ?.addEventListener("click", () => loadNews(true));

// Initial load
loadNews(false);