import React, { useContext, useEffect } from "react";
import "./CalendarSlot.scss";
import { formatTimestamp } from "../../../utils/functions";
import { TodoContext } from "../../../context/TodoContext";
const CalendarSlot = ({ event, style }) => {
  const { state } = useContext(TodoContext);
  const { taskSlotDuration } = state;
  let dynamicClassName = "";

  useEffect(() => {
    if (taskSlotDuration) {
    }
  }, [taskSlotDuration]);

  return (
    <div 
      className={`calendar-slot-container ${event.isCompleted ? "completed" : ""} ${event.isAllDay ? "all-day" : ""}`} 
      style={style}
    >
      <div className={`calendar-slot-container-desc ${event.isCompleted ? "completed" : ""}`}>
        {event.title}
      </div>
      <div className="calendar-slot-container-time">
        {event.isAllDay 
          ? "All Day"
          : `${formatTimestamp(event.createdTime).timeFormatted} - ${formatTimestamp(event.endTime).timeFormatted}`
        }
      </div>
    </div>
  );
};

export default CalendarSlot;
