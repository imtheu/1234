import { startCounter } from "./src/counter.js";
import {
  togglePlayingState,
  toggleHasVideo,
  addMainButtonListeners,
} from "./src/ui.js";
import {
  addVideoListeners,
  getInitialVideoState,
  playVideo,
} from "./src/video.js";

(async () => {
  chrome.runtime.onMessage.addListener((req) => {
    if (req.startsWith("VIDEO:")) {
      const action = req.split(":")[1];
      const isPlaying = action === "PLAY";
      togglePlayingState(isPlaying);
    }
  });

  try {
    const { playing } = await getInitialVideoState();
    togglePlayingState(playing);
    toggleHasVideo(true);

    await addVideoListeners();
  } catch {
    toggleHasVideo(false);
  }

  const onPlay = startCounter().then(playVideo);
  addMainButtonListeners(onPlay);
})();
