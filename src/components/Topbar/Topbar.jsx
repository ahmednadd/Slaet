import React from "react";
import "./Topbar.scss";
import { formatDate } from "../../utils/functions";

const Topbar = () => {
  return (
    <div className="topbar-container">
      <div className="topbar-container-date">
        {formatDate().date} {formatDate().month}
        <br />
        <span>{formatDate().day}</span>
      </div>
    </div>
  );
};

export default Topbar;
