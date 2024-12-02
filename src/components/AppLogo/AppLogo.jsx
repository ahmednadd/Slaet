import React from "react";
import "./AppLogo.scss";

const AppLogo = ({ size = "medium" }) => {
  const sizeClass = `app-logo--${size}`;

  return (
    <div className={`app-logo ${sizeClass}`}>
      <svg
        width="40"
        height="30"
        viewBox="34 28 40 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M34.5879 57L37.2435 42.5H41.6418L44.2974 28L74.5879 28L71.9323 42.5H67.534L64.8783 57H34.5879Z"
          fill="#F7F7F7"
        />
        <path
          d="M69.1797 43.0023L55.2644 43L44.1797 57H57.9871L69.1797 43.0023Z"
          fill="#06142B"
        />
        <path
          d="M69.1797 28.0025L54.7078 28L43.1797 43H57.5394L69.1797 28.0025Z"
          fill="#06142B"
        />
        <path
          d="M55.6767 55.5013L55.679 41.586L41.679 30.5013V44.3088L55.6767 55.5013Z"
          fill="#06142B"
        />
        <path
          d="M70.6766 55.5013L70.679 41.0294L55.679 29.5013V43.8611L70.6766 55.5013Z"
          fill="#06142B"
        />
        <path
          d="M50.8431 43L56.5 37.3431L62.1568 43L56.5 48.6569L50.8431 43Z"
          fill="#F7F7F7"
        />
      </svg>
    </div>
  );
};

export default AppLogo;
