import burgerMenu from "./burgerMenu.js";
import { getAll } from "./storage.js";

const template = document.getElementById("savedVideoTemplate");
const list = document.getElementById("savedVideosList");

const createElement = (metadata, url) => {
  const clone = template.content.cloneNode(true);

  const titleEl = clone.querySelector("p");
  const infoEl = clone.querySelector("span");
  const thumbEl = clone.querySelector("img");

  if (metadata) {
    if (metadata.isYoutube) {
      titleEl.textContent = metadata.title;
      thumbEl.src = metadata.thumbnail;
    } else {
      titleEl.textContent = metadata["og:title"];
      thumbEl.src = metadata["og:image"];
    }

    infoEl.textContent = metadata["og:site_name"];
  } else {
    titleEl.textContent = url;
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
