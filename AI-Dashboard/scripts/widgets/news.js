// scripts/widgets/news.js
// Tech headlines for India via public JSON mirror of NewsAPI

let lastNews = null; // used later by agent.js

async function loadNews(showErrors = true) {
  const url =
    "https://saurav.tech/NewsAPI/top-headlines/category/technology/in.json";

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("News API error");
    const data = await resp.json();
    lastNews = data;

    const listEl = document.getElementById("news-list");
    const emptyEl = document.getElementById("news-empty");
    if (!listEl || !emptyEl) return;

    listEl.innerHTML = "";
    const articles = data.articles || [];

        if (!articles.length) {
      emptyEl.style.display = "block";
    } else {
      emptyEl.style.display = "none";
      articles.slice(0, 6).forEach((a) => {
        const li = document.createElement("li");

        const link = document.createElement("a");
        link.className = "news-item-link";
        link.href = a.url || "#";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const title = document.createElement("div");
        title.className = "news-item-title";
        title.textContent = a.title || "Untitled article";

        const meta = document.createElement("div");
        meta.className = "news-item-meta";
        meta.textContent = a.source ? a.source.name : "Unknown source";

        link.appendChild(title);
        link.appendChild(meta);
        li.appendChild(link);
        listEl.appendChild(li);
      });
    }

    setText("news-updated", "Updated: " + new Date().toLocaleTimeString());
  } catch (err) {
    console.error(err);
    if (showErrors) {
      const emptyEl = document.getElementById("news-empty");
      if (emptyEl) {
        emptyEl.textContent =
          "Unable to load headlines right now. Try refreshing later.";
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