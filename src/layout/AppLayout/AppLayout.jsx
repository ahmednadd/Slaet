import React, { useContext } from "react";
import "./AppLayout.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Playground from "../../components/Playground/Playground";
import Calendar from "../../components/Calendar/Calendar";
import TaskEdit from "../../components/TaskEdit/TaskEdit";
import { TodoContext } from "../../context/TodoContext";

const AppLayout = () => {
  const { state } = useContext(TodoContext);

  return (
    <div className="app-layout">
      <Sidebar />
      <Topbar />
      <Playground />
      {state.selectedTask ? <TaskEdit /> : <Calendar />}
    </div>
  );
};

export default AppLayout;
