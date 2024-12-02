import React, { useState } from "react";
import "./Sidebar.scss";
import AppLogo from "../AppLogo/AppLogo";
import SidebarItems from "../../utils/constants";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(0);
  const listItemHeight = 65;
  return (
    <div className="sidebar-container">
      <div className="sidebar-container-icon">
        <AppLogo size="medium" />
      </div>
      <div className="sidebar-container-list">
        <div
          className="active-background"
          style={{
            top: `${activeItem * listItemHeight}px`,
          }}
        />
        {SidebarItems.map((item, index) => (
          <div
            key={index}
            className={`sidebar-container-list-item ${
              activeItem === index ? "active" : ""
            }`}
            onClick={() => setActiveItem(index)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
