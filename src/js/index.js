import { startCounter } from "./counter.js";
import { getData, saveData } from "./storage.js";
import {
  toggleButtonState,
  toggleHasVideo,
  addMainButtonListeners,
  getFormData,
  convertTimeToSeconds,
  addKeyboardListeners,
  addStartTimeEventListener,
  updateCounter,
  addSaveListener,
  setInitialFormData,
} from "./ui.js";
import {
  addVideoListeners,
  getInitialVideoState,
  getVideoPageMetadata,
  getVideoPageUrl,
  playVideo,
  setVideoTime,
} from "./video.js";
import burgerMenu from "./burgerMenu.js";

(async () => {
  const [{ url }] = await chrome.tabs.query({ active: true });

  burgerMenu.initialize();

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

  try {
    const metadata = await getVideoPageMetadata();
    const videoUrl = metadata["og:url"] ?? (await getVideoPageUrl());

    if (videoUrl) {
      const settings = await getData(videoUrl);
      setInitialFormData(settings);
    }
  } catch {}

  const extractData = (formData) => {
    const bpm = formData.get("bpm");
    const beats = formData.get("beats");
    const startTime = formData.get("start_time");

    return {
      bpm,
      beats,
      startTime,
    };
  };

  const onPlay = () => {
    const { beats, bpm, startTime } = extractData(getFormData());
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

  const onSave = async () => {
    const data = extractData(getFormData());
    const metadata = await getVideoPageMetadata();

    let videoUrl =
      metadata.isYoutube || !metadata["og:url"]
        ? metadata.url
        : metadata["og:url"];

    if (!videoUrl) {
      videoUrl = await getVideoPageUrl();
    }

    if (!videoUrl) {
      alert("Unable to save the settings for this site");
    }

    saveData({ [videoUrl]: { ...data, pageMetadata: metadata } });
  };

  addKeyboardListeners();
  addMainButtonListeners(onPlay, onStop);
  addSaveListener(onSave);
  addStartTimeEventListener((time) => setVideoTime(time));
})();
