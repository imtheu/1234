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

(async () => {
  const noVideoContentElement = document.getElementById("noVideo");
  const hasVideoContentElement = document.getElementById("hasVideo");

  const hasVideo = await hasVideoElement();

  hasVideoContentElement.classList.toggle("isVisible", hasVideo);
  noVideoContentElement.classList.toggle("isVisible", !hasVideo);
})();
