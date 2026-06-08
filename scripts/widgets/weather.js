// scripts/widgets/weather.js
// Live weather widget (Open‑Meteo)

const WEATHER_COORDS = { lat: 13.0827, lon: 80.2707 }; // Chennai
let lastWeather = null; // used later by agent.js

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

async function loadWeather(showErrors = true) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    WEATHER_COORDS.lat +
    "&longitude=" +
    WEATHER_COORDS.lon +
    "&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto";

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Weather API error");
    const data = await resp.json();
    const current = data.current || data.current_weather || {};
    lastWeather = current;

    const t = current.temperature_2m;
    const w = current.wind_speed_10m;
    const h = current.relative_humidity_2m;

    setText(
      "weather-temp",
      t != null ? t.toFixed(1) + " °C" : "--"
    );
    setText(
      "weather-wind",
      w != null ? w.toFixed(1) + " km/h" : "--"
    );
    setText(
      "weather-humidity",
      h != null ? h.toFixed(0) + " %" : "--"
    );

    let desc = "Clear sky";
    const code = current.weather_code;
    if (code >= 1 && code <= 3) desc = "Partly cloudy";
    else if (code >= 45 && code <= 48) desc = "Fog or mist";
    else if (code >= 51 && code <= 67) desc = "Drizzle or rain";
    else if (code >= 71 && code <= 77) desc = "Snowfall or snow grains";
    else if (code >= 80 && code <= 82) desc = "Rain showers";

    setText(
      "weather-summary",
      desc + " · live data from Open‑Meteo."
    );
    setText("weather-updated", "Updated: " + new Date().toLocaleTimeString());
  } catch (err) {
    console.error(err);
    if (showErrors) {
      setText(
        "weather-summary",
        "Unable to load weather. Please try again."
      );
    }
  }
}

// Attach button handler
document
  .getElementById("weather-refresh")
  ?.addEventListener("click", () => loadWeather(true));

// Initial load (no error message if it fails first time)
loadWeather(false);