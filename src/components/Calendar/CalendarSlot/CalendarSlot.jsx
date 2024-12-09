import React from "react";
import "./CalendarSlot.scss";
const CalendarSlot = ({ event }) => {
  console.log(event, "event");
  return (
    <div className="calendar-slot-container">
      <div className="calendar-slot-container-desc">
        Read one chapter of Meditations
      </div>
      <div className="calendar-slot-container-time">7:00 AM - 8:30 AM</div>
    </div>
  );
};

export default CalendarSlot;
