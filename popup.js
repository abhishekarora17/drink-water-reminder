const intervalSelect = document.getElementById("interval");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const statusEl = document.getElementById("status");
const todayCountEl = document.getElementById("today-count");

if (!chrome?.runtime?.id) {
  statusEl.textContent =
    "This page must be opened via the extension's toolbar icon, not as a plain file.";
  startBtn.disabled = true;
  stopBtn.disabled = true;
  throw new Error(
    "Drink Water Reminder: popup.html was not loaded in an extension context."
  );
}

function refreshStatus() {
  chrome.storage.local.get(["intervalMinutes", "enabled"], (data) => {
    if (data.enabled && data.intervalMinutes) {
      statusEl.textContent = `Active: every ${data.intervalMinutes} min`;
      intervalSelect.value = String(data.intervalMinutes);
    } else {
      statusEl.textContent = "Reminder is off";
    }
  });
}

startBtn.addEventListener("click", () => {
  const minutes = Number(intervalSelect.value);
  chrome.runtime.sendMessage({ type: "START_REMINDER", minutes }, () => {
    refreshStatus();
  });
});

stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "STOP_REMINDER" }, () => {
    refreshStatus();
  });
});

function refreshTodayCount() {
  const today = new Date().toISOString().slice(0, 10);
  chrome.storage.local.get(["drinkLog"], (data) => {
    const count = data.drinkLog?.[today]?.length ?? 0;
    todayCountEl.textContent = `💧 Today: ${count} glass${count === 1 ? "" : "es"}`;
  });
}

refreshStatus();
refreshTodayCount();
