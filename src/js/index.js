import { startCounter } from "./counter.js";
import {
  toggleButtonState,
  toggleHasVideo,
  addMainButtonListeners,
  getFormData,
  convertTimeToSeconds,
  addKeyboardListeners,
  addStartTimeEventListener,
  updateCounter,
} from "./ui.js";
import {
  addVideoListeners,
  getInitialVideoState,
  playVideo,
  setVideoTime,
} from "./video.js";

(async () => {
  const [{ url }] = await chrome.tabs.query({ active: true });

  if (url.startsWith("chrome://")) {
    return;
  }

  chrome.runtime.onMessage.addListener((req) => {
    if (req.startsWith("VIDEO:")) {
      const action = req.split(":")[1];
      const isPlaying = action === "PLAY";
      toggleButtonState({ isPlaying });
    }
  });

  try {
    const { playing } = await getInitialVideoState();
    toggleButtonState({ isPlaying: playing });
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
    toggleButtonState({ isCounting: true });

    startCounter(+bpm, +beats, (beat) => updateCounter(beat)).then(() => {
      playVideo();
      toggleButtonState({ isCounting: false });
      updateCounter(0);
    });
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
