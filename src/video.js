export const hasVideoElement = async () => {
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

export const playVideo = async () => {
  const [{ id: tabId }] = await chrome.tabs.query({ active: true });

  chrome.scripting.executeScript({
    target: {
      tabId,
    },
    func: () => document.querySelector("video")?.play(),
  });
};
