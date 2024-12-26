import React, { useState, useContext } from "react";
import "./AddTask.scss";
import { Icons } from "../../utils/icons";
import { TodoContext } from "../../context/TodoContext";
import { saveTasks } from "../../services/localStorageManager";
import Switch from "../Switch/Switch";
import TimeSelector from "../TimeSelector/TimeSelector";

const AddTask = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
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

  const handleAddTask = () => {
    if (inputValue?.length > 0) {
      let tasks = currentCalendarTasks;

      tasks.push({
        id: tasks.length + 1,
        title: inputValue,
        createdTime: currentStartTime
          ? currentStartTime
          : new Date().toISOString(),
        endTime: currentEndTime
          ? currentEndTime
          : new Date(new Date().getTime() + taskSlotDuration).toISOString(),
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
                10 mins
              </div>
            </div>
          </div>
          <TimeSelector />
        </div>
      )}
    </div>
  );
};

export default AddTask;
