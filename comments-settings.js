let turnOffBtn = document.querySelector("#turn-off");
let turnOnBtn = document.querySelector("#turn-on");

(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab) {
    const response = await chrome.tabs.sendMessage(tab.id, {
      message: "ask",
    });
    console.log("response", response);
    if (response.message === "off") {
      turnOffBtn.classList.add("hidden");
      turnOnBtn.classList.remove("hidden");
    }
  }
})();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("got response in popup");
  turnOffBtn.classList.add("hidden");
  turnOnBtn.classList.remove("hidden");
});
turnOffBtn.addEventListener("click", turnOff);
turnOnBtn.addEventListener("click", turnOn);

function turnOff() {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        message: "off",
      });
      turnOffBtn.classList.add("hidden");
      turnOnBtn.classList.remove("hidden");
    }
  })();
}
function turnOn() {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        message: "on",
      });
      turnOffBtn.classList.remove("hidden");
      turnOnBtn.classList.add("hidden");
    }
  })();
}
