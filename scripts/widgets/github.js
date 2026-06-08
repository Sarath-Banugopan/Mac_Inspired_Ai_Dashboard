// scripts/widgets/github.js
// GitHub public activity for a given username

let lastGitHub = null; // used later by agent.js

async function loadGitHub(showErrors = true) {
  const usernameInput = document.getElementById("github-username");
  const username = usernameInput?.value.trim();
  if (!username) {
    if (showErrors) alert("Enter your GitHub username first.");
    return;
  }

  const url =
    "https://api.github.com/users/" +
    encodeURIComponent(username) +
    "/events/public";

  try {
    const resp = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
    if (!resp.ok) throw new Error("GitHub API error");
    const data = await resp.json();
    lastGitHub = data;

    const listEl = document.getElementById("github-activity-list");
    const emptyEl = document.getElementById("github-empty");
    if (!listEl || !emptyEl) return;

    listEl.innerHTML = "";

    if (!Array.isArray(data) || !data.length) {
      emptyEl.textContent =
        "No recent public events for this user. Try again after some activity.";
      emptyEl.style.display = "block";
    } else {
      emptyEl.style.display = "none";

      data.slice(0, 6).forEach((event) => {
        const li = document.createElement("li");
        li.className = "news-item"; // reuse news list styling

        const title = document.createElement("div");
        title.className = "news-item-title";

        const type = event.type || "Event";
        const repo = event.repo?.name || "unknown repo";
        title.textContent = `${type.replace("Event", "")} · ${repo}`;

        const meta = document.createElement("div");
        meta.className = "news-item-meta";
        const created = event.created_at
          ? new Date(event.created_at).toLocaleString()
          : "";
        meta.textContent = created;

        li.appendChild(title);
        li.appendChild(meta);
        listEl.appendChild(li);
      });
    }

    setText(
      "github-updated",
      "Updated: " + new Date().toLocaleTimeString()
    );
  } catch (err) {
    console.error(err);
    if (showErrors) {
      const emptyEl = document.getElementById("github-empty");
      if (emptyEl) {
        emptyEl.textContent =
          "Unable to load GitHub activity (rate limits or network). Try again later.";
        emptyEl.style.display = "block";
      }
    }
  }
}

// Button handler
document
  .getElementById("github-refresh")
  ?.addEventListener("click", () => loadGitHub(true));

// Optional: auto-load when username loses focus (no popup)
document
  .getElementById("github-username")
  ?.addEventListener("blur", () => loadGitHub(false));