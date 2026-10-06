(() => {
  const OVERLAY_ID = "drink-water-reminder-overlay";
  if (document.getElementById(OVERLAY_ID)) return;

  const MESSAGES = [
    { emoji: "💧", title: "Time for a hydration break!" },
    { emoji: "🥤", title: "Your water is waiting." },
    { emoji: "🧠", title: "Hydrate your brain." },
    { emoji: "👀", title: "You've been staring at the screen long enough." },
    { emoji: "💦", title: "Take a sip!" },
    { emoji: "🚰", title: "Water check!" },
  ];
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.innerHTML = `
    <div class="dwr-card">
      <div class="dwr-emoji">${msg.emoji}</div>
      <h1>${msg.title}</h1>
      <p>Take a moment to stay hydrated.</p>
      <button id="dwr-drank">💧 I drank water</button>
      <button id="dwr-dismiss">Dismiss</button>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #${OVERLAY_ID} {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0b6cad, #2196f3);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, "Segoe UI", Arial, sans-serif;
      animation: dwr-fadein 0.25s ease-out;
    }
    #${OVERLAY_ID} .dwr-card {
      text-align: center;
      color: #ffffff;
      max-width: 420px;
      padding: 24px;
    }
    #${OVERLAY_ID} .dwr-emoji {
      font-size: 72px;
      margin-bottom: 12px;
    }
    #${OVERLAY_ID} h1 {
      font-size: 32px;
      margin: 0 0 8px;
    }
    #${OVERLAY_ID} p {
      font-size: 16px;
      opacity: 0.9;
      margin: 0 0 24px;
    }
    #${OVERLAY_ID} button {
      display: block;
      width: 100%;
      background: #ffffff;
      color: #0b6cad;
      border: none;
      border-radius: 8px;
      padding: 12px 28px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 12px;
    }
    #${OVERLAY_ID} button:hover {
      background: #eaf6ff;
    }
    #${OVERLAY_ID} #dwr-dismiss {
      background: transparent;
      color: #ffffff;
      border: 1.5px solid rgba(255, 255, 255, 0.6);
    }
    #${OVERLAY_ID} #dwr-dismiss:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    @keyframes dwr-fadein {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  document.documentElement.appendChild(style);
  document.documentElement.appendChild(overlay);

  function close() {
    overlay.remove();
    style.remove();
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(e) {
    if (e.key === "Escape") close();
  }

  function logDrink() {
    const today = new Date().toISOString().slice(0, 10);
    chrome.storage.local.get(["drinkLog"], (data) => {
      const log = data.drinkLog || {};
      const times = log[today] || [];
      times.push(new Date().toISOString());
      log[today] = times;
      chrome.storage.local.set({ drinkLog: log });
    });
  }

  document.getElementById("dwr-drank").addEventListener("click", () => {
    logDrink();
    close();
  });
  document.getElementById("dwr-dismiss").addEventListener("click", close);
  document.addEventListener("keydown", onKeydown);
})();
