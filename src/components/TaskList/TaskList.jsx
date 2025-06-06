import React, { useContext } from "react";
import "./TaskList.scss";
import TaskListItem from "./TaskListItem/TaskListItem";
import { TodoContext } from "../../context/TodoContext";

const TaskList = () => {
  const { state } = useContext(TodoContext);
  const { currentCalendarTasks } = state;
  return (
    <div className="task-list-container">
      {currentCalendarTasks.map((item) => (
        <React.Fragment key={item.id}>
          <TaskListItem item={item} />
          <div className="task-list-container-divider" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default TaskList;
