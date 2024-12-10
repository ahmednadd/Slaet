import React from "react";
import "./TaskListItem.scss";
import { formatTimestamp } from "../../../utils/functions";

const TaskListItem = ({ item }) => {
  return (
    <div className="task-list-item-container">
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
    </div>
  );
};

export default TaskListItem;
