import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./App.jsx";
import "./index.css";
import ResponsiveAppBar from "./components/layouts/Header.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <div>About</div>,
  },
  {
    path: "/app",
    element: <ResponsiveAppBar />,
  },
]);

export const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#263238",
    },
    secondary: {
      main: "#ffa000",
    },
    background: {
      default: "#eeeeee",
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={themeOptions}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
