import React, { useContext } from "react";
import "./Calendar.scss";
import CalendarSlot from "./CalendarSlot/CalendarSlot"; // Assuming you have a custom component for event rendering
import { TodoContext } from "../../context/TodoContext";

const Calendar = () => {
  const { state } = useContext(TodoContext);

  const { currentCalendarTasks } = state;

  // Generate time slots for 24 hours with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        slots.push({
          time: `${displayHour}:${minute
            .toString()
            .padStart(2, "0")} ${period}`,
          isHour: minute === 0,
          index: slots.length, // This index helps to map events to slots
        });
      }
    }
    return slots;
  };

  // Function to get the index of a time slot based on the provided time
  const getTimeSlotIndex = (time) => {
    const date = new Date(time);
    const hour = date.getHours();
    const minute = date.getMinutes();
    console.log(hour * 2 + Math.floor(minute / 30), "currentCalendarTasks");
    return hour * 2 + Math.floor(minute / 30);
  };

  return (
    <div className="calendar-container">
      <div className="timeline">
        {generateTimeSlots().map((slot, index) => (
          <div
            key={index}
            className={`time-slot ${
              slot.isHour ? "hour-slot" : "half-hour-slot"
            }`}
          >
            {slot.isHour && <div className="divider" />}
            {slot.isHour && <span className="time">{slot.time}</span>}
            {/* Render events that overlap with this time slot */}
            {currentCalendarTasks
              .filter((event) => {
                const startIndex = getTimeSlotIndex(event.createdTime);
                const endIndex = getTimeSlotIndex(event.endTime);
                return startIndex <= slot.index && endIndex > slot.index;
              })
              .map((event) => (
                <CalendarSlot key={event.id} event={event} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
