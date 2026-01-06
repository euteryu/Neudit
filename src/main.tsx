// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure this says "root" to match the HTML above
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);