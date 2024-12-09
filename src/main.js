import React from "react";
import { createRoot } from "react-dom/client";
import AppLayout from "./layout/AppLayout/AppLayout";
import { AppContextProvider } from "./context/AppContext";
import { TodoContextProvider } from "./context/TodoContext";

const App = () => {
  return (
    <TodoContextProvider>
      <AppContextProvider>
        <AppLayout />
      </AppContextProvider>
    </TodoContextProvider>
  );
};

// New way (React 18)
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container) to create a root.
root.render(<App />); // Use the new root.render method
