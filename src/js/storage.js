export const saveData = (data) => chrome.storage.sync.set(data);

export const getData = async (videoUrl) =>
  (await chrome.storage.sync.get(videoUrl))[videoUrl];

export const removeData = async (videoUrl) =>
  await chrome.storage.sync.remove(videoUrl);

export const getAll = async () => await chrome.storage.sync.get();
