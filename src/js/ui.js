export const toggleButtonState = ({ isPlaying, isCounting }) => {
  const mainButtonContainerElement = document.getElementById("mainButton");
  if (typeof isPlaying !== "undefined") {
    mainButtonContainerElement.classList.toggle("isPlaying", isPlaying);
  }

  if (typeof isCounting !== "undefined") {
    mainButtonContainerElement.classList.toggle("isCounting", isCounting);
  }
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

export const addStartTimeEventListener = (onChange) => {
  document
    .getElementById("start_time")
    .addEventListener("change", ({ target }) =>
      onChange(convertTimeToSeconds(target.value))
    );
};

export const updateCounter = (beat) => {
  const counter = document.getElementById("counter");
  counter.textContent = beat;
};

export const convertTimeToSeconds = (time) => {
  const [minutes, seconds, centiseconds] = time.split(":").map(Number);
  return minutes * 60 + seconds + centiseconds / 100;
};

export const getFormData = () => {
  const form = document.querySelector("form");
  const formData = new FormData(form);

  return formData;
};

export const addKeyboardListeners = () => {
  document.addEventListener("keydown", (event) => {
    const { key } = event;
    if (key === " ") {
      event.preventDefault();
      const isPlaying = !!document.querySelector(".isPlaying");
      const isCounting = !!document.querySelector(".isCounting");

      if (isCounting) {
        return;
      }

      let button;
      if (isPlaying) {
        button = document.querySelector("#stopButton");
      } else {
        button = document.querySelector("#playButton");
      }

      button.click();
    }
  });
};
