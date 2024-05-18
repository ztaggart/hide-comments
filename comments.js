chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "ask") {
    sendResponse({
      message: localStorage.getItem("blockComments"),
    });
  } else {
    localStorage.setItem("blockComments", request.message);
  }
});

// if disabled, tell popup menu
console.log("localStorage", localStorage.getItem("blockComments"));
if (localStorage.getItem("blockComments") === "off") {
  (async () => {
    console.log("sending message");
    await chrome.runtime.sendMessage({ message: "off" });
  })();
}

start();

function start() {
  if (localStorage.getItem("blockComments") !== "off") {
    hideComments();
    setupEventListeners();
  }
}

function setupEventListeners() {
  // attach function to video to allow comments to be read when video is done
  videoEndSetup();
  // show comments when recommended video card shows in video
  recommendedVideoCardSetup();
}

function videoEndSetup() {
  let video = document.querySelector(".html5-main-video");
  if (video) {
    // show comments when video ends
    video.addEventListener("ended", () => showComments());
  } else {
    waitForLoad(videoEndSetup);
  }
}

function recommendedVideoCardSetup() {
  let recCard = document.querySelector(".ytp-ce-element");
  if (recCard) {
    let classWatcher = new ClassWatcher(
      recCard,
      "ytp-ce-element-show",
      showComments,
      hideComments
    );
  } else {
    waitForLoad(recommendedVideoCardSetup);
  }
}

function waitForLoad(callback) {
  setTimeout(callback, 300);
}

function showComments() {
  let comments = document.querySelector("#comments");
  if (comments) {
    comments.style.display = "revert";
  }
}

function hideComments() {
  let comments = document.querySelector("#comments");
  if (comments) {
    comments.style.display = "none";
  } else {
    waitForLoad(hideComments);
  }
}

//https://stackoverflow.com/questions/10612024/event-trigger-on-a-class-change
class ClassWatcher {
  constructor(
    targetNode,
    classToWatch,
    classAddedCallback,
    classRemovedCallback
  ) {
    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, { attributes: true });
  }

  disconnect() {
    this.observer.disconnect();
  }

  mutationCallback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        let currentClassState = mutation.target.classList.contains(
          this.classToWatch
        );
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          if (currentClassState) {
            this.classAddedCallback();
          } else {
            this.classRemovedCallback();
          }
        }
      }
    }
  };
}
