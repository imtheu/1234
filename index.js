let step;
let start;
let beatMax;
let beatCount = 0;
let time = 0;

const audios = [
  new Audio("./sounds/metronome.mp3"),
  new Audio("./sounds/metronome.mp3"),
];

const hasVideoElement = async () => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });

  return new Promise((resolve) =>
    chrome.scripting.executeScript(
      {
        target: {
          tabId,
        },
        func: () => !!document.querySelector("video"),
      },
      ([{ result }]) => resolve(result)
    )
  );
};

const playVideo = async () => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });

  chrome.scripting.executeScript({
    target: {
      tabId,
    },
    func: () => {
      document.querySelector("video")?.play();
    },
  });
};

const beat = () => {
  if (beatCount === beatMax) {
    playVideo();
  } else {
    audios[beatCount % 2].play();
  }

  time += step;
  const diff = new Date().getTime() - start - time;

  if (beatCount < beatMax) {
    window.setTimeout(beat, step - diff);
    beatCount++;
  }
};

const onPlay = () => {
  time = 0;
  beatCount = 0;
  beatMax = 4;

  const bpm = 128;
  start = new Date().getTime();
  step = 60000 / bpm;

  window.setTimeout(beat, step);
};

(async () => {
  const noVideoContentElement = document.getElementById("noVideo");
  const hasVideoContentElement = document.getElementById("hasVideo");

  const hasVideo = await hasVideoElement();

  hasVideoContentElement.classList.toggle("isVisible", hasVideo);
  noVideoContentElement.classList.toggle("isVisible", !hasVideo);

  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", onPlay);
})();
