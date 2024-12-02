import React from "react";
import "./AppLayout.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <Topbar />
    </div>
  );
};

export default AppLayout;
