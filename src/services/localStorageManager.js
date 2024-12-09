// ... existing code ...

export const loadTasks = (callback) => {
  chrome.storage.local.get(["tasks"], (result) => {
    callback(result.tasks ? result.tasks : []);
  });
};

export const saveTasks = (tasks) => {
  chrome.storage.local.set({ tasks: tasks }, () => {
    console.log("Data saved to local storage");
  });
};
