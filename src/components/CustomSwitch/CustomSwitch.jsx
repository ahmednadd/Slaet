import React, { useState } from "react";
import "./CustomSwitch.scss";

const CustomSwitch = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="switch-container" onClick={handleToggle}>
      <div
        className={`switch-container-toggle ${isToggled ? "toggled" : ""}`}
      />
      <div className="switch-container-text">
        <span>To-Do</span>
        <span>Notes</span>
      </div>
    </div>
  );
};

export default CustomSwitch;
