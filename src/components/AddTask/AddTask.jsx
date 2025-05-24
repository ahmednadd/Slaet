import React, { useState, useContext, useEffect } from "react";
import "./AddTask.scss";
import { Icons } from "../../utils/icons";
import { TodoContext } from "../../context/TodoContext";
import { saveTasks } from "../../services/localStorageManager";
import Switch from "../Switch/Switch";
import TimeSelector from "../TimeSelector/TimeSelector";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import { roundToNext15Minutes } from "../../utils/functions";

const AddTask = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(10); // Default to 10 minutes
  const { state, setState } = useContext(TodoContext);
  const {
    currentCalendarTasks,
    taskSlotDuration,
    currentStartTime,
    currentEndTime,
  } = state;
  // set default task duration to 1

  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleNotificationSelect = (option) => {
    setSelectedNotification(option.value);
  };

  const resetTimeSelection = () => {
    setState((prevState) => ({
      ...prevState,
      currentStartTime: "",
      currentEndTime: "",
      taskSlotDuration: 60 * 60 * 1000, // Reset to default 1 hour
    }));
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

  const handleAddTask = () => {
    if (inputValue?.length > 0) {
      let tasks = currentCalendarTasks;

      // Calculate proper start and end times
      let taskStartTime, taskEndTime;
      
      if (isChecked) {
        // All-day task: set to start and end of current day
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        taskStartTime = startOfDay.toISOString();
        taskEndTime = endOfDay.toISOString();
      } else if (currentStartTime && currentEndTime) {
        // Use selected times
        taskStartTime = currentStartTime;
        taskEndTime = currentEndTime;
      } else if (currentStartTime) {
        // Only start time selected, calculate end time
        const startDate = new Date(currentStartTime);
        const endDate = new Date(startDate.getTime() + taskSlotDuration);
        taskStartTime = currentStartTime;
        taskEndTime = endDate.toISOString();
      } else {
        // No times selected, use rounded current time and duration
        const roundedStart = roundToNext15Minutes();
        const endTime = new Date(roundedStart.getTime() + taskSlotDuration);
        taskStartTime = roundedStart.toISOString();
        taskEndTime = endTime.toISOString();
      }

      const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title: inputValue,
        createdTime: taskStartTime,
        endTime: taskEndTime,
        isCompleted: false,
        isAllDay: isChecked,
        notificationMinutes: selectedNotification, // Store notification setting
      };

      tasks.push(newTask);

      setState((prevState) => ({
        ...prevState,
        currentCalendarTasks: tasks,
        // Reset time selection after creating task
        currentStartTime: "",
        currentEndTime: "",
        taskSlotDuration: 60 * 60 * 1000, // Reset to default 1 hour
      }));

      saveTasks(tasks);
      
      // Schedule notification
      scheduleNotification(newTask);
      
      setInputValue("");
      setIsChecked(false); // Reset all-day toggle
      setSelectedNotification(10); // Reset notification to default
    }
  };

  useEffect(() => {
    // Reset time selections when input is cleared
    if (inputValue.length === 0) {
      setState((prevState) => ({
        ...prevState,
        currentStartTime: "",
        currentEndTime: "",
        taskSlotDuration: 60 * 60 * 1000, // Reset to default 1 hour
      }));
      setIsChecked(false); // Reset all-day toggle when input is cleared
      setSelectedNotification(10); // Reset notification when input is cleared
    }
  }, [inputValue, setState]);

  // Reset time selection when all-day is toggled
  useEffect(() => {
    if (isChecked) {
      // Clear time selections when all-day is enabled
      setState((prevState) => ({
        ...prevState,
        currentStartTime: "",
        currentEndTime: "",
        taskSlotDuration: 24 * 60 * 60 * 1000, // Set to 24 hours for all-day
      }));
    } else {
      // Reset to default 1 hour when all-day is disabled
      setState((prevState) => ({
        ...prevState,
        taskSlotDuration: 60 * 60 * 1000,
      }));
    }
  }, [isChecked, setState]);

  return (
    <div
      className="add-task-container"
      style={{
        border:
          isInputFocused || inputValue?.length > 0
            ? "1px solid transparent"
            : "1px solid rgba(128, 128, 128, 0.1) ",
      }}
    >
      {inputValue?.length > 0 && (
        <Icons.enter className="enter-icon" onClick={handleAddTask} />
      )}
      <input
        type="text"
        placeholder="Add a task"
        className="add-task-container-input"
        onFocus={handleInputFocus}
        onBlur={() => setIsInputFocused(false)}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTask();
          }
          if (e.key === "Escape") {
            setInputValue("");
            resetTimeSelection();
          }
        }}
        style={{
          boxShadow:
            isInputFocused && inputValue?.length === 0
              ? "0px 16px 21px 0px rgba(0, 0, 0, 0.06),0px 2px 8px 0px rgba(0, 0, 0, 0.08)"
              : "none",
        }}
      />
      {inputValue?.length > 0 && (
        <div className="add-task-container-details">
          <div className="divider-top" />
          <div className="add-task-container-details-options">
            <div className="item">
              <div className="icon">
                <Icons.timeLine className="icon" />
                All Day
              </div>
              <Switch checked={isChecked} onChange={handleToggle} />
            </div>
            <div className="item">
              <div className="icon">
                <Icons.repeat className="icon" />
                None
              </div>
            </div>
            <div className="item">
              <div className="icon">
                <Icons.notification className="icon" />
                Remind me:
              </div>
              <NotificationDropdown 
                selectedNotification={selectedNotification}
                onSelect={handleNotificationSelect}
              />
            </div>
          </div>
          <TimeSelector isDisabled={isChecked} />
        </div>
      )}
    </div>
  );
};

export default AddTask;
