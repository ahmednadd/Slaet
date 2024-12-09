import React, { useState, useContext, useEffect } from "react";
import "./AddTask.scss";
import { Icons } from "../../utils/icons";
import { TodoContext } from "../../context/TodoContext";
import { saveTasks } from "../../services/localStorageManager";
import { formatDate } from "../../utils/functions";

const AddTask = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { state, setState } = useContext(TodoContext);
  // set default task duration to 1
  // 1 means 1 hour, 2 means 2 hours, 0.5 means 30 minutes, 0.25 means 15 minutes
  const [taskDuration, setTaskDuration] = useState(1);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  console.log(state, "state");

  const handleAddTask = () => {
    if (inputValue?.length > 0) {
      let tasks = state.currentCalendarTasks;
      tasks.push({
        id: tasks.length + 1,
        title: inputValue,
        createdTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        isCompleted: false,
      });
      setState((prevState) => ({
        ...prevState,
        currentCalendarTasks: tasks,
      }));

      saveTasks(tasks);
      setInputValue("");
    }
  };

  const handleTaskDurationChange = (value) => {
    setTaskDuration(value);
  };

  return (
    <div className="add-task-container">
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
          <div className="add-task-container-details-left">
            <div className="add-task-container-details-left-items time">
              <Icons.timeLine className="icon" />
              <div className="content">All Day</div>
            </div>
            <div className="add-task-container-details-left-items custom">
              <div className="content">
                <div className="start-time">
                  {new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <span>&#10132;</span>
                <div className="end-time">
                  {new Date(
                    new Date().getTime() + 60 * 60 * 1000
                  ).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="total-time">1 hour</div>
              </div>
            </div>
            <div className="add-task-container-details-left-items">
              <Icons.calendar className="icon" />
              <div className="content">
                {formatDate().date} {formatDate().month}
              </div>
            </div>
            <div className="add-task-container-details-left-items ">
              <Icons.repeat className="icon" />
              <div className="content">Everyday</div>
            </div>
          </div>
          <div className="divider" />
          <div className="add-task-container-details-right">
            <div className="add-task-container-details-right-items">
              <Icons.notification className="icon" />
              <div
                className="content"
                style={{
                  color: "rgba(40, 40, 40, 0.7)",
                }}
              >
                Remind me:
              </div>
            </div>
            <div className="add-task-container-details-right-items custom">
              <div className="content">
                <div className="">10 mins before</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;
