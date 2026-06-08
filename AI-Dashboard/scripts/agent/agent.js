// scripts/agent/agent.js
// On-screen Agent: UI wiring + dashboard context -> Gemini
// Includes:
// - floating agent chat
// - dashboard mode chat
// - disabled send buttons while request is running
// - Gemini task creation via JSON reply parsing
// - friendlier synced messages

const messagesEl = document.getElementById("agent-messages");
const inputEl = document.getElementById("agent-input");
const sendBtn = document.getElementById("agent-send");
const saveKeyBtn = document.getElementById("gemini-save");

// Dashboard mode chat elements
const dashboardMessagesEl = document.getElementById("ud-agent-messages");
const dashboardInputEl = document.getElementById("ud-agent-input");
const dashboardSendBtn = document.getElementById("ud-agent-send");

let agentBusy = false;

// Safely read dashboard state from the widget globals
function getDashboardContext() {
  return {
    weather: typeof lastWeather !== "undefined" ? lastWeather : null,
    crypto: typeof lastCrypto !== "undefined" ? lastCrypto : null,
    news:
      typeof lastNews !== "undefined" && lastNews
        ? (lastNews.articles || []).slice(0, 6).map((a) => ({
            title: a.title,
            source: a.source?.name,
          }))
        : null,
    github:
      typeof lastGitHub !== "undefined" && lastGitHub
        ? lastGitHub.slice(0, 6).map((e) => ({
            type: e.type,
            repo: e.repo?.name,
            created_at: e.created_at,
          }))
        : null,
    tasks: typeof lastTasks !== "undefined" ? lastTasks : [],
    system: typeof lastSystem !== "undefined" ? lastSystem : null,
  };
}

// Append same message to both chat panels
function appendAgentMessage(role, text) {
  const prefix = role === "user" ? "You: " : "Agent: ";

  if (messagesEl) {
    messagesEl.textContent += prefix + text + "\n\n";
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  if (dashboardMessagesEl) {
    dashboardMessagesEl.textContent += prefix + text + "\n\n";
    dashboardMessagesEl.scrollTop = dashboardMessagesEl.scrollHeight;
  }
}

function clearInitialPlaceholderIfNeeded() {
  const placeholders = [
    "Agent ready. After we wire Gemini, answers will appear here.",
    "Gemini dashboard chat ready.",
    "Dashboard Gemini chat ready.\n\nAsk me about weather, crypto, news, GitHub, tasks, or system status.",
  ];

  if (messagesEl && placeholders.includes(messagesEl.textContent.trim())) {
    messagesEl.textContent = "";
  }

  if (
    dashboardMessagesEl &&
    placeholders.includes(dashboardMessagesEl.textContent.trim())
  ) {
    dashboardMessagesEl.textContent = "";
  }
}

function setAgentBusyState(isBusy) {
  agentBusy = isBusy;

  if (sendBtn) {
    sendBtn.disabled = isBusy;
    sendBtn.textContent = isBusy ? "Thinking..." : "Ask Gemini";
  }

  if (dashboardSendBtn) {
    dashboardSendBtn.disabled = isBusy;
    dashboardSendBtn.textContent = isBusy ? "Thinking..." : "Ask";
  }
}

// Parse structured Gemini reply for task creation
function tryApplyTaskActionFromReply(replyText) {
  if (!replyText) return false;

  let parsed;
  try {
    parsed = JSON.parse(replyText);
  } catch {
    return false;
  }

  if (
    parsed &&
    parsed.action === "add_tasks" &&
    Array.isArray(parsed.tasks) &&
    parsed.tasks.length
  ) {
    parsed.tasks.forEach((task) => {
      if (typeof task === "string" && task.trim()) {
        if (typeof lastTasks !== "undefined") {
          lastTasks.push({
            text: task.trim(),
            done: false,
          });
        }
      }
    });

    if (typeof renderTasks === "function") {
      renderTasks();
    }

    // If unified dashboard task list is copied from main task list elsewhere,
    // it will refresh there too. No extra action required here.
    return true;
  }

  return false;
}

// Core handler for sending a question to Gemini
async function handleAgentQuery(promptText) {
  if (agentBusy) return;

  const prompt =
    promptText ||
    inputEl?.value.trim() ||
    dashboardInputEl?.value.trim();

  if (!prompt) return;

  clearInitialPlaceholderIfNeeded();
  appendAgentMessage("user", prompt);

  if (inputEl) inputEl.value = "";
  if (dashboardInputEl) dashboardInputEl.value = "";

  const ctx = getDashboardContext();

  setAgentBusyState(true);
  appendAgentMessage("assistant", "Thinking with live dashboard context…");

  try {
    let finalPrompt = prompt;

    // If the user is asking Gemini to add tasks, force JSON-only output
    if (
      /add .*task|add .*todo|create .*task|put .*in my tasks|add to my tasks/i.test(
        prompt
      )
    ) {
      finalPrompt =
        'Return ONLY valid JSON with this exact shape: ' +
        '{"action":"add_tasks","tasks":["task 1","task 2"]}. ' +
        "Do not include markdown, explanation, or extra text. " +
        "User request: " + prompt;
    }

    const reply = await callGemini(finalPrompt, ctx);

    const applied = tryApplyTaskActionFromReply(reply);

    if (applied) {
      appendAgentMessage("assistant", "Tasks added to your Tasks window.");
    } else {
      appendAgentMessage("assistant", reply);
    }
  } catch (err) {
    console.error(err);
    appendAgentMessage(
      "assistant",
      "Gemini error: " + (err.message || "Check your API key and network.")
    );
  } finally {
    setAgentBusyState(false);
  }
}

// Floating agent send
sendBtn?.addEventListener("click", () => {
  const prompt = inputEl?.value.trim();
  handleAgentQuery(prompt);
});

// Floating agent enter-to-send
inputEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleAgentQuery(inputEl.value.trim());
  }
});

// Dashboard agent send
dashboardSendBtn?.addEventListener("click", () => {
  const prompt = dashboardInputEl?.value.trim();
  handleAgentQuery(prompt);
});

// Dashboard agent enter-to-send
dashboardInputEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleAgentQuery(dashboardInputEl.value.trim());
  }
});

// Save key button -> delegate to geminiClient helper
saveKeyBtn?.addEventListener("click", () => {
  if (typeof setGeminiKeyFromInput === "function") {
    setGeminiKeyFromInput();
  }
});

// Quick prompt buttons
document.querySelectorAll("[data-prompt]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const p = btn.getAttribute("data-prompt");
    if (p) handleAgentQuery(p);
  });
});

// Optional show/hide key button if present
document
  .getElementById("gemini-toggle-visibility")
  ?.addEventListener("click", () => {
    const keyEl = document.getElementById("gemini-key");
    const btn = document.getElementById("gemini-toggle-visibility");
    if (!keyEl || !btn) return;

    if (keyEl.type === "password") {
      keyEl.type = "text";
      btn.textContent = "Hide";
    } else {
      keyEl.type = "password";
      btn.textContent = "Show";
    }
  });

// Initial helper text if empty
if (messagesEl && !messagesEl.textContent.trim()) {
  messagesEl.textContent =
    "1. Paste your Gemini API key and click Use.\n" +
    "2. Open some widgets so I have context.\n" +
    '3. Ask: "Summarize everything on my dashboard."';
}

if (dashboardMessagesEl && !dashboardMessagesEl.textContent.trim()) {
  dashboardMessagesEl.textContent =
    "Dashboard Gemini chat ready.\n\n" +
    "Ask me about weather, crypto, news, GitHub, tasks, or system status.";
}