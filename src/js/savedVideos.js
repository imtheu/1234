import burgerMenu from "./burgerMenu.js";
import { getAll } from "./storage.js";

const template = document.getElementById("savedVideoTemplate");
const list = document.getElementById("savedVideosList");

const createElement = (metadata, url) => {
  const clone = template.content.cloneNode(true);

  if (metadata) {
    clone.querySelector("p").textContent = metadata["og:title"];
    clone.querySelector("span").textContent = metadata["og:site_name"];
    clone.querySelector("img").src = metadata["og:image"];
  } else {
    clone.querySelector("p").textContent = url;
  }

  clone.querySelector("a").href = url;

  return clone;
};

(async () => {
  const videos = await getAll();

  Object.keys(videos).forEach((url) => {
    const video = videos[url];
    const element = createElement(video.pageMetadata, url);
    list.appendChild(element);
  });

  burgerMenu.initialize();
})();
