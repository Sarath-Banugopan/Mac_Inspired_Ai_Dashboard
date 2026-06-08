// scripts/widgets/cryptoChart.js
// BTC 24h price chart using CoinGecko + Chart.js

let cryptoChart = null;
let unifiedCryptoChart = null;

async function loadCryptoChart(showErrors = true) {
  const url =
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart" +
    "?vs_currency=usd&days=1";

  try {
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded.");
    }

    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Crypto chart API error: " + resp.status);

    const data = await resp.json();
    const points = Array.isArray(data.prices) ? data.prices : [];
    if (!points.length) throw new Error("No chart data returned.");

    const labels = points.map((p) =>
      new Date(p[0]).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    const prices = points.map((p) => Number(p[1]));

    renderMainCryptoChart(labels, prices);
    renderUnifiedCryptoChart(labels, prices);

    const note = document.getElementById("crypto-note");
    if (note) {
      note.textContent = "24h BTC chart loaded from CoinGecko.";
    }
  } catch (err) {
    console.error("Crypto chart error:", err);
    if (showErrors) {
      const note = document.getElementById("crypto-note");
      if (note) {
        note.textContent =
          "Unable to load BTC chart. Check Chart.js, network, or CoinGecko limits.";
      }
    }
  }
}

function renderMainCryptoChart(labels, prices) {
  const canvas = document.getElementById("crypto-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (cryptoChart) {
    cryptoChart.destroy();
  }

  cryptoChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "BTC/USD (24h)",
          data: prices,
          borderColor: "#0f766e",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => " $" + ctx.parsed.y.toLocaleString(),
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 6,
            color: "#6b7280",
            font: { size: 10 },
          },
          grid: { display: false },
        },
        y: {
          ticks: {
            color: "#6b7280",
            font: { size: 10 },
            callback: (value) => "$" + Number(value).toLocaleString(),
          },
          grid: {
            color: "rgba(148, 163, 184, 0.25)",
          },
        },
      },
    },
  });
}

function renderUnifiedCryptoChart(labels, prices) {
  const canvas = document.getElementById("unified-crypto-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (unifiedCryptoChart) {
    unifiedCryptoChart.destroy();
  }

  unifiedCryptoChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data: prices,
          borderColor: "#0f766e",
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: {
          ticks: {
            color: "#6b7280",
            font: { size: 10 },
            callback: (value) => "$" + Number(value).toLocaleString(),
          },
          grid: {
            color: "rgba(148, 163, 184, 0.2)",
          },
        },
      },
    },
  });
}

document.getElementById("crypto-refresh")?.addEventListener("click", () => {
  loadCryptoChart(true);
});

window.addEventListener("load", () => {
  setTimeout(() => loadCryptoChart(false), 300);
});