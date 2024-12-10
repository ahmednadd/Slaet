import React, { useContext, useEffect } from "react";
import "./CalendarSlot.scss";
import { formatTimestamp } from "../../../utils/functions";
import { TodoContext } from "../../../context/TodoContext";
const CalendarSlot = ({ event, style, scrollItem, index }) => {
  const { state } = useContext(TodoContext);
  const { taskSlotDuration } = state;
  let dynamicClassName = "";

  useEffect(() => {
    if (taskSlotDuration) {
      
    }
  }, [taskSlotDuration]);

  return (
    <div
      ref={index === 0 ? scrollItem : null}
      className="calendar-slot-container"
      style={style}
    >
      <div className="calendar-slot-container-desc">{event.title}</div>
      <div className="calendar-slot-container-time">
        {formatTimestamp(event.createdTime).timeFormatted} -{" "}
        {formatTimestamp(event.endTime).timeFormatted}
      </div>
    </div>
  );
};

export default CalendarSlot;
