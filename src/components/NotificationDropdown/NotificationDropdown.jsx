import React, { useState } from "react";
import "./NotificationDropdown.scss";
import useClickAway from "../../hooks/useClickAway";

const NotificationDropdown = ({ selectedNotification, onSelect, hideDropdown }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notificationOptions = [
    { label: "None", value: "none" },
    { label: "At time of event", value: 0 },
    { label: "5 minutes before", value: 5 },
    { label: "10 minutes before", value: 10 },
    { label: "15 minutes before", value: 15 },
    { label: "30 minutes before", value: 30 },
    { label: "1 hour before", value: 60 },
    { label: "2 hours before", value: 120 },
    { label: "1 day before", value: 1440 },
  ];

  const dropdownRef = useClickAway(() => {
    setIsOpen(false);
    if (hideDropdown) hideDropdown();
  });

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    if (hideDropdown) hideDropdown();
  };

  const selectedOption = notificationOptions.find(
    option => option.value === selectedNotification
  ) || notificationOptions[2]; // Default to "10 minutes before"

  return (
    <div className="notification-dropdown-container" ref={dropdownRef}>
      <div 
        className="notification-dropdown-selected"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? "open" : ""}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8"
        >
          <path d="M6 8L0 0h12L6 8z" fill="currentColor"/>
        </svg>
      </div>
      
      {isOpen && (
        <div className="notification-dropdown-menu">
          {notificationOptions.map((option) => (
            <div
              key={option.value}
              className={`notification-dropdown-item ${
                option.value === selectedNotification ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 