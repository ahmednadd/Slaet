import React, { useContext } from "react";
import "./TaskListItem.scss";
import { formatTimestamp } from "../../../utils/functions";
import { Icons } from "../../../utils/icons";
import { TodoContext } from "../../../context/TodoContext";

const TaskListItem = ({ item }) => {
  const { state, setState } = useContext(TodoContext);

  const onSelectTask = () => {
    setState((prevState) => ({
      ...prevState,
      selectedTask: item,
    }));
  };

  return (
    <div
      className={`task-list-item-container ${
        state.selectedTask?.id === item.id ? "active" : ""
      }`}
      onClick={onSelectTask}
    >
      <div className="task-list-item-container-check">
        <input type="checkbox" />
      </div>
      <div className="task-list-item-container-desc">
        <div className="task-list-item-container-desc-title">{item.title}</div>
        <div className="task-list-item-container-desc-date">
          {formatTimestamp(item.createdTime).timeFormatted} -{" "}
          {formatTimestamp(item.endTime).timeFormatted}
        </div>
      </div>
      <div className="task-list-item-container-options">
        <Icons.calendar />
      </div>
    </div>
  );
};

export default TaskListItem;
