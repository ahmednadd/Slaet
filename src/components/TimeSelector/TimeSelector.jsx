import React, { useContext, useRef, useState } from "react";
import "./TimeSelector.scss";
import TimeDropdown from "../TimeDropdown/TimeDropdown";
import { TodoContext } from "../../context/TodoContext";
import { formatDuration, formatTimestamp, roundToNext15Minutes } from "../../utils/functions";
import useClickAway from "../../hooks/useClickAway";

const TimeSelector = ({ isDisabled = false }) => {
  const { state, setState } = useContext(TodoContext);
  const [isStartTime, setIsStartTime] = useState(false);
  const [isEndTime, setIsEndTime] = useState(false);

  const {
    currentCalendarTasks,
    taskSlotDuration,
    currentStartTime,
    currentEndTime,
  } = state;

  const startTimeRef = useClickAway(() => {
    setIsStartTime(false);
  });

  const endTimeRef = useClickAway(() => {
    setIsEndTime(false);
  });

  const hideDropDowns = () => {
    setIsStartTime(false);
    setIsEndTime(false);
  };

  return (
    <div className={`time-selector-container ${isDisabled ? "disabled" : ""}`}>
      <div
        className={`start-time selection ${isStartTime && "selection-active"} ${isDisabled ? "disabled" : ""}`}
        onClick={() => !isDisabled && setIsStartTime(true)}
      >
        {isDisabled ? "All Day" : currentStartTime
          ? formatTimestamp(currentStartTime).timeFormatted
          : roundToNext15Minutes().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}

        {isStartTime && !isDisabled && (
          <div ref={startTimeRef}>
            <TimeDropdown startTime={true} hideDropDowns={hideDropDowns} />
          </div>
        )}
      </div>
      <span className={`arrow ${isDisabled ? "disabled" : ""}`}>&#10132;</span>
      <div
        className={`end-time selection ${isEndTime && "selection-active"} ${isDisabled ? "disabled" : ""}`}
        onClick={() => !isDisabled && setIsEndTime(true)}
      >
        {isDisabled ? "" : currentEndTime
          ? formatTimestamp(currentEndTime).timeFormatted
          : new Date(roundToNext15Minutes().getTime() + taskSlotDuration).toLocaleTimeString(
              [],
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }
            )}
        {isEndTime && !isDisabled && (
          <div ref={endTimeRef}>
            <TimeDropdown startTime={false} hideDropDowns={hideDropDowns} />
          </div>
        )}
      </div>
      <div className={`total-time ${isDisabled ? "disabled" : ""}`}>
        {isDisabled ? "All Day" : formatDuration(taskSlotDuration)}
      </div>
    </div>
  );
};

export default TimeSelector;
