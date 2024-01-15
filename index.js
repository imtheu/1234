import { startCounter } from "./src/counter.js";
import { hasVideoElement, playVideo } from "./src/video.js";

(async () => {
  const noVideoContentElement = document.getElementById("noVideo");
  const hasVideoContentElement = document.getElementById("hasVideo");

  const hasVideo = await hasVideoElement();

  hasVideoContentElement.classList.toggle("isVisible", hasVideo);
  noVideoContentElement.classList.toggle("isVisible", !hasVideo);

  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", () => startCounter().then(playVideo));
})();
