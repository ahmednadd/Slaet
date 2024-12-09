import React, { createContext, useState } from "react";

export const TodoContext = createContext();

export function TodoContextProvider({ children }) {
  const [state, setState] = useState({
    currentCalendarTasks: [],
  });

  const value = {
    state,
    setState,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
