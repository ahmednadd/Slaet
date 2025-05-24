import React, { useContext, useState, useEffect } from "react";
import "./TaskEdit.scss";
import TimeSelector from "../TimeSelector/TimeSelector";
import { Icons } from "../../utils/icons";
import Button from "../Button/Button";
import { TodoContext } from "../../context/TodoContext";
import DeleteDropdown from "../DeleteDropdown/DeleteDropdown";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import { saveTasks } from "../../services/localStorageManager";

const TaskEdit = () => {
  const { state, setState } = useContext(TodoContext);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(10);
  const { selectedTask, currentCalendarTasks } = state;
  
  useEffect(() => {
    // Initialize time selector with selected task's times when editing
    if (selectedTask) {
      setState((prevState) => ({
        ...prevState,
        currentStartTime: selectedTask.createdTime,
        currentEndTime: selectedTask.endTime,
        taskSlotDuration: new Date(selectedTask.endTime).getTime() - new Date(selectedTask.createdTime).getTime(),
      }));
      
      // Set notification setting from task
      setSelectedNotification(selectedTask.notificationMinutes || 10);
    }
  }, [selectedTask, setState]);

  const closeEdit = () => {
    setState((prevState) => ({
      ...prevState,
      selectedTask: null,
      // Reset time selections when closing edit
      currentStartTime: "",
      currentEndTime: "",
      taskSlotDuration: 60 * 60 * 1000,
    }));
  };

  const handleNotificationSelect = (option) => {
    setSelectedNotification(option.value);
  };

  const scheduleNotification = (task) => {
    // Only schedule if notification is not "none"
    if (selectedNotification === "none") return;

    const notificationTime = new Date(task.createdTime);
    
    if (selectedNotification > 0) {
      // Subtract notification minutes from start time
      notificationTime.setMinutes(notificationTime.getMinutes() - selectedNotification);
    }
    // If selectedNotification is 0, notification time = start time

    // Send message to background script to schedule notification
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: "SCHEDULE_NOTIFICATION",
        task: {
          ...task,
          notificationTime: notificationTime.getTime(),
          notificationMinutes: selectedNotification
        }
      });
    }
  };

  const saveTaskChanges = () => {
    if (selectedTask) {
      // Cancel old notification
      if (chrome?.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          type: "CANCEL_NOTIFICATION",
          taskId: selectedTask.id
        });
      }

      const updatedTask = {
        ...selectedTask,
        createdTime: state.currentStartTime || selectedTask.createdTime,
        endTime: state.currentEndTime || selectedTask.endTime,
        notificationMinutes: selectedNotification, // Update notification setting
      };

      const updatedTasks = currentCalendarTasks.map(task => 
        task.id === selectedTask.id ? updatedTask : task
      );
      
      setState((prevState) => ({
        ...prevState,
        currentCalendarTasks: updatedTasks,
        selectedTask: updatedTask,
      }));
      
      // Save to localStorage
      saveTasks(updatedTasks);
      
      // Schedule new notification
      scheduleNotification(updatedTask);
    }
  };

  const handleToggleComplete = () => {
    if (selectedTask) {
      const updatedTasks = currentCalendarTasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      );
      
      const updatedSelectedTask = {
        ...selectedTask,
        isCompleted: !selectedTask.isCompleted
      };
      
      setState((prevState) => ({
        ...prevState,
        currentCalendarTasks: updatedTasks,
        selectedTask: updatedSelectedTask,
      }));
      
      // Save to localStorage
      saveTasks(updatedTasks);
      
      // Cancel notification if task is being completed
      if (!selectedTask.isCompleted && chrome?.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          type: "CANCEL_NOTIFICATION",
          taskId: selectedTask.id
        });
      }
    }
  };

  return (
    <div className="task-edit-container">
      <div className="task-edit-container-options">
        <Icons.dots onClick={() => setShowDelete(true)} />
        <Icons.close onClick={closeEdit} />
        {showDelete && <DeleteDropdown />}
      </div>
      <div className="task-edit-container-task">
        <span className="heading">{selectedTask?.title}</span>
        <div className="complete">
          <input 
            type="checkbox" 
            checked={selectedTask?.isCompleted || false}
            onChange={handleToggleComplete}
          />
          <span>Mark as complete</span>
        </div>
      </div>
      <div className="divider" />
      <div className="task-edit-container-time">
        <Icons.timeLine />
        <TimeSelector isDisabled={selectedTask?.isAllDay || false} />
      </div>

      <div className="task-edit-container-time">
        <Icons.calendar />
        <span>05 Dec, Wed</span>
      </div>
      <div className="task-edit-container-time">
        <Icons.repeat />
        <span>Everyday</span>
      </div>

      <div className="task-edit-container-time notification">
        <Icons.notification />
        <span>Remind me:</span>
        <NotificationDropdown 
          selectedNotification={selectedNotification}
          onSelect={handleNotificationSelect}
        />
      </div>
      <div className="btn">
        <Button btnName="Save Changes" onClick={saveTaskChanges} />
      </div>
    </div>
  );
};

export default TaskEdit;
