// Background script for Slaet Chrome Extension
console.log("Slaet background script loaded");

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Slaet Extension Installed");
  
  // Request notification permission
  chrome.notifications.create({
    type: "basic",
    iconUrl: "assets/icon48.jpg",
    title: "Slaet",
    message: "Task notifications are now enabled!"
  });
});

// Handle action clicks
chrome.action.onClicked.addListener((tab) => {
  console.log("Action clicked", tab);
});

// Listen for messages from content scripts and main app
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);
  
  if (request.type === "SCHEDULE_NOTIFICATION") {
    scheduleTaskNotification(request.task);
    sendResponse({ success: true });
  }
  
  if (request.type === "CANCEL_NOTIFICATION") {
    cancelTaskNotification(request.taskId);
    sendResponse({ success: true });
  }
  
  if (request.type === "GET_ACTIVE_TASKS") {
    getActiveTasks().then(tasks => {
      sendResponse({ tasks });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.type === "OPEN_TASK") {
    openTaskInExtension(request.taskId);
    sendResponse({ success: true });
  }
  
  return true;
});

// Schedule notification for a task
function scheduleTaskNotification(task) {
  if (!task.notificationTime || task.notificationMinutes === "none") {
    console.log("No notification scheduled for task:", task.title);
    return;
  }
  
  const alarmName = `task_${task.id}`;
  const notificationTime = new Date(task.notificationTime);
  const now = new Date();
  
  // Don't schedule notifications for past times
  if (notificationTime <= now) {
    console.log("Notification time is in the past, skipping:", task.title);
    return;
  }
  
  // Create alarm for notification
  chrome.alarms.create(alarmName, {
    when: task.notificationTime
  });
  
  // Store task details for the notification
  chrome.storage.local.set({
    [`notification_${task.id}`]: {
      taskId: task.id,
      title: task.title,
      startTime: task.createdTime,
      endTime: task.endTime,
      notificationMinutes: task.notificationMinutes,
      isAllDay: task.isAllDay
    }
  });
  
  console.log(`Notification scheduled for task "${task.title}" at`, notificationTime);
}

// Cancel notification for a task
function cancelTaskNotification(taskId) {
  const alarmName = `task_${taskId}`;
  chrome.alarms.clear(alarmName);
  chrome.storage.local.remove(`notification_${taskId}`);
  console.log(`Notification cancelled for task ID: ${taskId}`);
}

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("Alarm triggered:", alarm.name);
  
  if (alarm.name.startsWith("task_")) {
    const taskId = alarm.name.replace("task_", "");
    
    // Get task details from storage
    const result = await chrome.storage.local.get(`notification_${taskId}`);
    const taskData = result[`notification_${taskId}`];
    
    if (taskData) {
      await showTaskNotification(taskData);
      
      // Clean up stored notification data
      chrome.storage.local.remove(`notification_${taskId}`);
    }
  }
});

// Show task notification
async function showTaskNotification(taskData) {
  const { title, startTime, notificationMinutes, isAllDay } = taskData;
  
  let message;
  if (isAllDay) {
    message = "All-day task";
  } else if (notificationMinutes === 0) {
    message = "Task is starting now!";
  } else if (notificationMinutes === 1) {
    message = "Task starts in 1 minute";
  } else if (notificationMinutes < 60) {
    message = `Task starts in ${notificationMinutes} minutes`;
  } else if (notificationMinutes === 60) {
    message = "Task starts in 1 hour";
  } else if (notificationMinutes === 1440) {
    message = "Task starts tomorrow";
  } else {
    const hours = Math.floor(notificationMinutes / 60);
    message = `Task starts in ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  // Create Chrome notification
  const notificationId = `task_notification_${taskData.taskId}`;
  chrome.notifications.create(notificationId, {
    type: "basic",
    iconUrl: "assets/icon48.jpg",
    title: title,
    message: message,
    priority: 2
  });
  
  // Also send to content script for in-page notification
  try {
    const tabs = await chrome.tabs.query({ active: true });
    for (const tab of tabs) {
      if (tab.url && !tab.url.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tab.id, {
          type: "SHOW_TASK_NOTIFICATION",
          taskData: {
            ...taskData,
            message: message
          }
        }).catch(() => {
          // Ignore errors for tabs that don't have content script
        });
      }
    }
  } catch (error) {
    console.log("Could not send to content script:", error);
  }
  
  console.log(`Notification shown for task: ${title}`);
}

// Get active tasks (tasks that haven't passed their end time)
async function getActiveTasks() {
  try {
    const result = await chrome.storage.local.get(["tasks"]);
    const tasks = result.tasks || [];
    const now = new Date();
    
    return tasks.filter(task => {
      const endTime = new Date(task.endTime);
      return endTime > now && !task.isCompleted;
    });
  } catch (error) {
    console.error("Error getting active tasks:", error);
    return [];
  }
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open or focus the extension tab
  chrome.tabs.query({ url: chrome.runtime.getURL("main.html") }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
      chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL("main.html") });
    }
  });
  
  // Clear the notification
  chrome.notifications.clear(notificationId);
});

// Clean up old alarms and notifications on startup
chrome.runtime.onStartup.addListener(async () => {
  console.log("Extension startup - cleaning up old alarms");
  
  // Get all alarms
  const alarms = await chrome.alarms.getAll();
  const now = Date.now();
  
  // Clear past alarms
  for (const alarm of alarms) {
    if (alarm.scheduledTime <= now) {
      chrome.alarms.clear(alarm.name);
      console.log(`Cleared past alarm: ${alarm.name}`);
    }
  }
});

// Open task in extension
function openTaskInExtension(taskId) {
  // Open or focus the extension tab
  chrome.tabs.query({ url: chrome.runtime.getURL("main.html") }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
      chrome.windows.update(tabs[0].windowId, { focused: true });
      
      // Send message to open specific task (you can implement this in your React app)
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "OPEN_SPECIFIC_TASK",
        taskId: taskId
      }).catch(() => {
        // Ignore if message can't be sent
      });
    } else {
      chrome.tabs.create({ 
        url: chrome.runtime.getURL("main.html") + `?taskId=${taskId}` 
      });
    }
  });
}
