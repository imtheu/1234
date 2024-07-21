export const togglePlayingState = (isPlaying) => {
  const mainButtonContainerElement = document.getElementById("mainButton");
  mainButtonContainerElement.classList.toggle("isPlaying", isPlaying);
};

export const toggleHasVideo = (hasVideo) => {
  const noVideoContentElement = document.getElementById("noVideo");
  const hasVideoContentElement = document.getElementById("hasVideo");

  hasVideoContentElement.classList.toggle("isVisible", hasVideo);
  noVideoContentElement.classList.toggle("isVisible", !hasVideo);
};

export const addMainButtonListeners = (onPlay, onStop) => {
  const playButton = document.getElementById("playButton");
  const stopButton = document.getElementById("stopButton");

  playButton.addEventListener("click", onPlay);
  stopButton.addEventListener("click", onStop);
};

export const convertTimeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const getFormData = () => {
  const form = document.querySelector("form");
  const formData = new FormData(form);

  return formData;
};

export const addKeyboardListeners = () => {
  document.addEventListener("keydown", ({ key }) => {
    if (key === " ") {
      const button = document.querySelector(
        ".isPlaying #stopButton, #playButton"
      );
      button.click();
    }
  });
};
