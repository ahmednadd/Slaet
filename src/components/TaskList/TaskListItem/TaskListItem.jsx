import React from "react";
import "./TaskListItem.scss";
import { formatTimestamp } from "../../../utils/functions";

const TaskListItem = ({ item }) => {
  const time = formatTimestamp(item.createdTime);

  return (
    <div className="task-list-item-container">
      <div className="task-list-item-container-check">
        <input type="checkbox" />
      </div>
      <div className="task-list-item-container-desc">
        <div className="task-list-item-container-desc-title">{item.title}</div>
        <div className="task-list-item-container-desc-date">
          {time.timeFormatted}
        </div>
      </div>
    </div>
  );
};

export default TaskListItem;
