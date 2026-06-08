// scripts/widgets/news.js
// Tech headlines for India via public JSON mirror of NewsAPI

let lastNews = null; // used later by agent.js

async function loadNews(showErrors = true) {
  const url = "https://saurav.tech/NewsAPI/top-headlines/category/technology/in.json";

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("News API error");

    const data = await resp.json();
    lastNews = data;

    const listEl = document.getElementById("news-list");
    const emptyEl = document.getElementById("news-empty");
    if (!listEl || !emptyEl) return;

    listEl.innerHTML = "";
    const articles = Array.isArray(data.articles) ? data.articles : [];

    const usefulArticles = articles
      .filter((a) => a && a.title && a.url)
      .slice(0, 10);

    if (!usefulArticles.length) {
      emptyEl.textContent = "No IT headlines available right now. Try refreshing.";
      emptyEl.style.display = "block";
      return;
    }

    emptyEl.style.display = "none";

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
      title.href = a.url;
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      title.textContent = `${index + 1}. ${a.title}`;

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
  } catch (err) {
    console.error(err);
    if (showErrors) {
      const emptyEl = document.getElementById("news-empty");
      if (emptyEl) {
        emptyEl.textContent = "Unable to load IT news right now. Try refreshing later.";
        emptyEl.style.display = "block";
      }
    }
  }
}

// Button handler
document
  .getElementById("news-refresh")
  ?.addEventListener("click", () => loadNews(true));

// Initial load
loadNews(false);