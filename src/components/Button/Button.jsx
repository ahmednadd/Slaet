import React from "react";
import "./Button.scss";

const Button = ({ btnName = "Button", onClick, disabled = false }) => {
  return (
    <button className="button-container" onClick={onClick} disabled={disabled}>
      {btnName}
    </button>
  );
};

export default Button;
