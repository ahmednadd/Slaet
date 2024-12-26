import React, { useContext, useRef, useState } from "react";
import "./TimeSelector.scss";
import TimeDropdown from "../TimeDropdown/TimeDropdown";
import { TodoContext } from "../../context/TodoContext";
import { formatDuration, formatTimestamp } from "../../utils/functions";
import useClickAway from "../../hooks/useClickAway";

const TimeSelector = () => {
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
    <div className="time-selector-container">
      <div
        className={`start-time selection ${isStartTime && "selection-active"}`}
        onClick={() => setIsStartTime(true)}
      >
        {currentStartTime
          ? formatTimestamp(currentStartTime).timeFormatted
          : new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}

        {isStartTime && (
          <div ref={startTimeRef}>
            <TimeDropdown startTime={true} hideDropDowns={hideDropDowns} />
          </div>
        )}
      </div>
      <span>&#10132;</span>
      <div
        className={`end-time selection ${isEndTime && "selection-active"}`}
        onClick={() => setIsEndTime(true)}
      >
        {currentEndTime
          ? formatTimestamp(currentEndTime).timeFormatted
          : new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleTimeString(
              [],
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }
            )}
        {isEndTime && (
          <div ref={endTimeRef}>
            <TimeDropdown startTime={false} hideDropDowns={hideDropDowns} />
          </div>
        )}
      </div>
      <div className="total-time">{formatDuration(taskSlotDuration)}</div>
    </div>
  );
};

export default TimeSelector;
