
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ToastWrapper from "./utils/toast/ToastWrapper";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <ToastWrapper />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);