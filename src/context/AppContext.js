import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [state, setState] = useState({
    // Add your initial state here
    // For example:
    // user: null,
    // theme: 'light',
  });

  const value = {
    state,
    setState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
