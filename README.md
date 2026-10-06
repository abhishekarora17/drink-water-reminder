# Drink Water Reminder (Chrome Extension)

Shows a full-screen overlay reminding you to drink water at a chosen interval.

## Load it in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder: `drink-water-reminder`
5. Click the extension icon in the toolbar, pick an interval, and click **Start Reminder**

## How it works

- `background.js` is the service worker: it sets a `chrome.alarms` timer for the chosen interval.
- When the alarm fires, it injects `overlay.js` into your active tab, which draws a full-screen overlay covering the entire page and shows a system notification as a backup.
- Click "Got it, I drank water" or press `Esc` to dismiss the overlay.
- Settings (interval, on/off) persist via `chrome.storage.local`, so the reminder keeps running across browser restarts as long as Chrome is open.

## Notes

- The overlay only appears on regular web pages (`http://`/`https://`) — Chrome blocks script injection on internal pages like `chrome://extensions` or the Web Store.
- To change the interval, just pick a new one and click **Start Reminder** again — it replaces the existing timer.
