import React, { useState, useEffect, useContext } from "react";
import "./TimeDropdown.scss";
import { TodoContext } from "../../context/TodoContext";
import { roundToNext15Minutes } from "../../utils/functions";

const TimeDropdown = ({ startTime, hideDropDowns }) => {
  const [timeOptions, setTimeOptions] = useState([]);
  const { state, setState } = useContext(TodoContext);
  const { currentStartTime, currentEndTime, taskSlotDuration } = state;

  // logic with all time slots
  useEffect(() => {
    const generateTimeOptions = () => {
      const options = [];
      let currentTime;

      // Set the current time based on currentStartTime if startTime is false
      if (!startTime && currentStartTime) {
        const startDate = new Date(currentStartTime);
        currentTime = new Date();
        currentTime.setHours(
          startDate.getHours(),
          startDate.getMinutes(),
          0,
          0
        );
      } else {
        // Use rounded time for consistent 15-minute intervals
        currentTime = roundToNext15Minutes();
      }

      for (let i = 0; i < 24 * 4; i++) {
        // 24 hours * 4 (15 min intervals)
        const time = new Date(currentTime.getTime() + i * 15 * 60000); // Add 15 minutes
        options.push(
          time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
      setTimeOptions(options);
    };

    generateTimeOptions();
  }, [startTime, currentStartTime]);

  // logic to disable previous times
  // useEffect(() => {
  //   const generateTimeOptions = () => {
  //     const options = [];
  //     const currentTime = new Date();

  //     // Set the current time based on currentStartTime if startTime is false
  //     if (!startTime && currentStartTime) {
  //       const startDate = new Date(currentStartTime);
  //       currentTime.setHours(
  //         startDate.getHours(),
  //         startDate.getMinutes(),
  //         0,
  //         0
  //       );
  //     } else {
  //       currentTime.setSeconds(0);
  //       currentTime.setMilliseconds(0);
  //       currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 15) * 15); // Round up to the nearest 15 minutes
  //     }

  //     // Calculate midnight
  //     const midnight = new Date(currentTime);
  //     midnight.setHours(24, 0, 0, 0); // Set time to midnight (00:00 of the next day)

  //     // Generate time slots until midnight
  //     while (currentTime < midnight) {
  //       options.push(
  //         currentTime.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: true,
  //         })
  //       );
  //       currentTime.setMinutes(currentTime.getMinutes() + 15); // Increment by 15 minutes
  //     }

  //     setTimeOptions(options);
  //   };

  //   generateTimeOptions();
  // }, [startTime, currentStartTime]);

  // ... existing code ...

  const handleSelectedTime = (value) => {
    const [time, modifier] = value.split(" ");
    let [hours, minutes] = time.split(":");

    // Convert hours and minutes to integers
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert to 24-hour format
    if (modifier.toLowerCase() === "pm" && hours !== 12) {
      hours += 12; // Convert PM hours to 24-hour format
    }
    if (modifier.toLowerCase() === "am" && hours === 12) {
      hours = 0; // Convert 12 AM to 00 hours
    }

    // Create a new date object for the current date
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds

    // Return the time as ISO string for consistency
    return date.toISOString();
  };

  const handleSelectTime = (time) => {
    if (startTime) {
      const selectedTime = handleSelectedTime(time);
      const selectedDate = new Date(selectedTime);
      const endTime = new Date(selectedDate.getTime() + taskSlotDuration);
      
      setState((prevState) => ({
        ...prevState,
        currentStartTime: selectedTime,
        currentEndTime: endTime.toISOString(),
      }));
    } else {
      const selectedEndTime = handleSelectedTime(time);
      setState((prevState) => ({
        ...prevState,
        currentEndTime: selectedEndTime,
      }));
      calculateDuration(selectedEndTime);
    }

    hideDropDowns();
  };

  const calculateDuration = (endTime) => {
    if (currentStartTime && endTime) {
      const start = new Date(currentStartTime).getTime();
      const end = new Date(endTime).getTime();
      
      // Ensure end time is after start time
      if (end <= start) {
        // If end time is not after start time, add 1 hour to start time
        const adjustedEnd = start + 60 * 60 * 1000;
        setState((prevState) => ({
          ...prevState,
          currentEndTime: new Date(adjustedEnd).toISOString(),
          taskSlotDuration: 60 * 60 * 1000, // Default to 1 hour
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          taskSlotDuration: end - start,
        }));
      }
    }
  };

  return (
    <div className="dropdown-container">
      {timeOptions.map((time, index) => (
        <div
          className="dropdown-container-item"
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectTime(time);
          }}
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimeDropdown;
