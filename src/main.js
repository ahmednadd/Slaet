import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div>
      <h1>Welcome to Your Custom New Tab with React!</h1>
      <p>This is a React component rendered in the new tab.</p>
    </div>
  );
};

// New way (React 18)
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container) to create a root.
root.render(<App />); // Use the new root.render method
