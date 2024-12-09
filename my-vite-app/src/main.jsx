import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { CustomThemeProvider } from "./theme/ThemeProvider";
import { ToastContainer } from "react-toastify";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <HashRouter>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
        <App />
      </HashRouter>
    </CustomThemeProvider>
  </React.StrictMode>
);
