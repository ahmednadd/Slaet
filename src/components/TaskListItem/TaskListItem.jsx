import React, { useContext } from "react";
import "./TaskListItem.scss";
import { formatTimestamp } from "../../../utils/functions";
import { Icons } from "../../../utils/icons";
import { TodoContext } from "../../../context/TodoContext";
import { saveTasks } from "../../../services/localStorageManager";

const TaskListItem = ({ item }) => {
  const { state, setState } = useContext(TodoContext);

  const onSelectTask = () => {
    setState((prevState) => ({
      ...prevState,
      selectedTask: item,
    }));
  };

  const handleToggleComplete = (e) => {
    e.stopPropagation(); // Prevent triggering onSelectTask
    
    const updatedTasks = state.currentCalendarTasks.map(task => 
      task.id === item.id 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    );
    
    setState((prevState) => ({
      ...prevState,
      currentCalendarTasks: updatedTasks,
      // Update selectedTask if it's the same as the toggled item
      selectedTask: prevState.selectedTask?.id === item.id 
        ? { ...prevState.selectedTask, isCompleted: !item.isCompleted }
        : prevState.selectedTask,
    }));
    
    // Save to localStorage
    saveTasks(updatedTasks);
    
    // Cancel notification if task is being completed
    if (!item.isCompleted && chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: "CANCEL_NOTIFICATION",
        taskId: item.id
      });
    }
  };

  return (
    <div
      className={`task-list-item-container ${
        state.selectedTask?.id === item.id ? "active" : ""
      } ${item.isCompleted ? "completed" : ""} ${item.isAllDay ? "all-day" : ""}`}
      onClick={onSelectTask}
    >
      <div className="task-list-item-container-check">
        <input 
          type="checkbox" 
          checked={item.isCompleted || false}
          onChange={handleToggleComplete}
        />
      </div>
      <div className="task-list-item-container-desc">
        <div className={`task-list-item-container-desc-title ${item.isCompleted ? "completed" : ""}`}>
          {item.title}
        </div>
        <div className="task-list-item-container-desc-date">
          {item.isAllDay 
            ? "All Day"
            : `${formatTimestamp(item.createdTime).timeFormatted} - ${formatTimestamp(item.endTime).timeFormatted}`
          }
        </div>
      </div>
      <div className="task-list-item-container-options">
        <Icons.calendar />
      </div>
    </div>
  );
};

export default TaskListItem; 