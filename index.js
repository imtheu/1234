import { startCounter } from "./src/counter.js";
import {
  togglePlayingState,
  toggleHasVideo,
  addMainButtonListeners,
  getFormData,
  convertTimeToSeconds,
  addKeyboardListeners,
  addStartTimeEventListener,
} from "./src/ui.js";
import {
  addVideoListeners,
  getInitialVideoState,
  playVideo,
  setVideoTime,
} from "./src/video.js";

(async () => {
  const [{ url }] = await chrome.tabs.query({ active: true });

  if (url.startsWith("chrome://")) {
    return;
  }

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

  const onPlay = () => {
    const formData = getFormData();
    const bpm = formData.get("bpm");
    const beats = formData.get("beats");
    const startTime = formData.get("start_time");
    const timeInSeconds = convertTimeToSeconds(startTime);
    setVideoTime(timeInSeconds);

    startCounter(+bpm, +beats).then(playVideo);
  };

  const onStop = () => {
    const formData = getFormData();
    const startTime = formData.get("start_time");
    const timeInSeconds = convertTimeToSeconds(startTime);
    setVideoTime(timeInSeconds);
  };

  addKeyboardListeners();
  addMainButtonListeners(onPlay, onStop);
  addStartTimeEventListener((time) => setVideoTime(time));
})();
