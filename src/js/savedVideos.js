import burgerMenu from "./burgerMenu.js";
import { getAll, removeData } from "./storage.js";

const template = document.getElementById("savedVideoTemplate");
const list = document.getElementById("savedVideosList");

const onDelete = async (url) => {
  try {
    await removeData(url);
    list.querySelector(`a[href="${url}"]`).parentElement.remove();
  } catch {
    alert("Failed to remove");
  }
};

const createElement = (data, url) => {
  const metadata = data.pageMetadata;
  const clone = template.content.cloneNode(true);

  const titleEl = clone.querySelector("p");
  const infoEl = clone.querySelector("span");
  const thumbEl = clone.querySelector("img");
  const deleteEl = clone.querySelector("button");

  if (metadata) {
    if (metadata.isYoutube) {
      titleEl.textContent = metadata.title;
      thumbEl.src = metadata.thumbnail;
    } else {
      titleEl.textContent = metadata["og:title"];
      thumbEl.src = metadata["og:image"];
    }

    infoEl.textContent = `${metadata["og:site_name"]} - `;
  } else {
    titleEl.textContent = url;
  }

  infoEl.textContent += `${data.beats} beats - ${data.bpm} bpm - ${data.startTime}`;

  clone.querySelector("a").href = url;

  deleteEl.addEventListener("click", (event) => {
    event.preventDefault();
    if (
      confirm(
        `Are you sure you want to delete the saved settings for the video "${titleEl.textContent}"?`
      )
    ) {
      onDelete(url);
    }
  });

  return clone;
};

(async () => {
  const videos = await getAll();

  Object.keys(videos).forEach((url) => {
    const video = videos[url];
    const element = createElement(video, url);
    list.appendChild(element);
  });

  burgerMenu.initialize();
})();
