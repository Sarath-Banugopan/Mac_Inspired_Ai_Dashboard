// scripts/widgets/crypto.js
// Live BTC + ETH prices from CoinGecko

let lastCrypto = null; // used later by agent.js

async function loadCrypto(showErrors = true) {
  const url =
    "https://api.coingecko.com/api/v3/simple/price" +
    "?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true";

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Crypto API error");
    const data = await resp.json();
    lastCrypto = data;

    const btc = data.bitcoin || {};
    const eth = data.ethereum || {};

    setText(
      "btc-price",
      btc.usd != null ? "$" + btc.usd.toLocaleString() : "--"
    );
    setText(
      "eth-price",
      eth.usd != null ? "$" + eth.usd.toLocaleString() : "--"
    );

    const btcChange = btc.usd_24h_change;
    const ethChange = eth.usd_24h_change;

    setText(
      "btc-change",
      btcChange != null
        ? (btcChange >= 0 ? "▲ " : "▼ ") + btcChange.toFixed(2) + "%"
        : "--"
    );
    setText(
      "eth-change",
      ethChange != null
        ? (ethChange >= 0 ? "▲ " : "▼ ") + ethChange.toFixed(2) + "%"
        : "--"
    );

    setText("crypto-updated", "Updated: " + new Date().toLocaleTimeString());
  } catch (err) {
    console.error(err);
    if (showErrors) {
      setText(
        "crypto-note",
        "Unable to load prices. CoinGecko may be rate limiting; try again."
      );
    }
  }
}

// Button handler
document
  .getElementById("crypto-refresh")
  ?.addEventListener("click", () => {
    loadCrypto(true);
  });

// Initial load + auto-refresh prices every 60s
loadCrypto(false);
setInterval(() => loadCrypto(false), 60000);