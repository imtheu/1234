let step;
let start;
let beatMax;
let beatCount = 0;
let time = 0;

const audioPath = "./sounds/metronome.mp3";
const audios = [new Audio(audioPath), new Audio(audioPath)];

const beat = (resolve) => {
  if (beatCount === beatMax) {
    return resolve();
  } else {
    audios[beatCount % 2].play();
  }

  time += step;
  const diff = new Date().getTime() - start - time;

  if (beatCount < beatMax) {
    window.setTimeout(() => beat(resolve), step - diff);
    beatCount++;
  }
};

export const startCounter = () => {
  time = 0;
  beatCount = 0;
  beatMax = 4;

  const bpm = 128;
  start = new Date().getTime();
  step = 60000 / bpm;

  return new Promise((resolve) => window.setTimeout(() => beat(resolve), step));
};
