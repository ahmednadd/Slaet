import React, { useContext } from "react";
import "./TaskList.scss";
import TaskListItem from "./TaskListItem/TaskListItem";
import { TodoContext } from "../../context/TodoContext";

const TaskList = () => {
  const { state } = useContext(TodoContext);
  const { currentCalendarTasks } = state;
  
  // Sort tasks: incomplete tasks first, completed tasks at the bottom
  const sortedTasks = [...currentCalendarTasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
      return 0; // Keep original order for tasks with same completion status
    }
    return a.isCompleted ? 1 : -1; // Incomplete tasks (false) come first
  });
  
  return (
    <div className="task-list-container">
      {sortedTasks.map((item) => (
        <React.Fragment key={item.id}>
          <TaskListItem item={item} />
          <div className="task-list-container-divider" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default TaskList;
