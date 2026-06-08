// scripts/widgets/tasks.js
// Simple in-memory task list for "Today · Tasks"

let lastTasks = []; // used later by agent.js

function renderTasks() {
  const listEl = document.getElementById("task-list");
  if (!listEl) return;

  listEl.innerHTML = "";
  lastTasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      lastTasks[idx].done = !lastTasks[idx].done;
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    li.appendChild(checkbox);
    li.appendChild(text);
    listEl.appendChild(li);
  });
}

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = taskInput.value.trim();
  if (!val) return;
  lastTasks.push({ text: val, done: false });
  taskInput.value = "";
  renderTasks();
});

document
  .getElementById("task-clear-done")
  ?.addEventListener("click", () => {
    lastTasks = lastTasks.filter((t) => !t.done);
    renderTasks();
  });

document
  .getElementById("task-clear-all")
  ?.addEventListener("click", () => {
    if (!lastTasks.length) return;
    if (!confirm("Clear all tasks?")) return;
    lastTasks = [];
    renderTasks();
  });

// Initial empty render
renderTasks();