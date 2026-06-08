// scripts/agent/geminiClient.js
// Lighter Gemini client using Gemini 2.5 Flash-Lite

let GEMINI_API_KEY = "";

function setGeminiKeyFromInput() {
  const keyEl = document.getElementById("gemini-key");
  const statusEl = document.getElementById("gemini-key-status");
  const topStatus = document.getElementById("gemini-status");
  const saveBtn = document.getElementById("gemini-save");

  if (!keyEl) return;

  const value = keyEl.value.trim();

  if (!value) {
    if (statusEl) {
      statusEl.textContent = "Paste a Gemini API key to enable the agent.";
      statusEl.style.color = "#b91c1c";
    }
    if (topStatus) {
      topStatus.textContent = "Gemini: Not connected";
    }
    return;
  }

  GEMINI_API_KEY = value;

  if (topStatus) {
    topStatus.textContent = "Gemini: Connected (Flash-Lite)";
  }

  if (saveBtn) {
    saveBtn.textContent = "Using Gemini";
  }

  if (statusEl) {
    statusEl.textContent = "Key set for this tab. Flash-Lite is ready.";
    statusEl.style.color = "#4b5563";
  }
}

async function callGemini(prompt, dashboardContext) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set.");
  }

  const systemInstruction =
    "You are an AI agent embedded in a personal dashboard. " +
    "Answer briefly, use the provided dashboard JSON context, " +
    "and do not invent missing facts.";

const url =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  "gemini-2.0-flash:generateContent?key=" +
  encodeURIComponent(GEMINI_API_KEY);

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: systemInstruction },
          {
            text:
              "Dashboard context (JSON):\n" +
              JSON.stringify(dashboardContext || {}, null, 2),
          },
          { text: "\nUser question:\n" + prompt },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 300,
    },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    console.error("Gemini error:", resp.status, errText);

    if (resp.status === 401) {
      throw new Error("Invalid Gemini API key.");
    }

    if (resp.status === 403) {
      throw new Error("Gemini API access is blocked for this project or key.");
    }

    if (resp.status === 429) {
      throw new Error("Rate limit reached. Please wait a few seconds and try again.");
    }

    if (resp.status === 404) {
      throw new Error("Gemini model endpoint not found.");
    }

    throw new Error("Gemini API error: " + resp.status);
  }

  const data = await resp.json();
  const candidates = data.candidates || [];
  const parts = candidates[0]?.content?.parts || [];
  const text = parts.map((p) => p.text || "").join("\n").trim();

  if (!text) {
    throw new Error("Gemini returned no response text.");
  }

  return text;
}