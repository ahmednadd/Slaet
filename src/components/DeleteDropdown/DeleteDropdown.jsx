import React, { useContext } from "react";
import "./DeleteDropdown.scss";
import { Icons } from "../../utils/icons";
import { TodoContext } from "../../context/TodoContext";
import { saveTasks } from "../../services/localStorageManager";

const DeleteDropdown = () => {
  const { state, setState } = useContext(TodoContext);

  const handleDelete = () => {
    const selectedTaskId = state.selectedTask.id;
    const tasks = state.currentCalendarTasks.filter(
      (task) => task.id !== selectedTaskId
    );
    
    setState((prevState) => ({
      ...prevState,
      currentCalendarTasks: tasks,
      selectedTask: null,
    }));
    
    saveTasks(tasks);
    
    // Cancel notification for deleted task
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: "CANCEL_NOTIFICATION",
        taskId: selectedTaskId
      });
    }
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-container-item" onClick={handleDelete}>
        <Icons.delete />
        <span
          style={{
            color: "#FF4242",
          }}
        >
          Delete
        </span>
      </div>
    </div>
  );
};

export default DeleteDropdown;
