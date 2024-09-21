export const saveData = (data) => chrome.storage.sync.set(data);

export const getData = async (videoUrl) =>
  (await chrome.storage.sync.get(videoUrl))[videoUrl];
