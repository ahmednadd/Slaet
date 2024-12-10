import React, { createContext, useState } from "react";

export const TodoContext = createContext();

export function TodoContextProvider({ children }) {
  const [state, setState] = useState({
    currentCalendarTasks: [],
    // default duration is 1 hour
    taskSlotDuration: 60 * 60 * 1000,
    currentStartTime: "",
    currentEndTime: "",
  });

  const value = {
    state,
    setState,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
