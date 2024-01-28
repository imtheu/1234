import { startCounter } from "./src/counter.js";
import {
  addVideoListeners,
  getInitialVideoState,
  playVideo,
} from "./src/video.js";

(async () => {
  const noVideoContentElement = document.getElementById("noVideo");
  const hasVideoContentElement = document.getElementById("hasVideo");
  const mainButtonContainerElement = document.getElementById("mainButton");

  chrome.runtime.onMessage.addListener((req) => {
    if (req.startsWith("VIDEO:")) {
      const action = req.split(":")[1];
      const isPlaying = action === "PLAY";
      mainButtonContainerElement.classList.toggle("isPlaying", isPlaying);
    }
  });

  try {
    const { playing } = await getInitialVideoState();
    mainButtonContainerElement.classList.toggle("isPlaying", playing);

    hasVideoContentElement.classList.toggle("isVisible", true);
    noVideoContentElement.classList.toggle("isVisible", false);

    await addVideoListeners();
  } catch {
    hasVideoContentElement.classList.toggle("isVisible", false);
    noVideoContentElement.classList.toggle("isVisible", true);
  }

  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", () => startCounter().then(playVideo));
})();
