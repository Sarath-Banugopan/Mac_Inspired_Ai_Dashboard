// scripts/main.js
// Core window manager + dock + clock

let zIndexCounter = 20;
const windows = Array.from(document.querySelectorAll(".mac-window"));
const dockButtons = Array.from(document.querySelectorAll(".dock-icon"));

// ----- Clock in top bar -----
function updateClock() {
  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[now.getDay()];
  const mins = String(now.getMinutes()).padStart(2, "0");
  let hrs = now.getHours();
  const ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12 || 12;
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = `${day} ${hrs}:${mins} ${ampm}`;
}

// ----- Dock helpers -----
function setDockActive(windowId, active) {
  const btn = document.getElementById(`dock-${windowId}`);
  if (!btn) return;
  btn.classList.toggle("active", active);
}

function bringToFront(win) {
  win.style.zIndex = ++zIndexCounter;
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.add("visible");
  win.dataset.minimized = "false";
  bringToFront(win);
  setDockActive(id, true);
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.remove("visible");
  win.classList.remove("maximized");
  win.dataset.minimized = "false";
  updateFullscreenState();
  setDockActive(id, false);
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (!win || !win.classList.contains("visible")) return;
  win.classList.remove("maximized");
  win.classList.remove("visible");
  win.dataset.minimized = "true";
  updateFullscreenState();
  setDockActive(id, true);
}

function toggleMaximize(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (!win.classList.contains("visible")) openWindow(id);

  windows.forEach((otherWin) => {
    if (otherWin.id !== id) otherWin.classList.remove("maximized");
  });

  win.classList.toggle("maximized");
  bringToFront(win);
  updateFullscreenState();
}

function updateFullscreenState() {
  const hasMaximized = windows.some((w) => w.classList.contains("maximized"));
  document.body.classList.toggle("has-maximized", hasMaximized);
}

function toggleFromDock(id) {
  const win = document.getElementById(id);
  if (!win) return;

  if (!win.classList.contains("visible")) {
    openWindow(id);
    return;
  }

  const isTop = Number(win.style.zIndex || 0) === zIndexCounter;
  if (isTop) {
    minimizeWindow(id);
  } else {
    bringToFront(win);
  }
}

// ----- Attach dock events -----
dockButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const windowId = button.dataset.window;
    toggleFromDock(windowId);
  });
});

// ----- Dragging for each window -----
windows.forEach((win) => {
  const header = win.querySelector(".window-header");
  win.addEventListener("mousedown", () => bringToFront(win));

  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;
  let dragging = false;

  header.addEventListener("mousedown", (event) => {
    if (
      event.target.classList.contains("light") ||
      win.classList.contains("maximized")
    ) {
      return;
    }

    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    originLeft = win.offsetLeft;
    originTop = win.offsetTop;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  });

  function onDrag(event) {
    if (!dragging) return;
    const nextLeft = originLeft + (event.clientX - startX);
    const nextTop = originTop + (event.clientY - startY);
    const maxLeft = window.innerWidth - win.offsetWidth;
    const maxTop = window.innerHeight - 90;

    win.style.left = `${Math.max(0, Math.min(nextLeft, maxLeft))}px`;
    win.style.top = `${Math.max(32, Math.min(nextTop, maxTop))}px`;
  }

  function stopDrag() {
    dragging = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  }
});

// ----- ESC exits maximize -----
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  windows.forEach((win) => win.classList.remove("maximized"));
  updateFullscreenState();
});

// ----- Initialize -----
updateClock();
setInterval(updateClock, 1000);

// ----- Initialize -----
updateClock();
setInterval(updateClock, 1000);

// Open only the three startup windows
openWindow("window-crypto");
openWindow("window-news");
openWindow("window-agent");



let isDashboardMode = false;

function syncUnifiedDashboard() {
  // Weather
  setText("ud-weather-temp", document.getElementById("weather-temp")?.textContent || "--");
  setText("ud-weather-wind", document.getElementById("weather-wind")?.textContent || "--");
  setText("ud-weather-humidity", document.getElementById("weather-humidity")?.textContent || "--");
  setText("ud-weather-summary", document.getElementById("weather-summary")?.textContent || "Waiting for weather data...");

  // Crypto
  setText("ud-btc-price", document.getElementById("btc-price")?.textContent || "--");
  setText("ud-btc-change", document.getElementById("btc-change")?.textContent || "--");
  setText("ud-eth-price", document.getElementById("eth-price")?.textContent || "--");
  setText("ud-eth-change", document.getElementById("eth-change")?.textContent || "--");

  // News
  const udNews = document.getElementById("ud-news-list");
  if (udNews) {
    udNews.innerHTML = document.getElementById("news-list")?.innerHTML || "";
  }

  // GitHub
  const udGitHub = document.getElementById("ud-github-list");
  if (udGitHub) {
    udGitHub.innerHTML = document.getElementById("github-activity-list")?.innerHTML || "";
  }

  // Tasks
  const udTasks = document.getElementById("ud-task-list");
  if (udTasks) {
    udTasks.innerHTML = document.getElementById("task-list")?.innerHTML || "";
  }

  // System
  setText("ud-sys-cores", document.getElementById("sys-cores")?.textContent || "--");
  setText("ud-sys-ram", document.getElementById("sys-ram")?.textContent || "--");
  setText("ud-sys-browser", document.getElementById("sys-browser")?.textContent || "--");
  setText("ud-sys-battery", document.getElementById("sys-battery")?.textContent || "--");

  // Agent preview
  setText(
    "ud-agent-preview",
    document.getElementById("agent-messages")?.textContent?.trim() ||
      "Ask the agent in the floating Agent window and key summaries can be shown here."
  );
}

function enterDashboardMode() {
  const dashboard = document.getElementById("unified-dashboard");
  if (!dashboard) return;
  isDashboardMode = true;
  document.body.classList.add("dashboard-mode");
  dashboard.classList.add("active");
  syncUnifiedDashboard();
}

function exitDashboardMode() {
  const dashboard = document.getElementById("unified-dashboard");
  if (!dashboard) return;
  isDashboardMode = false;
  document.body.classList.remove("dashboard-mode");
  dashboard.classList.remove("active");
}

document.getElementById("dashboard-mode-toggle")?.addEventListener("click", () => {
  if (isDashboardMode) {
    exitDashboardMode();
  } else {
    enterDashboardMode();
  }
});

document.getElementById("dashboard-mode-close")?.addEventListener("click", () => {
  exitDashboardMode();
});