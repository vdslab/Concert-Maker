import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./pages/App.jsx";
import MyConcert from "./pages/MyConcert.jsx";
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
    element: <App />,
  },
  {
    path: "/my-concert",
    element: <MyConcert />,
  },
  {
    path: "/box",
    element: (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          margin: 0,
          bgcolor: "lightpink",
          border: "6px solid yellow",
        }}
      >
        Box
      </Box>
    ),
  },
]);

export const themeOptions = responsiveFontSizes(
  createTheme({
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
        paper: "#ffffff",
      },
    },
  }),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        border: "6px solid red",
      }}
    >
      <ThemeProvider theme={themeOptions}>
        <CssBaseline />
        <ResponsiveAppBar />
        <Box flexGrow="1" border="6px solid green" sx={{ overflow: "auto" }}>
          <RouterProvider router={router} />
        </Box>
      </ThemeProvider>
    </Box>
  </React.StrictMode>,
);
