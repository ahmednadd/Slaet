// Content script for Slaet Chrome Extension
// This script injects notification popups into any webpage

console.log("Slaet content script loaded on:", window.location.href);

// Inject notification styles
const injectStyles = () => {
  if (document.getElementById('slaet-notification-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'slaet-notification-styles';
  style.textContent = `
    .slaet-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
      border: 1px solid #e1e5e9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 2147483647;
      transform: translateX(400px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    
    .slaet-notification.show {
      transform: translateX(0);
    }
    
    .slaet-notification-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .slaet-notification-icon {
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    
    .slaet-notification-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      flex: 1;
      margin-left: 12px;
      margin-right: 12px;
    }
    
    .slaet-notification-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 18px;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    
    .slaet-notification-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .slaet-notification-body {
      padding: 20px;
    }
    
    .slaet-notification-message {
      font-size: 14px;
      color: #374151;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }
    
    .slaet-notification-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .slaet-notification-btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .slaet-notification-btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .slaet-notification-btn-primary:hover {
      background: #2563eb;
    }
    
    .slaet-notification-btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }
    
    .slaet-notification-btn-secondary:hover {
      background: #e5e7eb;
    }
    
    .slaet-notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transition: width 0.1s linear;
    }
    
    @keyframes slaet-bounce {
      0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
      40%, 43% { transform: translateY(-8px); }
      70% { transform: translateY(-4px); }
    }
    
    .slaet-notification.bounce {
      animation: slaet-bounce 1s;
    }
  `;
  
  document.head.appendChild(style);
};

// Create notification popup
const showNotificationPopup = (taskData) => {
  // Inject styles first
  injectStyles();
  
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.slaet-notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'slaet-notification';
  
  const { title, message, taskId } = taskData;
  
  notification.innerHTML = `
    <div class="slaet-notification-header">
      <div class="slaet-notification-icon">📋</div>
      <h3 class="slaet-notification-title">${escapeHtml(title)}</h3>
      <button class="slaet-notification-close" onclick="this.closest('.slaet-notification').remove()">×</button>
    </div>
    <div class="slaet-notification-body">
      <p class="slaet-notification-message">${escapeHtml(message)}</p>
      <div class="slaet-notification-actions">
        <button class="slaet-notification-btn slaet-notification-btn-secondary" onclick="this.closest('.slaet-notification').remove()">
          Dismiss
        </button>
        <button class="slaet-notification-btn slaet-notification-btn-primary" onclick="window.slaetOpenTask('${taskId}')">
          View Task
        </button>
      </div>
    </div>
    <div class="slaet-notification-progress" style="width: 100%;"></div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.add('show');
    notification.classList.add('bounce');
  }, 100);
  
  // Auto-hide after 10 seconds
  let progress = 100;
  const progressBar = notification.querySelector('.slaet-notification-progress');
  
  const interval = setInterval(() => {
    progress -= 1;
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
    
    if (progress <= 0) {
      clearInterval(interval);
      hideNotification(notification);
    }
  }, 100);
  
  // Store interval for cleanup
  notification._progressInterval = interval;
  
  console.log('Slaet notification shown:', title);
};

// Hide notification with animation
const hideNotification = (notification) => {
  if (notification._progressInterval) {
    clearInterval(notification._progressInterval);
  }
  
  notification.classList.remove('show');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 300);
};

// Escape HTML to prevent XSS
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Global function to open task in extension
window.slaetOpenTask = (taskId) => {
  // Send message to background script to open extension
  chrome.runtime.sendMessage({
    type: "OPEN_TASK",
    taskId: taskId
  });
  
  // Remove notification
  const notification = document.querySelector('.slaet-notification');
  if (notification) {
    hideNotification(notification);
  }
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.type === "SHOW_TASK_NOTIFICATION") {
    showNotificationPopup(request.taskData);
    sendResponse({ success: true });
  }
  
  return true;
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  const notifications = document.querySelectorAll('.slaet-notification');
  notifications.forEach(notification => {
    if (notification._progressInterval) {
      clearInterval(notification._progressInterval);
    }
  });
});

console.log("Slaet content script ready for notifications"); 