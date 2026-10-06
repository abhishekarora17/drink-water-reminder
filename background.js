const ALARM_NAME = "drink-water-alarm";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_REMINDER") {
    const minutes = Math.max(1, Number(message.minutes) || 60);
    chrome.storage.local.set({ intervalMinutes: minutes, enabled: true }, () => {
      chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: minutes,
        periodInMinutes: minutes,
      });
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === "STOP_REMINDER") {
    chrome.alarms.clear(ALARM_NAME, () => {
      chrome.storage.local.set({ enabled: false }, () => {
        sendResponse({ ok: true });
      });
    });
    return true;
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    showReminderOnActiveTab();
  }
});

// Also fires immediately if Chrome (re)starts and a periodic alarm was
// already scheduled but the browser was closed when it should have fired.
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.get(ALARM_NAME, (alarm) => {
    if (alarm) showReminderOnActiveTab();
  });
});

async function showReminderOnActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Some pages (chrome://, the Web Store, etc.) block content script injection.
    if (tab?.id && /^https?:/.test(tab.url || "")) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["overlay.js"],
      });
    }
  } catch (err) {
    console.warn("Drink Water Reminder: could not show overlay", err);
  }

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Time to drink water!",
    message: "Stay hydrated — take a sip now.",
    priority: 2,
  });
}
