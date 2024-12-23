import React from "react";
import "./AppLayout.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Playground from "../../components/Playground/Playground";
import Calendar from "../../components/Calendar/Calendar";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <Topbar />
      <Playground />
      <div className="right-side">
        <Calendar />
      </div>
    </div>
  );
};

export default AppLayout;
