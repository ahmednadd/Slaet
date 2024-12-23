import React from "react";
import "./Switch.scss";
const Switch = ({ checked, onChange }) => {
  console.log(checked);
  return (
    <div className="toggleWrapper">
      <input
        type="checkbox"
        name="toggle1"
        className="mobileToggle"
        checked={checked} // {{ edit_1 }}
        onChange={onChange} // {{ edit_2 }}
      />
      <label htmlFor="toggle1"></label>
    </div>
  );
};

export default Switch;
