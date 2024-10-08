let step;
let start;
let beatMax;
let beatCount = 0;
let time = 0;

const audioPath = "../assets/sounds/metronome.mp3";
const audios = [new Audio(audioPath), new Audio(audioPath)];

const beat = (resolve, onCounterChange) => {
  if (beatCount === beatMax) {
    return resolve();
  } else {
    onCounterChange(beatCount + 1);
    audios[beatCount % 2].play();
  }

  time += step;
  const diff = new Date().getTime() - start - time;

  if (beatCount < beatMax) {
    window.setTimeout(() => beat(resolve, onCounterChange), step - diff);
    beatCount++;
  }
};

export const startCounter = (bpm, beats, onCounterChange) => {
  time = 0;
  beatCount = 0;
  beatMax = beats;

  start = new Date().getTime();
  step = 60000 / bpm;

  return new Promise((resolve) =>
    window.setTimeout(() => beat(resolve, onCounterChange), step)
  );
};
