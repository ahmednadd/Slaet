import React, { useContext, useEffect, useRef } from "react";
import "./Calendar.scss";
import CalendarSlot from "./CalendarSlot/CalendarSlot"; // Assuming you have a custom component for event rendering
import { TodoContext } from "../../context/TodoContext";

const Calendar = () => {
  const { state } = useContext(TodoContext);
  const { currentCalendarTasks } = state;

  const scrollItem = useRef(null);

  const startOfDay = "2024-12-10T00:00:00"; // Start time
  const endOfDay = "2024-12-10T24:00:00"; // End time

  useEffect(() => {
    if (scrollItem.current) {
      // Scroll the container to the first slot
      setTimeout(() => {
        scrollItem.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [currentCalendarTasks.length]);

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let current = new Date(start);

    while (current <= new Date(end)) {
      slots.push(new Date(current));
      current.setMinutes(current.getMinutes() + 30); // Increment by 30 minutes
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(startOfDay, endOfDay);

  // Convert time to "minutes since start of the day" for positioning
  const timeToMinutes = (time) => {
    const date = new Date(time);
    return date.getHours() * 60 + date.getMinutes();
  };

  // Calculate the top position and height of an event
  const calculateEventStyle = (event, startOfDay) => {
    const startMinutes =
      timeToMinutes(event.createdTime) - timeToMinutes(startOfDay);
    const endMinutes = timeToMinutes(event.endTime) - timeToMinutes(startOfDay);

    return {
      top: `${(startMinutes / 30) * 25 + 24}px`, // 50px per 30 minutes + 24px padding top
      height: `${((endMinutes - startMinutes) / 30) * 25}px`, // 50px per 30 minutes
    };
  };

  return (
    <div className="calendar-container">
      <div className="timeline">
        {timeSlots.map((slot, index) => (
          <div
            key={index}
            className="time-slot"
            style={{
              opacity: index % 2 === 0 ? 1 : 0,
            }}
          >
            <div className="divider" />
            <span className="time">
              {slot.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // Change to AM/PM format
              })}
            </span>
          </div>
        ))}
      </div>

      {currentCalendarTasks.map((event, index) => {
        const style = calculateEventStyle(event, startOfDay);

        return (
          <CalendarSlot
            key={event.id}
            event={event}
            style={style}
            scrollItem={scrollItem}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default Calendar;
