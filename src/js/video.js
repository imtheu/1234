export const getInitialVideoState = async () => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });

  return new Promise((resolve, reject) =>
    chrome.scripting.executeScript(
      {
        target: {
          tabId,
        },
        func: () => {
          const video = document.querySelector("video");
          if (video) {
            return {
              playing: !video.paused && !video.ended && video.readyState > 2,
            };
          }

          return {
            error: "NOT_FOUND",
          };
        },
      },
      ([{ result }]) => {
        if (result.error) {
          return reject(result.error);
        }

        resolve(result);
      }
    )
  );
};

export const setVideoTime = async (time) => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: {
      tabId,
    },
    args: [time],
    func: (time) => {
      const video = document.querySelector("video");
      video.pause();
      video.currentTime = time;
    },
  });
};

export const playVideo = async () => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });

  chrome.scripting.executeScript({
    target: {
      tabId,
    },
    func: () => document.querySelector("video")?.play(),
  });
};

export const addVideoListeners = async () => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });

  chrome.scripting.executeScript({
    target: {
      tabId,
    },
    func: () => {
      const video = document.querySelector("video");
      const sendMessage = chrome.runtime.sendMessage;

      if (window._1234) {
        video.removeEventListener("play", window._1234.onPlay);
        video.removeEventListener("pause", window._1234.onPause);
        video.removeEventListener("ended", window._1234.onEnded);
      } else {
        window._1234 = {};
      }

      window._1234.onPlay = () => sendMessage("VIDEO:PLAY");
      window._1234.onPause = () => sendMessage("VIDEO:PAUSE");
      window._1234.onEnded = () => sendMessage("VIDEO:ENDED");

      video.addEventListener("play", window._1234.onPlay);
      video.addEventListener("pause", window._1234.onPause);
      video.addEventListener("ended", window._1234.onEnded);
    },
  });
};

export const getVideoPageMetadata = async () => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });

  return new Promise((resolve, reject) =>
    chrome.scripting.executeScript(
      {
        target: {
          tabId,
        },
        func: () => {
          const metatags = document.head.querySelectorAll(
            `
            meta[property="og:url"],
            meta[property="og:title"],
            meta[property="og:image"],
            meta[property="og:site_name"]
            `
          );

          const title = document.head.querySelector("title").textContent;
          const url = window.location.href;

          const isYoutube = url.includes("youtube"); // YouTube does not update the metatags during AJAX navigation
          let thumbnail;
          if (isYoutube) {
            const getYouTubeVideoId = (url) =>
              new URL(url).searchParams.get("v");

            const getThumbnail = (id) =>
              `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

            const videoId = getYouTubeVideoId(url);
            thumbnail = getThumbnail(videoId);
          }

          const metadata = [...metatags].reduce(
            (acc, el) => {
              acc[el.getAttribute("property")] = el.content;
              return acc;
            },
            { url, thumbnail, isYoutube, title }
          );

          if (metadata) {
            return metadata;
          }

          return {
            error: "NOT_FOUND",
          };
        },
      },
      ([{ result }]) => {
        if (result.error) {
          return reject(result.error);
        }

        resolve(result);
      }
    )
  );
};

export const getVideoPageUrl = async () => {
  const [{ url }] = await chrome.tabs.query({ active: true });
  return url;
};
