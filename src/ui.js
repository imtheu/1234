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
  playButton.addEventListener("click", onPlay);
};
