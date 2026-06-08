// scripts/widgets/system.js
// Browser / device snapshot using navigator APIs

let lastSystem = null; // used later by agent.js

async function loadSystemInfo() {
  const cores = navigator.hardwareConcurrency || null; // logical CPU cores
  const mem = navigator.deviceMemory || null;          // approx RAM in GB (where supported)

  const ua = navigator.userAgent || "";
  const isOnline = navigator.onLine;

  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";

  let device = "Desktop";
  if (/Mobi|Android/i.test(ua)) device = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

  let batteryText = "Not available";
  try {
    if (navigator.getBattery) {
      const batt = await navigator.getBattery();
      const lvl = Math.round((batt.level || 0) * 100);
      batteryText =
        lvl + "% " + (batt.charging ? "(charging)" : "(on battery)");
    }
  } catch (_) {
    // ignore errors, keep default batteryText
  }

  lastSystem = {
    cores,
    memoryGB: mem,
    browser,
    device,
    online: isOnline,
    battery: batteryText,
  };

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("sys-cores", cores != null ? cores + " cores" : "Unknown");
  set("sys-ram", mem != null ? mem + " GB (approx)" : "Unknown");
  set("sys-browser", browser);
  set("sys-device", device);
  set("sys-online", isOnline ? "Online" : "Offline");
  set("sys-battery", batteryText);
}

document
  .getElementById("sys-refresh")
  ?.addEventListener("click", () => loadSystemInfo());

loadSystemInfo();