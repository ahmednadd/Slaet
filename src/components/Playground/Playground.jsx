import React, { useEffect, useContext } from "react";
import "./Playground.scss";
import AddTask from "../AddTask/AddTask";
import TaskList from "../TaskList/TaskList";
import { TodoContext } from "../../context/TodoContext";
import { loadTasks } from "../../services/localStorageManager";

const Playground = () => {
  const { setState } = useContext(TodoContext);

  useEffect(() => {
    loadTasks((storedTasks) => {
      setState((prevState) => ({
        ...prevState,
        currentCalendarTasks: storedTasks,
      }));
    });
  }, [setState]);

  return (
    <div className="playground-container">
      <AddTask />
      <TaskList />
    </div>
  );
};

export default Playground;
