import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
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
      <ResponsiveAppBar />
      <Box component="main">
        <Toolbar />
        <RouterProvider router={router} />
      </Box>
    </ThemeProvider>
  </React.StrictMode>,
);
